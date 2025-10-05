// services/langGraphAgent.js
// Advanced LangGraph agent for intelligent conversation flow
// Handles routing, context management, and sophisticated responses

import { StateGraph, END } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatHistory, UserSummary } from '../models/index.js';
// Note: getUserMemory is available but not needed in this implementation
import dotenv from 'dotenv';

dotenv.config();

// State schema for the conversation
const ConversationState = {
  messages: [],
  userId: null,
  language: "en",
  intent: null,
  context: {},
  response: "",
  needsSummary: false,
  conversationId: "default"
};

// Initialize LLM
const llm = new ChatGroq({
  model: "llama-3.1-8b-instant",
  temperature: 0.7,
  maxTokens: 1000,
  apiKey: process.env.GROQ_API_KEY
});

// Intent classification prompts
const INTENT_CLASSIFIER_PROMPTS = {
  en: `Analyze this user message and classify the intent. Return ONLY one word from these options:
- casual: General conversation, greetings, jokes, small talk
- technical: Programming, development, specific technical questions
- summary: User wants to see their conversation summary or history
- help: User needs help or assistance with the system

User message: "{message}"

Intent:`,
  ar: `حلل هذه الرسالة من المستخدم واستنبط القصد منها. أرجع كلمة واحدة فقط من هذه الخيارات باللغة الإنجليزية:
- casual: محادثة عامة، تحيات، سؤال عن الحال، حديث اجتماعي
- technical: أسئلة برمجة، تطوير، تقنية، علوم حاسوب، هندسة
- summary: طلب ملخص المحادثة، استعراض التاريخ، تلخيص ما سبق  
- help: طلب المساعدة، شرح النظام، التوجيه، الإرشاد

رسالة المستخدم: "{message}"

تصنيف القصد:`
};

