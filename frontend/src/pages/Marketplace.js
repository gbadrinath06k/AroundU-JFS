import React, { useEffect, useState } from 'react';
import api from '../api/client';
import Tabs from '../components/Tabs';
import Icon from '../components/Icon';

export default function Marketplace() {
  const [items, setItems] = useState([]);
  const [radius, setRadius] = useState(10);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('USED');
  const [error, setError] = useState('');

  const load = async (r) => {
    try {
      const res = await api.get(`/marketplace/nearby?radiusKm=${r}`);
      setItems(res.data);
    } catch (err) {
      setError('Could not load marketplace items');
    }
  };

  useEffect(() => { load(radius); }, [radius]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !price) return;
    try {
      await api.post('/marketplace', { title, description, price: Number(price), condition });
      setTitle('');
      setDescription('');
      setPrice('');
      load(radius);
    } catch (err) {
      setError('Could not list item');
    }
  };

  const markSold = async (id) => {
    await api.put(`/marketplace/${id}/status?status=SOLD`);
    load(radius);
  };

  return (
    <div className="container page-enter">
      <Tabs />

      <div className="page-header">
        <div className="icon-badge"><Icon name="market" size={20} /></div>
        <div>
          <div className="page-title">Local Marketplace</div>
          <div className="page-subtitle">Buy and sell within your area</div>
        </div>
      </div>

      {error && <p className="error"><Icon name="bolt" size={14} />{error}</p>}

      <div className="card">
        <form onSubmit={handleCreate}>
          <div className="field-row">
            <Icon name="tag" size={15} />
            <input placeholder="Item title (e.g. Study table)" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          <input type="number" placeholder="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)} />
          <select value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option value="NEW">New</option>
            <option value="LIKE_NEW">Like New</option>
            <option value="USED">Used</option>
          </select>
          <button type="submit"><Icon name="plus" size={15} />List Item</button>
        </form>
      </div>

      <div className="radius-control">
        <Icon name="radius" size={16} />
        <span className="radius-value">{radius} km</span>
        <input type="range" min="1" max="50" value={radius} onChange={(e) => setRadius(Number(e.target.value))} />
      </div>

      {items.length === 0 && (
        <div className="empty">
          <Icon name="market" size={28} />
          No items for sale within {radius} km yet.
        </div>
      )}

      {items.map((item, i) => (
        <div className="card" key={item.id} style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
          <div className="badge-row">
            <span className="badge">{item.condition.replace('_', ' ')}</span>
            <span className="badge distance-badge"><Icon name="pin" size={11} />{item.distanceKm} km away</span>
          </div>
          <div className="title-row">
            <Icon name="cart" size={16} />
            <span><strong>{item.title}</strong> — ₹{item.price}</span>
          </div>
          {item.description && <p className="meta">{item.description}</p>}
          <div className="meta"><Icon name="user" size={12} />sold by {item.seller}</div>
          <button className="secondary" style={{ marginTop: 10 }} onClick={() => markSold(item.id)}>
            <Icon name="check" size={14} />Mark as sold
          </button>
        </div>
      ))}
    </div>
  );
}
