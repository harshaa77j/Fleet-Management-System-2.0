const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {getTelemetryHistory, getTelemetryCharts} = require("../contorllers/manager.telemetry.controller");


router.get("/vehicles/:vehicle_id/telemetry", auth("MANAGER"),getTelemetryHistory);
router.get("/vehicles/:vehicle_id/telemetry/charts", auth("MANAGER"),getTelemetryCharts);

module.exports = router;
