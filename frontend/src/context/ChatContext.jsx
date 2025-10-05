import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { chatAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // Authentication context to check if user is logged in
  const { user, isAuthenticated } = useAuth();
  
  // Core state management
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);


  // Initialize chat data when user is authenticated
  useEffect(() => {
    const initializeConversations = async () => {
      if (isAuthenticated && user) {
        await fetchConversations();
      } else {
        // Clear chat data when user logs out
        setConversations([]);
        setCurrentConversationId(null);
        setMessages([]);
        setError(null);
      }
    };

    initializeConversations();
  }, [isAuthenticated, user?.id]); // Only depend on user ID, not the whole user object

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (currentConversationId && isAuthenticated) {
      // Create a local async function to avoid dependency issues
      const loadMessages = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await chatAPI.getConversationHistory(currentConversationId);
          
          if (response.data.success) {
            const chatHistory = response.data.data?.messages || [];
            
            // Transform ChatHistory records into individual messages
            const transformedMessages = [];
            chatHistory.forEach(chat => {
              // Add user message
              transformedMessages.push({
                id: `${chat.id}-user`,
                role: 'user',
                content: chat.message,
                timestamp: chat.createdAt,
                conversationId: chat.conversationId
              });
              
              // Add assistant message
              transformedMessages.push({
                id: `${chat.id}-assistant`,
                role: 'assistant',
                content: chat.response,
                model_name: chat.model_name,
                timestamp: chat.createdAt,
                conversationId: chat.conversationId
              });
            });
            
            setMessages(transformedMessages);
          } else {
            throw new Error(response.data.message || 'Failed to fetch messages');
          }
        } catch (error) {
          console.error('❌ Error fetching messages:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Failed to load messages';
          setError(errorMessage);
          setMessages([]);
        } finally {
          setLoading(false);
        }
      };

      loadMessages();
    }
  }, [currentConversationId, isAuthenticated]);

  /**
   * Fetch all conversations for the current user
   */
  const fetchConversations = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await chatAPI.getConversations();
      
      if (response.data.success) {
        const fetchedConversations = response.data.data || [];
        setConversations(fetchedConversations);
        
        // Auto-select first conversation if none selected
        if (fetchedConversations.length > 0 && !currentConversationId) {
          const firstConversation = fetchedConversations[0];
          const conversationId = firstConversation.conversationId || firstConversation.id;
          setCurrentConversationId(conversationId);
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch conversations');
      }
    } catch (error) {
      console.error('❌ Error fetching conversations:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load conversations';
      setError(errorMessage);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Create a new conversation
   */
  const createNewConversation = useCallback(async (language = 'en') => {
    if (!isAuthenticated) {
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await chatAPI.createConversation({ language });
      
      if (response.data.success) {
        const newConversation = response.data.data;
        
        // Add to conversations list
        setConversations(prev => [newConversation, ...prev]);
        
        // Select the new conversation
        setCurrentConversationId(newConversation.conversationId);
        setMessages([]); // Start with empty messages
        
        return newConversation;
      } else {
        throw new Error(response.data.message || 'Failed to create conversation');
      }
    } catch (error) {
      console.error('❌ Error creating conversation:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create conversation';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Select a conversation and load its messages
   */
  const selectConversation = useCallback(async (conversationId) => {
    if (!conversationId) {
      return;
    }

    setCurrentConversationId(conversationId);
    setError(null);
    
    // We'll fetch messages in a separate useEffect when currentConversationId changes
  }, []);

  /**
   * Fetch messages for a specific conversation
   */
  const fetchMessages = useCallback(async (conversationId) => {
    if (!conversationId || !isAuthenticated) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await chatAPI.getConversationHistory(conversationId);
      
      if (response.data.success) {
        const chatHistory = response.data.data?.messages || [];
        
        // Transform ChatHistory records into individual messages
        const transformedMessages = [];
        chatHistory.forEach(chat => {
          // Add user message
          transformedMessages.push({
            id: `${chat.id}-user`,
            role: 'user',
            content: chat.message,
            timestamp: chat.createdAt,
            conversationId: chat.conversationId
          });
          
          // Add assistant message
          transformedMessages.push({
            id: `${chat.id}-assistant`,
            role: 'assistant',
            content: chat.response,
            model_name: chat.model_name,
            timestamp: chat.createdAt,
            conversationId: chat.conversationId
          });
        });
        
        setMessages(transformedMessages);
      } else {
        throw new Error(response.data.message || 'Failed to fetch messages');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load messages';
      setError(errorMessage);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Send a message in the current conversation
   */
  const sendMessage = useCallback(async (messageText, modelName = 'langgraph-agent', language = 'en') => {
    if (!messageText?.trim() || !isAuthenticated) {
      return null;
    }

    setSending(true);
    setError(null);

    try {
      if (!currentConversationId || currentConversationId === 'default') {
        const newConversation = await createNewConversation(language);
        if (!newConversation) {
          return null;
        }
      }

      
      const messageData = {
        message: messageText.trim(),
        conversationId: currentConversationId,
        language,
        model_name: modelName
      };

      const response = await chatAPI.sendMessage(messageData);
      
      if (response.data.success) {
        const chatHistoryRecord = response.data.data;
        
        // Transform the ChatHistory record into individual user and assistant messages
        const userMessage = {
          id: `${chatHistoryRecord.id}-user`,
          role: 'user',
          content: chatHistoryRecord.message,
          timestamp: chatHistoryRecord.createdAt,
          conversationId: chatHistoryRecord.conversationId
        };
        
        const assistantMessage = {
          id: `${chatHistoryRecord.id}-assistant`,
          role: 'assistant',
          content: chatHistoryRecord.response,
          model_name: chatHistoryRecord.model_name,
          timestamp: chatHistoryRecord.createdAt,
          conversationId: chatHistoryRecord.conversationId
        };
        
        // Add both messages to current messages
        setMessages(prev => [...prev, userMessage, assistantMessage]);
        
        // Update the conversation's last message time in the conversations list
        setConversations(prev => 
          prev.map(conv => 
            conv.id === currentConversationId 
              ? { ...conv, updatedAt: new Date().toISOString() }
              : conv
          )
        );
        
        return { userMessage, assistantMessage };
      } else {
        throw new Error(response.data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send message';
      setError(errorMessage);
      return null;
    } finally {
      setSending(false);
    }
  }, [isAuthenticated, currentConversationId, createNewConversation]);

  /**
   * Delete a conversation
   */
  const deleteConversation = useCallback(async (conversationId) => {
    if (!conversationId || !isAuthenticated) {
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await chatAPI.deleteConversation(conversationId);
      
      if (response.data.success) {
        
        // Remove from conversations list
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        
        // If this was the current conversation, clear it
        if (currentConversationId === conversationId) {
          setCurrentConversationId(null);
          setMessages([]);
          
          // Auto-select another conversation if available
          const remainingConversations = conversations.filter(conv => (conv.conversationId || conv.id) !== conversationId);
          if (remainingConversations.length > 0) {
            const nextConversation = remainingConversations[0];
            const nextConversationId = nextConversation.conversationId || nextConversation.id;
            setCurrentConversationId(nextConversationId);
            // Messages will be loaded automatically by the useEffect when currentConversationId changes
          }
        }
        
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to delete conversation');
      }
    } catch (error) {
      console.error('❌ Error deleting conversation:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete conversation';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentConversationId, conversations]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Debug function to reset sending state (emergency use)
   */
  const resetSendingState = useCallback(() => {
    setSending(false);
  }, []);

  /**
   * Get current conversation object
   */
  const getCurrentConversation = useCallback(() => {
    return conversations.find(conv => (conv.conversationId || conv.id) === currentConversationId) || null;
  }, [conversations, currentConversationId]);

  // Context value to provide to components
  const value = {
    // State
    conversations,
    currentConversationId,
    messages,
    loading,
    sending,
    error,
    
    // Functions
    fetchConversations,
    createNewConversation,
    selectConversation,
    sendMessage,
    deleteConversation,
    clearError,
    getCurrentConversation,
    resetSendingState,
    
    // Computed values
    hasConversations: conversations.length > 0,
    hasCurrentConversation: !!currentConversationId,
    hasMessages: messages.length > 0
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

/**
 * Custom hook to use chat context
 */
export const useChatContext = () => {
  const context = useContext(ChatContext);
  
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  
  return context;
};

export default ChatContext;
