const express = require("express");
const router = express.Router();
const { getTargets, getTarget, createTarget, updateTarget, deleteTarget } = require("../controllers/targetController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.route("/").get(getTargets).post(createTarget);
router.route("/:id").get(getTarget).put(updateTarget).delete(deleteTarget);

module.exports = router;
