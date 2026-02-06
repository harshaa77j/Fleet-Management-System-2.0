const AggregationService = require('../services/aggregation.service');

async function test() {
  console.log('Testing aggregation service...\n');
  
  try {
    console.log('Testing today\'s aggregation:');
    await AggregationService.aggregateDailyReports();
    
    console.log('\nTest completed successfully!');
    
  } catch (error) {
    console.error('\nTest failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

// Run the test
test();