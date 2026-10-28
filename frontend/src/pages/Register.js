import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import Icon from '../components/Icon';

// A few preset Hyderabad-area coordinates so the location/distance demo is easy to show
const PRESET_LOCATIONS = [
  { label: 'Kukatpally, Hyderabad', lat: 17.4849, lng: 78.4138 },
  { label: 'Gachibowli, Hyderabad', lat: 17.4401, lng: 78.3489 },
  { label: 'Ameerpet, Hyderabad', lat: 17.4375, lng: 78.4482 },
  { label: 'Dilsukhnagar, Hyderabad', lat: 17.3687, lng: 78.5247 },
  { label: 'Secunderabad, Hyderabad', lat: 17.4399, lng: 78.4983 },
];

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [locationIndex, setLocationIndex] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const loc = PRESET_LOCATIONS[locationIndex];
    try {
      const res = await api.post('/auth/register', {
        username,
        email,
        password,
        latitude: loc.lat,
        longitude: loc.lng,
        locationLabel: loc.label,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('userId', res.data.userId);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <div className="auth-logo"><Icon name="pin" size={22} /></div>
        <h2>Join AroundU</h2>
        {error && <p className="error"><Icon name="bolt" size={14} />{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="field-row">
            <Icon name="user" size={15} />
            <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label><Icon name="pin" size={13} />Your area (for the hyperlocal radius)</label>
          <select value={locationIndex} onChange={(e) => setLocationIndex(Number(e.target.value))}>
            {PRESET_LOCATIONS.map((loc, idx) => (
              <option key={loc.label} value={idx}>{loc.label}</option>
            ))}
          </select>
          <button type="submit"><Icon name="plus" size={15} />Create account</button>
        </form>
        <p className="switch-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
