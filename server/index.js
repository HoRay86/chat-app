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
        origin: '*',  // 如果部署後記得加安全的網域！
        methods: ["GET", "POST"]
    }
});
const rooms = {};

io.on("connection", (socket) => {

    // 監聽登入事件（帶上 room id & user name）
    socket.on('join-room', ({ roomId, username }) => {
        const nameList = Object.values(rooms[roomId] || {});
        let finalName = username;

        // 如果名稱已存在，加數字
        let count = 1;
        while (nameList.includes(finalName)) {
            finalName = `${username} - ${count++}`;
        }

        socket.join(roomId);
        socket.username = finalName;
        socket.roomId = roomId;

        if (!rooms[roomId]) rooms[roomId] = {};
        rooms[roomId][socket.id] = finalName;

        io.to(roomId).emit('system message', `📥 [${finalName}] joined the chat`);
        io.to(roomId).emit('user list', Object.values(rooms[roomId]));
        io.to(roomId).emit('user count', Object.keys(rooms[roomId]).length);
    });


    // 訊息傳送
    socket.on('chat message', ({ roomId, user, text }) => {
        io.to(roomId).emit('chat message', { user, text });
    });

    // 離線時發送系統訊息
    socket.on('disconnect', () => {
        const room = socket.roomId;
        const name = socket.username;
        if (room && rooms[room]) {
            delete rooms[room][socket.id];
            io.to(room).emit('system message', `📤 [${name}] left the chat`);
            io.to(room).emit('user list', Object.values(rooms[room]));
        }
    });
});


const PORT = process.env.PORT || 3001; //設定後端伺服器監聽的端口。

server.listen(PORT, () => {
    console.log(`伺服器正在監聽端口 ${PORT}`);
});
