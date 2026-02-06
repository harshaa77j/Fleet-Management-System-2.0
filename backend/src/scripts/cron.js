const cron = require('node-cron');
const AggregationService = require('../services/aggregation.service');


cron.schedule('59 23 * * *', async () => {
  console.log('Daily aggregation cron triggered:', new Date());
  
  try {
    await AggregationService.aggregateDailyReports();
  } catch (error) {
    console.error('Cron job failed:', error);
    
  }
});

console.log('Daily aggregation cron job scheduled (runs at 11:59 PM)');
