const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {addWorker, listWorkers, assignWorkerToVehicle} = require("../controllers/manager.worker.controller");

router.post("/workers", auth("MANAGER"), addWorker);
router.get("/workers", auth("MANAGER"), listWorkers)
router.post("/workers/assign",auth("MANAGER"), assignWorkerToVehicle);

module.exports = router;
