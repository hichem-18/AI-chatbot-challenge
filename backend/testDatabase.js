import { testConnection } from './configs/database.js';
import { sequelize, User, ChatHistory, UserSummary } from './models/index.js';

// Comprehensive database connection test
const testDatabaseConnection = async () => {
  
  try {
    // Test 1: Basic connection
    await testConnection();
    
    // Test 2: Authentication
    await sequelize.authenticate();
    
    // Test 3: Check if tables exist
    const tableNames = await sequelize.getQueryInterface().showAllTables();
    
    // Test 4: Model operations
    
    // Count records in each table
    const userCount = await User.count();
    const chatCount = await ChatHistory.count();
    const summaryCount = await UserSummary.count();
    
    
    // Test 5: Try a simple query
    const users = await User.findAll({ limit: 1 });
    
    // Test 6: Test relationships
    if (users.length > 0) {
      const userWithHistory = await User.findOne({
        where: { id: users[0].id },
        include: [
          { model: ChatHistory, as: 'chatHistory' },
          { model: UserSummary, as: 'summary' }
        ]
      });
    } else {
    }
    
    return true;
    
  } catch (error) {
    return false;
  } finally {
    // Close connection
    await sequelize.close();
  }
};

// Connection status check
const quickConnectionCheck = async () => {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    console.error('❌ Database connection: FAILED');
    console.error('   Error:', error.message);
    return false;
  } finally {
    await sequelize.close();
  }
};

// Export functions
export { testDatabaseConnection, quickConnectionCheck };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.includes('--quick')) {
    quickConnectionCheck();
  } else {
    testDatabaseConnection();
  }
}