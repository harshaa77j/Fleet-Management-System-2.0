const { PrismaClient } = require('@prisma/client');
const ExportService = require('../services/export.service');
const prisma = new PrismaClient();

exports.getVehicleHistory = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { period = '30days' } = req.query;

    const days = period === '7days' ? 7 : period === '90days' ? 90 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const vehicle = await prisma.vehicle.findFirst({
    where: { device_id: vehicleId }
    });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const reports = await prisma.dailyVehicleReport.findMany({
      where: {
        vehicle_id: vehicle.vehicle_id,
        report_date: { gte: startDate }
      },
      orderBy: { report_date: 'desc' },
      include: {
        vehicle: { select: { device_id: true, model: true } },
        worker: { select: { name: true, biometric_id: true } }
      }
    });

    res.json({
      success: true,
      vehicleId,
      period,
      count: reports.length,
      data: reports
    });

  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getVehicleStats = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { period = '30days' } = req.query;

    const days = period === '7days' ? 7 : period === '90days' ? 90 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const vehicle = await prisma.vehicle.findFirst({
    where: { device_id: vehicleId }
    });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const reports = await prisma.dailyVehicleReport.findMany({
      where: {
        vehicle_id: vehicle.vehicle_id,
        report_date: { gte: startDate }
      }
    });

    if (reports.length === 0) {
      return res.json({
        success: true,
        vehicleId,
        period,
        stats: null,
        message: 'No data available for this period'
      });
    }

    const stats = {
      avgVoltage: average(reports.map(r => r.avg_voltage_mv)),
      avgTemp: average(reports.map(r => r.avg_temp_c)),
      avgCurrent: average(reports.map(r => r.avg_current_ma)),
      avgSOC: average(reports.map(r => r.avg_soc_percent)),
      avgSOH: average(reports.map(r => r.avg_soh_percent)),
      totalOperatingHours: reports.reduce((sum, r) => sum + (r.operating_hours || 0), 0),
      avgAuthenticationRate: average(reports.map(r => r.authentication_rate))
    };

    res.json({
      success: true,
      vehicleId,
      period,
      stats
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.downloadReport = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { format, period = '30days' } = req.query;

    if (!format || !['excel', 'csv'].includes(format)) {
      return res.status(400).json({ success: false, message: 'Invalid format. Use excel or csv' });
    }

    const days = period === '7days' ? 7 : period === '90days' ? 90 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const vehicle = await prisma.vehicle.findFirst({
    where: { device_id: vehicleId }
    });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    const reports = await prisma.dailyVehicleReport.findMany({
      where: {
        vehicle_id: vehicle.vehicle_id,
        report_date: { gte: startDate }
      },
      orderBy: { report_date: 'desc' }
    });

    if (reports.length === 0) {
      return res.status(404).json({ success: false, message: 'No data available' });
    }

    const formattedData = ExportService.formatForExport(reports);

    if (format === 'excel') {
      const buffer = await ExportService.generateExcel(formattedData);
      
      res.setHeader('Content-Disposition', `attachment; filename=${vehicle.device_id}_report_${period}.xlsx`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);
      
    } else {
      const csv = await ExportService.generateCSV(formattedData);
      
      res.setHeader('Content-Disposition', `attachment; filename=${vehicle.device_id}_report_${period}.csv`);
      res.setHeader('Content-Type', 'text/csv');
      res.send(csv);
    }

  } catch (error) {
    console.error('Error downloading report:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

function average(arr) {
  const valid = arr.filter(v => v != null);
  if (valid.length === 0) return null;
  return valid.reduce((sum, val) => sum + val, 0) / valid.length;
}