const mongoose = require("mongoose");

const simulatorCampaignSchema = new mongoose.Schema({
  target: { type: mongoose.Schema.Types.ObjectId, ref: "Target", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  attackType: { type: String },           // e.g. "CEO Fraud", "Fake Invoice", "OTP Alert"
  difficulty: { type: String },           // Easy / Medium / Hard
  scheduledAt: { type: Date },
  status: { type: String, enum: ["scheduled", "sent", "opened", "clicked"], default: "scheduled" },
  emailCampaign: { type: mongoose.Schema.Types.ObjectId, ref: "EmailCampaign" },
  aiReasoning: { type: String },          // Why AI chose this attack
}, { timestamps: true });

module.exports = mongoose.model("SimulatorCampaign", simulatorCampaignSchema);
