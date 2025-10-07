// verifyDatabase.js
// Script to verify database table structure after sync

import { sequelize } from './configs/database.js';

const verifyTables = async () => {
  try {
    
    // Check if tables exist
    const tables = await sequelize.getQueryInterface().showAllTables();
    
    // Check users table structure
    if (tables.includes('users')) {
      const userTableInfo = await sequelize.getQueryInterface().describeTable('users');
      console.table(userTableInfo);
    } else {
    }
    
    // Check chat_history table structure
    if (tables.includes('chat_history')) {
      const chatTableInfo = await sequelize.getQueryInterface().describeTable('chat_history');
      console.table(chatTableInfo);
    } else {
    }
    
    // Check user_summaries table structure
    if (tables.includes('user_summaries')) {
      const summaryTableInfo = await sequelize.getQueryInterface().describeTable('user_summaries');
      console.table(summaryTableInfo);
    } else {
    }
    
  } catch (error) {
    console.error('❌ Error verifying tables:', error);
  } finally {
    await sequelize.close();
  }
};

verifyTables();