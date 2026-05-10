const mongoose = require("mongoose");

const riskScoreSchema = new mongoose.Schema({
  target: { type: mongoose.Schema.Types.ObjectId, ref: "Target", required: true, unique: true },
  score: { type: Number, default: 0 },        // 0-100
  level: { type: String, default: "Safe" },   // Safe / Vulnerable / High Risk / Critical
  reasons: [{ type: String }],
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RiskScore", riskScoreSchema);
