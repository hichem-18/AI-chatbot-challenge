import { DataTypes } from 'sequelize';
import { sequelize } from '../configs/database.js';

const UserSummary = sequelize.define('UserSummary', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // One summary per user
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  summary_text: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 5000] // Limit summary to 5000 characters
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
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'user_summaries',
  timestamps: true,
  createdAt: false, // We only want updatedAt for UserSummary
  hooks: {
    beforeUpdate: (userSummary) => {
      userSummary.updatedAt = new Date();
    }
  }
});

export default UserSummary;