import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import moment from 'moment/moment';
import { useNavigate } from 'react-router-dom';

const ConversationList = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const isRTL = i18n.language === 'ar';
    
    const { chats, setSelectedChat, selectedChat } = useAppContext();
    const [search, setSearch] = useState('');

    const handleNewConversation = () => {
        // TODO: Implement new conversation creation
        console.log('Creating new conversation...');
    };

    const handleSelectConversation = (chat) => {
        setSelectedChat(chat);
        navigate('/chat');
    };

    const handleDeleteConversation = (chatId, e) => {
        e.stopPropagation();
        // TODO: Implement conversation deletion
        console.log('Deleting conversation:', chatId);
    };

    const filteredChats = chats.filter((chat) => 
        chat.messages[0] 
            ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) 
            : chat.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className={`flex flex-col h-full ${isRTL ? 'rtl' : 'ltr'}`}>
            {/* New Chat Button */}
            <button 
                onClick={handleNewConversation}
                className='flex justify-center items-center w-full py-2 mt-4 text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] text-sm rounded-md cursor-pointer hover:opacity-90 transition-opacity'
            >
                <span className={`${isRTL ? 'ml-2' : 'mr-2'} text-xl`}>💬</span>
                <span>{t('chat.newChat')}</span>
            </button>

            {/* Search Conversations */}
            <div className='flex items-center gap-2 p-3 mt-4 border border-gray-400 dark:border-white/20 rounded-md'>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                    onChange={(e) => setSearch(e.target.value)} 
                    value={search} 
                    type="text" 
                    placeholder={t('chat.searchConversations')} 
                    className={`text-xs placeholder:text-gray-400 outline-none bg-transparent flex-1 ${isRTL ? 'text-right' : 'text-left'}`}
                />
            </div>

            {/* Recent Chats Header */}
            {chats.length > 0 && (
                <p className={`mt-4 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('chat.recentChats')}
                </p>
            )}

            {/* Conversations List */}
            <div className='flex-1 overflow-y-scroll mt-3 text-sm space-y-2'>
                {filteredChats.length === 0 ? (
                    <div className={`text-center py-8 text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-xl">💬</span>
                        </div>
                        <p className="text-xs">{t('chat.noConversations')}</p>
                    </div>
                ) : (
                    filteredChats.map((chat) => (
                        <div 
                            onClick={() => handleSelectConversation(chat)}
                            key={chat._id} 
                            className={`p-3 px-4 rounded-md cursor-pointer flex justify-between group transition-colors hover:bg-gray-100 dark:hover:bg-[#57317C]/20 ${
                                selectedChat?._id === chat._id 
                                    ? 'bg-primary-50 dark:bg-[#57317C]/30 border border-primary-200 dark:border-[#80609F]/30' 
                                    : 'bg-gray-50 dark:bg-[#57317C]/10 border border-gray-200 dark:border-[#80609F]/15'
                            }`}
                        >
                            <div className="flex-1 min-w-0">
                                <p className={`truncate font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                                    {chat.messages.length > 0 
                                        ? chat.messages[0].content.slice(0, 32) 
                                        : chat.name
                                    }
                                    {chat.messages.length > 0 && chat.messages[0].content.length > 32 && '...'}
                                </p>
                                <div className={`flex items-center mt-1 text-xs text-gray-500 dark:text-[#B1A6C0] ${isRTL ? 'justify-end' : 'justify-start'}`}>
                                    <span>{moment(chat.updatedAt).fromNow()}</span>
                                    <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-gray-300 dark:text-gray-600`}>•</span>
                                    <span>{chat.messages.length} {t('chat.messages')}</span>
                                </div>
                            </div>
                            
                            {/* Delete Button */}
                            <button 
                                onClick={(e) => handleDeleteConversation(chat._id, e)}
                                className='hidden group-hover:block p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors'
                                title={t('chat.deleteConversation')}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ConversationList;