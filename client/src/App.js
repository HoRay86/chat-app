import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://chat-app-server-rbkm.onrender.com');

const hash = window.location.hash; // 例如 "#/room/222-rKmfQ0"
const roomId = hash.split('/room/')[1] || 'default';
const lastDashIndex = roomId.lastIndexOf('-');
const encodedNameOnly = roomId.slice(0, lastDashIndex);
const roomNameOnly = decodeURIComponent(encodedNameOnly);

function App() {
  const [username, setUsername] = useState('');
  const [tempName, setTempName] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [userCount, setUserCount] = useState(1);
  const [userList, setUserList] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const messagesEndRef = useRef(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  
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
      socket.emit('chat message', { roomId, username: tempName, text: message }); // 加入roomId
      setMessage('');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      setUsername(tempName);
      socket.emit('join-room', { roomId, username: tempName }); // 加入roomId
    }
  };

  const handleCopyRoomLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000); // Reset copied message after a short delay
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>
          💬 {roomNameOnly} Chat Room ({userCount}) - Hello, {username}!
        </h2>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center',  }}>
          <button
            onClick={handleCopyRoomLink}
            className="copy-button"
            style={{
              fontSize: '0.9em',
              padding: '6px 10px',
              color: '#666',
              border: '1px solid #ccc',
              background: 'transparent',
              borderRadius: '6px'
            }}
          >
            
            {copiedUrl ? '✅ Copied!':  '🔗 Copy Room Link'}

          </button>

          <button
            onClick={toggleDarkMode}
            className="mode-toggle-button"
            style={{ fontSize: '1.2em' }}
          >
            <i className={`fas fa-${isDarkMode ? 'sun' : 'moon'}`}></i>
          </button>
        </div>
      </div>

      <p>🧍 Online Users: {userList.join(', ')}</p>
     

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