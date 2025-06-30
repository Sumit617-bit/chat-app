import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';

// ✅ Connect to backend
const socket = io(' https://chat-app-atvs.onrender.com'); // Replace with actual URL

function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  // ✅ Handle user login
  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoggedIn(true);
    }
  };

  // ✅ Handle message sending
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const fullMessage = `${username}: ${message}`;
      socket.emit('chat_message', fullMessage);
      setMessage('');
    }
  };

  // ✅ Listen for incoming messages
  useEffect(() => {
    socket.on('chat_message', (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('chat_message');
    };
  }, []);

  // ✅ Login form UI
  if (!isLoggedIn) {
    return (
      <div className="App">
        <h2>Welcome to the Chat App</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit">Join Chat</button>
        </form>
      </div>
    );
  }

  // ✅ Chat UI after login
  return (
    <div className="App">
      <h2>Hello, {username}! 👋</h2>
      <div className="chat-box">
        {chat.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
