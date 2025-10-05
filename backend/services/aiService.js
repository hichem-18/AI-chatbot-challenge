// services/aiService.js
// LangChain AI service for chatbot functionality
// Handles model initialization, memory management, and chat responses

import { ChatOpenAI } from "@langchain/openai";
import { ChatGroq } from "@langchain/groq";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";
import dotenv from 'dotenv';

dotenv.config();

// Model configurations
const MODEL_CONFIGS = {
  "gpt-3.5-turbo": {
    provider: "openai",
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 1000
  },
  "gpt-4": {
    provider: "openai",
    modelName: "gpt-4",
    temperature: 0.7,
    maxTokens: 1500
  },
  "llama-3.1-70b": {
    provider: "groq",
    modelName: "llama-3.1-70b-versatile",
    temperature: 0.7,
    maxTokens: 2000
  },
  "llama-3.1-8b": {
    provider: "groq", 
    modelName: "llama-3.1-8b-instant",
    temperature: 0.7,
    maxTokens: 2000
  }
};

// Language-specific system prompts with cultural awareness
const SYSTEM_PROMPTS = {
  en: {
    template: `You are a helpful AI assistant. You provide clear, accurate, and helpful responses to user questions. 
Be friendly, professional, and engaging in your responses. If you don't know something, admit it honestly.

Current conversation:
{history}

Human: {input}
Assistant:`
  },
  ar: {
    template: `أنت مساعد ذكي محترم ومهذب. تتحدث بالعربية الفصحى مع الحفاظ على الأدب الإسلامي والثقافة العربية الأصيلة.

إرشادات مهمة للرد:
- استخدم اللغة العربية الفصحى المعاصرة (تجنب العامية تماماً)
- حافظ على الطابع الرسمي والمهني مع الود المناسب
- ابدأ بالتحية المناسبة (السلام عليكم، مرحباً، أهلاً وسهلاً)
- استخدم ألفاظ التقدير والاحترام (حضرتك، تكرماً، من فضلك، إذا سمحت)
- راعِ الحساسية الثقافية والدينية (تجنب المواضيع الحساسة)
- كن مفيداً ومساعداً مع التواضع اللائق
- اختتم بدعوة مهذبة للمساعدة مرة أخرى
- استخدم المصطلحات العربية الأصيلة بدلاً من المعرّبة عندما أمكن

المحادثة السابقة:
{history}

الإنسان: {input}
المساعد:`
  }
};

// Memory storage for each user
const userMemories = new Map();
const userChains = new Map();

/**
 * Initialize a chat model based on the model name
 * @param {string} modelName - The name of the model to initialize
 * @returns {ChatOpenAI|ChatGroq} The initialized chat model
 */
export const initializeChatModel = (modelName) => {
  try {
    const config = MODEL_CONFIGS[modelName];
    if (!config) {
      throw new Error(`Unsupported model: ${modelName}`);
    }

    let chatModel;

    if (config.provider === "openai") {
      chatModel = new ChatOpenAI({
        modelName: config.modelName,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
        openAIApiKey: process.env.OPENAI_API_KEY
      });
    } else if (config.provider === "groq") {
      chatModel = new ChatGroq({
        model: config.modelName,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
        apiKey: process.env.GROQ_API_KEY
      });
    } else {
      throw new Error(`Unsupported provider: ${config.provider}`);
    }

    return chatModel;
  } catch (error) {
    console.error(`❌ Error initializing chat model ${modelName}:`, error);
    throw error;
  }
};

/**
 * Get or create conversation memory for a user
 * @param {number} userId - The user ID
 * @param {string} conversationId - The conversation ID (optional)
 * @returns {ConversationBufferMemory} The conversation memory
 */
const getUserMemory = (userId, conversationId = 'default') => {
  const memoryKey = `${userId}-${conversationId}`;
  
  if (!userMemories.has(memoryKey)) {
    const memory = new BufferMemory({
      memoryKey: "history",
      inputKey: "input",
      outputKey: "response",
      returnMessages: false
    });
    userMemories.set(memoryKey, memory);
  }
  
  return userMemories.get(memoryKey);
};

