import React from 'react';
import { motion } from 'framer-motion';
import { CITIES, LANDMARKS } from '../data/mockData';

const LAYER_BUTTONS = [
  { key: 'normal', label: 'Normal', icon: '◑' },
  { key: 'crt',    label: 'CRT',    icon: '◎' },
  { key: 'nvg',    label: 'NVG',    icon: '◈' },
  { key: 'flir',   label: 'FLIR',   icon: '◉' },
  { key: 'arrow',  label: 'Arrow',  icon: '◇' },
  { key: 'none',   label: 'None',   icon: '○'  },
  { key: 'ai',     label: 'AI',     icon: '◆'  },
];

export default function BottomBar({ layer, setLayer, targetCity, setTargetCity, activeLandmark, setActiveLandmark }) {
  return (
    <div style={{
      flexShrink: 0,
      background: 'rgba(3,7,14,0.95)',
      borderTop: '1px solid rgba(0,229,255,0.1)',
    }}>
      {/* Landmark sub-tabs (only in CRT mode when a city is selected) */}
      {layer === 'crt' && targetCity?.name === 'Washington DC' && (
        <div style={{
          display: 'flex',
          padding: '4px 12px 0',
          gap: 0,
          borderBottom: '1px solid rgba(0,229,255,0.08)',
          overflowX: 'auto',
        }}>
          {LANDMARKS.map(lm => (
            <button
              key={lm.name}
              className={`city-tab ${activeLandmark?.name === lm.name ? 'active' : ''}`}
              onClick={() => setActiveLandmark(lm)}>
              {lm.name}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
        {/* City quick-nav */}
        <div style={{ display: 'flex', overflowX: 'auto' }}>
          {CITIES.map(city => (
            <button
              key={city.name}
              className={`city-tab ${targetCity?.name === city.name ? 'active' : ''}`}
              onClick={() => setTargetCity(city)}>
              {city.name}
            </button>
          ))}
        </div>

        {/* Separator */}
        <div style={{ width: 1, height: 24, background: 'rgba(0,229,255,0.15)', margin: '0 8px', flexShrink: 0 }} />

        {/* Layer switcher */}
        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
          {LAYER_BUTTONS.map(btn => (
            <motion.button
              key={btn.key}
              className={`layer-btn ${layer === btn.key ? 'active' : ''}`}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLayer(btn.key)}>
              <span className="icon">{btn.icon}</span>
              {btn.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
