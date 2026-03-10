import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { randHex, randInt } from '../data/mockData';

function SliderRow({ label, value, onChange, color = 'var(--cyan)' }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--text-dim)', letterSpacing: 0.5 }}>{label}</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 8, color }}>{value}</span>
      </div>
      <input type="range" min="0" max="100" value={parseInt(value)} onChange={e => onChange(e.target.value)}
        style={{ accentColor: color }} />
    </div>
  );
}

function SelectRow({ label, options, value, onChange }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--text-dim)', marginBottom: 4, letterSpacing: 0.5 }}>{label}</div>
      <select value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function DataReadout({ label, value, unit, blink = false, color = 'var(--cyan)' }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '4px 0', borderBottom: '1px solid rgba(0,229,255,0.06)',
    }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--text-dim)' }}>{label}</span>
      <div style={{ display: 'flex', gap: 3, alignItems: 'baseline' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color }}
              className={blink ? 'blink' : ''}>{value}</span>
        {unit && <span style={{ fontFamily: 'var(--mono)', fontSize: 7, color: 'var(--text-dim)' }}>{unit}</span>}
      </div>
    </div>
  );
}

export default function RightPanel({ layer, target }) {
  const [alert,    setAlert]    = useState(78);
  const [events,   setEvents]   = useState(40);
  const [pos,      setPos]      = useState(0);
  const [type,     setType]     = useState('Tactical');
  const [brightness, setBrightness] = useState(80);
  const [contrast, setContrast] = useState(60);
  const [saturation, setSaturation] = useState(50);
  const [recTime,  setRecTime]  = useState('00:12:07');
  const [gsd,      setGsd]      = useState('0.454');
  const [alt,      setAlt]      = useState('523.7km');
  const [hash,     setHash]     = useState(randHex(4));

  // Tick rec time
  useEffect(() => {
    const iv = setInterval(() => {
      setRecTime(prev => {
        const parts = prev.split(':').map(Number);
        parts[2]++;
        if (parts[2] >= 60) { parts[2] = 0; parts[1]++; }
        if (parts[1] >= 60) { parts[1] = 0; parts[0]++; }
        return parts.map(n => String(n).padStart(2, '0')).join(':');
      });
      setHash(randHex(4));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const now = new Date();
  const recDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

  return (
    <div className="panel" style={{
      width: 200,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      borderLeft: '1px solid var(--border)',
      background: 'rgba(4,10,20,0.92)',
    }}>
      <div className="bracket bracket-tr" />
      <div className="bracket bracket-br" />

      {/* REC indicator */}
      <div style={{
        padding: '8px 12px 6px',
        borderBottom: '1px solid rgba(0,229,255,0.1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div className="pulse-dot" style={{ background: 'var(--red)', boxShadow: '0 0 6px var(--red)' }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--red)', letterSpacing: 1 }}>REC</span>
        </div>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--text-dim)' }}>{recDate}</span>
      </div>

      <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(0,229,255,0.08)' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--cyan)', letterSpacing: 1, marginBottom: 6 }}
             className="text-glow-cyan">
          {recTime}
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 7, color: 'var(--text-dim)' }}>
          DRK: 67439 PASS: 205C-{hash}
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>

        {/* Alert / Events sliders */}
        <div style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--text-dim)', letterSpacing: 1, marginBottom: 8 }}>
          FILTERS
        </div>
        <SliderRow label="ALERT" value={`${alert}%`} onChange={setAlert} color="var(--amber)" />
        <SliderRow label="EVENTS" value={`${events}%`} onChange={setEvents} />

        <div style={{ borderTop: '1px solid rgba(0,229,255,0.08)', margin: '8px 0' }} />

        {/* Type selector */}
        <SelectRow label="TYPE" value={type} onChange={setType}
          options={['Tactical', 'Strategic', 'SIGINT', 'HUMINT', 'IMINT']} />

        {/* Detect / Clear buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10 }}>
          {['DETECT', 'CLEAR'].map(label => (
            <motion.button key={label} whileTap={{ scale: 0.95 }}
              style={{
                background: label === 'DETECT' ? 'rgba(0,229,255,0.1)' : 'transparent',
                border: `1px solid ${label === 'DETECT' ? 'var(--cyan2)' : 'rgba(0,229,255,0.2)'}`,
                color: label === 'DETECT' ? 'var(--cyan)' : 'var(--text-dim)',
                fontFamily: 'var(--mono)', fontSize: 8, padding: '5px 0',
                cursor: 'pointer', borderRadius: 1, letterSpacing: 1,
              }}>
              {label}
            </motion.button>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(0,229,255,0.08)', margin: '8px 0' }} />

        {/* Image adjustments */}
        <div style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--text-dim)', letterSpacing: 1, marginBottom: 8 }}>
          IMAGE
        </div>
        <SliderRow label="BRIGHTNESS" value={`${brightness}`} onChange={setBrightness} />
        <SliderRow label="CONTRAST"   value={`${contrast}`}   onChange={setContrast} />
        <SliderRow label="SATURATION" value={`${saturation}`} onChange={setSaturation} />

        <div style={{ borderTop: '1px solid rgba(0,229,255,0.08)', margin: '8px 0' }} />

        {/* Orbital readouts */}
        <div style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--text-dim)', letterSpacing: 1, marginBottom: 8 }}>
          ORBITAL DATA
        </div>
        <DataReadout label="GSD"    value={gsd}   unit="m/px" />
        <DataReadout label="ALT"    value={alt}   />
        <DataReadout label="SON"    value="-56.4" unit="EL" />
        <DataReadout label="PASS"   value={recTime.slice(0,5)} blink />
        <DataReadout label="INC"    value="97.9"  unit="°" />
        <DataReadout label="VEL"    value="7.68"  unit="km/s" />

        {/* Target intel (if selected) */}
        {target && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: 10 }}>
            <div style={{ borderTop: '1px solid rgba(255,179,0,0.2)', paddingTop: 8 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 8, color: 'var(--amber)', letterSpacing: 1, marginBottom: 6 }}
                   className="text-glow-amber">
                ◈ TARGET LOCK
              </div>
              <DataReadout label="LAT"  value={target.lat?.toFixed(4) || '--'} unit="°" color="var(--amber)" />
              <DataReadout label="LNG"  value={target.lng?.toFixed(4) || '--'} unit="°" color="var(--amber)" />
              <DataReadout label="TYPE" value={target.type?.toUpperCase() || '--'} color="var(--amber)" />
              {target.id && <DataReadout label="ID" value={target.id} color="var(--amber)" />}
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom: layer label */}
      <div style={{
        padding: '6px 12px',
        borderTop: '1px solid rgba(0,229,255,0.08)',
        fontFamily: 'var(--mono)', fontSize: 7, color: 'var(--text-dim)',
      }}>
        <span>MODE: </span>
        <span style={{ color: 'var(--cyan)' }}>{layer.toUpperCase()}</span>
      </div>
    </div>
  );
}