/**
 * Get or create conversation chain for a user
 * @param {number} userId - The user ID
 * @param {string} modelName - The model name
 * @param {string} language - The language preference
 * @param {string} conversationId - The conversation ID
 * @returns {ConversationChain} The conversation chain
 */
const getUserChain = (userId, modelName, language, conversationId = 'default') => {
  const chainKey = `${userId}-${conversationId}-${modelName}-${language}`;
  
  if (!userChains.has(chainKey)) {
    const chatModel = initializeChatModel(modelName);
    const memory = getUserMemory(userId, conversationId);
    const promptTemplate = SYSTEM_PROMPTS[language] || SYSTEM_PROMPTS.en;
    
    const prompt = PromptTemplate.fromTemplate(promptTemplate.template);
    
    const chain = new ConversationChain({
      llm: chatModel,
      memory: memory,
      prompt: prompt,
      verbose: process.env.NODE_ENV === 'development'
    });
    
    userChains.set(chainKey, chain);
  }
  
  return userChains.get(chainKey);
};

/**
 * Get chat response for a user message
 * @param {number} userId - The user ID
 * @param {string} message - The user message
 * @param {string} modelName - The model name to use
 * @param {string} language - The language preference (en/ar)
 * @param {string} conversationId - The conversation ID (optional)
 * @returns {Promise<string>} The AI response
 */
export const getChatResponse = async (userId, message, modelName = "gpt-3.5-turbo", language = "en", conversationId = "default") => {
  try {
    // Validate inputs
    if (!userId || !message) {
      throw new Error('User ID and message are required');
    }

    if (!MODEL_CONFIGS[modelName]) {
      throw new Error(`Unsupported model: ${modelName}`);
    }

    if (!SYSTEM_PROMPTS[language]) {
      console.warn(`Unsupported language: ${language}, defaulting to English`);
      language = "en";
    }

    // Get or create conversation chain
    const chain = getUserChain(userId, modelName, language, conversationId);

    // Get response from the chain
    const response = await chain.call({
      input: message.trim()
    });

    const aiResponse = response.response || response.text || "I apologize, but I couldn't generate a response.";

    return aiResponse;

  } catch (error) {
    console.error(`❌ Error getting chat response:`, error);
    
    // Return appropriate error message based on language
    const errorMessage = language === 'ar' 
      ? 'عذراً، حدث خطأ أثناء معالجة رسالتك. يرجى المحاولة مرة أخرى.'
      : 'I apologize, but I encountered an error while processing your message. Please try again.';
    
    throw new Error(errorMessage);
  }
};

/**
 * Clear conversation memory for a user
 * @param {number} userId - The user ID
 * @param {string} conversationId - The conversation ID (optional)
 */
export const clearUserMemory = (userId, conversationId = 'default') => {
  const memoryKey = `${userId}-${conversationId}`;
  const chainKeys = Array.from(userChains.keys()).filter(key => key.startsWith(memoryKey));
  
  // Remove memory
  if (userMemories.has(memoryKey)) {
    userMemories.delete(memoryKey);
  }
  
  // Remove associated chains
  chainKeys.forEach(key => {
    userChains.delete(key);
  });
};

/**
 * Get memory statistics
 * @returns {Object} Memory usage statistics
 */
export const getMemoryStats = () => {
  return {
    totalMemories: userMemories.size,
    totalChains: userChains.size,
    memoryKeys: Array.from(userMemories.keys()),
    chainKeys: Array.from(userChains.keys())
  };
};

/**
 * Validate API keys
 * @returns {Object} API key validation status
 */
export const validateApiKeys = () => {
  const openaiKey = process.env.OPENAI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  
  return {
    openai: !!openaiKey && openaiKey.startsWith('sk-'),
    groq: !!groqKey && groqKey.length > 20,
    hasAnyKey: !!(openaiKey || groqKey)
  };
};

// Export all functions
export default {
  initializeChatModel,
  getChatResponse,
  clearUserMemory,
  getMemoryStats,
  validateApiKeys
};