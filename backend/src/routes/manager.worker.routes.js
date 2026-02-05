const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {addWorker, listWorkers, assignWorkerToVehicle, removeWorkerFromVehicle, reassignWorkerToVehicle, deleteWorker} = require("../controllers/manager.worker.controller");

router.post("/workers", auth("MANAGER"), addWorker);
router.get("/workers", auth("MANAGER"), listWorkers)
router.post("/workers/assign",auth("MANAGER"), assignWorkerToVehicle);
router.post("/workers/remove",auth("MANAGER"), removeWorkerFromVehicle);
router.post("/workers/reassign", auth("MANAGER"), reassignWorkerToVehicle);
router.post("/workers/:worker_id",auth("MANAGER"), deleteWorker);

module.exports = router;
