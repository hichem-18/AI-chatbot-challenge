import { sequelize } from '../configs/database.js';
import User from './User.js';
import ChatHistory from './ChatHistory.js';
import UserSummary from './UserSummary.js';

// Define associations between models
const initializeModels = () => {
  // User has many ChatHistory records
  User.hasMany(ChatHistory, {
    foreignKey: 'userId',
    as: 'chatHistory'
  });

  // ChatHistory belongs to User
  ChatHistory.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  // User has one UserSummary
  User.hasOne(UserSummary, {
    foreignKey: 'userId',
    as: 'summary'
  });

  // UserSummary belongs to User
  UserSummary.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

// Initialize the associations
initializeModels();

// Export models and sequelize instance
export {
  sequelize,
  User,
  ChatHistory,
  UserSummary,
  initializeModels
};

// Default export for convenience
export default {
  sequelize,
  User,
  ChatHistory,
  UserSummary,
  initializeModels
};