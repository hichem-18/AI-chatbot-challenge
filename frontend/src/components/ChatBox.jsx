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
  const [model, setModel] = useState('gpt-3.5-turbo');
  const onSubmit = async(e) => {
    e.preventDefault();
  }
    useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);
useEffect(() => {
  console.log("selectedChat changed:", selectedChat?.name);
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
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40'>
        <div ref={containerRef} className='flex-1 mb-5 overflow-y-scroll'>
            {messages.length === 0 && (
                <div className='h-full flex flex-col items-center justify-center gap-2 text-primary'>
                    <img src={theme === "dark" ? assets.logo : assets.logo} alt="" className='w-full max-w-56 sm:max-w-68' />
                    <p className='mt-5 text-4xl sm:text-6xl text-center text-gray-500'>Ask me anything</p>
                </div>
            )}

            {messages.map((message, index) => <Message key={index} message={message} />
            )}

        </div>
        <form onSubmit={onSubmit} className='bg-primary/20 dark:bg-[#583C79]/30 border border-primary border-[#80609f]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center' action="">
            <select onChange={(e) => setModel(e.target.value)} value={model} name="model" id="">
                <option className='text-sm pl03 pr-2 outline-none' value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option className='text-sm pl03 pr-2 outline-none' value="gpt-4">GPT-4</option>
                <option className='text-sm pl03 pr-2 outline-none' value="gpt-4-turbo">GPT-4 Turbo</option>
                <option className='text-sm pl03 pr-2 outline-none' value="gpt-4-vision-preview">GPT-4 Vision</option>
            </select>
            <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder='Type your prompt here...' className='flex-1 w-full text-sm outline-none ' required />
            <button>
                <img src={assets.send_icon} alt="" className='w-8 cursor-pointer' />
            </button>

        </form>
    </div>
  )

}

export default ChatBox
