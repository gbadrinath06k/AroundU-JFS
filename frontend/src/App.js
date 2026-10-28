import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import SkillSwap from './pages/SkillSwap';
import Marketplace from './pages/Marketplace';
import GeoChats from './pages/GeoChats';
import Navbar from './components/Navbar';

function isAuthed() {
  return !!localStorage.getItem('token');
}

function Protected({ children }) {
  return isAuthed() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      {isAuthed() && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Protected><Feed /></Protected>} />
        <Route path="/skills" element={<Protected><SkillSwap /></Protected>} />
        <Route path="/marketplace" element={<Protected><Marketplace /></Protected>} />
        <Route path="/chats" element={<Protected><GeoChats /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
