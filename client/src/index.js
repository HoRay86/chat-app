import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import RoomEntry from './RoomEntry';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<RoomEntry />} />
        <Route path="/room/:roomId" element={<App />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
