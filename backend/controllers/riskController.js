const RiskScore = require("../models/RiskScore");
const Target = require("../models/Target");
const EmailCampaign = require("../models/EmailCampaign");

// GET /api/risk/scores — all targets with risk scores
const getRiskScores = async (req, res) => {
  try {
    const targets = await Target.find({ createdBy: req.user._id });

    const results = await Promise.all(
      targets.map(async (t) => {
        const risk = await RiskScore.findOne({ target: t._id });
        const campaigns = await EmailCampaign.find({ target: t._id });
        return {
          target: t,
          score: risk?.score || 0,
          level: risk?.level || "Safe",
          reasons: risk?.reasons || [],
          totalEmails: campaigns.length,
          opened: campaigns.filter((c) => ["opened", "clicked"].includes(c.status)).length,
          clicked: campaigns.filter((c) => c.status === "clicked").length,
          updatedAt: risk?.updatedAt,
        };
      })
    );

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/risk/summary — department/company breakdown
const getRiskSummary = async (req, res) => {
  try {
    const targets = await Target.find({ createdBy: req.user._id });

    const companyMap = {};
    for (const t of targets) {
      const risk = await RiskScore.findOne({ target: t._id });
      const company = t.company || "Unknown";
      if (!companyMap[company]) companyMap[company] = { total: 0, totalScore: 0, critical: 0 };
      companyMap[company].total += 1;
      companyMap[company].totalScore += risk?.score || 0;
      if (risk?.level === "Critical" || risk?.level === "High Risk") companyMap[company].critical += 1;
    }

    const summary = Object.entries(companyMap).map(([company, data]) => ({
      company,
      avgScore: Math.round(data.totalScore / data.total),
      total: data.total,
      critical: data.critical,
    }));

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRiskScores, getRiskSummary };
