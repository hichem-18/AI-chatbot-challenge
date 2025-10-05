import { useState } from "react";
import { useEffect } from "react";
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUsers } from "../assets/assets";


const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || 'light'); // 'light' or 'dark'
    const fetchUser = async () => {
        setUser()
    } 
    //make dummy data
    const fetchUsersChats = async () => {
        setChats(dummyChats)
        setSelectedChat(dummyChats[0])
    }
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);
    useEffect(() => {
        if (user) {
            fetchUsersChats();
        } else {
            setChats([]);
            setSelectedChat(null);
        }
    }, [user]);
    useEffect(() => {
        fetchUser();
    },[]);
    const value = {
        user,
        chats,
        selectedChat,
        theme,
        setUser,
        setChats,
        setSelectedChat,
        setTheme,
        navigate
    }

    return (

        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext);