// verifyDatabase.js
// Script to verify database table structure after sync

import { sequelize } from './configs/database.js';

const verifyTables = async () => {
  try {
    console.log('🔍 Verifying database table structure...');
    
    // Check if tables exist
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('📋 Existing tables:', tables);
    
    // Check users table structure
    if (tables.includes('users')) {
      const userTableInfo = await sequelize.getQueryInterface().describeTable('users');
      console.log('👤 Users table structure:');
      console.table(userTableInfo);
    } else {
      console.log('❌ Users table does not exist');
    }
    
    // Check chat_history table structure
    if (tables.includes('chat_history')) {
      const chatTableInfo = await sequelize.getQueryInterface().describeTable('chat_history');
      console.log('💬 Chat_history table structure:');
      console.table(chatTableInfo);
    } else {
      console.log('❌ Chat_history table does not exist');
    }
    
    // Check user_summaries table structure
    if (tables.includes('user_summaries')) {
      const summaryTableInfo = await sequelize.getQueryInterface().describeTable('user_summaries');
      console.log('📝 User_summaries table structure:');
      console.table(summaryTableInfo);
    } else {
      console.log('❌ User_summaries table does not exist');
    }
    
  } catch (error) {
    console.error('❌ Error verifying tables:', error);
  } finally {
    await sequelize.close();
  }
};

verifyTables();