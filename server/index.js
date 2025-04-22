// server/index.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",  // 如果部署後記得加安全的網域！
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("🔌 A user connected");

    socket.on("chat message", (msg) => {
        io.emit("chat message", msg); // 廣播給全部人
    });

    socket.on("disconnect", () => {
        console.log("❌ A user disconnected");
    });
});

server.listen(3001, () => {
    console.log("✅ Server running on http://localhost:3001");
});
