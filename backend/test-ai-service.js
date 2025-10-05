// test-ai-service.js
// Test script for the AI service functionality

import { getChatResponse, validateApiKeys, getMemoryStats, clearUserMemory } from './services/aiService.js';

const runTests = async () => {

  try {
    // Test 1: Validate API Keys
    const apiStatus = validateApiKeys();
    
    if (!apiStatus.hasAnyKey) {
      return;
    }

    // Test 2: Memory Stats (should be empty initially)

    // Test 3: Simple Chat Test
    const testUserId = 999;
    const testMessage = "Hello! Can you tell me a joke?";
    
    // Test with different models (use whichever API key you have)
    const modelToTest = apiStatus.groq ? "llama-3.1-8b" : "gpt-3.5-turbo";
    
    const response1 = await getChatResponse(
      testUserId,
      testMessage,
      modelToTest,
      "en",
      "test-conversation"
    );
    

    // Test 4: Follow-up message (test memory)
    const followUpMessage = "That was funny! Tell me another one.";
    
    const response2 = await getChatResponse(
      testUserId,
      followUpMessage,
      modelToTest,
      "en",
      "test-conversation"
    );
    

    // Test 5: Arabic language test
    if (apiStatus.openai || apiStatus.groq) {
      const arabicResponse = await getChatResponse(
        testUserId,
        "مرحبا، كيف حالك؟",
        modelToTest,
        "ar",
        "test-conversation-ar"
      );
    }

    clearUserMemory(testUserId, "test-conversation");
    clearUserMemory(testUserId, "test-conversation-ar");


  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
};

// Run the tests
runTests();