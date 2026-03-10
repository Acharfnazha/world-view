import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LAYERS_CONFIG = [
  { key: 'flights',  label: 'Live Flights',     icon: '✈',  count: 6,  unit: '',   color: 'var(--cyan)',  alert: null },
  { key: 'quakes',   label: 'Earthquakes (24h)', icon: '⚡', count: 7,  unit: '',   color: 'var(--amber)', alert: '2h' },
  { key: 'sats',     label: 'Satellites',        icon: '◈',  count: 180, unit: '',  color: 'var(--green)', alert: 'OK' },
  { key: 'traffic',  label: 'Street Traffic',    icon: '◉',  count: null,unit: '',  color: 'var(--amber)', alert: null },
  { key: 'weather',  label: 'Weather Radar',     icon: '◈',  count: null,unit: '',  color: 'var(--cyan)',  alert: null },
  { key: 'cctv',     label: 'CCTV Mesh',         icon: '◎',  count: 14, unit: 'K', color: 'var(--text-dim)', alert: 'OFL' },
];

function LayerRow({ cfg, isOn, onToggle }) {
  return (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(0,229,255,0.04)' }}
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 12px',
        borderBottom: '1px solid rgba(0,229,255,0.05)',
        cursor: 'pointer',
      }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: isOn ? cfg.color : 'var(--text-dim)' }}>
        {cfg.icon}
      </span>
      <span style={{ flex: 1, fontFamily: 'var(--ui)', fontSize: 11, fontWeight: 500,
                     color: isOn ? 'var(--text)' : 'var(--text-dim)', letterSpacing: 0.3 }}>
        {cfg.label}
      </span>
      {cfg.count != null && (
        <span style={{ fontFamily: 'var(--mono)', fontSize: 9,
                       color: isOn ? cfg.color : 'var(--text-dim)' }}>
          {cfg.count}{cfg.unit}
        </span>
      )}
      {cfg.alert && (
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 7,
          color: isOn ? (cfg.alert === 'OFL' ? 'var(--red)' : 'var(--green)') : 'var(--text-dim)',
          border: `1px solid ${isOn ? 'rgba(0,229,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
          padding: '1px 4px', borderRadius: 1,
        }}>{cfg.alert}</span>
      )}
      <div className={`toggle ${isOn ? 'on' : ''}`} />
    </motion.div>
  );
}

function StatusBlock({ label, value, sub, color = 'var(--cyan)' }) {
  return (
    <div style={{ padding: '6px 12px', borderBottom: '1px solid rgba(0,229,255,0.05)' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--text-dim)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontFamily: 'var(--display)', fontSize: 12, color, letterSpacing: 1 }}
           className={color === 'var(--cyan)' ? 'text-glow-cyan' : ''}>
        {value}
      </div>
      {sub && <div style={{ fontFamily: 'var(--mono)', fontSize: 7, color: 'var(--text-dim)', marginTop: 1 }}>{sub}</div>}
    </div>
  );
}

export default function LeftPanel({ activeDataLayers, onToggleLayer }) {
  return (
    <div className="panel glow-cyan" style={{
      width: 220,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      borderRight: '1px solid var(--border)',
    }}>
      <div className="bracket bracket-tl" />
      <div className="bracket bracket-bl" />

      {/* Header */}
      <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid rgba(0,229,255,0.12)' }}>
        <div style={{ fontFamily: 'var(--display)', fontSize: 9, color: 'var(--cyan)', letterSpacing: 2 }}
             className="text-glow-cyan">
          DATA LAYERS
        </div>
      </div>

      {/* Layer toggles */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {LAYERS_CONFIG.map(cfg => (
          <LayerRow
            key={cfg.key}
            cfg={cfg}
            isOn={activeDataLayers[cfg.key]}
            onToggle={() => onToggleLayer(cfg.key)}
          />
        ))}
      </div>

      {/* Stats */}
      <div style={{ borderTop: '1px solid rgba(0,229,255,0.1)' }}>
        <StatusBlock label="UPTIME" value="847:22:14" sub="CONTINUOUS" />
        <StatusBlock label="CONTACTS" value="3,847" sub="GLOBAL TRACKED" />
        <StatusBlock label="SIGNAL" value="94.7%" color="var(--green)" sub="UPLINK NOMINAL" />
      </div>

      {/* Classification stamp */}
      <div style={{
        padding: '8px 12px',
        borderTop: '1px solid rgba(0,229,255,0.08)',
        fontFamily: 'var(--mono)',
        fontSize: 7,
        color: 'var(--text-dim)',
        lineHeight: 1.8,
      }}>
        <div style={{ color: 'var(--red)', fontSize: 8, letterSpacing: 1 }}>TOP SECRET // TS-TK // NOFORN</div>
        <div>KH11-4506 OPS-4117</div>
        <div style={{ marginTop: 4 }}>INF GLOBAL BEAR FIRETRACKER BRIDGE TOADFISH BRAVO...</div>
      </div>
    </div>
  );
}
