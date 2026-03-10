import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// We use react-globe.gl which wraps Three.js globe
// Lazy-import to avoid SSR issues
let GlobeGL = null;

const GLOBE_TEXTURE = {
  normal:  'https://unpkg.com/three-globe@2.30.0/example/img/earth-blue-marble.jpg',
  night:   'https://unpkg.com/three-globe@2.30.0/example/img/earth-night.jpg',
  topo:    'https://unpkg.com/three-globe@2.30.0/example/img/earth-topology.png',
};

function GlobeComponent({ layer, flights, quakes, satellites, onCountryClick, targetCity }) {
  const globeRef   = useRef(null);
  const containerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [GlobeLib, setGlobeLib] = useState(null);

  // Dynamically import react-globe.gl
  useEffect(() => {
    import('react-globe.gl').then(m => {
      setGlobeLib(() => m.default || m);
    }).catch(() => {
      console.warn('react-globe.gl not available, using fallback');
    });
  }, []);

  // Fly to city when targetCity changes
  useEffect(() => {
    if (!globeRef.current || !targetCity) return;
    globeRef.current.pointOfView(
      { lat: targetCity.lat, lng: targetCity.lng, altitude: 0.4 },
      1200
    );
  }, [targetCity]);

  // Build point data
  const pointsData = [
    ...flights.map(f => ({ ...f, type: 'flight',    color: '#00e5ff', size: 0.5 })),
    ...quakes.map(q  => ({ ...q, type: 'quake',     color: q.mag > 5 ? '#ff1744' : '#ffb300', size: q.mag * 0.18 })),
    ...satellites.map(s => ({ ...s, type: 'satellite', color: '#39ff14', size: 0.4 })),
  ];

  const texture = ['nvg','flir','arrow'].includes(layer)
    ? GLOBE_TEXTURE.night
    : layer === 'normal'
    ? GLOBE_TEXTURE.normal
    : GLOBE_TEXTURE.topo;

  if (!GlobeLib) {
    return (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--cyan)', fontFamily: 'var(--mono)', fontSize: 11,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="blink" style={{ fontSize: 10, letterSpacing: 2, marginBottom: 8 }}>
            LOADING GLOBE MODULE...
          </div>
          <div style={{ color: 'var(--text-dim)', fontSize: 9 }}>
            run: npm install react-globe.gl
          </div>
        </div>
      </div>
    );
  }

  return (
    <GlobeLib
      ref={globeRef}
      globeImageUrl={texture}
      backgroundColor="rgba(0,0,0,0)"
      atmosphereColor={layer === 'nvg' ? '#39ff14' : '#00e5ff'}
      atmosphereAltitude={0.15}
      pointsData={pointsData}
      pointLat="lat"
      pointLng="lng"
      pointColor="color"
      pointRadius="size"
      pointAltitude={0.005}
      pointResolution={4}
      onPointClick={(point) => onCountryClick && onCountryClick(point)}
      onGlobeClick={({ lat, lng }) => onCountryClick && onCountryClick({ lat, lng, type: 'geo' })}
      width={containerRef.current?.offsetWidth}
      height={containerRef.current?.offsetHeight}
    />
  );
}

