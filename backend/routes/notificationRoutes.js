const express = require("express");
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead, getUnreadCount } = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.put("/:id/read", markAsRead);
router.put("/mark-all-read", markAllAsRead);

module.exports = router;
