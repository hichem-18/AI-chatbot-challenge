// controllers/chatController.js
// Chat controller with LangChain and LangGraph integration
// Handles all chat-related operations with proper conversation management

import { processConversationGraph } from '../services/langGraphAgent.js';
import { getChatResponse, clearUserMemory } from '../services/aiService.js';
import { ChatHistory, UserSummary, sequelize } from '../models/index.js';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

/**
 * Send a chat message using LangGraph agent (main endpoint)
 * @route POST /api/chat/message
 */
export const sendMessage = async (req, res) => {
  try {
    const { 
      message, 
      language = "en", 
      conversationId = "default",
      model_name = "langgraph-agent" 
    } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: language === 'ar' 
          ? 'الرسالة مطلوبة من فضلك'
          : 'Message is required'
      });
    }


    // Process with LangGraph agent
    const response = await processConversationGraph(
      userId,
      message.trim(),
      language,
      conversationId
    );

    // Get the latest chat record (created by the agent)
    const latestChat = await ChatHistory.findOne({
      where: { 
        userId,
        message: message.trim()
      },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        id: latestChat?.id || null,
        conversationId: conversationId,
        message: message.trim(),
        response: response,
        model_name: 'langgraph-agent',
        language: language,
        createdAt: latestChat?.createdAt || new Date(),
        agent_type: 'langgraph'
      }
    });

  } catch (error) {
    console.error('LangGraph message error:', error);
    res.status(500).json({
      success: false,
      message: error.message || (
        req.body.language === 'ar' 
          ? 'فشل في معالجة الرسالة'
          : 'Failed to process chat message'
      )
    });
  }
};

/**
 * Send a chat message using simple LangChain
 * @route POST /api/chat/simple
 */
export const sendSimpleMessage = async (req, res) => {
  try {
    const { 
      message, 
      model_name = "llama-3.1-8b", 
      language = "en",
      conversationId = "default"
    } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: language === 'ar' 
          ? 'الرسالة مطلوبة من فضلك'
          : 'Message is required'
      });
    }


    // Get AI response using simple LangChain
    const response = await getChatResponse(
      userId,
      message.trim(),
      model_name,
      language,
      conversationId
    );

    // Save to database
    const chatRecord = await ChatHistory.create({
      userId: userId,
      model_name: model_name,
      message: message.trim(),
      response: response,
      language: language
    });

    res.json({
      success: true,
      data: {
        id: chatRecord.id,
        conversationId: conversationId,
        message: message.trim(),
        response: response,
        model_name: model_name,
        language: language,
        createdAt: chatRecord.createdAt,
        agent_type: 'simple'
      }
    });

  } catch (error) {
    console.error('Simple chat error:', error);
    res.status(500).json({
      success: false,
      message: error.message || (
        req.body.language === 'ar' 
          ? 'فشل في معالجة الرسالة'
          : 'Failed to process chat message'
      )
    });
  }
};

/**
 * Create a new conversation
 * @route POST /api/chat/new-conversation
 */
export const createNewConversation = async (req, res) => {
  try {
    const { title, language = "en" } = req.body;
    const userId = req.user.id;

    // Generate unique conversation ID
    const conversationId = uuidv4();

    // Clear any existing memory for this new conversation
    clearUserMemory(userId, conversationId);


    res.json({
      success: true,
      data: {
        conversationId,
        title: title || (language === 'ar' ? 'محادثة جديدة' : 'New Conversation'),
        language,
        createdAt: new Date(),
        messageCount: 0
      }
    });

  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({
      success: false,
      message: req.body.language === 'ar' 
        ? 'فشل في إنشاء محادثة جديدة'
        : 'Failed to create new conversation'
    });
  }
};

/**
 * Get all user conversations
 * @route GET /api/chat/conversations
 */
