import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useState } from 'react';
import { useEffect } from 'react';
import { assets } from '../assets/assets';
import Message from './Message';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
const ChatBox = () => {
    const containerRef = useRef(null);

  const { selectedChat, theme } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [agent, setAgent] = useState('langgraph-agent');
  const onSubmit = async(e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    // Add user message
    const userMessage = {
      content: prompt,
      role: 'user',
      timestamp: new Date().toISOString()
    };
    
    // Add bot response (dummy)
    const botMessage = {
      content: `Thanks for your message: "${prompt}". This is a demo response from ${agent}.`,
      role: 'assistant',
      timestamp: new Date().toISOString(),
      model_name: agent
    };
    
    setMessages(prev => [...prev, userMessage, botMessage]);
    setPrompt('');
  }
    useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);
useEffect(() => {

}, [selectedChat]);
useEffect(() => {
    if (containerRef.current) {
        containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: 'smooth'
        })
    }
  }, [messages]);
  return (
    <div className='flex-1 flex flex-col h-full relative p-6 md:p-8'>
        {/* Chat Header */}
        <div className="mb-6 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-2xl">
          {selectedChat ? (
            <>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {selectedChat.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {selectedChat.messages?.length} messages
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                New Conversation
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                0 messages
              </p>
            </>
          )}
          {/* Current Agent Display */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Active Agent:</span>
            <span className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
              {agent === 'langgraph-agent' ? '🤖 LangGraph Agent' : 
               agent === 'llama-3.1-8b' ? '🦙 Llama 3.1 8B' : 
               agent === 'gpt-3.5-turbo' ? '⚡ GPT-3.5 Turbo' : agent}
            </span>
          </div>
        </div>
        
        {/* Messages Container */}
        <div ref={containerRef} className='flex-1 overflow-y-auto px-2 pb-32'>
            {messages.length === 0 ? (
                <div className='h-full flex flex-col items-center justify-center relative'>
                  {/* Empty State with Glass Effect */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full blur-xl animate-pulse"></div>
                    <div className='relative w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl'>
                      <span className="text-6xl animate-bounce">🤖</span>
                    </div>
                  </div>
                  
                  <div className="text-center max-w-md mx-auto">
                    <h2 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4'>
                      Ask me anything
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                      I'm your AI assistant, ready to help with any questions or tasks you have in mind.
                    </p>
                    
                    {/* Suggestion Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                      <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                        <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-xl border border-white/30 dark:border-gray-700/30 cursor-pointer hover:scale-105 transition-all duration-300">
                          <span className="text-2xl mb-2 block">💡</span>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Get creative ideas</p>
                        </div>
                      </div>
                      
                      <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                        <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-4 rounded-xl border border-white/30 dark:border-gray-700/30 cursor-pointer hover:scale-105 transition-all duration-300">
                          <span className="text-2xl mb-2 block">📝</span>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Write content</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            ) : (
                <div className="space-y-6">
                  {messages.map((message, index) => <Message key={index} message={message} />)}
                </div>
            )}
        </div>

        {/* Input Form */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
          <form onSubmit={onSubmit} className='relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-2xl p-4 shadow-2xl'>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              {/* AI Agent selector */}
              <div className="flex-shrink-0">
                <select 
                  onChange={(e) => setAgent(e.target.value)} 
                  value={agent} 
                  className="px-4 py-2 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="langgraph-agent">🤖 LangGraph Agent (Smart Routing)</option>
                  <option value="llama-3.1-8b">🦙 Llama 3.1 8B</option>
                  <option value="gpt-3.5-turbo">⚡ GPT-3.5 Turbo</option>
                </select>
              </div>
              
              {/* Message input */}
              <div className="flex-1 flex items-end gap-3">
                <input 
                  type="text" 
                  value={prompt} 
                  onChange={(e) => setPrompt(e.target.value)} 
                  placeholder='Type your message here...' 
                  className='flex-1 px-4 py-3 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200' 
                  required 
                />
                
                {/* Send button */}
                <button 
                  type="submit"
                  className="group relative p-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-200"></div>
                  <svg className="relative w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
    </div>
  )

}

export default ChatBox
