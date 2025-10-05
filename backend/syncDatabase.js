import {sequelize, User, ChatHistory, UserSummary } from './models/index.js';
import { testConnection } from './configs/database.js';

// Database sync script
const syncDatabase = async (options = {}) => {
  try {
    console.log('🔄 Starting database synchronization...');
    
    // Test connection first
    await testConnection();
    
    // Sync all models with the database
    // force: true will drop tables if they exist and recreate them
    // alter: true will try to alter existing tables to match models
    const syncOptions = {
      force: options.force || false,  // Set to true to drop and recreate tables
      alter: options.alter || true,   // Set to true to alter existing tables
      logging: options.logging ?? true // Enable SQL logging
    };

    await sequelize.sync(syncOptions);    
    console.log('✅ Database synchronized successfully!');
    console.log('📋 Tables created/updated:');
    console.log('  - users');
    console.log('  - chat_history');
    console.log('  - user_summaries');
    
    return true;
  } catch (error) {
    console.error('❌ Database synchronization failed:', error);
    return false;
  }
};

// Create sample data (optional)
const createSampleData = async () => {
  try {
    console.log('🌱 Creating sample data...');
    
    // Create a sample user
    const sampleUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
      language_preference: 'en'
    });
    
    console.log('👤 Sample user created:', sampleUser.email);
    
    // Create sample chat history
    const chatHistory = await ChatHistory.create({
      userId: sampleUser.id,
      model_name: 'gpt-3.5-turbo',
      message: 'Hello, how are you?',
      response: 'I am doing great, thank you for asking!',
      language: 'en'
    });
    
    console.log('💬 Sample chat history created');
    
    // Create sample user summary
    const userSummary = await UserSummary.create({
      userId: sampleUser.id,
      summary_text: 'User prefers conversational interactions and asks general questions.',
      language: 'en'
    });
    
    console.log('📝 Sample user summary created');
    
    return { user: sampleUser, chatHistory, userSummary };
  } catch (error) {
    console.error('❌ Failed to create sample data:', error);
    return null;
  }
};

// Main function to run the sync
const main = async () => {
 
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const alter = args.includes('--alter');
  const sample = args.includes('--sample');
  
  console.log('📋 Arguments parsed:', { force, alter, sample });
  
  // Sync database
  const success = await syncDatabase({ force, alter });
  
  if (success && sample) {
    await createSampleData();
  }
  
  // Close connection
  await sequelize.close();
  console.log('🔒 Database connection closed');
};

// Export functions for use in other files
export { syncDatabase, createSampleData };

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Starting syncDatabase.js script...');
  main().catch((error) => {
    console.error('❌ Fatal error in main():', error);
    process.exit(1);
  });
}