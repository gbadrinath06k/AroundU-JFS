import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from './Icon';

export default function Tabs() {
  const location = useLocation();
  const tabs = [
    { path: '/', label: 'Feed', icon: 'feed' },
    { path: '/skills', label: 'Skill Swap', icon: 'skills' },
    { path: '/marketplace', label: 'Marketplace', icon: 'market' },
    { path: '/chats', label: 'Geo Chats', icon: 'chat' },
  ];
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <Link
          key={t.path}
          to={t.path}
          className={`tab ${location.pathname === t.path ? 'active' : ''}`}
        >
          <Icon name={t.icon} size={15} />
          {t.label}
        </Link>
      ))}
    </div>
  );
}
