const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AggregationService {
  /**
   *  Called by cron job every day at 11:59 PM
   * When to modify:
   * - Add new metrics to aggregate (e.g., avg_power, max_speed)
   * - Change vehicle filter criteria (e.g., include IN_MAINTENANCE)
   * - Add notifications on completion
   */

  static async aggregateDailyReports() {
    console.log('Starting daily aggregation job at:', new Date());
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1); 
      
      console.log('Aggregating data for:', today.toISOString().split('T')[0]);
      
      const vehicles = await prisma.vehicle.findMany({
        where: { status: 'ACTIVE' }
      });
      
      console.log(`🚗 Found ${vehicles.length} active vehicles`);
      
      for (const vehicle of vehicles) {
        await this.aggregateVehicleDay(vehicle, today, tomorrow);
      }
      
      console.log('✅ Daily aggregation completed successfully');
      
    } catch (error) {
      console.error('❌ Aggregation error:', error);
      throw error;
    }
  }

  /**
   * When to modify:
   * - Add new calculated fields (e.g., total_distance)
   * - Change worker detection logic
   * - Add data quality checks
   * 
   * @param {Object} vehicle - Vehicle object from database
   * @param {Date} startDate - Start of day (00:00:00)
   * @param {Date} endDate - End of day (00:00:00 next day)
   */
  static async aggregateVehicleDay(vehicle, startDate, endDate) {
    try {
      const stats = await prisma.vehicleStats.findMany({
        where: {
          vehicle_id: vehicle.vehicle_id,
          recorded_at: {
            gte: startDate,  
            lt: endDate      
          }
        },
        include: {
          worker: true  
        }
      });
      
      if (stats.length === 0) {
        console.log(`No data for vehicle ${vehicle.device_id} on ${startDate.toISOString().split('T')[0]}`);
        return;
      }
      
      console.log(`Processing ${stats.length} records for ${vehicle.device_id}`);
      
      const validSoc = stats.filter(s => s.soc_percent != null).map(s => s.soc_percent);
      const validSoh = stats.filter(s => s.soh_percent != null).map(s => s.soh_percent);
      const validVoltage = stats.filter(s => s.voltage_mv != null).map(s => s.voltage_mv);
      const validCurrent = stats.filter(s => s.current_ma != null).map(s => s.current_ma);
      const validTemp = stats.filter(s => s.temperature_c != null).map(s => s.temperature_c);
    
      const workerCounts = {};
      stats.forEach(s => {
        if (s.worker_id) {
          workerCounts[s.worker_id] = (workerCounts[s.worker_id] || 0) + 1;
        }
      });
      
      const primaryWorkerId = Object.keys(workerCounts).length > 0
        ? Object.keys(workerCounts).reduce((a, b) => 
            workerCounts[a] > workerCounts[b] ? a : b
          )
        : null;
      
      const primaryWorker = primaryWorkerId 
        ? stats.find(s => s.worker_id === primaryWorkerId)?.worker
        : null;
      
      const authenticatedCount = stats.filter(s => s.authenticated).length;
      const authenticationRate = (authenticatedCount / stats.length) * 100;
    
      const latestCycleCount = stats
        .filter(s => s.cycle_count != null)
        .sort((a, b) => b.recorded_at - a.recorded_at)[0]?.cycle_count;
      
      const operatingHours = (stats.length * 5) / 60;
      

      const reportData = {
        vehicle_id: vehicle.vehicle_id,
        device_id: vehicle.device_id,
        report_date: startDate,
        
        avg_soc_percent: this.average(validSoc),
        avg_soh_percent: this.average(validSoh),
        avg_voltage_mv: this.average(validVoltage),
        avg_current_ma: this.average(validCurrent),
        avg_temp_c: this.average(validTemp),
        
        min_soc_percent: validSoc.length > 0 ? Math.min(...validSoc) : null,
        max_soc_percent: validSoc.length > 0 ? Math.max(...validSoc) : null,
        min_voltage_mv: validVoltage.length > 0 ? Math.min(...validVoltage) : null,
        max_voltage_mv: validVoltage.length > 0 ? Math.max(...validVoltage) : null,
        max_temp_c: validTemp.length > 0 ? Math.max(...validTemp) : null,

        total_cycle_count: latestCycleCount,
        operating_hours: operatingHours,
        
        primary_worker_id: primaryWorkerId,
        primary_biometric_id: primaryWorker?.biometric_id || null,
        authentication_rate: authenticationRate,
        
        data_points_count: stats.length 
      };
      
      await prisma.dailyVehicleReport.upsert({
        where: {
          vehicle_id_report_date: { 
            vehicle_id: vehicle.vehicle_id,
            report_date: startDate
          }
        },
        update: reportData,
        create: reportData 
      });
      
      console.log(`Aggregated report for ${vehicle.device_id}`);
      
    } catch (error) {
      console.error(`Error aggregating vehicle ${vehicle.device_id}:`, error);
    }
  }

  static average(arr) {
    if (arr.length === 0) return null;
    return arr.reduce((sum, val) => sum + val, 0) / arr.length;
  }

  static async aggregateDateRange(startDate, endDate) {
    console.log(`Aggregating from ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);
    
    let currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    
    while (currentDate <= end) {
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      console.log(`Processing: ${currentDate.toISOString().split('T')[0]}`);
      
      const vehicles = await prisma.vehicle.findMany({
        where: { status: 'ACTIVE' }
      });
      
      for (const vehicle of vehicles) {
        await this.aggregateVehicleDay(vehicle, currentDate, nextDay);
      }
      
      currentDate = nextDay;
    }
    
    console.log('Aggregation completed');
  }
}

module.exports = AggregationService;