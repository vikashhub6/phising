const EmailCampaign = require("../models/EmailCampaign");
const Notification = require("../models/Notification");

// Track email open (pixel)
const trackOpen = async (req, res) => {
  try {
    const { trackingId } = req.params;
    const campaign = await EmailCampaign.findOne({ trackingId }).populate("target", "name email");

    if (campaign) {
      // Only notify on FIRST open
      const isFirstOpen = campaign.status === "sent";
      if (isFirstOpen) {
        campaign.status = "opened";
        campaign.openedAt = new Date();
        await campaign.save();

        const notification = await Notification.create({
          user: campaign.createdBy,
          campaign: campaign._id,
          type: "email_opened",
          message: `📧 ${campaign.target?.name || "Target"} (${campaign.target?.email}) opened your email — "${campaign.subject}" — Check reply at your Gmail`,
        });

        const io = req.app.get("io");
        if (io) {
          io.to(campaign.createdBy.toString()).emit("notification", {
            _id: notification._id,
            type: "email_opened",
            message: notification.message,
            createdAt: notification.createdAt,
            read: false,
          });
          io.to(campaign.createdBy.toString()).emit("dashboard_update", {
            campaignId: campaign._id,
            status: campaign.status,
            openCount: campaign.openCount,
          });
        }
      } else {
        // Just update count silently, no duplicate notification
        campaign.openCount += 1;
        await campaign.save();
      }
    }

    // Return 1x1 transparent pixel
    const pixel = Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      "base64"
    );
    res.writeHead(200, {
      "Content-Type": "image/gif",
      "Content-Length": pixel.length,
      "Cache-Control": "no-store",
    });
    res.end(pixel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Track link click
const trackClick = async (req, res) => {
  try {
    const { trackingId } = req.params;
    const campaign = await EmailCampaign.findOne({ trackingId }).populate("target", "name email");

    if (campaign) {
      // Only notify on FIRST click
      const isFirstClick = campaign.status !== "clicked";
      if (isFirstClick) {
        campaign.status = "clicked";
        campaign.clickedAt = new Date();
        campaign.clickCount += 1;
        await campaign.save();

        const notification = await Notification.create({
          user: campaign.createdBy,
          campaign: campaign._id,
          type: "link_clicked",
          message: `🎯 ${campaign.target?.name || "Target"} (${campaign.target?.email}) clicked the phishing link — "${campaign.subject}" — Check reply at your Gmail`,
        });

        const io = req.app.get("io");
        if (io) {
          io.to(campaign.createdBy.toString()).emit("notification", {
            _id: notification._id,
            type: "link_clicked",
            message: notification.message,
            createdAt: notification.createdAt,
            read: false,
          });
          io.to(campaign.createdBy.toString()).emit("dashboard_update", {
            campaignId: campaign._id,
            status: campaign.status,
            clickCount: campaign.clickCount,
          });
        }
      } else {
        // Just update count silently
        campaign.clickCount += 1;
        await campaign.save();
      }
    }

    res.redirect(`${process.env.FRONTEND_URL}/awareness`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { trackOpen, trackClick };