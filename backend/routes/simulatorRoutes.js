const express = require("express");
const router = express.Router();
const { recommendAttack, launchSimulation, getSimulations } = require("../controllers/simulatorController");
const { protect } = require("../middleware/authMiddleware");

router.get("/recommend/:targetId", protect, recommendAttack);
router.post("/launch", protect, launchSimulation);
router.get("/campaigns", protect, getSimulations);

module.exports = router;
