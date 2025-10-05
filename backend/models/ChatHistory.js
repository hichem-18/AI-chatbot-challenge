import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/database.js';

const ChatHistory = sequelize.define('ChatHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  conversationId: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'default',
    validate: {
      len: [1, 255]
    }
  },
  model_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  language: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'en',
    validate: {
      isIn: [['en', 'ar']]
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'chat_history',
  timestamps: true,
  updatedAt: false // We only want createdAt for ChatHistory
});

export default ChatHistory;