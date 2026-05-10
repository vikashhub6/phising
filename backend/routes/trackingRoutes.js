const express = require("express");
const router = express.Router();
const { trackOpen, trackClick } = require("../controllers/trackingController");

// Public routes (no auth needed - email client hits these)
router.get("/open/:trackingId", trackOpen);
router.get("/click/:trackingId", trackClick);

module.exports = router;
