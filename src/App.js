import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/global.css';

import TopBar      from './components/TopBar';
import LeftPanel   from './components/LeftPanel';
import GlobeCenter from './components/GlobeCenter';
import RightPanel  from './components/RightPanel';
import BottomBar   from './components/BottomBar';

// ── Boot sequence ─────────────────────────────────────────────────────────────
const BOOT_LINES = [
  'INITIALIZING WORLDVIEW v4.7.2...',
  'LOADING GEOSPATIAL MODULES.............. OK',
  'CONNECTING SATELLITE UPLINK............. OK',
  'DECRYPTING INTEL FEEDS.................. OK',
  'LOADING FLIGHT TELEMETRY................ OK',
  'SEISMIC SENSOR ARRAY ONLINE............. OK',
  'NETWORK INTERCEPT ACTIVE................ OK',
  'CLASSIFICATION: TS//SCI//NOFORN',
  'ACCESS GRANTED // PROCEEDING...',
];

function BootScreen({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [done, setDone]   = useState(false);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[i]]);
        i++;
      } else {
        clearInterval(iv);
        setTimeout(() => setDone(true), 500);
        setTimeout(onComplete, 1200);
      }
    }, 200);
    return () => clearInterval(iv);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={done ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: '#000',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 40,
      }}>
      <div style={{
        fontFamily: 'var(--display)', fontSize: 28, letterSpacing: 8,
        color: 'var(--cyan)', marginBottom: 40,
      }} className="text-glow-cyan">
        WORLDVIEW
      </div>
      <div style={{
        width: '100%', maxWidth: 500,
        fontFamily: 'var(--mono)', fontSize: 11,
        lineHeight: 2,
      }}>
        {lines.map((line, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ color: String(line||'').includes('CLASSIF') ? 'var(--red)' :
                            String(line||'').includes('OK')       ? 'var(--green)' :
                            String(line||'').includes('GRANTED')  ? 'var(--amber)' : 'var(--text-dim)' }}>
            {String(line ?? '')}
          </motion.div>
        ))}
        {lines.length === BOOT_LINES.length && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="blink" style={{ color: 'var(--cyan)' }}>_</motion.span>
        )}
      </div>
    </motion.div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [booting, setBooting] = useState(true);
  const [layer,   setLayer]   = useState('normal');
  const [target,  setTarget]  = useState(null);
  const [targetCity, setTargetCity] = useState(null);
  const [activeLandmark, setActiveLandmark] = useState(null);
  const [activeDataLayers, setActiveDataLayers] = useState({
    flights: true,
    quakes:  true,
    sats:    true,
    traffic: false,
    weather: false,
    cctv:    false,
  });

  const handleToggleLayer = (key) => {
    setActiveDataLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePointClick = (point) => {
    setTarget(point);
  };

  // Ticker message
  const [ticker] = useState(
    'CLASSIFIED // OP: NIGHTFALL · SIGINT ACTIVE · UPLINK CONFIRMED · SAT-KENNAN PASS IN 00:14:32 · THREAT LEVEL: ELEVATED · NRO DOWNLINK NOMINAL · CRYPTO VERIFIED AES-256 · ALL STATIONS NOMINAL ·'
  );

  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'var(--ui)',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--bg)',
    }}>
      {/* Overlay effects */}
      <div className="crt-scanlines" />
      <div className="vignette" />
      <div className="noise" />
      {['crt','nvg','flir'].includes(layer) && <div className="crt-sweep" />}

      {/* Boot screen */}
      <AnimatePresence>
        {booting && <BootScreen onComplete={() => setBooting(false)} />}
      </AnimatePresence>

      {/* Main UI */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: booting ? 0 : 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top bar */}
        <TopBar layer={layer} />

        {/* Content area */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left panel */}
          <LeftPanel
            activeDataLayers={activeDataLayers}
            onToggleLayer={handleToggleLayer}
          />

          {/* Globe center */}
          <GlobeCenter
            layer={layer}
            activeDataLayers={activeDataLayers}
            onPointClick={handlePointClick}
            target={target}
            targetCity={targetCity}
          />

          {/* Right panel */}
          <RightPanel layer={layer} target={target} />
        </div>

        {/* Bottom bar */}
        <BottomBar
          layer={layer}
          setLayer={setLayer}
          targetCity={targetCity}
          setTargetCity={(city) => { setTargetCity(city); setTarget(city); }}
          activeLandmark={activeLandmark}
          setActiveLandmark={setActiveLandmark}
        />

        {/* Ticker */}
        <div style={{
          height: 20,
          background: 'rgba(0,0,0,0.95)',
          borderTop: '1px solid rgba(0,229,255,0.08)',
          overflow: 'hidden',
          display: 'flex', alignItems: 'center',
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 7,
            color: 'var(--text-dim)', letterSpacing: 1,
            whiteSpace: 'nowrap',
            animation: 'ticker 40s linear infinite',
          }}>
            {ticker} {ticker}
          </div>
        </div>
      </motion.div>
    </div>
  );
}