import React, { useState, useEffect } from 'react';

export default function TopBar({ layer }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const utc = time.toUTCString().slice(17, 25);
  const layerLabel = {
    normal: 'CRT', crt: 'CRT', nvg: 'NVG', flir: 'FLIR', arrow: 'ARROW', none: 'NONE', ai: 'AI'
  }[layer] || 'CRT';

  const isPanoptix = true; // header indicators

  return (
    <div style={{
      height: 38,
      background: 'rgba(3,7,14,0.97)',
      borderBottom: '1px solid rgba(0,229,255,0.1)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: 0,
      flexShrink: 0,
      position: 'relative',
    }}>
      {/* Left: nav pill indicators */}
      <div style={{ display: 'flex', gap: 6, marginRight: 16 }}>
        {['PANOPTIX', 'VIS:290', 'SAT-GRDF', 'BRNK:8.8', 'E.0ms'].map((label, i) => (
          <span key={i} style={{
            fontFamily: 'var(--mono)', fontSize: 7, letterSpacing: 0.5,
            color: i === 0 ? 'var(--cyan)' : 'var(--text-dim)',
            padding: '2px 6px',
            background: i === 0 ? 'rgba(0,229,255,0.08)' : 'transparent',
            border: i === 0 ? '1px solid rgba(0,229,255,0.2)' : 'none',
            borderRadius: 1,
          }}>{label}</span>
        ))}
      </div>

      {/* Center: WORLDVIEW logo */}
      <div style={{
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--display)',
          fontSize: 16,
          fontWeight: 900,
          letterSpacing: 6,
          color: 'var(--cyan)',
          lineHeight: 1,
        }} className="text-glow-cyan">
          WORLDVIEW
        </div>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 6, letterSpacing: 3,
          color: 'var(--text-dim)', marginTop: 1,
        }}>
          NO PLACE LEFT BEHIND
        </div>
      </div>

      {/* Right: mode + clock */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{
          fontFamily: 'var(--display)', fontSize: 9, letterSpacing: 3,
          color: 'var(--amber)', padding: '2px 8px',
          border: '1px solid rgba(255,179,0,0.3)',
          borderRadius: 1,
        }} className="text-glow-amber">
          {layerLabel}
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--cyan)', letterSpacing: 1 }}
              className="text-glow-cyan">
          {utc} UTC
        </span>
        <div className="pulse-dot" style={{ background: 'var(--red)', boxShadow: '0 0 5px var(--red)' }} />
        <span style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--red)', letterSpacing: 1 }}>LIVE</span>
      </div>
    </div>
  );
}
