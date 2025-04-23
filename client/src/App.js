import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://chat-app-server-rbkm.onrender.com');

function App() {
  const [username, setUsername] = useState('');
  const [tempName, setTempName] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [userList, setUserList] = useState([]);

  const getInitialMode = () => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };
  const [isDarkMode, setIsDarkMode] = useState(getInitialMode);
  const messagesEndRef = useRef(null);

  
  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollToBottom();
    }, 50);
    return () => clearTimeout(timeout);
  }, [chat]);

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
    socket.on('user count', (count) => {
      console.log('user count', count)
      setUserCount(count);
    });
    socket.on('user list', (list) => {
      console.log('user list', list)
      setUserList(list);
    });

    return () => {
      socket.off('chat message');
      socket.off('system message');
      socket.off('user count');
      socket.off('user list');
      socket.disconnect();
    };

  }, []);

  // 切換模式
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      <div className={`login-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <h2>👋 Welcome to Chat</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', gap: '10px' }}>
          <input
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="Enter your name"
            style={{ borderRadius: '5px', padding: '5px' }}
          />
          <button type="submit">Join Chat</button>
        </form>
      </div>
    );
  }

  // 聊天畫面
  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <h2>💬 Chat Room - Hello, {username}!</h2>
      {/* <p>👥 {userCount} Online</p>
      <p>🧍 Online Users: {userList.join(', ')}</p> */}

      {/* 手動切換亮暗模式圖示 */}
      <button
        onClick={toggleDarkMode}
        className="mode-toggle-button"
      >
        <i className={`fas fa-${isDarkMode ? 'sun' : 'moon'}`}></i>
      </button>

      <div className="chat-area">
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {chat.map((msg, idx) => {
            // 處理系統訊息
            if (msg.type === 'system') {
              return (
                <li key={idx} className="message-system">
                  {msg.text}
                </li>
              );
            }

            // 判斷是否是自己發的訊息
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
                <div className={isSelf ? 'message-self' : 'message-other'}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9em' }}>
                    👤 {msg.user}
                  </div>
                  <div>{msg.text}</div>
                </div>
              </li>
            );
          })}
        </ul>
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-input-area">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;