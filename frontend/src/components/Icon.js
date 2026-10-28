import React from 'react';

// Minimal inline SVG icon set — no external dependency, keeps bundle small
// and lets every icon inherit currentColor so it matches the theme.
const PATHS = {
  feed: 'M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16M5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  skills: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.1-3.1a4 4 0 0 1-5.1 5.1l-4.3 4.3-4.3-4.3a4 4 0 0 1-5.1-5.1l3.1 3.1a1 1 0 0 0 1.4 0l1.6-1.6a1 1 0 0 0 0-1.4L3.5 3.2A4 4 0 0 1 9 7.5l-1 1 4.3 4.3 1-1a4 4 0 0 1 5.1-5.1l-3.7 3.6Z',
  market: 'M6 2 3 6v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V6l-3-4H6ZM3 6h18M16 10a4 4 0 0 1-8 0',
  chat: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z',
  pin: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  bolt: 'M13 2 3 14h7l-1 8 10-12h-7l1-8Z',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z',
  thumb: 'M7 11v10H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3Zm0 0 4.5-8a2 2 0 0 1 3.5 1.3V9h4.2a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 18 20H9a2 2 0 0 1-2-1',
  tag: 'M20.6 12.6 12 21.2 2.8 12A2 2 0 0 1 2 10.5V4a2 2 0 0 1 2-2h6.5a2 2 0 0 1 1.4.6l8.7 8.7a2 2 0 0 1 0 2.8ZM7 7h.01',
  cart: 'M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.2a2 2 0 0 0 2-1.6L23 6H6',
  check: 'M20 6 9 17l-5-5',
  back: 'M19 12H5M12 19l-7-7 7-7',
  room: 'M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5Z',
  user: 'M20 21a8 8 0 1 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  radius: 'M12 2v4M12 18v4M2 12h4M18 12h4M12 12m-7 0a7 7 0 1 0 14 0 7 7 0 1 0-14 0',
  sparkle: 'M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.1 2.1M15.6 15.6l2.1 2.1M17.7 6.3l-2.1 2.1M8.4 15.6l-2.1 2.1',
  plus: 'M12 5v14M5 12h14',
  image: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM21 15l-5-5L5 21',
  close: 'M18 6 6 18M6 6l12 12',
};

export default function Icon({ name, size = 16, strokeWidth = 2, className = '' }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}
