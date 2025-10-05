import darkMode from './darkMode.svg';
import lightMode from './react.svg';
import logo from './chatbot.png';
import loop from './loop.png';
import logout from './logout.svg';
import user from './user.png';
import close_icon from './close_icon.png';
import send_icon from './send_icon.svg';

export const assets = {
    darkMode,
    lightMode,
    logo,
    loop,
    logout,
    user,
    close_icon,
    send_icon
}



export const dummyUsers = {
    "_id":"689c6deed410acddc0d95a0e",
"name": "GreatStack",
"email": "admin@example.com",
"password": "$2b$10$VESVDPDjL5LF.KCU6jKyqeXNSLASAAFPR2KKIJEXTMO.PJvZJAudy",
"credits": 200,
}


export const dummyChats = [
    {
        _id: "689c6deed410acddc0d95a0e",
        userId: "user123",
        userName: "GreatStack",
        name: "General Discussion",
        "messages": [
            { "content": "Hello there!", timestamp: "2024-01-15T10:30:00Z", "role": "user" },
            { "content": "Hi! How can I help you today?", timestamp: "2024-01-15T10:31:00Z", "role": "bot" }
        ]
    },
    {
        _id: "chat002",
        userId: "user456",
        userName: "Jane Smith",
        name: "Technical Support",
        messages: [
            { "content": "I'm having trouble with my account", timestamp: "2024-01-15T14:20:00Z", "role": "user" },
            { "content": "I'd be happy to help you with that. What specific issue are you experiencing?", timestamp: "2024-01-15T14:21:00Z", "role": "bot" }
        ]
    },
    {
        _id: "chat003",
        userId: "user789",
        userName: "Bob Johnson",
        name: "Project Planning",
        messages: [
            { "content": "Can you help me organize my tasks?", timestamp: "2024-01-15T16:45:00Z", "role": "user" },
            { "content": "Of course! Let's start by listing your current priorities.", timestamp: "2024-01-15T16:46:00Z", "role": "bot" }
        ]
    }
];