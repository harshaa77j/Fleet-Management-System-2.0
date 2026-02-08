const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
    scheduleMaintenance,
    getTodayMaintenanceReminders,
    startMaintenance,
    completeMaintenance
} = require("../controllers/manager.maintenance.controller");

router.post("/maintenance", auth("MANAGER"),scheduleMaintenance);
router.get("/maintenance/reminders",auth("MANAGER"),getTodayMaintenanceReminders);
router.post("/maintenance/:maintenance_id/start",auth("MAAGER"),startMaintenance);
router.post("/maintenance/:maintenance_id",auth("MANAGER"),completeMaintenance);

module.exports = router;