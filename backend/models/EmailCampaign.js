const mongoose = require("mongoose");

const emailCampaignSchema = new mongoose.Schema(
  {
    target: { type: mongoose.Schema.Types.ObjectId, ref: "Target", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    trackingId: { type: String, unique: true, required: true },
    status: {
      type: String,
      enum: ["draft", "sent", "opened", "clicked"],
      default: "draft",
    },
    sentAt: { type: Date },
    openedAt: { type: Date },
    clickedAt: { type: Date },
    openCount: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmailCampaign", emailCampaignSchema);
