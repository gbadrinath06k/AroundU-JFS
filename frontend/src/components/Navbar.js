import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';

export default function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div className="brand-row">
        <div className="brand-mark"><Icon name="pin" size={16} /></div>
        <div className="brand">AroundU</div>
      </div>
      <div className="right">
        <span className="hi"><Icon name="user" size={14} />Hi, {username}</span>
        <button className="secondary" onClick={logout}>
          <Icon name="logout" size={14} />Logout
        </button>
      </div>
    </div>
  );
}
