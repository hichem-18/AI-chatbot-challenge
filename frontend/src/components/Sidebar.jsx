import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useState } from 'react';
import { assets } from '../assets/assets';
import moment from 'moment/moment';
import { useNavigate } from 'react-router-dom';
const Sidebar = ({isMenuOpen, setIsMenuOpen}) => {
    const navigate = useNavigate();

    const {chats, selectedChat, setSelectedChat, theme, setTheme, user} = useAppContext();
    const [search, setSearch] = useState('');
return (
    <div className={`relative flex flex-col h-screen min-w-72 p-6 transition-all duration-500 max-md:absolute left-0 z-50 ${!isMenuOpen && 'max-md:-translate-x-full'}`}>
      {/* Background with glass effect */}
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-white/30 dark:border-gray-700/30"></div>
      
      {/* Content */}
      <div className="relative flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-2xl blur-lg"></div>
            <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-4 rounded-2xl border border-white/30 dark:border-gray-700/30">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Chat
              </div>
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="relative group mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
          <button className='relative w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'>
            <div className="flex items-center justify-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>New Chat</span>
            </div>
          </button>
        </div>

        {/* Search Box */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200/50 to-gray-300/50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl blur"></div>
          <div className='relative flex items-center gap-3 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-xl'>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              onChange={(e)=>setSearch(e.target.value)} 
              value={search} 
              type="text" 
              placeholder="Search conversations..." 
              className='flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-500 outline-none' 
            />
          </div>
        </div>

        {/* Recent Chats */}
        {chats.length > 0 && (
          <div className="mb-4">
            <h3 className='text-sm font-semibold text-gray-600 dark:text-gray-400 px-2'>Recent Chats</h3>
          </div>
        )}
        
        {/* Chat List */}
        <div className='flex-1 overflow-y-auto space-y-3 pr-2'>
          {chats.filter((chat) => chat.messages[0] ? chat.messages[0]?.content
            .toLowerCase().includes(search.toLowerCase()) : chat.name.toLowerCase()
            .includes(search.toLowerCase())).map((chat) => (
            <div 
              onClick={() => {navigate('/chat'); setSelectedChat(chat); setIsMenuOpen(false)}} 
              key={chat._id} 
              className={`group relative cursor-pointer ${selectedChat?._id === chat._id ? 'ring-2 ring-indigo-500' : ''}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur transition-opacity duration-300 ${selectedChat?._id === chat._id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
              <div className={`relative p-4 backdrop-blur-sm border rounded-xl transition-all duration-300 hover:scale-105 ${
                selectedChat?._id === chat._id 
                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-indigo-200 dark:border-indigo-700' 
                  : 'bg-white/50 dark:bg-gray-800/50 border-white/30 dark:border-gray-700/30 hover:bg-white/70 dark:hover:bg-gray-800/70'
              }`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className='font-medium text-gray-800 dark:text-gray-200 truncate mb-1'>
                      {chat.messages.length > 0 ? chat.messages[0].content.slice(0,35) : chat.name}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'> 
                      {moment(chat.updatedAt).fromNow()}
                    </p>
                  </div>
                  <button className='opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200'>
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="space-y-4 pt-4 border-t border-white/30 dark:border-gray-700/30">
          {/* Dark Mode Toggle */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200/50 to-gray-300/50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl blur"></div>
            <div className='relative flex items-center justify-between p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-xl'>
              <div className='flex items-center gap-3'>
                <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                  {theme === 'dark' ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21.64 13a1 1 0 00-1.05-.14 8.05 8.05 0 01-3.37.73A8.15 8.15 0 019.08 5.49a8.59 8.59 0 01.25-2A1 1 0 008 2.36a10.14 10.14 0 1014.21 11.7 1 1 0 00-.57-1.06z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06L5.106 17.834a.75.75 0 001.06 1.06l1.592-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.592a.75.75 0 00-1.061 1.061l1.59 1.59z" />
                    </svg>
                  )}
                </div>
                <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </p>
              </div>
              <label className='relative inline-flex cursor-pointer'>
                <input 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={theme === 'dark'}
                />
                <div className='w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-indigo-500 peer-checked:to-purple-500 transition-all duration-300 shadow-inner'>
                </div>
                <span className='absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-5 peer-checked:shadow-lg'></span>
              </label>
            </div>
          </div>

          {/* User Account */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className='relative flex items-center gap-3 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-xl cursor-pointer hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300'>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className='text-sm font-medium text-gray-800 dark:text-gray-200 truncate'>
                  {user ? user.name : 'Login your account'}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>Online</p>
              </div>
              {user && (
                <button className='opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200'>
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Close button for mobile */}
        <button 
          onClick={() => setIsMenuOpen(false)}
          className='absolute top-4 right-4 p-2 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 md:hidden hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200'
        >
          <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>


)
}

export default Sidebar
