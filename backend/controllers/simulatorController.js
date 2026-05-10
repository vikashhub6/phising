const SimulatorCampaign = require("../models/SimulatorCampaign");
const RiskScore = require("../models/RiskScore");
const Target = require("../models/Target");
const EmailCampaign = require("../models/EmailCampaign");
const Groq = require("groq-sdk");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const ATTACK_TYPES = {
  Easy: ["Fake Invoice", "HR Policy Update", "Salary Increment"],
  Medium: ["OTP Alert", "Google Drive Share", "IT Support Request"],
  Hard: ["CEO Fraud", "Slack/Teams Invite", "Board Meeting Invite"],
};

const recommendAttack = async (req, res) => {
  try {
    const { targetId } = req.params;
    const target = await Target.findById(targetId);
    const risk = await RiskScore.findOne({ target: targetId });
    const campaigns = await EmailCampaign.find({ target: targetId });

    const score = risk?.score || 0;
    let difficulty = "Easy";
    if (score >= 60) difficulty = "Hard";
    else if (score >= 30) difficulty = "Medium";

    const attackOptions = ATTACK_TYPES[difficulty];
    const usedTypes = campaigns.map((c) => c.subject);

    const prompt = `You are a cybersecurity AI. Based on this employee profile, recommend the best phishing simulation attack.

Employee: ${target.name}, ${target.jobTitle || "Employee"} at ${target.company}
Risk Score: ${score}/100 (${risk?.level || "Safe"})
Past attack types used: ${usedTypes.join(", ") || "None"}
Available attack types: ${attackOptions.join(", ")}

Pick the best attack type and explain why in 1-2 sentences. Also suggest best time to send (morning/lunch/evening).
Return JSON: { "attackType": "...", "reasoning": "...", "sendTime": "..." }`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });

    const raw = completion.choices[0].message.content;
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());

    res.json({ ...parsed, difficulty, score });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const launchSimulation = async (req, res) => {
  try {
    const { targetId, attackType, difficulty } = req.body;
    const target = await Target.findById(targetId);
    if (!target) return res.status(404).json({ message: "Target not found" });

    const prompt = `Create a realistic phishing simulation email of type "${attackType}" for security training.
Target: ${target.name}, ${target.jobTitle || "Employee"} at ${target.company}.
Make it convincing but it's for authorized cybersecurity training.
Return JSON only: { "subject": "...", "body": "full HTML email body with {{TRACKING_LINK}} placeholder" }`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });

    const raw = completion.choices[0].message.content;
    const { subject, body } = JSON.parse(raw.replace(/```json|```/g, "").trim());

    const trackingId = uuidv4();
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const trackingPixel = `<img src="${backendUrl}/api/track/open/${trackingId}" width="1" height="1" style="display:none" />`;
    const trackingLink = `${backendUrl}/api/track/click/${trackingId}`;
    const finalBody = body.replace("{{TRACKING_LINK}}", trackingLink) + trackingPixel;

    await transporter.sendMail({ from: process.env.EMAIL_USER, to: target.email, subject, html: finalBody });

    const campaign = await EmailCampaign.create({
      target: targetId, createdBy: req.user._id, subject, body, trackingId, status: "sent", sentAt: new Date(),
    });

    const simCampaign = await SimulatorCampaign.create({
      target: targetId, createdBy: req.user._id, attackType, difficulty, status: "sent",
      emailCampaign: campaign._id, scheduledAt: new Date(),
    });

    res.status(201).json({ message: "Simulation launched!", simCampaign, campaign });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSimulations = async (req, res) => {
  try {
    const sims = await SimulatorCampaign.find({ createdBy: req.user._id })
      .populate("target", "name email company")
      .populate("emailCampaign", "status openCount clickCount sentAt")
      .sort({ createdAt: -1 });
    res.json(sims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { recommendAttack, launchSimulation, getSimulations };