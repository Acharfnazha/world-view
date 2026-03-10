// ── FLIGHTS ──────────────────────────────────────────────────────────────────
export const MOCK_FLIGHTS = [
  { id: "AA471",  lat:  52.5, lng:  -30.2, alt: 38000, spd: 547, from: "JFK", to: "LHR" },
  { id: "LH404",  lat:  54.1, lng:  -20.8, alt: 36500, spd: 531, from: "FRA", to: "ORD" },
  { id: "SQ321",  lat:  28.4, lng:  170.3, alt: 41000, spd: 562, from: "SIN", to: "LAX" },
  { id: "EK225",  lat:  48.7, lng:   25.1, alt: 39000, spd: 548, from: "DXB", to: "BOS" },
  { id: "QF7",    lat:  12.3, lng:  160.4, alt: 43000, spd: 571, from: "SYD", to: "DFW" },
  { id: "UA901",  lat:  48.2, lng: -175.1, alt: 37500, spd: 538, from: "SFO", to: "NRT" },
  { id: "BA177",  lat:  60.1, lng:  -15.3, alt: 35000, spd: 521, from: "LHR", to: "YYZ" },
  { id: "AF447",  lat:   5.2, lng:  -35.7, alt: 40000, spd: 555, from: "CDG", to: "GRU" },
  { id: "DL890",  lat:  35.5, lng:  145.2, alt: 38500, spd: 543, from: "LAX", to: "NRT" },
  { id: "KL702",  lat:  65.3, lng:   45.1, alt: 37000, spd: 529, from: "AMS", to: "HKG" },
  { id: "CX888",  lat:  22.1, lng:  108.4, alt: 39500, spd: 551, from: "HKG", to: "JFK" },
  { id: "TK001",  lat:  45.8, lng:   30.2, alt: 36000, spd: 517, from: "IST", to: "ORD" },
];

// ── EARTHQUAKES ───────────────────────────────────────────────────────────────
export const MOCK_QUAKES = [
  { id: "usp000001", lat: -20.5, lng: -175.3, mag: 6.2, place: "Tonga Region",       depth: 35, time: "14:22", type: "quake" },
  { id: "usp000002", lat:  51.2, lng: -179.1, mag: 4.8, place: "S. of Alaska",       depth: 21, time: "12:57", type: "quake" },
  { id: "usp000003", lat: -15.4, lng:  167.2, mag: 5.4, place: "Vanuatu",            depth: 47, time: "11:33", type: "quake" },
  { id: "usp000004", lat:  37.5, lng: -118.8, mag: 3.9, place: "California",         depth:  9, time: "09:14", type: "quake" },
  { id: "usp000005", lat:  12.3, lng:  124.7, mag: 5.1, place: "Philippines",        depth: 62, time: "08:02", type: "quake" },
  { id: "usp000006", lat:  36.1, lng:  141.5, mag: 5.7, place: "Near Coast of Japan",depth: 38, time: "06:44", type: "quake" },
  { id: "usp000007", lat: -33.5, lng:  -70.2, mag: 4.3, place: "Chile",              depth: 15, time: "04:18", type: "quake" },
];

// ── SATELLITES ────────────────────────────────────────────────────────────────
export const MOCK_SATELLITES = [
  { id: "s01", name: "KH-11 KENNAN",  lat:  34.2, lng:  -80.1, alt:  320, vel: 7.68, inc: 97.9,  status: "ACTIVE",  signal: 94 },
  { id: "s02", name: "LACROSSE-5",    lat:  55.3, lng:   22.4, alt:  680, vel: 7.55, inc: 57.0,  status: "ACTIVE",  signal: 87 },
  { id: "s03", name: "MENTOR-4",      lat:   0.0, lng:   75.0, alt: 35786, vel: 3.07, inc: 3.2,  status: "ACTIVE",  signal: 99 },
  { id: "s04", name: "NRO-L-49",      lat: -12.1, lng: -140.3, alt:  490, vel: 7.60, inc: 98.1,  status: "STANDBY", signal: 71 },
  { id: "s05", name: "MISTY-2",       lat:  67.4, lng:   55.8, alt:  800, vel: 7.46, inc: 64.0,  status: "ACTIVE",  signal: 83 },
  { id: "s06", name: "WGS-10",        lat:   0.0, lng:  171.0, alt: 35786, vel: 3.07, inc: 0.1,  status: "ACTIVE",  signal: 97 },
];

// ── CITIES ────────────────────────────────────────────────────────────────────
export const CITIES = [
  { name: "Austin",        lat:  30.27,  lng: -97.74  },
  { name: "San Francisco", lat:  37.77,  lng: -122.42 },
  { name: "New York",      lat:  40.71,  lng: -74.01  },
  { name: "Tokyo",         lat:  35.68,  lng:  139.69 },
  { name: "London",        lat:  51.51,  lng:   -0.13 },
  { name: "Paris",         lat:  48.86,  lng:    2.35 },
  { name: "Dubai",         lat:  25.20,  lng:   55.27 },
  { name: "Washington DC", lat:  38.91,  lng:  -77.04 },
];

// ── LANDMARKS (for CRT zoom) ──────────────────────────────────────────────────
export const LANDMARKS = [
  { name: "US Capitol",           lat:  38.8899, lng:  -77.0091 },
  { name: "Washington Monument",  lat:  38.8895, lng:  -77.0353 },
  { name: "Lincoln Memorial",     lat:  38.8893, lng:  -77.0502 },
  { name: "Pentagon",             lat:  38.8719, lng:  -77.0563 },
  { name: "Jefferson Memorial",   lat:  38.8814, lng:  -77.0366 },
];

// ── NETWORK PINGS ─────────────────────────────────────────────────────────────
export const NET_SOURCES = [
  "185.220.101.47","91.108.4.29","198.96.155.3","104.244.72.115",
  "185.130.44.108","176.10.104.243","95.142.47.51","192.42.116.16",
];
export const NET_PROTOCOLS = ["TLS 1.3","AES-256","RSA-4096","EC P-384","ChaCha20"];
export const NET_LABELS    = ["EXFIL","RELAY","BEACON","C2","PROBE","HANDSHK","INJECT"];

// ── HELPERS ───────────────────────────────────────────────────────────────────
export const randItem = arr => arr[Math.floor(Math.random() * arr.length)];
export const randInt  = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
export const randHex  = len => Array.from({ length: len }, () =>
  Math.floor(Math.random() * 16).toString(16)).join("").toUpperCase();
