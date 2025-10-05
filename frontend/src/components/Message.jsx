import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment/moment';
import Prism from 'prismjs';

const Message = ({ message }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        Prism.highlightAll();
    }, [message.content]);

    // Function to detect Arabic characters
    const containsArabic = (text) => {
        const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
        return arabicRegex.test(text);
    };

    // Determine if content should be RTL
    const isRTL = containsArabic(message.content) || i18n.language === 'ar';

    // Format timestamp
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return '';
        return moment(timestamp).format('HH:mm');
    };

    // Get relative time for tooltip
    const getRelativeTime = (timestamp) => {
        if (!timestamp) return '';
        return moment(timestamp).fromNow();
    };

    return (
        <div className={`flex w-full my-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.role === 'user' ? (
                // User Message - Right aligned, blue background
                <div className="flex items-end gap-2 max-w-[70%] ml-auto">
                    <div className="flex flex-col">
                        <div 
                            className={`p-3 bg-blue-500 text-white rounded-lg ${
                                isRTL ? 'rounded-br-sm' : 'rounded-br-sm'
                            }`}
                            dir={isRTL ? 'rtl' : 'ltr'}
                        >
                            <div className={`text-sm break-words ${isRTL ? 'text-right' : 'text-left'}`}>
                                {message.content}
                            </div>
                        </div>
                        
                        {/* Timestamp */}
                        {message.timestamp && (
                            <div 
                                className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
                                    isRTL ? 'text-right' : 'text-right'
                                }`}
                                title={getRelativeTime(message.timestamp)}
                            >
                                {formatTimestamp(message.timestamp)}
                            </div>
                        )}
                    </div>
                    
                    {/* User Avatar (Optional) */}
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            ) : (
                // Assistant Message - Left aligned, gray background
                <div className="flex items-end gap-2 max-w-[70%] mr-auto">
                    {/* AI Avatar */}
                    <div className="w-8 h-8 bg-purple-500 dark:bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    
                    <div className="flex flex-col">
                        <div 
                            className={`p-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg ${
                                isRTL ? 'rounded-bl-sm' : 'rounded-bl-sm'
                            }`}
                            dir={isRTL ? 'rtl' : 'ltr'}
                        >
                            {message.isImage ? (
                                <img 
                                    src={message.content} 
                                    alt="AI generated image" 
                                    className="w-full max-w-md rounded-lg" 
                                />
                            ) : (
                                <div className={`text-sm break-words reset-tw ${isRTL ? 'text-right' : 'text-left'}`}>
                                    {message.content}
                                </div>
                            )}
                        </div>
                        
                        {/* Assistant message footer */}
                        <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400 ${
                            isRTL ? 'flex-row-reverse text-right' : 'text-left'
                        }`}>
                            {/* Model name */}
                            {message.model_name && (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded-full text-xs">
                                    {message.model_name === 'langgraph-agent' ? (t('chat.ai') || 'AI') : message.model_name}
                                </span>
                            )}
                            
                            {/* Timestamp */}
                            {message.timestamp && (
                                <>
                                    <span className="text-gray-300 dark:text-gray-600">•</span>
                                    <span title={getRelativeTime(message.timestamp)}>
                                        {formatTimestamp(message.timestamp)}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Message
