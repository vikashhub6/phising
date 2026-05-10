const express = require("express");
const router = express.Router();
const { generateEmail, sendEmail, getCampaigns } = require("../controllers/emailController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/generate", generateEmail);
router.post("/send", sendEmail);
router.get("/campaigns", getCampaigns);

module.exports = router;
