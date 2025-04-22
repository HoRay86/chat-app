// client/src/App.js
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://chat-app-server-rbkm.onrender.com');

function App() {
  const [username, setUsername] = useState('');
  const [tempName, setTempName] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Connected to server');
    });

    socket.on('chat message', (msg) => {
      console.log('📩 Received:', msg);
      setChat((prev) => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat message', { user: username, text: message });
      setMessage('');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      setUsername(tempName);
    }
  };

  // 還沒登入的畫面
  if (!username) {
    return (
      <div style={{ padding: 20 }}>
        <h2>👋 Welcome to Chat</h2>
        <form onSubmit={handleLogin}>
          <input
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="Enter your name"
          />
          <button type="submit">Join Chat</button>
        </form>
      </div>
    );
  }

  // 聊天畫面
  return (
    <div style={{ padding: 20 }}>
      <h2>💬 Chat Room - Hello, {username}!</h2>
      <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '1em' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {chat.map((msg, idx) => (
            <li key={idx} style={{ marginBottom: '8px' }}>
              <strong>👤 [{msg.user}]</strong>: {msg.text}
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleSend}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ width: '70%', marginRight: '8px' }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
