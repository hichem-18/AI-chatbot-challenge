// test-ai-service.js
// Test script for the AI service functionality

import { getChatResponse, validateApiKeys, getMemoryStats, clearUserMemory } from './services/aiService.js';

const runTests = async () => {
  console.log('🧪 Testing AI Service');
  console.log('===================');

  try {
    // Test 1: Validate API Keys
    console.log('\n1️⃣ Testing API Key validation...');
    const apiStatus = validateApiKeys();
    console.log('API Keys status:', apiStatus);
    
    if (!apiStatus.hasAnyKey) {
      console.log('❌ No API keys found. Please add OPENAI_API_KEY or GROQ_API_KEY to your .env file');
      return;
    }

    // Test 2: Memory Stats (should be empty initially)
    console.log('\n2️⃣ Initial memory stats...');
    console.log('Memory stats:', getMemoryStats());

    // Test 3: Simple Chat Test
    console.log('\n3️⃣ Testing simple chat response...');
    const testUserId = 999;
    const testMessage = "Hello! Can you tell me a joke?";
    
    // Test with different models (use whichever API key you have)
    const modelToTest = apiStatus.groq ? "llama-3.1-8b" : "gpt-3.5-turbo";
    console.log(`Using model: ${modelToTest}`);
    
    const response1 = await getChatResponse(
      testUserId,
      testMessage,
      modelToTest,
      "en",
      "test-conversation"
    );
    
    console.log('✅ Response 1:', response1);

    // Test 4: Follow-up message (test memory)
    console.log('\n4️⃣ Testing conversation memory...');
    const followUpMessage = "That was funny! Tell me another one.";
    
    const response2 = await getChatResponse(
      testUserId,
      followUpMessage,
      modelToTest,
      "en",
      "test-conversation"
    );
    
    console.log('✅ Response 2:', response2);

    // Test 5: Arabic language test
    if (apiStatus.openai || apiStatus.groq) {
      console.log('\n5️⃣ Testing Arabic language...');
      const arabicResponse = await getChatResponse(
        testUserId,
        "مرحبا، كيف حالك؟",
        modelToTest,
        "ar",
        "test-conversation-ar"
      );
      console.log('✅ Arabic Response:', arabicResponse);
    }

    // Test 6: Memory stats after usage
    console.log('\n6️⃣ Memory stats after usage...');
    console.log('Memory stats:', getMemoryStats());

    // Test 7: Clear memory
    console.log('\n7️⃣ Testing memory cleanup...');
    clearUserMemory(testUserId, "test-conversation");
    clearUserMemory(testUserId, "test-conversation-ar");
    console.log('Memory stats after cleanup:', getMemoryStats());

    console.log('\n✅ All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
};

// Run the tests
runTests();