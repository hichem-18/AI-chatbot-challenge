// routes/chatRoutes.js
// Chat routes for the AI chatbot with LangChain integration

import express from 'express';
import { getChatResponse, validateApiKeys, getMemoryStats, clearUserMemory } from '../services/aiService.js';
import { processConversationGraph, getGraphStats } from '../services/langGraphAgent.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import * as chatController from '../controllers/chatController.js';

const router = express.Router();

// Use controller methods for better organization
/**
 * Send a chat message using LangGraph agent (main endpoint)
 * @route POST /api/chat/message
 */
router.post('/message', authenticateToken, chatController.sendMessage);

/**
 * Send a chat message using simple LangChain (alternative)
 * @route POST /api/chat/simple
 */
router.post('/simple', authenticateToken, chatController.sendSimpleMessage);

/**
 * Start a new conversation
 * @route POST /api/chat/new-conversation
 */
router.post('/new-conversation', authenticateToken, chatController.createNewConversation);

/**
 * Get all user conversations
 * @route GET /api/chat/conversations
 */
router.get('/conversations', authenticateToken, chatController.getUserConversations);

/**
 * Get conversation history by ID
 * @route GET /api/chat/history/:conversationId
 */
router.get('/history/:conversationId', authenticateToken, chatController.getConversationHistory);

/**
 * Get all chat history for the user (legacy endpoint)
 * @route GET /api/chat/history
 */
router.get('/history', authenticateToken, chatController.getAllChatHistory);

/**
 * Get user summary
 * @route GET /api/chat/summary
 */
router.get('/summary', authenticateToken, chatController.getUserSummary);

/**
 * Generate user summary
 * @route POST /api/chat/generate-summary
 */
router.post('/generate-summary', authenticateToken, chatController.generateUserSummary);

/**
 * Delete a conversation
 * @route DELETE /api/chat/conversation/:id
 */
router.delete('/conversation/:id', authenticateToken, chatController.deleteConversation);

/**
 * Clear conversation memory
 * @route DELETE /api/chat/memory
 */
router.delete('/memory', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId = 'default' } = req.body;

    clearUserMemory(userId, conversationId);

    res.json({
      success: true,
      message: 'Conversation memory cleared'
    });

  } catch (error) {
    console.error('Clear memory error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear memory'
    });
  }
});

/**
 * Get AI service status
 * @route GET /api/chat/status
 */
router.get('/status', async (req, res) => {
  try {
    const apiKeys = validateApiKeys();
    const memoryStats = getMemoryStats();
    const graphStats = getGraphStats();

    res.json({
      success: true,
      data: {
        apiKeys,
        memoryStats,
        graphStats,
        availableModels: ["llama-3.1-8b", "llama-3.1-70b", "gpt-3.5-turbo", "gpt-4"],
        supportedLanguages: ["en", "ar"],
        agents: {
          simple: "Basic LangChain conversation",
          langgraph: "Advanced conversation flow with intent routing"
        }
      }
    });

  } catch (error) {
    console.error('Status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get service status'
    });
  }
});

export default router;