export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, offset = 0 } = req.query;

    // Get conversations by grouping chat history
    const conversations = await ChatHistory.findAll({
      attributes: [
        [sequelize.fn('COALESCE', sequelize.col('conversationId'), 'default'), 'conversationId'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'messageCount'],
        [sequelize.fn('MAX', sequelize.col('createdAt')), 'lastActivity'],
        [sequelize.fn('MIN', sequelize.col('createdAt')), 'createdAt'],
        'language'
      ],
      where: { userId },
      group: [
        sequelize.fn('COALESCE', sequelize.col('conversationId'), 'default'),
        'language'
      ],
      order: [[sequelize.fn('MAX', sequelize.col('createdAt')), 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      raw: true
    });

    // Get first messages for each conversation to generate names
    const conversationsWithTitles = await Promise.all(conversations.map(async (conv) => {
      try {
        // Get the first message of this conversation
        const whereCondition = conv.conversationId === 'default' 
          ? { 
              userId, 
              [Op.or]: [
                { conversationId: 'default' },
                { conversationId: null }
              ]
            }
          : { userId, conversationId: conv.conversationId };

        const firstMessage = await ChatHistory.findOne({
          where: whereCondition,
          order: [['createdAt', 'ASC']],
          attributes: ['message', 'language']
        });

        // Generate conversation name from first message
        let title = 'New Conversation'; // Default fallback
        
        if (firstMessage?.message) {
          const message = firstMessage.message.trim();
          const language = firstMessage.language || conv.language || 'en';
          
          // Clean message and extract words
          const cleanMessage = message.replace(/[^\w\s\u0600-\u06FF]/g, '').trim();
          const words = cleanMessage.split(/\s+/).filter(word => word.length > 0);
          
          if (words.length > 0) {
            // Take first 3-4 words based on language
            const wordCount = language === 'ar' ? 3 : 4;
            const selectedWords = words.slice(0, wordCount);
            const generatedTitle = selectedWords.join(' ');
            
            if (generatedTitle.length >= 3) {
              title = generatedTitle.length > 50 
                ? generatedTitle.substring(0, 47) + '...' 
                : generatedTitle;
            }
          }
          
          // Set language-specific fallback if needed
          if (title === 'New Conversation' && language === 'ar') {
            title = 'محادثة جديدة';
          }
        } else {
          if (conv.language === 'ar') {
            title = 'محادثة جديدة';
          }
        }

        return { ...conv, title };
      } catch (error) {
        console.error('Error generating title for conversation:', conv.conversationId, error);
        return { 
          ...conv, 
          title: conv.language === 'ar' ? 'محادثة جديدة' : 'New Conversation' 
        };
      }
    }));

    const totalConversations = await ChatHistory.findAll({
      attributes: [
        [sequelize.fn('COUNT', 
          sequelize.fn('DISTINCT', 
            sequelize.fn('COALESCE', sequelize.col('conversationId'), 'default')
          )
        ), 'count']
      ],
      where: { userId },
      raw: true
    });

    res.json({
      success: true,
      data: conversationsWithTitles,
      total: parseInt(totalConversations[0]?.count || 0),
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations'
    });
  }
};

/**
 * Get conversation history by conversation ID
 * @route GET /api/chat/history/:conversationId
 */
export const getConversationHistory = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const { limit = 50, offset = 0, order = 'ASC' } = req.query;

    // Handle default conversation ID
    const whereCondition = {
      userId,
      ...(conversationId === 'default' 
        ? { 
            [Op.or]: [
              { conversationId: 'default' },
              { conversationId: null }
            ]
          }
        : { conversationId }
      )
    };

    const chatHistory = await ChatHistory.findAll({
      where: whereCondition,
      order: [['createdAt', order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: [
        'id', 'model_name', 'message', 'response', 
        'language', 'createdAt', 'conversationId'
      ]
    });

    const totalMessages = await ChatHistory.count({
      where: whereCondition
    });

    res.json({
      success: true,
      data: {
        conversationId,
        messages: chatHistory,
        total: totalMessages,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          order: order.toUpperCase()
        }
      }
    });

  } catch (error) {
    console.error('Get conversation history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversation history'
    });
  }
};

/**
 * Get all chat history for user (legacy endpoint)
 * @route GET /api/chat/history
 */
export const getAllChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, offset = 0 } = req.query;

    const chatHistory = await ChatHistory.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: [
        'id', 'model_name', 'message', 'response', 
        'language', 'createdAt', 'conversationId'
      ]
    });

    const total = await ChatHistory.count({ where: { userId } });

    res.json({
      success: true,
      data: chatHistory,
      total: total,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });

  } catch (error) {
    console.error('Get all history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat history'
    });
  }
};

/**
 * Get user summary
 * @route GET /api/chat/summary
 */
export const getUserSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { language = 'en' } = req.query;

    // Get user summary
    const userSummary = await UserSummary.findOne({
      where: { userId },
      attributes: ['summary_text', 'language', 'updatedAt']
    });

    // Get conversation statistics
    const stats = await ChatHistory.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalMessages'],
        [sequelize.fn('COUNT', 
          sequelize.fn('DISTINCT', 
            sequelize.fn('COALESCE', sequelize.col('conversationId'), 'default')
          )
        ), 'totalConversations'],
        [sequelize.fn('COUNT', 
          sequelize.literal("CASE WHEN language = 'ar' THEN 1 END")
        ), 'arabicMessages'],
        [sequelize.fn('COUNT', 
          sequelize.literal("CASE WHEN language = 'en' THEN 1 END")
        ), 'englishMessages'],
        [sequelize.fn('MAX', sequelize.col('createdAt')), 'lastActivity']
      ],
      where: { userId },
      raw: true
    });

    const statistics = stats[0] || {};

    res.json({
      success: true,
      data: {
        summary: userSummary ? {
          text: userSummary.summary_text,
          language: userSummary.language,
          updatedAt: userSummary.updatedAt
        } : null,
        statistics: {
          totalMessages: parseInt(statistics.totalMessages || 0),
          totalConversations: parseInt(statistics.totalConversations || 0),
          arabicMessages: parseInt(statistics.arabicMessages || 0),
          englishMessages: parseInt(statistics.englishMessages || 0),
          lastActivity: statistics.lastActivity
        },
        hasSummary: !!userSummary
      }
    });

  } catch (error) {
    console.error('Get user summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user summary'
    });
  }
};