// Response prompts for different intents
const RESPONSE_PROMPTS = {
  casual: {
    en: `You are a friendly AI assistant having a casual conversation. Be warm, engaging, and natural.
Keep responses conversational and helpful.

Previous context: {context}
User message: {message}

Response:`,
    ar: `أنت مساعد ذكي مهذب تقوم بمحادثة ودية. التزم بالأدب العربي الأصيل والثقافة الإسلامية.

إرشادات للمحادثة العادية:
- ابدأ بتحية مناسبة (السلام عليكم، مرحباً، أهلاً بك)
- استخدم اللغة العربية الفصحى مع الطابع الودود
- أظهر الاهتمام الصادق بالمستخدم
- تجنب الإفراط في الرسمية لكن حافظ على الأدب
- استخدم تعابير الود العربية (بارك الله فيك، وفقك الله، حفظك الله)
- اختتم بدعوة مهذبة للحديث مرة أخرى

السياق السابق: {context}
رسالة المستخدم: {message}

رد ودود ومهذب:`
  },
  technical: {
    en: `You are an expert technical assistant. Provide detailed, accurate technical information.
Use examples, code snippets when relevant, and be thorough in your explanations.

Previous context: {context}
User message: {message}

Technical Response:`,
    ar: `أنت مساعد تقني خبير متخصص. قدم معلومات تقنية دقيقة ومفصلة باللغة العربية الفصحى.

إرشادات للردود التقنية:
- استخدم المصطلحات التقنية العربية الصحيحة (حاسوب، برمجة، شبكة، قاعدة بيانات)
- اشرح المفاهيم بطريقة واضحة ومنهجية
- قدم أمثلة عملية ومقاطع الكود عند الحاجة
- اربط المعلومات بالسياق العربي والإسلامي عند الإمكان
- تجنب التعقيد الزائد واجعل الشرح مفهوماً
- استخدم ألفاظ التقدير (تفضل، بإذنك، كما تطلب)
- اختتم بسؤال عن وضوح المعلومة أو الحاجة لمزيد من التفصيل

السياق السابق: {context}
استفسار المستخدم: {message}

الرد التقني المفصل:`
  },
  summary: {
    en: `Create a comprehensive summary of the user's conversation history and interests.
Focus on key topics discussed, preferences shown, and patterns in their questions.

Conversation history: {history}
User message: {message}

Summary:`,
    ar: `أنشئ ملخصاً شاملاً ومهذباً لتاريخ محادثات المستخدم واهتماماته باللغة العربية الفصحى.

إرشادات الملخص:
- ابدأ بتحية مهذبة واشكر المستخدم على ثقته
- لخص المواضيع الرئيسية بطريقة منظمة ومرتبة
- أبرز اهتمامات المستخدم وتفضيلاته
- استخدم لغة رسمية محترمة مع الود المناسب
- اذكر النقاط المهمة والإنجازات في المحادثات
- قدم نصائح أو توجيهات مفيدة إذا كان ذلك مناسباً
- اختتم بالدعاء للمستخدم والتمني له التوفيق

سجل المحادثات: {history}
طلب المستخدم: {message}

ملخص شامل ومهذب:`
  },
  help: {
    en: `You are a helpful system assistant. Provide clear guidance about the chatbot features and capabilities.
Be informative about available commands, features, and how to use the system effectively.

Available features:
- Multi-language support (English/Arabic)
- Multiple AI models (llama-3.1-8b, llama-3.1-70b, gpt-3.5-turbo, gpt-4)
- Conversation memory and history
- User summaries and preferences
- Technical and casual conversation modes

User message: {message}

Help Response:`,
    ar: `أنت مساعد نظام مؤدب ومفيد. قدم إرشادات واضحة حول إمكانيات وميزات المساعد الذكي باللغة العربية الفصحى.

إرشادات تقديم المساعدة:
- ابدأ بترحيب حار ومهذب بالمستخدم
- اشرح الميزات بطريقة منظمة وواضحة
- استخدم المصطلحات العربية الصحيحة للتقنيات
- قدم أمثلة عملية لكيفية الاستفادة من كل ميزة
- أظهر الحرص على راحة المستخدم ورضاه
- اختتم بتأكيد الاستعداد للمساعدة في أي وقت

الميزات المتاحة:
- دعم اللغتين العربية والإنجليزية مع احترام الثقافة العربية
- نماذج ذكية متطورة متعددة
- ذاكرة محادثة ذكية وسجل للتفاعلات
- ملخصات شخصية للمستخدم وحفظ التفضيلات  
- أنماط متخصصة للمحادثة (تقنية، عادية، علمية)
- احترام الخصوصية والقيم الثقافية

استفسار المستخدم: {message}

رد مساعدة مهذب وشامل:`
  }
};

/**
 * Node 1: Route Query - Determines the intent of user message
 */
async function routeQuery(state) {
  try {
    
    const message = state.messages[state.messages.length - 1];
    const language = state.language || 'en';
    
    const intentPrompt = PromptTemplate.fromTemplate(INTENT_CLASSIFIER_PROMPTS[language]);
    const intentChain = intentPrompt.pipe(llm);
    
    const intentResponse = await intentChain.invoke({
      message: message
    });
    
    const intent = intentResponse.content.toLowerCase().trim();
    
    // Get recent conversation context
    const recentHistory = await ChatHistory.findAll({
      where: { userId: state.userId },
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['message', 'response', 'createdAt']
    });
    
    const context = recentHistory.map(h => `User: ${h.message}\nAI: ${h.response}`).join('\n\n');
    
    return {
      ...state,
      intent,
      context: { recentHistory: context }
    };
    
  } catch (error) {
    console.error('❌ Error in routeQuery:', error);
    return {
      ...state,
      intent: 'casual',
      context: {}
    };
  }
}

/**
 * Node 2: Respond Chat - Handles casual conversation
 */
