// test-arabic-enhancements.js
// Test script for enhanced Arabic language support with cultural nuances

import { processConversationGraph } from './services/langGraphAgent.js';
import { getChatResponse } from './services/aiService.js';
import { User } from './models/index.js';

const testArabicEnhancements = async () => {
  console.log('🕌 Testing Enhanced Arabic Language Support');
  console.log('==========================================');

  try {
    // Create Arabic test user
    console.log('\n👤 Creating Arabic test user...');
    const testUser = await User.findOrCreate({
      where: { email: 'arabic-test@example.com' },
      defaults: {
        email: 'arabic-test@example.com',
        password: 'testpassword123',
        language_preference: 'ar'
      }
    });
    const testUserId = testUser[0].id;
    console.log(`✅ Arabic test user created: ID ${testUserId}`);

    // Test 1: Casual Arabic conversation with cultural greetings
    console.log('\n1️⃣ Testing casual Arabic conversation...');
    const casualArabic = await processConversationGraph(
      testUserId,
      "السلام عليكم، كيف حالك اليوم؟",
      "ar"
    );
    console.log('✅ Casual Arabic:', casualArabic.substring(0, 150) + '...');

    // Test 2: Technical query in Arabic
    console.log('\n2️⃣ Testing technical query in Arabic...');
    const technicalArabic = await processConversationGraph(
      testUserId,
      "أريد تعلم البرمجة بلغة جافا سكريبت، من أين أبدأ؟",
      "ar"
    );
    console.log('✅ Technical Arabic:', technicalArabic.substring(0, 150) + '...');

    // Test 3: Help request with formal tone
    console.log('\n3️⃣ Testing help request in Arabic...');
    const helpArabic = await processConversationGraph(
      testUserId,
      "هل يمكنك مساعدتي في فهم إمكانيات هذا النظام؟",
      "ar"
    );
    console.log('✅ Help Arabic:', helpArabic.substring(0, 150) + '...');

    // Test 4: Summary request
    console.log('\n4️⃣ Testing summary in Arabic...');
    const summaryArabic = await processConversationGraph(
      testUserId,
      "أريد ملخصاً لمحادثتنا من فضلك",
      "ar"
    );
    console.log('✅ Summary Arabic:', summaryArabic.substring(0, 150) + '...');

    // Test 5: Simple LangChain Arabic response
    console.log('\n5️⃣ Testing simple Arabic response...');
    const simpleArabic = await getChatResponse(
      testUserId,
      "حدثني عن أهمية الأدب في الثقافة العربية",
      "llama-3.1-8b",
      "ar"
    );
    console.log('✅ Simple Arabic:', simpleArabic.substring(0, 150) + '...');

    // Test 6: Cultural context test
    console.log('\n6️⃣ Testing cultural context awareness...');
    const culturalArabic = await processConversationGraph(
      testUserId,
      "ما رأيك في أهمية احترام الوالدين في الإسلام؟",
      "ar"
    );
    console.log('✅ Cultural Arabic:', culturalArabic.substring(0, 150) + '...');

    console.log('\n🎉 جميع اختبارات اللغة العربية المحسنة اكتملت بنجاح!');
    console.log('🌟 All enhanced Arabic language tests completed successfully!');

  } catch (error) {
    console.error('❌ Arabic enhancement test failed:', error.message);
    console.error('Full error:', error);
  }
};

// Run the tests
testArabicEnhancements();