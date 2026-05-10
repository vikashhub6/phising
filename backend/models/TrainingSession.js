const mongoose = require("mongoose");

const trainingSessionSchema = new mongoose.Schema({
  target: { type: mongoose.Schema.Types.ObjectId, ref: "Target", required: true },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: "EmailCampaign" },
  triggerReason: { type: String },        // e.g. "clicked phishing link"
  quizScore: { type: Number },            // 0-100
  completed: { type: Boolean, default: false },
  aiCoaching: { type: String },           // AI generated coaching message
  completedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("TrainingSession", trainingSessionSchema);
