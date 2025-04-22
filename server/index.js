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

io.on("connection", (socket) => {
    console.log("🔌 A user connected");

    // 監聽登入事件（帶上 user name）
    socket.on("join", (username) => {
        socket.username = username; // 記住這個使用者
        console.log(`📥 ${username} joined`);
        io.emit("system message", `📥 [${username}] joined the chat`);
    });

    // 普通訊息
    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
    });

    // 離線時發送系統訊息
    socket.on("disconnect", () => {
        if (socket.username) {
            console.log(`📤 ${socket.username} left`);
            io.emit("system message", `📤 [${socket.username}] left the chat`);
        }
    });
});


server.listen(3001, () => {
    console.log("✅ Server running on http://localhost:3001");
});
