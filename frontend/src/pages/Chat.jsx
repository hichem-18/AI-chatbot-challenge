import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ConversationList from '../components/ConversationList';
import Message from '../components/Message';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useChatContext } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { detectLanguage } from '../utils/languageDetection';

const Chat = () => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useAppContext();
  const { user, logout } = useAuth();
  const {
    messages,
    conversations,
    currentConversationId,
    loading,
    sending,
    error,
    sendMessage,
    fetchConversations,
    createNewConversation,
    getCurrentConversation,
    clearError
  } = useChatContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('langgraph-agent');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isRTL = i18n.language === 'ar';

  // Initialize conversations on component mount - only run once when user changes
  useEffect(() => {
    const initializeChat = async () => {
      if (user?.id) {
        await fetchConversations();
      }
    };
    
    initializeChat();
  }, [user?.id, fetchConversations]);

  // Only create new conversation when explicitly needed (not on refresh)
  useEffect(() => {
    // Don't auto-create conversations on page load/refresh
    // Only create when user explicitly starts a new conversation
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const toggleDarkMode = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || sending) return;

    const messageText = prompt.trim();
    // Detect language automatically based on message content
    const detectedLanguage = detectLanguage(messageText);
    
    console.log(`🔍 Language detected: ${detectedLanguage} for message: "${messageText.substring(0, 50)}${messageText.length > 50 ? '...' : ''}"`);
    
    // Clear input immediately for better UX
    setPrompt('');
    
    try {
      await sendMessage(messageText, selectedModel, detectedLanguage);

    } catch (error) {
      console.error('❌ Failed to send message:', error);
      // Restore the prompt if sending failed
      setPrompt(messageText);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleNewChat = async () => {
    try {
      const userLanguage = user?.language_preference || i18n.language || 'en';
      await createNewConversation(userLanguage);
    } catch (error) {
      console.error('❌ Failed to create new conversation:', error);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 via-indigo-900 to-purple-900 relative overflow-hidden ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-1000"></div>
      </div>

      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Sidebar - ConversationList */}
        <div className={`${isRTL ? 'order-2' : 'order-1'} ${isMenuOpen ? 'fixed inset-y-0 left-0 z-[60] w-80 sm:w-96' : 'hidden'} md:block md:relative md:z-auto md:w-1/4 transition-all duration-300 transform ${isMenuOpen ? 'translate-x-0' : 'md:translate-x-0 -translate-x-full md:translate-x-0'}`}>
          <div className="relative h-full">
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/20 dark:from-gray-800/40 dark:to-gray-900/20 md:from-white/90 md:to-white/80 md:dark:from-gray-800/90 md:dark:to-gray-900/80 backdrop-blur-xl border-r border-white/30 dark:border-gray-700/30 md:shadow-2xl"></div>
            <div className="relative z-10 h-full p-4 flex flex-col">
              <ConversationList />
              
              {/* Mobile Controls - Only show on mobile when sidebar is open - Bottom of sidebar */}
              <div className="md:hidden mt-auto pt-6 space-y-4 border-t border-white/30 dark:border-gray-700/30">
                {/* Language Switcher */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('profile.language') || 'Language'}
                  </label>
                  <LanguageSwitcher />
                </div>
                
                {/* AI Model Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('chat.aiAgent') || 'AI Model'}
                  </label>
                  <select 
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full px-3 py-2 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border border-white/40 dark:border-gray-600/40 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="langgraph-agent">🤖 {t('chat.aiAgent') || 'LangGraph Agent'}</option>
                    <option value="llama-3.1-8b">🦙 Llama 3.1 8B</option>
                    <option value="llama-3.1-70b">🦙 Llama 3.1 70B</option>
                    <option value="gpt-3.5-turbo">⚡ GPT-3.5 Turbo</option>
                    <option value="gpt-4">🚀 GPT-4</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Chat Area */}
        <div className={`${isRTL ? 'order-1' : 'order-2'} flex-1 w-full md:w-3/4 flex flex-col relative`}>
          {/* Top Header Bar */}
          <div className="relative z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-white/30 dark:border-gray-700/30 shadow-lg">
            {/* Back to Home Button */}
            <Link 
              to="/" 
              className="absolute top-4 left-4 z-30 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/30 dark:border-gray-700/30 hover:border-indigo-300 dark:hover:border-indigo-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">{t('common.back') || 'Back'}</span>
            </Link>
            
            <div className="flex items-center justify-between p-2 sm:p-4 pt-12 sm:pt-16">
              {/* Left side - Menu button and title */}
              <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 sm:p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex-shrink-0"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                  </svg>
                </button>
                
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-lg sm:text-2xl">💬</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="text-sm sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent truncate">
                      {getCurrentConversation()?.title || t('chat.aiAssistant') || 'AI Assistant'}
                    </h1>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                        {selectedModel === 'langgraph-agent' ? '🤖 LangGraph' :
                         selectedModel === 'llama-3.1-8b' ? '🦙 Llama 8B' :
                         selectedModel === 'llama-3.1-70b' ? '🦙 Llama 70B' :
                         selectedModel === 'gpt-3.5-turbo' ? '⚡ GPT-3.5' :
                         selectedModel === 'gpt-4' ? '🚀 GPT-4' :
                         selectedModel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side controls */}
              <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
                {/* AI Agent Selector */}
                <select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="hidden sm:block px-2 sm:px-3 py-1 sm:py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-lg text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="langgraph-agent">🤖 {t('chat.aiAgent') || 'LangGraph Agent'}</option>
                  <option value="llama-3.1-8b">🦙 Llama 3.1 8B</option>
                  <option value="llama-3.1-70b">🦙 Llama 3.1 70B</option>
                  <option value="gpt-3.5-turbo">⚡ GPT-3.5 Turbo</option>
                  <option value="gpt-4">🚀 GPT-4</option>
                </select>

                {/* Language Switcher - Hidden on mobile */}
                <div className="hidden sm:block">
                  <LanguageSwitcher />
                </div>

                {/* Dark Mode Toggle */}
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <span className="hidden sm:inline text-sm font-medium text-gray-600 dark:text-gray-400">☀️</span>
                  <label className="relative inline-flex cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={theme === 'dark'}
                      onChange={toggleDarkMode}
                    />
                    <div className="w-10 h-5 sm:w-14 sm:h-7 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full peer-checked:from-indigo-500 peer-checked:to-purple-500 transition-all duration-300 shadow-inner">
                      <div className="w-4 h-4 sm:w-6 sm:h-6 bg-white rounded-full shadow-lg transform transition-transform duration-300 translate-x-0.5 translate-y-0.5 peer-checked:translate-x-5 sm:peer-checked:translate-x-7"></div>
                    </div>
                  </label>
                  <span className="hidden sm:inline text-sm font-medium text-gray-600 dark:text-gray-400">🌙</span>
                </div>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="p-1.5 sm:p-2 rounded-xl bg-red-500/10 dark:bg-red-500/20 hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-all duration-200 backdrop-blur-sm border border-red-500/30 dark:border-red-500/30 text-red-600 dark:text-red-400"
                  title={t('auth.logout') || 'Logout'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="mx-4 mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm"></div>
            <div 
              ref={messagesContainerRef}
              className="relative z-10 h-full overflow-y-auto px-2 sm:px-4 py-4 sm:py-6 pb-20 sm:pb-32"
            >
              {loading && messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">{t('chat.loading') || 'Loading messages...'}</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className='h-full flex flex-col items-center justify-center relative'>
                  {/* Empty State */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full blur-xl animate-pulse"></div>
                    <div className='relative w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl'>
                      <span className="text-6xl animate-bounce">🤖</span>
                    </div>
                  </div>
                  
                  <div className="text-center max-w-md mx-auto">
                    <h2 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4'>
                      {t('chat.askAnything') || 'Ask me anything'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                      {t('chat.assistantReady') || "I'm your AI assistant, ready to help with any questions or tasks you have in mind."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <Message 
                      key={message.id || `message-${index}`} 
                      message={{
                        ...message,
                        timestamp: message.timestamp || message.createdAt
                      }} 
                    />
                  ))}
                  {sending && (
                    <div className="flex justify-start">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 max-w-[70%]">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* Message Input Area - Responsive */}
          <div className="absolute bottom-2 sm:bottom-6 left-2 sm:left-6 right-2 sm:right-6 z-50">
            <form onSubmit={handleSendMessage} className='relative bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-lg'>
              <div className="flex items-end gap-2 sm:gap-3">
                <input 
                  type="text" 
                  value={prompt} 
                  onChange={(e) => {
                    setPrompt(e.target.value);
                  }} 
                  placeholder={t('chat.typeMessage') || 'Type your message here...'} 
                  className='flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                  disabled={sending}
                  required 
                  autoFocus
                />
                
                <button 
                  type="submit"
                  disabled={sending || !prompt.trim()}
                  className="group relative p-2 sm:p-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg sm:rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg sm:rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-200"></div>
                  {sending ? (
                    <div className="relative w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <svg className="relative w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Mobile Overlay with Blur - Only covers the main content area, not the sidebar */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed top-0 left-80 sm:left-96 right-0 bottom-0 bg-black/50 backdrop-blur-sm z-[45]" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Chat;