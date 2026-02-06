const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports.controller');

router.get('/vehicles/:vehicleId/history', reportsController.getVehicleHistory);

router.get('/vehicles/:vehicleId/stats', reportsController.getVehicleStats);

router.get('/vehicles/:vehicleId/download', reportsController.downloadReport);

module.exports = router;