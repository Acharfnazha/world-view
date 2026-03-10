import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Globe from './Globe';
import { MOCK_FLIGHTS, MOCK_QUAKES, MOCK_SATELLITES } from '../data/mockData';

function HUDCorner({ pos }) {
  const styles = {
    tl: { top: 20, left: 20, borderWidth: '2px 0 0 2px' },
    tr: { top: 20, right: 20, borderWidth: '2px 2px 0 0' },
    bl: { bottom: 20, left: 20, borderWidth: '0 0 2px 2px' },
    br: { bottom: 20, right: 20, borderWidth: '0 2px 2px 0' },
  }[pos];
  return (
    <div style={{
      position: 'absolute', width: 24, height: 24,
      borderStyle: 'solid', borderColor: 'rgba(0,229,255,0.4)',
      ...styles, zIndex: 20, pointerEvents: 'none',
    }} />
  );
}

function ScanningOverlay({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute', inset: 0, zIndex: 15, pointerEvents: 'none',
            background: 'linear-gradient(180deg, rgba(0,229,255,0.04) 0%, transparent 50%, rgba(0,229,255,0.04) 100%)',
          }}>
          <motion.div
            initial={{ top: '-10%' }}
            animate={{ top: '110%' }}
            transition={{ duration: 1.8, ease: 'linear', repeat: 3 }}
            style={{
              position: 'absolute', left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)',
              boxShadow: '0 0 12px rgba(0,229,255,0.6)',
            }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CoordDisplay({ target }) {
  if (!target) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        fontFamily: 'var(--mono)', fontSize: 9,
        color: 'var(--amber)',
        background: 'rgba(4,8,16,0.9)',
        border: '1px solid rgba(255,179,0,0.3)',
        padding: '4px 16px',
        letterSpacing: 1,
        zIndex: 25, pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }} className="text-glow-amber">
      TARGET: {target.lat?.toFixed?.(4) ?? '--'}° · {target.lng?.toFixed?.(4) ?? '--'}°
    </motion.div>
  );
}

// Scope overlay for CRT mode
function ScopeOverlay() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 18 }}>
      {/* Dark surround */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at center, transparent 37%, rgba(0,0,0,0.6) 44%, rgba(0,0,0,0.97) 52%)',
      }} />
      {/* Ring */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '74vh', height: '74vh',
        borderRadius: '50%',
        border: '1px solid rgba(0,229,255,0.35)',
        boxShadow: '0 0 20px rgba(0,229,255,0.1), inset 0 0 40px rgba(0,0,0,0.3)',
      }} />
      {/* Crosshair */}
      <div style={{
        position: 'absolute', top: 0, left: '50%',
        width: 1, height: '100%',
        background: 'rgba(0,229,255,0.15)',
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: 0,
        width: '100%', height: 1,
        background: 'rgba(0,229,255,0.15)',
      }} />
      {/* Tick marks */}
      {[25, 50, 75].map(pct => (
        <React.Fragment key={pct}>
          <div style={{ position:'absolute', top:`${pct}%`, left:'50%', transform:'translate(-50%,0)',
                        width:8, height:1, background:'rgba(0,229,255,0.3)' }} />
          <div style={{ position:'absolute', left:`${pct}%`, top:'50%', transform:'translate(0,-50%)',
                        height:8, width:1, background:'rgba(0,229,255,0.3)' }} />
        </React.Fragment>
      ))}
    </div>
  );
}

export default function GlobeCenter({ layer, activeDataLayers, onPointClick, target, targetCity }) {
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (target) {
      setScanning(true);
      const t = setTimeout(() => setScanning(false), 3600);
      return () => clearTimeout(t);
    }
  }, [target]);

  const flights   = activeDataLayers.flights  ? MOCK_FLIGHTS   : [];
  const quakes    = activeDataLayers.quakes   ? MOCK_QUAKES    : [];
  const satellites = activeDataLayers.sats   ? MOCK_SATELLITES : [];

  const isCRT = layer === 'crt';

  return (
    <div className={`globe-area layer-${layer}`} style={{
      flex: 1, position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(ellipse at center, #030a14 0%, #000 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        backgroundImage: `
          linear-gradient(rgba(0,229,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,229,255,0.025) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }} />

      {/* The globe */}
      <div className="globe-wrap" style={{
        position: 'relative',
        width: isCRT ? '90vh' : '100%',
        height: isCRT ? '90vh' : '100%',
        maxWidth: isCRT ? '90vh' : undefined,
        borderRadius: isCRT ? '50%' : 0,
        overflow: isCRT ? 'hidden' : 'visible',
        zIndex: 5,
      }}>
        <Globe
          layer={layer}
          flights={flights}
          quakes={quakes}
          satellites={satellites}
          onPointClick={onPointClick}
          targetCity={targetCity}
        />
      </div>

      {/* CRT scope overlay */}
      {isCRT && <ScopeOverlay />}

      {/* HUD corner brackets */}
      {['tl','tr','bl','br'].map(pos => <HUDCorner key={pos} pos={pos} />)}

      {/* Scanning sweep */}
      <ScanningOverlay active={scanning} />

      {/* Coord readout */}
      <AnimatePresence>
        {target && <CoordDisplay target={target} />}
      </AnimatePresence>

      {/* Layer watermark */}
      <div style={{
        position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
        fontFamily: 'var(--display)', fontSize: 7, letterSpacing: 4,
        color: 'rgba(0,229,255,0.3)', pointerEvents: 'none', zIndex: 25,
        whiteSpace: 'nowrap',
      }}>
        {layer === 'nvg' && '● NIGHT VISION // NVG ACTIVE'}
        {layer === 'flir' && '● THERMAL // FLIR ACTIVE'}
        {layer === 'crt' && '● CRT // SURVEILLANCE MODE'}
        {layer === 'ai' && '● AI ENHANCED // NEURAL PROCESSING'}
      </div>

      {/* NVG frame vignette */}
      {layer === 'nvg' && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 19,
          background: 'radial-gradient(circle at center, transparent 45%, rgba(0,0,0,0.85) 70%, #000 90%)',
        }} />
      )}
    </div>
  );
}
