const XLSX = require('xlsx');

class ExportService {
  static formatForExport(reports) {
    return reports.map(report => ({
      'Report Date': report.report_date ? new Date(report.report_date).toISOString().split('T')[0] : '',
      'Vehicle ID': report.device_id || '',
      'Avg SOC (%)': report.avg_soc_percent?.toFixed(1) || '',
      'Avg SOH (%)': report.avg_soh_percent?.toFixed(1) || '',
      'Avg Voltage (mV)': report.avg_voltage_mv?.toFixed(1) || '',
      'Avg Current (mA)': report.avg_current_ma?.toFixed(1) || '',
      'Avg Temp (°C)': report.avg_temp_c?.toFixed(1) || '',
      'Min SOC (%)': report.min_soc_percent?.toFixed(1) || '',
      'Max SOC (%)': report.max_soc_percent?.toFixed(1) || '',
      'Max Temp (°C)': report.max_temp_c?.toFixed(1) || '',
      'Operating Hours': report.operating_hours?.toFixed(1) || '',
      'Cycle Count': report.total_cycle_count || '',
      'Worker ID': report.primary_biometric_id || '',
      'Auth Rate (%)': report.authentication_rate?.toFixed(1) || '',
      'Data Points': report.data_points_count || ''
    }));
  }

  static async generateExcel(data) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');

    ws['!cols'] = [
      { wch: 12 }, // Report Date
      { wch: 15 }, // Vehicle ID
      { wch: 12 }, // Avg SOC
      { wch: 12 }, // Avg SOH
      { wch: 15 }, // Avg Voltage
      { wch: 15 }, // Avg Current
      { wch: 12 }, // Avg Temp
      { wch: 12 }, // Min SOC
      { wch: 12 }, // Max SOC
      { wch: 12 }, // Max Temp
      { wch: 15 }, // Operating Hours
      { wch: 12 }, // Cycle Count
      { wch: 15 }, // Worker ID
      { wch: 12 }, // Auth Rate
      { wch: 12 }  // Data Points
    ];
    
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  }

  static async generateCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(val => 
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  }
}

module.exports = ExportService;