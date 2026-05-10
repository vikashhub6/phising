const express = require("express");
const router = express.Router();
const { getRiskScores, getRiskSummary } = require("../controllers/riskController");
const { protect } = require("../middleware/authMiddleware");

router.get("/scores", protect, getRiskScores);
router.get("/summary", protect, getRiskSummary);

module.exports = router;
