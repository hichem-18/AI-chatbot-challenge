import React from 'react'
import { useEffect } from 'react'
import Prism from 'prismjs';
const Message = ({message}) => {
    useEffect(() => {
        Prism.highlightAll();
    }, [message.content]);

  return (
    <div>
      {message.role === 'user' ? (
        <div className='flex items-start justify-end my-4 gap-2'>
            <div className='flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609f]/30 rounded-md max-w-2xl'>
                <p className='text-sm dark:text-primary'>{message.content}</p>
            </div>
            <img src={message.user} alt="" className='w-8 rounded-full' />

        </div>)
        :
        (
            <div className='inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-primary/20 dark:bg-[#57317C]/30 border border-[#80609f]/30 rounded-md my-4'>
                {message.isImage ? (
                    <img src={message.content} alt="" className='w-full max-w-md mt-2' />
                ):
                (
                    <div className='text-sm dark:text-primary reset-tw'>{message.content}</div>
                )}

            </div>
        )
    }
    </div>
  )
}

export default Message
