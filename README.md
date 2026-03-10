# 🌍 WORLDVIEW — Global Intelligence Command Console

A cinematic intelligence OS dashboard inspired by the video reference — featuring a 3D globe, layer modes (CRT, NVG, FLIR, AI), real-time mock data, and full tactical HUD aesthetics.

---

## 🚀 How to Run (Step-by-Step)

### Prerequisites
- **Node.js** (v16 or newer) — download from https://nodejs.org
- **npm** (comes with Node.js)

### 1. Install Dependencies

Open your terminal in the `worldview/` folder and run:

```bash
npm install
```

This installs React, Framer Motion, and all dependencies. Takes ~1-2 minutes.

### 2. Start the App

```bash
npm start

```

Your browser will automatically open to **http://localhost:3000**

That's it! 🎉

---

## 📁 File Structure

```
worldview/
├── public/
│   └── index.html              # HTML shell + Google Fonts
│
├── src/
│   ├── index.js                # React entry point
│   ├── App.js                  # 🔑 Main orchestrator + boot sequence
│   │
│   ├── styles/
│   │   └── global.css          # All CSS: CRT, NVG, FLIR, glow effects, animations
│   │
│   ├── data/
│   │   └── mockData.js         # Flights, quakes, satellites, cities mock data
│   │
│   └── components/
│       ├── TopBar.js           # WORLDVIEW header + UTC clock
│       ├── LeftPanel.js        # Data layer toggles (flights, quakes, sats...)
│       ├── GlobeCenter.js      # Globe wrapper + HUD overlays + scanning effects
│       ├── Globe.js            # SVG globe with projected markers
│       ├── RightPanel.js       # Tactical controls, sliders, orbital readouts
│       └── BottomBar.js        # City tabs + layer switcher (Normal/CRT/NVG/FLIR/AI)
│
└── package.json
```

---

## 🎮 How to Use

### Layer Modes (Bottom Bar)
| Button | Effect |
|--------|--------|
| **Normal** | Standard blue earth view |
| **CRT** | Circular telescope scope, surveillance mode |
| **NVG** | Green phosphor night vision (FLIR-style) |
| **FLIR** | Thermal infrared simulation |
| **Arrow** | High-contrast grayscale |
| **AI** | Neural-enhanced purple tint |
| **None** | Clean view |

### Interactions
- **Bottom city buttons** → Fly to that city, sets target intel
- **Globe markers** → Click flights (✈), quakes (⚡), or satellites (◈) to lock target
- **Left panel toggles** → Turn data layers on/off
- **Right panel sliders** → Adjust alert/event filters + image processing

### Data Panels
- **Left panel** — Live Flights, Earthquakes, Satellites, Street Traffic, Weather Radar, CCTV Mesh
- **Right panel** — REC timer, orbital readouts (GSD, ALT, velocity), target lock coordinates
- **Bottom ticker** — Scrolling classified intel feed

---

## 🔌 Adding Real Data (Optional Upgrades)

### Real Flights — OpenSky Network (Free, No Key)
```js
// In src/data/mockData.js, replace MOCK_FLIGHTS fetch:
const res = await fetch('https://opensky-network.org/api/states/all');
const data = await res.json();
const flights = data.states.slice(0, 50).map(s => ({
  id: s[1]?.trim() || 'UNKN',
  lat: s[6], lng: s[5], alt: s[7] * 3.28, // meters to feet
  spd: s[9] * 1.944, // m/s to knots
}));
```

### Real Earthquakes — USGS (Free, No Key)
```js
// In src/data/mockData.js:
const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson');
const data = await res.json();
const quakes = data.features.map(f => ({
  id: f.id,
  lat: f.geometry.coordinates[1],
  lng: f.geometry.coordinates[0],
  mag: f.properties.mag,
  place: f.properties.place,
  depth: f.geometry.coordinates[2],
}));
```

### Real 3D Globe — react-globe.gl (Optional, looks amazing)
```bash
npm install react-globe.gl
```
Then in `Globe.js`, uncomment the `GlobeComponent` and it will use Three.js 3D globe automatically.

### Mapbox Satellite Imagery
1. Sign up at https://mapbox.com (free tier: 50k map loads/month)
2. Get your access token
3. Replace the SVG globe with a Mapbox GL JS component:
```bash
npm install react-map-gl mapbox-gl
```

---

## 🎨 Customization

### Change the Color Scheme
Edit `src/styles/global.css` root variables:
```css
:root {
  --cyan:   #00e5ff;  /* Main accent */
  --amber:  #ffb300;  /* Warning/alert */
  --red:    #ff1744;  /* Critical */
  --green:  #00e676;  /* Nominal/OK */
}
```

### Add New Cities
Edit `src/data/mockData.js`:
```js
export const CITIES = [
  { name: "Your City", lat: 40.71, lng: -74.01 },
  // ...
];
```

### Add New Layer Modes
In `src/styles/global.css`:
```css
.layer-yourmode .globe-wrap {
  filter: /* your CSS filter here */;
}
```
Then add the button in `src/components/BottomBar.js`.

---

## 🛠 Troubleshooting

| Problem | Solution |
|---------|----------|
| `npm install` fails | Make sure Node.js 16+ is installed: `node --version` |
| Blank screen | Check browser console (F12) for errors |
| Globe not loading | The SVG globe works offline; for 3D globe run `npm install react-globe.gl` |
| Fonts not loading | App works offline but fonts need internet; fallback is monospace |
| Port 3000 in use | Run `PORT=3001 npm start` |

---

## 📦 Build for Production

```bash
npm run build
```

Creates optimized files in `build/` folder. Deploy to any static host (Vercel, Netlify, GitHub Pages).

---

## Tech Stack

- **React 18** — UI framework
- **Framer Motion** — Animations and transitions
- **CSS3** — CRT/NVG/FLIR filter effects, scanlines, glow
- **SVG** — Custom globe projection (orthographic)
- **Google Fonts** — Orbitron, Share Tech Mono, Rajdhani

---

*Classification: TOP SECRET // TS-TK // NOFORN*


## Note
If you run into Three.js module export errors, reinstall dependencies after updating `three`.