/**
 * Generate user summary based on conversation history
 * @route POST /api/chat/generate-summary
 */
export const generateUserSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { language = 'en' } = req.body;

    // Get recent conversation history for summary generation
    const recentChats = await ChatHistory.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 50, // Use last 50 messages for summary
      attributes: ['message', 'response', 'language', 'createdAt']
    });

    if (recentChats.length === 0) {
      return res.json({
        success: false,
        message: language === 'ar' 
          ? 'لا توجد محادثات كافية لإنشاء ملخص'
          : 'Not enough conversation history to generate summary'
      });
    }

    // Prepare conversation context for AI
    const conversationContext = recentChats.map(chat => 
      `User: ${chat.message}\nAssistant: ${chat.response}`
    ).join('\n\n');

    // Generate summary using AI (simplified version)
    const summaryPrompt = language === 'ar' 
      ? `قم بإنشاء ملخص شخصي للمستخدم بناءً على محادثاته التالية. اجعل الملخص يعكس اهتماماته وأسلوب تفاعله:\n\n${conversationContext}\n\nالملخص:`
      : `Create a personalized user summary based on the following conversations. Make the summary reflect their interests and interaction style:\n\n${conversationContext}\n\nSummary:`;

    // Use simple AI generation (you can enhance this with actual AI service)
    let summaryText = '';
    
    if (language === 'ar') {
      summaryText = `مستخدم نشط يتفاعل بانتظام مع المساعد الذكي. يظهر اهتماماً بمواضيع متنوعة ويطرح أسئلة مفيدة. لديه ${recentChats.length} محادثة حديثة تظهر تفاعلاً إيجابياً مع النظام. المستخدم يفضل التواصل ${language === 'ar' ? 'باللغة العربية' : 'باللغة الإنجليزية'} ويسعى للحصول على معلومات مفيدة ومساعدة فعالة.`;
    } else {
      summaryText = `Active user who regularly engages with the AI assistant. Shows interest in diverse topics and asks thoughtful questions. Has ${recentChats.length} recent conversations demonstrating positive interaction with the system. The user prefers communicating in ${language === 'ar' ? 'Arabic' : 'English'} and seeks helpful information and effective assistance.`;
    }

    // Save or update summary in database
    const [userSummary, created] = await UserSummary.findOrCreate({
      where: { userId },
      defaults: {
        summary_text: summaryText,
        language: language,
      }
    });

    if (!created) {
      // Update existing summary
      await userSummary.update({
        summary_text: summaryText,
        language: language,
        updatedAt: new Date()
      });
    }

    res.json({
      success: true,
      data: {
        summary: {
          text: summaryText,
          language: language,
          updatedAt: new Date().toISOString()
        }
      },
      message: language === 'ar' 
        ? 'تم إنشاء الملخص بنجاح'
        : 'Summary generated successfully'
    });

  } catch (error) {
    console.error('Generate user summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate user summary'
    });
  }
};

/**
 * Delete a conversation
 * @route DELETE /api/chat/conversation/:id
 */
export const deleteConversation = async (req, res) => {
  try {
    const { id: conversationId } = req.params;
    const userId = req.user.id;
    const { language = 'en' } = req.body;

    // Delete all chat history for this conversation (handle all possible conversationId variations)
    const whereCondition = {
      userId,
      [Op.or]: [
        { conversationId: conversationId },
        ...(conversationId === 'default' ? [
          { conversationId: null },
          { conversationId: 'default' }
        ] : [])
      ]
    };

    
    // Delete chat history
    const deletedCount = await ChatHistory.destroy({
      where: whereCondition
    });


    // Clear memory for this conversation
    clearUserMemory(userId, conversationId);


    res.json({
      success: true,
      message: language === 'ar' 
        ? `تم حذف المحادثة بنجاح (${deletedCount} رسالة)`
        : `Conversation deleted successfully (${deletedCount} messages)`,
      data: {
        conversationId,
        deletedMessageCount: deletedCount
      }
    });

  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({
      success: false,
      message: req.body.language === 'ar' 
        ? 'فشل في حذف المحادثة'
        : 'Failed to delete conversation'
    });
  }
};

export default {
  sendMessage,
  sendSimpleMessage,
  createNewConversation,
  getUserConversations,
  getConversationHistory,
  getAllChatHistory,
  getUserSummary,
  generateUserSummary,
  deleteConversation
};