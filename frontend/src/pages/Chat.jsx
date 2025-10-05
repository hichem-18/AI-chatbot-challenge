import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { chatAPI } from '../utils/api';

const Chat = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('langgraph-agent');

  const models = [
    { value: 'langgraph-agent', label: t('chat.models.langgraph') },
    { value: 'llama-3.1-8b', label: t('chat.models.llama-8b') },
    { value: 'llama-3.1-70b', label: t('chat.models.llama-70b') }
  ];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setLoading(true);

    // Add user message to chat
    const newMessage = {
      id: Date.now(),
      message: userMessage,
      response: '',
      isUser: true,
      model_name: selectedModel
    };
    
    setMessages(prev => [...prev, newMessage]);

    try {
      const response = selectedModel === 'langgraph-agent'
        ? await chatAPI.sendMessage({
            message: userMessage,
            language: 'en',
            model_name: selectedModel
          })
        : await chatAPI.sendSimpleMessage({
            message: userMessage,
            language: 'en',
            model_name: selectedModel
          });

      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        message: userMessage,
        response: response.data.data.response,
        isUser: false,
        model_name: selectedModel
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        message: userMessage,
        response: t('chat.error'),
        isUser: false,
        isError: true,
        model_name: selectedModel
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <button className="w-full btn-primary mb-4">
            {t('chat.newChat')}
          </button>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('chat.selectModel')}
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="input-primary"
            >
              {models.map(model => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('chat.conversations')}
            </h3>
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 cursor-pointer">
                Current Chat
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <p>{t('chat.loading')}</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={msg.id || index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                  msg.isUser 
                    ? 'bg-primary-600 text-white' 
                    : msg.isError 
                    ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}>
                  <p className="text-sm">
                    {msg.isUser ? msg.message : msg.response}
                  </p>
                  {!msg.isUser && (
                    <p className="text-xs opacity-70 mt-1">
                      {models.find(m => m.value === msg.model_name)?.label}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 flex items-center space-x-2">
                <div className="spinner" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('chat.loading')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t('chat.typePlaceholder')}
              className="flex-1 input-primary"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="btn-primary px-6"
            >
              {loading ? (
                <div className="spinner" />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;