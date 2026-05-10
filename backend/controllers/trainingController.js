const TrainingSession = require("../models/TrainingSession");
const EmailCampaign = require("../models/EmailCampaign");
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST /api/training/trigger — auto-trigger when employee clicks
const triggerTraining = async (req, res) => {
  try {
    const { trackingId } = req.body;
    const campaign = await EmailCampaign.findOne({ trackingId }).populate("target");
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    // Generate AI coaching message
    const prompt = `A user named ${campaign.target.name} (${campaign.target.jobTitle || "Employee"} at ${campaign.target.company}) just clicked a simulated phishing link with subject: "${campaign.subject}".
    
Write a short, friendly, personalized security coaching message (3-4 sentences) explaining:
1. What attack technique was used
2. What red flags they missed
3. One key tip to avoid this in future

Be encouraging, not scary. Return only the coaching message text, no JSON.`;

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
    });
    const aiCoaching = completion.choices[0].message.content;

    // Create training session
    const session = await TrainingSession.create({
      target: campaign.target._id,
      campaign: campaign._id,
      triggerReason: `Clicked phishing link: ${campaign.subject}`,
      aiCoaching,
    });

    res.json({ session, aiCoaching });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/training/quiz-complete — save quiz result
const completeQuiz = async (req, res) => {
  try {
    const { sessionId, quizScore } = req.body;
    const session = await TrainingSession.findByIdAndUpdate(
      sessionId,
      { quizScore, completed: true, completedAt: new Date() },
      { new: true }
    );
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/training/sessions — all training sessions
const getSessions = async (req, res) => {
  try {
    const sessions = await TrainingSession.find()
      .populate("target", "name email company")
      .populate("campaign", "subject")
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/training/session/:trackingId — get session for awareness page
const getSessionByTracking = async (req, res) => {
  try {
    const campaign = await EmailCampaign.findOne({ trackingId: req.params.trackingId });
    if (!campaign) return res.status(404).json({ message: "Not found" });
    const session = await TrainingSession.findOne({ campaign: campaign._id }).populate("target");
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { triggerTraining, completeQuiz, getSessions, getSessionByTracking };
