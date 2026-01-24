const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { addVehicle } = require("../controllers/manager.vehicle.controller");
const {listVehicles} = require("../controllers/manager.vehicle.controller");
const {getVehicleDashboard} = require("../controllers/manager.vehicle.controller");

router.post("/vehicles", auth("MANAGER"), addVehicle);
router.get("/vehicles", auth("MANAGER"), listVehicles);
router.get("/vehicle/:vehicle_id", auth("MANAGER"), getVehicleDashboard);

module.exports = router;