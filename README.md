# 🗨️ Chat With Me - 簡易即時聊天室

使用 **React** + **Socket.io** 打造的匿名即時聊天室應用。

> ⚠️ **目前多房間機制尚在開發中，所有使用者仍會進入同一個聊天室。**

---

## 🔧 功能特色

- ✅ 即時文字訊息傳送（Socket.io）
- ✅ 支援亮／暗模式切換
- ✅ 自動將 URL 轉為可點擊超連結
- ✅ 支援點擊回覆指定訊息
- ⏳ 更多功能開發中...

---

## 🧑‍💻 使用技術

- **前端**：React、React Router、Socket.io-client
- **後端**：Node.js、Express、Socket.io
- **部署**：
  - 前端：GitHub Pages
  - 後端：Render.com

---

## 📂 專案結構

```bash
chat-with-me/
├── public/
├── src/
│   ├── App.js            # 聊天室主畫面邏輯
│   ├── RoomEntry.js      # 房間入口頁（多房間開發中）
│   ├── index.js          # React Router 與入口設定
│   └── index.css         # 全域樣式設定
├── server/
│   └── index.js          # Node.js + Socket.io 後端伺服器
└── README.md
```

## 🙌 特別感謝

- 💡 [tlk.io](https://tlk.io/) — 初始靈感來源
- 👥 感謝以下朋友協助測試與回饋：
  - Erica
  - Bob
  - 靜靜
  - 雨停
- Socket.io — 提供穩定的即時通訊框架
- React 社群 — 提供豐富的教學資源與元件靈感
- Render — 免費提供 Node.js 後端部署平台
