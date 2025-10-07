import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useChatContext } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import moment from 'moment/moment';
import { useNavigate } from 'react-router-dom';

const ConversationList = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isRTL = i18n.language === 'ar';
    
    const { 
        conversations,
        currentConversationId,
        loading,
        error,
        fetchConversations,
        createNewConversation,
        selectConversation,
        deleteConversation,
        clearError,
        hasConversations
    } = useChatContext();
    

    
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    // Fetch conversations when component mounts
    useEffect(() => {
        if (user) {
            fetchConversations();
        }
    }, [user, fetchConversations]);

    // Clear error when component unmounts or when search changes
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                clearError();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    const handleNewConversation = async () => {
        const userLanguage = user?.language_preference || i18n.language || 'en';
        
        try {
            // Clear any existing conversation selection first
            selectConversation(null);
            
            const newConversation = await createNewConversation(userLanguage);
            if (newConversation) {
                navigate('/chat');
            }
        } catch (error) {
            console.error('❌ Failed to create conversation:', error);
        }
    };

    const handleSelectConversation = async (conversation) => {
        const conversationId = conversation.conversationId || conversation.id;
        await selectConversation(conversationId);
        navigate('/chat');
    };

    const handleDeleteConversation = (conversation, e) => {
        e.stopPropagation();
        const conversationId = conversation.conversationId || conversation.id;
        setShowDeleteConfirm(conversationId);
    };

    const confirmDelete = async (conversationId) => {
        setDeletingId(conversationId);
        setShowDeleteConfirm(null);
        
        try {
            const success = await deleteConversation(conversationId);
            if (success) {
                // No need to call fetchConversations() - ChatContext already updates the state
                // The component will re-render automatically when conversations state changes
            }
        } catch (error) {
            console.error('❌ Failed to delete conversation:', error);
        } finally {
            setDeletingId(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(null);
    };

    // Get conversation preview text
    const getConversationPreview = (conversation) => {
        if (conversation.title) return conversation.title;
        if (conversation.lastMessage) return conversation.lastMessage;
        return conversation.summary || t('chat.newConversation') || 'New Conversation';
    };

    // Filter conversations based on search
    const filteredConversations = conversations.filter((conversation) => {
        const preview = getConversationPreview(conversation).toLowerCase();
        return preview.includes(search.toLowerCase());
    });

    return (
        <div className={`flex flex-col h-full ${isRTL ? 'rtl' : 'ltr'}`}>
            {/* New Chat Button */}
            <button 
                onClick={handleNewConversation}
                disabled={loading}
                className='flex justify-center items-center w-full py-2 mt-4 text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] text-sm rounded-md cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'
            >
                {loading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        <span>{t('chat.creating') || 'Creating...'}</span>
                    </>
                ) : (
                    <>
                        {/* Plus Icon */}
                        <svg className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>{t('chat.newChat') || 'New Chat'}</span>
                    </>
                )}
            </button>

            {/* Error Display */}
            {error && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

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
            {hasConversations && (
                <p className={`mt-4 text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('chat.recentChats') || 'Recent Chats'}
                </p>
            )}

            {/* Conversations List */}
            <div className='flex-1 overflow-y-scroll mt-3 text-sm space-y-2'>
                {loading && conversations.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('chat.loadingConversations') || 'Loading conversations...'}</p>
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <div className={`text-center py-8 text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                            {/* Message Square Icon */}
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="text-xs">
                            {search ? (t('chat.noSearchResults') || 'No conversations found') : (t('chat.noConversations') || 'No conversations yet')}
                        </p>
                        {!search && (
                            <p className="text-xs mt-1 text-gray-400">
                                {t('chat.createFirstConversation') || 'Click "New Chat" to start your first conversation'}
                            </p>
                        )}
                    </div>
                ) : (
                    filteredConversations.map((conversation, index) => {
                        const conversationId = conversation.conversationId || conversation.id;
                        const uniqueKey = `conv-${conversationId}`;
                        return (
                        <div 
                            onClick={() => handleSelectConversation(conversation)}
                            key={uniqueKey} 
                            className={`p-3 px-4 rounded-md cursor-pointer flex justify-between group transition-colors hover:bg-gray-100 dark:hover:bg-[#57317C]/20 ${
                                currentConversationId === conversationId 
                                    ? 'bg-primary-50 dark:bg-[#57317C]/30 border border-primary-200 dark:border-[#80609F]/30' 
                                    : 'bg-gray-50 dark:bg-[#57317C]/10 border border-gray-200 dark:border-[#80609F]/15'
                            } ${deletingId === conversationId ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            <div className="flex-1 min-w-0">
                                <p className={`truncate font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                                    {getConversationPreview(conversation).slice(0, 50)}
                                    {getConversationPreview(conversation).length > 50 && '...'}
                                </p>
                                <div className={`flex items-center mt-1 text-xs text-gray-500 dark:text-[#B1A6C0] ${isRTL ? 'justify-end' : 'justify-start'}`}>
                                    <span>{moment(conversation.updatedAt || conversation.createdAt).fromNow()}</span>
                                    {conversation.messageCount > 0 && (
                                        <>
                                            <span className={`${isRTL ? 'mr-2' : 'ml-2'} text-gray-300 dark:text-gray-600`}>•</span>
                                            <span>{conversation.messageCount} {t('chat.messages') || 'messages'}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            {/* Delete Button */}
                            <button 
                                onClick={(e) => handleDeleteConversation(conversation, e)}
                                disabled={deletingId === (conversation.conversationId || conversation.id)}
                                className='hidden group-hover:block p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors disabled:opacity-50'
                                title={t('chat.deleteConversation') || 'Delete conversation'}
                            >
                                {deletingId === (conversation.conversationId || conversation.id) ? (
                                    <div className="w-4 h-4 border border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                                ) : (
                                    /* Trash2 Icon */
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        );
                    })
                )}
            </div>

            {/* Delete Confirmation Dialog - Using Portal */}
            {showDeleteConfirm && createPortal(
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[99999]" 
                    style={{ zIndex: 99999 }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            cancelDelete();
                        }
                    }}
                >
                    <div 
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-700 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mr-3">
                                {/* Warning Icon */}
                                <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {t('chat.confirmDelete') || 'Confirm Delete'}
                            </h3>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            {t('chat.deleteConversationMessage') || 'Are you sure you want to delete this conversation? This action cannot be undone.'}
                        </p>
                        
                        <div className="flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => cancelDelete()}
                                className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 focus:ring-2 focus:ring-gray-300 focus:outline-none cursor-pointer"
                                style={{ pointerEvents: 'auto' }}
                            >
                                {t('chat.cancel') || 'Cancel'}
                            </button>
                            <button
                                type="button"
                                onClick={() => confirmDelete(showDeleteConfirm)}
                                className="px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:bg-red-700 transition-all duration-200 focus:ring-2 focus:ring-red-300 active:scale-95 focus:outline-none cursor-pointer"
                                disabled={deletingId === showDeleteConfirm}
                                style={{ pointerEvents: 'auto' }}
                            >
                                {deletingId === showDeleteConfirm ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Deleting...
                                    </div>
                                ) : (
                                    t('chat.delete') || 'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default ConversationList;