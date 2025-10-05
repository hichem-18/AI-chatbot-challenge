import React from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Prism from 'prismjs';

const CMessage = ({ message }) => {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    
    useEffect(() => {
        Prism.highlightAll();
    }, [message.content]);

    return (
        <div className={`${isRTL ? 'rtl' : 'ltr'}`}>
            {message.role === 'user' ? (
                /* User Message - Right side (left for RTL) */
                <div className={`flex items-start ${isRTL ? 'justify-start' : 'justify-end'} my-4 gap-2`}>
                    {/* Avatar for RTL */}
                    {isRTL && (
                        <img src={message.user || '/default-user.png'} alt="" className='w-8 rounded-full' />
                    )}
                    
                    <div className='flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609f]/30 rounded-md max-w-2xl'>
                        <p className='text-sm dark:text-primary text-right rtl:text-left'>{message.content}</p>
                    </div>
                    
                    {/* Avatar for LTR */}
                    {!isRTL && (
                        <img src={message.user || '/default-user.png'} alt="" className='w-8 rounded-full' />
                    )}
                </div>
            ) : (
                /* AI Message - Left side (right for RTL) */
                <div className={`flex ${isRTL ? 'justify-end' : 'justify-start'} my-4`}>
                    <div className='inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609f]/30 rounded-md'>
                        {message.isImage ? (
                            <img src={message.content} alt="" className='w-full max-w-md mt-2' />
                        ) : (
                            <div className={`text-sm dark:text-primary reset-tw ${isRTL ? 'text-right' : 'text-left'}`}>
                                {message.content}
                            </div>
                        )}
                        
                        {/* Model name indicator */}
                        {message.model && (
                            <div className={`text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                                {message.model}
                            </div>
                        )}
                        
                        {/* Timestamp */}
                        {message.timestamp && (
                            <div className={`text-xs text-gray-400 dark:text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CMessage;