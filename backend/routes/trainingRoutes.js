const express = require("express");
const router = express.Router();
const { triggerTraining, completeQuiz, getSessions, getSessionByTracking } = require("../controllers/trainingController");
const { protect } = require("../middleware/authMiddleware");

router.post("/trigger", triggerTraining);                         // Called from awareness page (no auth)
router.post("/quiz-complete", completeQuiz);                      // Called from awareness page
router.get("/sessions", protect, getSessions);                    // Admin view
router.get("/session/:trackingId", getSessionByTracking);         // Awareness page fetch

module.exports = router;
