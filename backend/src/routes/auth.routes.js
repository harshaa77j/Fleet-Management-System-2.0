const express = require("express");
const router = express.Router();
const {setPassword} = require("../controllers/setPassword.controller");

router.post("/set-password", setPassword);

module.exports = router;