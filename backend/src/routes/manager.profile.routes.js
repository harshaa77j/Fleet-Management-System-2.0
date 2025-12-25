const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {updateManagerProfile} = require("../controllers/manager.profile.controller");

router.put("/profile",auth("MANAGER"),updateManagerProfile);

module.exports = router;