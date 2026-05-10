const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const EmailCampaign = require("../models/EmailCampaign");
const Target = require("../models/Target");
const { generatePhishingEmail } = require("../services/groqService");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate AI email
const generateEmail = async (req, res) => {
  try {
    const { targetId } = req.body;
    const target = await Target.findOne({ _id: targetId, createdBy: req.user._id });
    if (!target) return res.status(404).json({ message: "Target not found" });
    const result = await generatePhishingEmail(target);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send email
const sendEmail = async (req, res) => {
  try {
    const { targetId, subject, body, replyToEmail, showAsName, showAsEmail } = req.body;
    const target = await Target.findOne({ _id: targetId, createdBy: req.user._id });
    if (!target) return res.status(404).json({ message: "Target not found" });

    const trackingId = uuidv4();
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    const trackingPixel = `<img src="${backendUrl}/api/track/open/${trackingId}" width="1" height="1" style="display:none" />`;
    const trackingLink = `${backendUrl}/api/track/click/${trackingId}`;
    const finalBody = body.replace("{{TRACKING_LINK}}", trackingLink) + trackingPixel;

    await transporter.sendMail({
      from: `"${showAsName || "Support Team"}" <${showAsEmail || process.env.EMAIL_USER}>`,
      to: target.email,
      subject,
      html: finalBody,
      replyTo: replyToEmail || process.env.EMAIL_USER,
    });

    const campaign = await EmailCampaign.create({
      target: targetId,
      createdBy: req.user._id,
      subject,
      body,
      trackingId,
      status: "sent",
      sentAt: new Date(),
      senderName: showAsName || "Support Team",
      senderEmail: showAsEmail || process.env.EMAIL_USER,
    });

    res.status(201).json({ message: "Email sent!", campaign });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all campaigns
const getCampaigns = async (req, res) => {
  try {
    const campaigns = await EmailCampaign.find({ createdBy: req.user._id })
      .populate("target", "name email company");
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateEmail, sendEmail, getCampaigns };