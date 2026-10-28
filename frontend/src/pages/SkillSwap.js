import React, { useEffect, useState } from 'react';
import api from '../api/client';
import Tabs from '../components/Tabs';
import Icon from '../components/Icon';

export default function SkillSwap() {
  const [offers, setOffers] = useState([]);
  const [radius, setRadius] = useState(10);
  const [skillOffered, setSkillOffered] = useState('');
  const [skillWanted, setSkillWanted] = useState('');
  const [description, setDescription] = useState('');
  const [matches, setMatches] = useState({});
  const [error, setError] = useState('');

  const load = async (r) => {
    try {
      const res = await api.get(`/skills/nearby?radiusKm=${r}`);
      setOffers(res.data);
    } catch (err) {
      setError('Could not load skill offers');
    }
  };

  useEffect(() => { load(radius); }, [radius]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!skillOffered.trim() || !skillWanted.trim()) return;
    try {
      await api.post('/skills', { skillOffered, skillWanted, description });
      setSkillOffered('');
      setSkillWanted('');
      setDescription('');
      load(radius);
    } catch (err) {
      setError('Could not post skill offer');
    }
  };

  const checkMatches = async (id) => {
    const res = await api.get(`/skills/${id}/matches`);
    setMatches((m) => ({ ...m, [id]: res.data }));
  };

  const markClosed = async (id) => {
    await api.put(`/skills/${id}/status?status=CLOSED`);
    load(radius);
  };

  return (
    <div className="container page-enter">
      <Tabs />

      <div className="page-header">
        <div className="icon-badge"><Icon name="skills" size={20} /></div>
        <div>
          <div className="page-title">Skill Swap</div>
          <div className="page-subtitle">Trade skills with people nearby</div>
        </div>
      </div>

      {error && <p className="error"><Icon name="bolt" size={14} />{error}</p>}

      <div className="card">
        <form onSubmit={handleCreate}>
          <div className="field-row">
            <Icon name="skills" size={15} />
            <input placeholder="Skill you can offer (e.g. Guitar lessons)" value={skillOffered} onChange={(e) => setSkillOffered(e.target.value)} />
          </div>
          <div className="field-row">
            <Icon name="sparkle" size={15} />
            <input placeholder="Skill you want (e.g. Spoken Spanish)" value={skillWanted} onChange={(e) => setSkillWanted(e.target.value)} />
          </div>
          <textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          <button type="submit"><Icon name="plus" size={15} />Post Offer</button>
        </form>
      </div>

      <div className="radius-control">
        <Icon name="radius" size={16} />
        <span className="radius-value">{radius} km</span>
        <input type="range" min="1" max="50" value={radius} onChange={(e) => setRadius(Number(e.target.value))} />
      </div>

      {offers.length === 0 && (
        <div className="empty">
          <Icon name="skills" size={28} />
          No open skill offers within {radius} km yet.
        </div>
      )}

      {offers.map((o, i) => (
        <div className="card" key={o.id} style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
          <span className="badge distance-badge"><Icon name="pin" size={11} />{o.distanceKm} km away</span>
          <div className="title-row">
            <Icon name="skills" size={16} />
            <span><strong>{o.user}</strong> offers <strong>{o.skillOffered}</strong> for <strong>{o.skillWanted}</strong></span>
          </div>
          {o.description && <p className="meta">{o.description}</p>}
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button className="secondary" onClick={() => checkMatches(o.id)}><Icon name="sparkle" size={14} />Find matches</button>
            <button className="secondary" onClick={() => markClosed(o.id)}><Icon name="check" size={14} />Mark closed</button>
          </div>
          {matches[o.id] && (
            matches[o.id].length === 0
              ? <p className="meta" style={{ marginTop: 8 }}>No reverse matches yet.</p>
              : matches[o.id].map((m) => (
                  <p className="meta" key={m.id} style={{ marginTop: 8 }}>
                    <Icon name="sparkle" size={12} />
                    Match: {m.user} ({m.skillOffered} for {m.skillWanted})
                  </p>
                ))
          )}
        </div>
      ))}
    </div>
  );
}