async function respondChat(state) {
  try {
    
    const message = state.messages[state.messages.length - 1];
    const language = state.language || 'en';
    const context = state.context.recentHistory || '';
    
    const chatPrompt = PromptTemplate.fromTemplate(RESPONSE_PROMPTS.casual[language]);
    const chatChain = chatPrompt.pipe(llm);
    
    const response = await chatChain.invoke({
      message,
      context: context.substring(0, 500) // Limit context size
    });
    
    return {
      ...state,
      response: response.content,
      needsSummary: false
    };
    
  } catch (error) {
    console.error('❌ Error in respondChat:', error);
    return {
      ...state,
      response: language === 'ar' 
        ? 'أعتذر بصدق عن هذا الخطأ التقني، حضرتك. سأحاول مساعدتك بطريقة أخرى إن شاء الله. يرجى إعادة المحاولة أو صياغة السؤال بطريقة مختلفة.'
        : 'Sorry, I encountered an error processing your message.'
    };
  }
}

/**
 * Node 3: Respond Technical - Handles technical queries
 */
async function respondTechnical(state) {
  try {
    
    const message = state.messages[state.messages.length - 1];
    const language = state.language || 'en';
    const context = state.context.recentHistory || '';
    
    const techPrompt = PromptTemplate.fromTemplate(RESPONSE_PROMPTS.technical[language]);
    const techChain = techPrompt.pipe(llm);
    
    const response = await techChain.invoke({
      message,
      context: context.substring(0, 800) // More context for technical queries
    });
    
    return {
      ...state,
      response: response.content,
      needsSummary: false
    };
    
  } catch (error) {
    console.error('❌ Error in respondTechnical:', error);
    return {
      ...state,
      response: language === 'ar' 
        ? 'أعتذر حضرتك، واجهت صعوبة تقنية في معالجة استفسارك المتخصص. أرجو المحاولة مرة أخرى أو إعادة صياغة السؤال بطريقة أخرى، وسأبذل جهدي لمساعدتك بإذن الله.'
        : 'Sorry, I cannot process your technical query at the moment.'
    };
  }
}

/**
 * Node 4: Generate Summary - Creates user summary
 */
async function generateSummary(state) {
  try {
    
    const language = state.language || 'en';
    
    // Get comprehensive chat history
    const fullHistory = await ChatHistory.findAll({
      where: { userId: state.userId },
      order: [['createdAt', 'DESC']],
      limit: 20,
      attributes: ['message', 'response', 'model_name', 'language', 'createdAt']
    });
    
    const historyText = fullHistory.map(h => 
      `[${h.createdAt.toISOString()}] User: ${h.message}\nAI (${h.model_name}): ${h.response}`
    ).join('\n\n');
    
    const summaryPrompt = PromptTemplate.fromTemplate(RESPONSE_PROMPTS.summary[language]);
    const summaryChain = summaryPrompt.pipe(llm);
    
    const summaryResponse = await summaryChain.invoke({
      history: historyText.substring(0, 2000), // Limit for API
      message: state.messages[state.messages.length - 1]
    });
    
    // Save summary to database
    await UserSummary.upsert({
      userId: state.userId,
      summary_text: summaryResponse.content,
      language: language
    });
    
    
    return {
      ...state,
      response: summaryResponse.content,
      needsSummary: true
    };
    
  } catch (error) {
    console.error('❌ Error in generateSummary:', error);
    return {
      ...state,
      response: language === 'ar' 
        ? 'أعتذر حضرتك، لا أستطيع إعداد الملخص في هذه اللحظة نظراً لظروف تقنية. أرجو المحاولة لاحقاً وسأكون في خدمتك بإذن الله.'
        : 'Sorry, I cannot generate a summary at the moment.'
    };
  }
}

/**
 * Node 5: Respond Help - Provides system help
 */
