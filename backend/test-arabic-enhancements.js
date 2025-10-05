// test-arabic-enhancements.js
// Test script for enhanced Arabic language support with cultural nuances

import { processConversationGraph } from './services/langGraphAgent.js';
import { getChatResponse } from './services/aiService.js';
import { User } from './models/index.js';

const testArabicEnhancements = async () => {

  try {
    // Create Arabic test user
    const testUser = await User.findOrCreate({
      where: { email: 'arabic-test@example.com' },
      defaults: {
        email: 'arabic-test@example.com',
        password: 'testpassword123',
        language_preference: 'ar'
      }
    });
    const testUserId = testUser[0].id;

    // Test 1: Casual Arabic conversation with cultural greetings
    const casualArabic = await processConversationGraph(
      testUserId,
      "السلام عليكم، كيف حالك اليوم؟",
      "ar"
    );

    // Test 2: Technical query in Arabic
    const technicalArabic = await processConversationGraph(
      testUserId,
      "أريد تعلم البرمجة بلغة جافا سكريبت، من أين أبدأ؟",
      "ar"
    );

    // Test 3: Help request with formal tone
    const helpArabic = await processConversationGraph(
      testUserId,
      "هل يمكنك مساعدتي في فهم إمكانيات هذا النظام؟",
      "ar"
    );

    // Test 4: Summary request
    const summaryArabic = await processConversationGraph(
      testUserId,
      "أريد ملخصاً لمحادثتنا من فضلك",
      "ar"
    );

    // Test 5: Simple LangChain Arabic response
    const simpleArabic = await getChatResponse(
      testUserId,
      "حدثني عن أهمية الأدب في الثقافة العربية",
      "llama-3.1-8b",
      "ar"
    );

    // Test 6: Cultural context test
    const culturalArabic = await processConversationGraph(
      testUserId,
      "ما رأيك في أهمية احترام الوالدين في الإسلام؟",
      "ar"
    );


  } catch (error) {
    console.error('❌ Arabic enhancement test failed:', error.message);
    console.error('Full error:', error);
  }
};

// Run the tests
testArabicEnhancements();