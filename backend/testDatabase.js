import { testConnection } from './configs/database.js';
import { sequelize, User, ChatHistory, UserSummary } from './models/index.js';

// Comprehensive database connection test
const testDatabaseConnection = async () => {
  console.log('🔍 Database Connection Test');
  console.log('==========================');
  
  try {
    // Test 1: Basic connection
    console.log('1️⃣  Testing basic connection...');
    await testConnection();
    console.log('   ✅ Basic connection successful');
    
    // Test 2: Authentication
    console.log('2️⃣  Testing authentication...');
    await sequelize.authenticate();
    console.log('   ✅ Authentication successful');
    
    // Test 3: Check if tables exist
    console.log('3️⃣  Checking tables...');
    const tableNames = await sequelize.getQueryInterface().showAllTables();
    console.log('   📋 Existing tables:', tableNames);
    
    // Test 4: Model operations
    console.log('4️⃣  Testing model operations...');
    
    // Count records in each table
    const userCount = await User.count();
    const chatCount = await ChatHistory.count();
    const summaryCount = await UserSummary.count();
    
    console.log('   📊 Record counts:');
    console.log(`      Users: ${userCount}`);
    console.log(`      Chat History: ${chatCount}`);
    console.log(`      User Summaries: ${summaryCount}`);
    
    // Test 5: Try a simple query
    console.log('5️⃣  Testing simple query...');
    const users = await User.findAll({ limit: 1 });
    console.log(`   ✅ Query successful (found ${users.length} user(s))`);
    
    // Test 6: Test relationships
    console.log('6️⃣  Testing relationships...');
    if (users.length > 0) {
      const userWithHistory = await User.findOne({
        where: { id: users[0].id },
        include: [
          { model: ChatHistory, as: 'chatHistory' },
          { model: UserSummary, as: 'summary' }
        ]
      });
      console.log('   ✅ Relationships working correctly');
      console.log(`   📝 User has ${userWithHistory?.chatHistory?.length || 0} chat records`);
      console.log(`   📋 User summary exists: ${userWithHistory?.summary ? 'Yes' : 'No'}`);
    } else {
      console.log('   ℹ️  No users found to test relationships');
    }
    
    console.log('\n🎉 All database tests passed!');
    return true;
    
  } catch (error) {
    console.error('\n❌ Database test failed:', error.message);
    console.error('🔧 Try running: node syncDatabase.js --force');
    return false;
  } finally {
    // Close connection
    await sequelize.close();
    console.log('🔒 Database connection closed');
  }
};

// Connection status check
const quickConnectionCheck = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection: OK');
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