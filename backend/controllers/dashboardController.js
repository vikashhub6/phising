const EmailCampaign = require("../models/EmailCampaign");
const Target = require("../models/Target");

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalTargets = await Target.countDocuments({ createdBy: userId });
    const totalEmails = await EmailCampaign.countDocuments({ createdBy: userId });
    const openedEmails = await EmailCampaign.countDocuments({ createdBy: userId, status: { $in: ["opened", "clicked"] } });
    const clickedEmails = await EmailCampaign.countDocuments({ createdBy: userId, status: "clicked" });

    const recentCampaigns = await EmailCampaign.find({ createdBy: userId })
      .populate("target", "name email company")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      stats: {
        totalTargets,
        totalEmails,
        openedEmails,
        clickedEmails,
        openRate: totalEmails > 0 ? ((openedEmails / totalEmails) * 100).toFixed(1) : 0,
        clickRate: totalEmails > 0 ? ((clickedEmails / totalEmails) * 100).toFixed(1) : 0,
      },
      recentCampaigns,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