// ── Fallback SVG Globe (always works, no npm needed) ───────────────────────────
function SVGGlobe({ layer, flights, quakes, satellites, onPointClick }) {
  const W = 600, H = 600, CX = 300, CY = 300, R = 260;

  const project = (lat, lng) => {
    const phi   = (90 - lat) * Math.PI / 180;
    const theta = (lng + 180) * Math.PI / 180;
    const x = CX + R * Math.sin(phi) * Math.cos(theta);
    const y = CY - R * Math.cos(phi);
    const visible = Math.sin(phi) * Math.cos(theta) > 0;
    return { x, y, visible };
  };

  const graticules = [];
  for (let lat = -90; lat <= 90; lat += 30) {
    const pts = [];
    for (let lng = -180; lng <= 180; lng += 5) {
      const p = project(lat, lng);
      pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
    }
    graticules.push(pts.join(' '));
  }
  for (let lng = -180; lng <= 180; lng += 30) {
    const pts = [];
    for (let lat = -90; lat <= 90; lat += 5) {
      const p = project(lat, lng);
      pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
    }
    graticules.push(pts.join(' '));
  }

  const landColor   = { normal:'#0d2035', nvg:'#003300', flir:'#330000', crt:'#0a1a28', arrow:'#111', ai:'#0a0020' }[layer] || '#0d2035';
  const gridColor   = { normal:'rgba(0,229,255,0.12)', nvg:'rgba(57,255,20,0.15)', flir:'rgba(255,50,0,0.15)', crt:'rgba(0,229,255,0.2)' }[layer] || 'rgba(0,229,255,0.12)';
  const glowColor   = { normal:'#00e5ff', nvg:'#39ff14', flir:'#ff3300', crt:'#00e5ff' }[layer] || '#00e5ff';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ display:'block' }}>
      <defs>
        <radialGradient id="globeGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor={landColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor="#000" stopOpacity="1" />
        </radialGradient>
        <radialGradient id="atmosGrad" cx="50%" cy="50%" r="50%">
          <stop offset="80%" stopColor="transparent" />
          <stop offset="100%" stopColor={glowColor} stopOpacity="0.12" />
        </radialGradient>
        <clipPath id="globeClip">
          <circle cx={CX} cy={CY} r={R} />
        </clipPath>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Base sphere */}
      <circle cx={CX} cy={CY} r={R} fill="url(#globeGrad)" />

      {/* Simplified continents (approximate shapes) */}
      <g clipPath="url(#globeClip)" opacity="0.6">
        {/* North America */}
        {(() => {
          const pts = [[70,-160],[72,-140],[68,-120],[60,-110],[55,-100],[50,-85],[45,-75],[40,-70],[35,-75],[30,-80],[25,-80],[22,-85],[20,-90],[22,-105],[28,-110],[35,-120],[40,-124],[50,-125],[55,-130],[60,-140],[65,-150],[70,-160]];
          const projected = pts.map(([la,lo]) => project(la,lo)).filter(p=>p.visible);
          return projected.length > 3 ? <polygon points={projected.map(p=>`${p.x.toFixed(0)},${p.y.toFixed(0)}`).join(' ')} fill={landColor} stroke={gridColor} strokeWidth="0.5"/> : null;
        })()}
        {/* South America */}
        {(() => {
          const pts = [[12,-72],[8,-60],[5,-52],[0,-50],[-5,-35],[-10,-37],[-20,-40],[-30,-50],[-40,-62],[-50,-68],[-55,-65],[-40,-58],[-25,-48],[-15,-39],[-5,-35],[5,-52],[8,-60],[12,-72]];
          const projected = pts.map(([la,lo]) => project(la,lo)).filter(p=>p.visible);
          return projected.length > 3 ? <polygon points={projected.map(p=>`${p.x.toFixed(0)},${p.y.toFixed(0)}`).join(' ')} fill={landColor} stroke={gridColor} strokeWidth="0.5"/> : null;
        })()}
        {/* Europe */}
        {(() => {
          const pts = [[71,28],[70,15],[60,5],[50,2],[43,5],[36,10],[36,28],[45,35],[55,37],[60,30],[65,25],[71,28]];
          const projected = pts.map(([la,lo]) => project(la,lo)).filter(p=>p.visible);
          return projected.length > 3 ? <polygon points={projected.map(p=>`${p.x.toFixed(0)},${p.y.toFixed(0)}`).join(' ')} fill={landColor} stroke={gridColor} strokeWidth="0.5"/> : null;
        })()}
        {/* Africa */}
        {(() => {
          const pts = [[37,10],[30,32],[20,38],[10,42],[0,42],[-10,40],[-20,35],[-30,30],[-35,20],[-35,18],[-22,14],[-10,13],[0,2],[10,-5],[20,-17],[20,33],[30,32],[37,10]];
          const projected = pts.map(([la,lo]) => project(la,lo)).filter(p=>p.visible);
          return projected.length > 3 ? <polygon points={projected.map(p=>`${p.x.toFixed(0)},${p.y.toFixed(0)}`).join(' ')} fill={landColor} stroke={gridColor} strokeWidth="0.5"/> : null;
        })()}
        {/* Asia */}
        {(() => {
          const pts = [[70,30],[60,60],[50,80],[40,70],[30,60],[20,60],[20,80],[30,90],[25,100],[20,110],[30,120],[40,140],[50,140],[60,120],[70,100],[75,80],[80,60],[70,30]];
          const projected = pts.map(([la,lo]) => project(la,lo)).filter(p=>p.visible);
          return projected.length > 3 ? <polygon points={projected.map(p=>`${p.x.toFixed(0)},${p.y.toFixed(0)}`).join(' ')} fill={landColor} stroke={gridColor} strokeWidth="0.5"/> : null;
        })()}
        {/* Australia */}
        {(() => {
          const pts = [[-15,130],[-20,125],[-30,115],[-35,117],[-35,137],[-32,137],[-28,153],[-20,149],[-15,142],[-12,136],[-15,130]];
          const projected = pts.map(([la,lo]) => project(la,lo)).filter(p=>p.visible);
          return projected.length > 3 ? <polygon points={projected.map(p=>`${p.x.toFixed(0)},${p.y.toFixed(0)}`).join(' ')} fill={landColor} stroke={gridColor} strokeWidth="0.5"/> : null;
        })()}
      </g>

      {/* Graticule grid */}
      {graticules.map((pts, i) => (
        <polyline key={i} points={pts} fill="none"
          stroke={gridColor} strokeWidth="0.4"
          clipPath="url(#globeClip)" />
      ))}

      {/* Atmosphere glow */}
      <circle cx={CX} cy={CY} r={R} fill="url(#atmosGrad)" />
      <circle cx={CX} cy={CY} r={R + 2} fill="none"
        stroke={glowColor} strokeWidth="2" opacity="0.3"
        style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }} />

      {/* Flight markers */}
      {flights.map(f => {
        const p = project(f.lat, f.lng);
        if (!p.visible) return null;
        return (
          <g key={f.id} onClick={() => onPointClick(f)} style={{ cursor: 'crosshair' }}>
            <circle cx={p.x} cy={p.y} r={4} fill={glowColor} opacity={0.85}
              filter="url(#glow)">
              <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
            </circle>
            <text x={p.x + 6} y={p.y + 3}
              style={{ fontFamily: 'var(--mono)', fontSize: 7, fill: glowColor, fillOpacity: 0.7 }}>
              {f.id}
            </text>
          </g>
        );
      })}

      {/* Quake markers */}
      {quakes.map(q => {
        const p = project(q.lat, q.lng);
        if (!p.visible) return null;
        const color = q.mag > 5 ? '#ff1744' : '#ffb300';
        return (
          <g key={q.id} onClick={() => onPointClick(q)} style={{ cursor: 'crosshair' }}>
            <circle cx={p.x} cy={p.y} r={q.mag * 2.5} fill="none" stroke={color} strokeWidth="0.8" opacity="0.6">
              <animate attributeName="r" values={`${q.mag};${q.mag*3};${q.mag}`} dur="3s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx={p.x} cy={p.y} r="2.5" fill={color} filter="url(#glow)" />
          </g>
        );
      })}

      {/* Satellite markers */}
      {satellites.map(s => {
        const p = project(s.lat, s.lng);
        if (!p.visible) return null;
        return (
          <g key={s.id} onClick={() => onPointClick(s)} style={{ cursor: 'crosshair' }}>
            <rect x={p.x-3} y={p.y-3} width={6} height={6}
              fill="none" stroke="#39ff14" strokeWidth="0.8"
              transform={`rotate(45 ${p.x} ${p.y})`}
              filter="url(#glow)" />
            <text x={p.x + 7} y={p.y + 3}
              style={{ fontFamily: 'var(--mono)', fontSize: 6, fill: '#39ff14', fillOpacity: 0.7 }}>
              {s.name.split(' ')[0]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Exported Globe wrapper ─────────────────────────────────────────────────────
export default function Globe({ layer, flights, quakes, satellites, onPointClick, targetCity, activeLandmarks }) {
  return (
    <SVGGlobe
      layer={layer}
      flights={flights}
      quakes={quakes}
      satellites={satellites}
      onPointClick={onPointClick}
    />
  );
}
