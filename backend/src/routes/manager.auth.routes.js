const express = require("express");
const router = express.Router();
const {managerLogin} = require("../controllers/manager.auth.controller");

router.post("/login", managerLogin);

module.exports = router;