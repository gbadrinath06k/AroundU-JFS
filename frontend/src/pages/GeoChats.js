import React, { useEffect, useRef, useState } from 'react';
import api from '../api/client';
import Tabs from '../components/Tabs';
import Icon from '../components/Icon';

const POLL_MS = 3000;

export default function GeoChats() {
  const [rooms, setRooms] = useState([]);
  const [radius, setRadius] = useState(10);
  const [activeRoom, setActiveRoom] = useState(null);
  const [myRoom, setMyRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const username = localStorage.getItem('username');

  const loadRooms = async (r) => {
    try {
      const res = await api.get(`/chats/rooms?radiusKm=${r}`);
      setRooms(res.data);
    } catch (err) {
      setError('Could not load nearby chat rooms');
    }
  };

  const loadMyRoom = async () => {
    try {
      const res = await api.get('/chats/my-room');
      setMyRoom(res.data.room);
    } catch (err) {
      // ignore
    }
  };

  const loadMessages = async (room) => {
    try {
      const res = await api.get(`/chats/${encodeURIComponent(room)}/messages`);
      setMessages(res.data);
    } catch (err) {
      setError('Could not load messages');
    }
  };

  useEffect(() => {
    loadMyRoom();
    loadRooms(radius);
  }, [radius]);

  useEffect(() => {
    if (activeRoom) return;
    const id = setInterval(() => loadRooms(radius), POLL_MS);
    return () => clearInterval(id);
  }, [radius, activeRoom]);

  useEffect(() => {
    if (!activeRoom) return;
    loadMessages(activeRoom);
    const id = setInterval(() => loadMessages(activeRoom), POLL_MS);
    return () => clearInterval(id);
  }, [activeRoom]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openRoom = (room) => setActiveRoom(room);
  const openMyRoom = () => { if (myRoom) setActiveRoom(myRoom); };

  const createRoom = async (e) => {
    e.preventDefault();
    const name = newRoomName.trim();
    if (!name) return;
    try {
      // Posting a greeting creates the room (backend groups messages by room name)
      // so a brand-new room immediately shows up for others nearby.
      await api.post('/chats', { room: name, content: `${username} started this room 👋` });
      setNewRoomName('');
      setActiveRoom(name);
      loadRooms(radius);
    } catch (err) {
      setError('Could not create room');
    }
  };

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeRoom) return;
    try {
      await api.post('/chats', { room: activeRoom, content: text });
      setText('');
      loadMessages(activeRoom);
    } catch (err) {
      setError('Could not send message');
    }
  };

  if (activeRoom) {
    return (
      <div className="container page-enter">
        <Tabs />
        <div className="page-header">
          <div className="icon-badge"><Icon name="room" size={20} /></div>
          <div>
            <div className="page-title">{activeRoom}</div>
            <div className="page-subtitle">Geo chat room</div>
          </div>
        </div>
        {error && <p className="error"><Icon name="bolt" size={14} />{error}</p>}
        <div className="chat-window">
          <div className="chat-header">
            <span className="title"><Icon name="chat" size={16} />{activeRoom}</span>
            <button className="secondary" onClick={() => setActiveRoom(null)}>
              <Icon name="back" size={14} />Back
            </button>
          </div>
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="empty">
                <Icon name="chat" size={28} />
                No messages yet — say hi!
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`chat-bubble ${m.sender === username ? 'mine' : ''}`}>
                <div className="sender">{m.sender}</div>
                <div>{m.content}</div>
                <div className="time">{new Date(m.createdAt).toLocaleTimeString()}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <form className="chat-input-row" onSubmit={send}>
            <input
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button type="submit"><Icon name="send" size={15} />Send</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container page-enter">
      <Tabs />

      <div className="page-header">
        <div className="icon-badge"><Icon name="chat" size={20} /></div>
        <div>
          <div className="page-title">Geo Chats</div>
          <div className="page-subtitle">Location-based chat rooms near you</div>
        </div>
      </div>

      {error && <p className="error"><Icon name="bolt" size={14} />{error}</p>}

      {myRoom && (
        <div className="card room-card" onClick={openMyRoom}>
          <span className="badge"><Icon name="pin" size={11} />Your area</span>
          <div className="title-row">
            <Icon name="room" size={16} />
            <strong>{myRoom}</strong>
          </div>
          <p className="meta">Jump into your local room — refreshes every few seconds.</p>
        </div>
      )}

      <div className="card">
        <form onSubmit={createRoom}>
          <div className="field-row">
            <Icon name="plus" size={15} />
            <input
              placeholder="Start a new room (e.g. Dog Walkers, Weekend Hikers)"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            />
          </div>
          <button type="submit"><Icon name="room" size={15} />Create Room</button>
        </form>
      </div>

      <div className="radius-control">
        <Icon name="radius" size={16} />
        <span className="radius-value">{radius} km</span>
        <input type="range" min="1" max="50" value={radius} onChange={(e) => setRadius(Number(e.target.value))} />
      </div>

      {rooms.length === 0 && (
        <div className="empty">
          <Icon name="chat" size={28} />
          No active chat rooms within {radius} km yet. Open your area room above to start one.
        </div>
      )}

      <div className="room-list">
        {rooms.map((r, i) => (
          <div className="card room-card" key={r.room} onClick={() => openRoom(r.room)} style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
            <div className="badge-row">
              <span className="badge distance-badge"><Icon name="pin" size={11} />{r.distanceKm} km away</span>
              <span className="badge"><Icon name="chat" size={11} />{r.messageCount} msgs</span>
            </div>
            <div className="title-row">
              <Icon name="room" size={16} />
              <strong>{r.room}</strong>
            </div>
            <p className="meta">{r.lastSender}: {r.lastMessage}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
