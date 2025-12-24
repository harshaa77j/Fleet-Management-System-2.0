const express = require("express");
const router = express.Router();
const { onboardManager } = require("../controllers/manager.onboard.controller");

router.post("/onboard-manager", onboardManager);

module.exports = router;