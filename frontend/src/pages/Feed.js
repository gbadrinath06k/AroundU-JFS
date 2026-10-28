import React, { useEffect, useState } from 'react';
import api from '../api/client';
import Tabs from '../components/Tabs';
import Icon from '../components/Icon';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [radius, setRadius] = useState(10);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');

  const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB keeps the H2 lab DB light

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('Image must be under 2 MB');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const load = async (r) => {
    try {
      const res = await api.get(`/posts/feed?radiusKm=${r}`);
      setPosts(res.data);
    } catch (err) {
      setError('Could not load feed');
    }
  };

  useEffect(() => { load(radius); }, [radius]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await api.post('/posts', { content, category, imageBase64: image || null });
      setContent('');
      setImage('');
      load(radius);
    } catch (err) {
      setError('Could not create post');
    }
  };

  const upvote = async (id) => {
    await api.post(`/posts/${id}/upvote`);
    load(radius);
  };

  return (
    <div className="container page-enter">
      <Tabs />

      <div className="page-header">
        <div className="icon-badge"><Icon name="feed" size={20} /></div>
        <div>
          <div className="page-title">Hyperlocal Feed</div>
          <div className="page-subtitle">What's happening near you</div>
        </div>
      </div>

      {error && <p className="error"><Icon name="bolt" size={14} />{error}</p>}

      <div className="card">
        <form onSubmit={handlePost}>
          <textarea
            placeholder="What's happening nearby?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="GENERAL">General</option>
            <option value="ALERT">Alert</option>
            <option value="EVENT">Event</option>
            <option value="LOST_FOUND">Lost & Found</option>
          </select>
          <label className="secondary file-pick" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', margin: '8px 0' }}>
            <Icon name="image" size={15} />{image ? 'Change photo' : 'Add photo'}
            <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          </label>
          {image && (
            <div style={{ position: 'relative', marginBottom: 10 }}>
              <img src={image} alt="preview" style={{ width: '100%', maxHeight: 260, objectFit: 'cover', borderRadius: 14 }} />
              <button type="button" className="secondary" onClick={() => setImage('')}
                style={{ position: 'absolute', top: 8, right: 8, padding: '6px 8px' }}>
                <Icon name="close" size={14} />
              </button>
            </div>
          )}
          <button type="submit"><Icon name="plus" size={15} />Post</button>
        </form>
      </div>

      <div className="radius-control">
        <Icon name="radius" size={16} />
        <span className="radius-value">{radius} km</span>
        <input type="range" min="1" max="50" value={radius} onChange={(e) => setRadius(Number(e.target.value))} />
      </div>

      {posts.length === 0 && (
        <div className="empty">
          <Icon name="feed" size={28} />
          No posts within {radius} km yet.
        </div>
      )}

      {posts.map((p, i) => (
        <div className="card" key={p.id} style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
          <div className="badge-row">
            <span className="badge"><Icon name="tag" size={11} />{p.category}</span>
            <span className="badge distance-badge"><Icon name="pin" size={11} />{p.distanceKm} km away</span>
          </div>
          <p style={{ marginTop: 10 }}>{p.content}</p>
          {p.imageBase64 && (
            <img src={p.imageBase64} alt="post" style={{ width: '100%', maxHeight: 360, objectFit: 'cover', borderRadius: 14, marginTop: 10 }} />
          )}
          <div className="meta">
            <Icon name="user" size={12} />
            {p.author} &middot; {new Date(p.createdAt).toLocaleString()}
          </div>
          <button className="secondary" style={{ marginTop: 10 }} onClick={() => upvote(p.id)}>
            <Icon name="thumb" size={14} />{p.upvotes}
          </button>
        </div>
      ))}
    </div>
  );
}
