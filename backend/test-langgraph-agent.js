// test-langgraph-agent.js
// Test script for LangGraph conversation agent

import { processConversationGraph, getGraphStats } from './services/langGraphAgent.js';
import { testConnection } from './configs/database.js';
import { User } from './models/index.js';

const runAgentTests = async () => {
  console.log('🤖 Testing LangGraph Agent');
  console.log('==========================');

  try {
    // Test database connection
    console.log('\n🔧 Testing database connection...');
    await testConnection();
    console.log('✅ Database connected');

    // Create test user
    console.log('\n👤 Creating test user...');
    const testUser = await User.findOrCreate({
      where: { email: 'test-agent@example.com' },
      defaults: {
        email: 'test-agent@example.com',
        password: 'testpassword123',
        language_preference: 'en'
      }
    });
    const testUserId = testUser[0].id;
    console.log(`✅ Test user created/found: ID ${testUserId}`);

    // Test 1: Graph Stats
    console.log('\n1️⃣ Getting graph statistics...');
    const stats = getGraphStats();
    console.log('Graph stats:', stats);

    // Test 2: Casual Conversation
    console.log('\n2️⃣ Testing casual conversation...');
    const casualResponse = await processConversationGraph(
      testUserId,
      "Hi there! How are you today?",
      "en"
    );
    console.log('✅ Casual response:', casualResponse.substring(0, 100) + '...');

    // Test 3: Technical Query
    console.log('\n3️⃣ Testing technical query...');
    const techResponse = await processConversationGraph(
      testUserId,
      "How do I implement a REST API in Node.js with Express?",
      "en"
    );
    console.log('✅ Technical response:', techResponse.substring(0, 100) + '...');

    // Test 4: Help Request
    console.log('\n4️⃣ Testing help request...');
    const helpResponse = await processConversationGraph(
      testUserId,
      "What can you help me with?",
      "en"
    );
    console.log('✅ Help response:', helpResponse.substring(0, 100) + '...');

    // Test 5: Arabic Conversation
    console.log('\n5️⃣ Testing Arabic conversation...');
    const arabicResponse = await processConversationGraph(
      testUserId,
      "مرحبا، أريد المساعدة في البرمجة",
      "ar"
    );
    console.log('✅ Arabic response:', arabicResponse.substring(0, 100) + '...');

    // Test 6: Summary Request
    console.log('\n6️⃣ Testing summary request...');
    const summaryResponse = await processConversationGraph(
      testUserId,
      "Can you give me a summary of our conversation?",
      "en"
    );
    console.log('✅ Summary response:', summaryResponse.substring(0, 100) + '...');

    console.log('\n🎉 All LangGraph agent tests completed successfully!');

  } catch (error) {
    console.error('❌ Agent test failed:', error.message);
    console.error('Full error:', error);
  }
};

// Run the tests
runAgentTests();