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

    // 聊天訊息
    socket.on('chat message', (msg) => {
      setChat((prev) => [...prev, { type: 'chat', ...msg }]);
    });

    // 系統訊息（加入/離開）
    socket.on('system message', (text) => {
      setChat((prev) => [...prev, { type: 'system', text }]);
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
      socket.emit('join', tempName); // let backend know user join
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
          {chat.map((msg, idx) => {
            if (msg.type === 'system') {
              return (
                <li key={idx} style={{ textAlign: 'center', color: 'gray', margin: '8px 0' }}>
                  {msg.text}
                </li>
              );
            }

            const isSelf = msg.user === username;
            return (
              <li
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: isSelf ? 'flex-end' : 'flex-start',
                  marginBottom: '8px',
                }}
              >
                <div
                  style={{
                    background: isSelf ? '#d1e7dd' : '#f1f1f1',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    maxWidth: '60%',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '0.9em' }}>
                    👤 [{msg.user}]
                  </div>
                  <div>{msg.text}</div>
                </div>
              </li>
            );
          })}
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
