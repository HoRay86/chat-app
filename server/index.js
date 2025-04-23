// server/index.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors({
    origin: '*',  // 或者指定你前端網址也行
    methods: ['GET', 'POST'],
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",  // 如果部署後記得加安全的網域！
        methods: ["GET", "POST"]
    }
});
let users = {};
const sendUserList = () => {
  const userList = Object.values(users);
  io.emit("user list", userList);
};

io.on("connection", (socket) => {

    // 監聽登入事件（帶上 user name）
    socket.on("join", (username) => {
        socket.username = username;
        users[socket.id] = username;
        socket.username = username; // 記住這個使用者
        console.log(`📥 ${username} joined`);
        io.emit("system message", `📥 [${username}] joined the chat`);
        io.emit("user count", Object.keys(users).length);
        sendUserList(); // 傳送新的用戶列表
    });

    // 普通訊息
    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
    });

    // 離線時發送系統訊息
    socket.on("disconnect", () => {
        if (users[socket.id]) {
            const name = users[socket.id];
            console.log(`📤 ${name} left (${socket.id})`);
            io.emit("system message", `📤 [${name}] left the chat`);
            delete users[socket.id];
            io.emit("user count", Object.keys(users).length);
            sendUserList(); // ✅ 傳送更新後的用戶列表
        }
    });
});


const PORT = process.env.PORT || 3001; //設定後端伺服器監聽的端口。

server.listen(PORT, () => {
    console.log(`伺服器正在監聽端口 ${PORT}`);
});
