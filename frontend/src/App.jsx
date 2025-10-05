import React from 'react'
import Sidebar from './components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import ChatBox from './components/ChatBox'
import { useState } from 'react'
import { assets } from './assets/assets'
import './assets/prism.css'
import { useAppContext } from './context/AppContext'
import Login from './pages/Login'
const App = () => {
  const {user} = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);



  return (
    <>
    {!isMenuOpen && <img src={assets.menu_icon} className='absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden dark:invert not-dark:invert-0' alt="menu" onClick={() => setIsMenuOpen(true)}/> }
    {user ? (
      <div className="dark:bg-gradient-to-b from-[#242124] to-[#000000]">
      <div className="flex h-screen w-screen">

        <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <Routes>
          <Route path="/" element={<ChatBox />} />
        </Routes>
      </div>
      </div>
    ) : (
      <div className='bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen'>
        <Login />
      </div>
    )}
    
    </>
  )
}

export default App
