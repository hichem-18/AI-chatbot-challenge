import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import { useAppContext } from '../context/AppContext';

const Chat = () => {
  const { i18n } = useTranslation();
  const { theme, setTheme } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isRTL = i18n.language === 'ar';

  const toggleDarkMode = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
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
        {/* Sidebar - Adapts position based on RTL */}
        <div className={`${isRTL ? 'order-2' : 'order-1'} ${isMenuOpen ? 'block' : 'max-md:hidden'} transition-all duration-300`}>
          <div className="relative h-full">
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/20 dark:from-gray-800/40 dark:to-gray-900/20 backdrop-blur-xl border-r border-white/30 dark:border-gray-700/30"></div>
            <div className="relative z-10 h-full">
              <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            </div>
          </div>
        </div>
        
        {/* Main Chat Area */}
        <div className={`${isRTL ? 'order-1' : 'order-2'} flex-1 flex flex-col relative`}>
          {/* Top Header Bar */}
          <div className="relative z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-white/30 dark:border-gray-700/30 shadow-lg">
            <div className="flex items-center justify-between p-4">
              {/* Left side - Menu button and title */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      AI Assistant
                    </h1>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Online</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Dark mode toggle and settings */}
              <div className="flex items-center space-x-3">
                {/* Dark Mode Toggle */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">☀️</span>
                  <label className="relative inline-flex cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={theme === 'dark'}
                      onChange={toggleDarkMode}
                    />
                    <div className="w-14 h-7 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full peer-checked:from-indigo-500 peer-checked:to-purple-500 transition-all duration-300 shadow-inner">
                      <div className="w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-300 translate-x-0.5 translate-y-0.5 peer-checked:translate-x-7"></div>
                    </div>
                  </label>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">🌙</span>
                </div>

                {/* Settings Button */}
                <button className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-200 backdrop-blur-sm border border-white/30 dark:border-gray-600/30">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* ChatBox Component with Glass Effect Container */}
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm"></div>
            <div className="relative z-10 h-full">
              <ChatBox />
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Overlay with Blur */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Chat;