async function respondHelp(state) {
  try {
    
    const message = state.messages[state.messages.length - 1];
    const language = state.language || 'en';
    
    const helpPrompt = PromptTemplate.fromTemplate(RESPONSE_PROMPTS.help[language]);
    const helpChain = helpPrompt.pipe(llm);
    
    const response = await helpChain.invoke({
      message
    });
    
    return {
      ...state,
      response: response.content,
      needsSummary: false
    };
    
  } catch (error) {
    console.error('❌ Error in respondHelp:', error);
    return {
      ...state,
      response: language === 'ar' 
        ? 'أعتذر بصدق حضرتك، أواجه صعوبة تقنية في تقديم المساعدة الآن. أرجو منك المحاولة مرة أخرى وسأكون سعيداً لخدمتك بأفضل ما أستطيع.'
        : 'Sorry, I cannot provide help at the moment.'
    };
  }
}

/**
 * Conditional edge function - Routes to appropriate response node
 */
function routeToResponse(state) {
  const intent = state.intent;
  
  switch (intent) {
    case 'technical':
      return 'respond_technical';
    case 'summary':
      return 'generate_summary';
    case 'help':
      return 'respond_help';
    case 'casual':
    default:
      return 'respond_chat';
  }
}

/**
 * Create and compile the conversation graph
 */
function createConversationGraph() {
  
  const workflow = new StateGraph({
    channels: ConversationState
  });

  // Add nodes
  workflow.addNode("route_query", routeQuery);
  workflow.addNode("respond_chat", respondChat);
  workflow.addNode("respond_technical", respondTechnical);
  workflow.addNode("generate_summary", generateSummary);
  workflow.addNode("respond_help", respondHelp);

  // Set entry point
  workflow.setEntryPoint("route_query");

  // Add conditional edges
  workflow.addConditionalEdges(
    "route_query",
    routeToResponse,
    {
      "respond_chat": "respond_chat",
      "respond_technical": "respond_technical", 
      "generate_summary": "generate_summary",
      "respond_help": "respond_help"
    }
  );

  // Add edges to END
  workflow.addEdge("respond_chat", END);
  workflow.addEdge("respond_technical", END);
  workflow.addEdge("generate_summary", END);
  workflow.addEdge("respond_help", END);

  // Compile the graph
  const app = workflow.compile();
  
  return app;
}

/**
 * Main function to process conversation with LangGraph
 * @param {number} userId - User ID
 * @param {string} message - User message
 * @param {string} language - Language preference
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<string>} AI response
 */
export async function processConversationGraph(userId, message, language = 'en', conversationId = 'default') {
  try {
    
    const graph = createConversationGraph();
    
    const initialState = {
      messages: [message],
      userId,
      language,
      intent: null,
      context: {},
      response: "",
      needsSummary: false,
      conversationId
    };
    
    const result = await graph.invoke(initialState);
    
    // Save conversation to memory and database
    await ChatHistory.create({
      userId,
      conversationId,
      model_name: 'langgraph-agent',
      message: message.trim(),
      response: result.response,
      language
    });
    
    (`✅ Conversation processed successfully for user ${userId}`);
    return result.response;
    
  } catch (error) {
    console.error('❌ Error in processConversationGraph:', error);
    throw new Error(
      language === 'ar' 
        ? 'أعتذر بصدق حضرتك، حدث خطأ تقني أثناء معالجة محادثتنا. أرجو منك الصبر والمحاولة مرة أخرى، وإن شاء الله سأكون في خدمتك بشكل أفضل.'
        : 'Sorry, an error occurred while processing your conversation.'
    );
  }
}

/**
 * Get conversation graph statistics
 */
export function getGraphStats() {
  return {
    availableNodes: [
      'route_query',
      'respond_chat', 
      'respond_technical',
      'generate_summary',
      'respond_help'
    ],
    supportedIntents: ['casual', 'technical', 'summary', 'help'],
    supportedLanguages: ['en', 'ar']
  };
}

// Export everything
export default {
  processConversationGraph,
  getGraphStats,
  createConversationGraph
};