<div align="center">

<img src="https://img.shields.io/badge/ENvirion-Environmental%20Digital%20Twin-16A34A?style=for-the-badge&logo=leaf&logoColor=white" />

# ENVIRION
### AI-Powered Environmental Digital Twin Platform

*Real-time air quality simulation · Urban intervention modeling · Government-grade analytics*

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![MapLibre GL](https://img.shields.io/badge/MapLibre%20GL-3D%20Maps-396CB2?style=flat-square)](https://maplibre.org/)
[![Open-Meteo](https://img.shields.io/badge/Open--Meteo-Live%20AQI-0EA5E9?style=flat-square)](https://open-meteo.com/)

</div>

---

## Table of Contents

- [Overview](#-overview)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [How It Works](#-how-it-works)
- [Interventions](#-interventions)
- [AQI Engine](#-aqi-engine)
- [API & Backend](#-api--backend)
- [Author](#-author)

---

## Overview

**ENVIRION** is a full-stack environmental intelligence platform that transforms real-time air pollution data into interactive 3D urban simulations. It enables municipalities, researchers, and urban planners to model the impact of environmental interventions — before implementing them in the real world.

> *"So, we know that in major cities like Delhi, the Air Quality Index is often in an alarming condition. Existing systems only show numbers — not solutions. ENVIRION changes that."*

**Key Capabilities:**
- Live 3D satellite map with real-time AQI heatmap overlay
- Drag-and-drop environmental intervention simulation
- US-EPA standard AQI calculation engine
- Municipality login system with Supabase authentication
- Save and load simulation scenarios per organization
- Dual-API resilience with automatic failover

---

## Screenshots

### Landing Page — Hero Section
> AI-Powered Environmental Digital Twin with live AQI card preview

![Hero Section](./Screenshot_2026-04-08_002443.png)

---

### About Section — Live AQI Snapshot
> Pollution bar chart, active interventions preview, and platform description

![About Section](./Screenshot_2026-04-08_002830.png)

---

### Analyst Mode — Full Simulation Dashboard
> 3D satellite map with heatmap, left metrics panel, intervention sliders, and drag-to-map deployment

![Analyst Dashboard](./Screenshot__116_.png)

---

### Login Page — Municipality Sign In
> Secure government municipality login to access the environmental intelligence dashboard

![Login Page](./Screenshot_2026-04-08_002750.png)

---

### Register Page — Municipality Registration
> Register your municipal organization to access the simulation platform

![Register Page](./Screenshot_2026-04-08_002631.png)

---

## Features

| Feature | Description |
|---|---|
| **Live AQI Data** | Real-time PM2.5, PM10, CO, NO₂ from Open-Meteo API |
| **3D City Map** | MapLibre GL satellite basemap with 3D building extrusions |
| **Drag & Drop** | Place intervention markers anywhere on the live map |
| **Pollution Heatmap** | Dynamic heatmap responds to interventions in real time |
| **EPA AQI Engine** | Full US-EPA breakpoint calculations for all pollutants |
| **CO₂ Modeling** | Net carbon impact using IPCC CO₂e equivalency factors |
| **Dual-API Failover** | Auto-switches to OpenWeatherMap if primary API fails |
| **Audit Log** | Hash-verified, timestamped log of every API event |
| **Auth System** | Municipality login & registration via Supabase |
| **Save/Load** | Save simulation scenarios and reload across sessions |
| **Global Search** | Search any city on earth via Nominatim/OSM |
| **Negative Stressors** | Model Parali burning & pollution increase scenarios |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | Component-based UI framework |
| **Vite 5** | Lightning-fast build tool & dev server |
| **MapLibre GL JS** | 3D interactive satellite map rendering |
| **React Router v6** | Client-side routing (Home, Analyst, Login, Signup) |
| **Supabase JS Client** | Auth & database from the frontend |
| **CSS Modules** | Scoped component styling |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **Supabase** | Authentication, PostgreSQL database |
| **MongoDB (legacy)** | Previous simulation storage (migrated to Supabase) |
| **JWT** | Secure token-based authentication middleware |

### External APIs & Services
| Service | Purpose |
|---|---|
| **Open-Meteo** | Primary real-time air quality data source |
| **OpenWeatherMap** | Fallback air quality API |
| **MapTiler** | Hybrid satellite map tile provider |
| **Nominatim / OSM** | Location search & geocoding |

### Standards
| Standard | Application |
|---|---|
| **US-EPA AQI Breakpoints** | PM2.5, PM10, CO, NO₂ AQI calculation |
| **IPCC CO₂e Factors** | Carbon equivalent reduction modeling |

---

## Project Structure

```
ENVIRION/
│
├── react-app/                        # Frontend (React + Vite)
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── components/               # Reusable UI Components
│   │   │   ├── About.jsx             # About section with AQI bars
│   │   │   ├── AnalystNav.jsx        # Top navbar for analyst page
│   │   │   ├── AqiScaleBox.jsx       # AQI color scale legend
│   │   │   ├── AuditLogModal.jsx     # API audit log popup
│   │   │   ├── CtaBanner.jsx         # Call-to-action section
│   │   │   ├── Features.jsx          # Platform features grid
│   │   │   ├── Footer.jsx            # Site footer
│   │   │   ├── HeatmapLegend.jsx     # Map heatmap legend
│   │   │   ├── Hero.jsx              # Landing page hero section
│   │   │   ├── HowItWorks.jsx        # Steps methodology section
│   │   │   ├── LeftPanel.jsx         # Analyst left metrics panel
│   │   │   ├── LoadModal.jsx         # Load saved simulations modal
│   │   │   ├── MapView.jsx           # MapLibre GL map wrapper
│   │   │   ├── Navbar.jsx            # Landing page navbar
│   │   │   ├── PartnersStrip.jsx     # Data sources strip
│   │   │   ├── ProtectedRoute.jsx    # Auth-guarded route wrapper
│   │   │   ├── RightPanel.jsx        # Intervention sliders panel
│   │   │   └── SaveButton.jsx        # Save simulation button
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Supabase auth context provider
│   │   │
│   │   ├── lib/
│   │   │   └── supabaseClient.js     # Supabase client initialization
│   │   │
│   │   ├── pages/
│   │   │   ├── Analyst.jsx           # Full analyst simulation page
│   │   │   ├── Home.jsx              # Landing page
│   │   │   ├── Login.jsx             # Municipality login page
│   │   │   └── Signup.jsx            # Municipality registration page
│   │   │
│   │   ├── services/
│   │   │   ├── api.js                # Open-Meteo + OWM API calls
│   │   │   └── backend.js            # Backend REST API calls
│   │   │
│   │   ├── styles/
│   │   │   ├── analyst.css           # Analyst page styles
│   │   │   ├── auth.css              # Login / Register styles
│   │   │   ├── index.css             # Landing page styles
│   │   │   └── shared.css            # CSS variables (shared)
│   │   │
│   │   ├── utils/
│   │   │   ├── aqi.js                # US-EPA AQI calculation engine
│   │   │   └── simulation.js         # Intervention impact calculator
│   │   │
│   │   ├── App.jsx                   # Root app with router setup
│   │   └── main.jsx                  # React entry point
│   │
│   ├── index.html                    # HTML entry point
│   ├── vite.config.js                # Vite configuration
│   ├── package.json                  # Frontend dependencies
│   └── .env                          # Frontend env vars (Supabase keys)
│
├── server/                           # Backend (Node.js + Express)
│   ├── middleware/
│   │   └── auth.js                   # JWT auth middleware
│   ├── models/
│   │   ├── User.js                   # User schema
│   │   └── Simulation.js             # Simulation data schema
│   ├── index.js                      # Express server entry point
│   ├── .env                          # Server env vars (DB, JWT secret)
│   └── node_modules/
│
└── README.md                         # ← You are here
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) v18 or above
- [npm](https://www.npmjs.com/) v9 or above
- A [Supabase](https://supabase.com/) project (free tier works)

---

### 1️ Clone the Repository

```bash
git clone https://github.com/arunsharma30/Envirion.git
cd Envirion
```

---

### 2️ Setup the Frontend

```bash
cd react-app
npm install
```

Create a `.env` file inside `react-app/`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

Frontend runs at → `http://localhost:5173`

---

### 3️ Setup the Backend

```bash
cd ../server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:

```bash
node index.js
```

Backend API runs at → `http://localhost:5000`

---

### 4️ Open the App

Go to `http://localhost:5173` in your browser.

- Register your municipality via **Register Municipality**
- Login with your credentials
- Click **Launch Analyst ↗** to open the simulation dashboard

---

## Environment Variables

### Frontend (`react-app/.env`)

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous public key |
| `VITE_BACKEND_URL` | Backend server URL (default: `http://localhost:5000`) |

### Backend (`server/.env`)

| Variable | Description |
|---|---|
| `PORT` | Port for Express server (default: `5000`) |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (never expose publicly) |
| `JWT_SECRET` | Secret key for JWT token signing |

---

## How It Works

```
Step 1: LIVE DATA INGESTION
  └── Fetches PM2.5, PM10, CO, NO₂ from Open-Meteo API
      └── Automatic failover to OpenWeatherMap if primary fails
      └── Data hash-verified and audit-logged

Step 2: GEOSPATIAL MAPPING
  └── MapLibre GL renders 3D satellite city view
      └── Real building extrusions at zoom level 13+
      └── Dynamic pollution heatmap overlaid on map

Step 3: INTERVENTION SIMULATION
  └── User drags interventions from panel to map
      └── Sliders control adoption percentage (0–100%)
      └── Multiple markers per strategy supported

Step 4: IMPACT PROJECTION
  └── EPA AQI engine recalculates pollution levels
      └── CO₂e reduction computed using IPCC factors
      └── Heatmap updates in real time per intervention
```

---

## Interventions

### Positive Interventions (Pollution Reducers)

| Icon | Name | Impact Type | Max CO₂ Reduction |
|---|---|---|---|
| | Timber Construction | Replaces carbon-heavy concrete | 35% |
| | Green Cement | Low-clinker cement mix | 30% |
| | Retrofit Policy | Renovate instead of demolish | 90% |
| | Public Transit | Shift to light-rail/metro | 50% |
| | EV Adoption | Electrify vehicle fleet | 65% |
| | Urban Greening | Expand tree canopy | 15% |
| | Industrial CCS | Carbon capture on stacks | 75% |

### Negative Interventions (Pollution Stressors)

| Icon | Name | Impact | CO₂ per ton |
|---|---|---|---|
| | Parali Burning | Stubble/crop burning | 1460 kg CO₂/tonne |

---

## AQI Engine

ENVIRION uses the **US-EPA standard breakpoint formula** to compute AQI:

```
AQI = ((I_high - I_low) / (C_high - C_low)) × (C - C_low) + I_low
```

**Pollutants calculated:**

| Pollutant | Unit | Good (0–50) | Hazardous (300+) |
|---|---|---|---|
| PM 2.5 | μg/m³ | 0 – 12 | > 250.5 |
| PM 10 | μg/m³ | 0 – 54 | > 425 |
| CO | μg/m³ | 0 – 4400 | > 30500 |
| NO₂ | μg/m³ | 0 – 53 | > 1250 |

**AQI Categories:**

| Range | Category | Color |
|---|---|---|
| 0 – 50 | Good | 🟢 |
| 51 – 100 | Moderate | 🟡 |
| 101 – 150 | Unhealthy for Sensitive | 🟠 |
| 151 – 200 | Unhealthy | 🔴 |
| 201 – 300 | Very Unhealthy | 🔴 |
| 301 – 500 | Hazardous | 🟤 |

---

## 🔌 API & Backend

### REST Endpoints (Express Server)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | | Register a new municipality |
| `POST` | `/api/auth/login` | | Login and get JWT token |
| `GET` | `/api/simulations` | JWT | Get saved simulations for user |
| `POST` | `/api/simulations` | JWT | Save a new simulation scenario |
| `DELETE` | `/api/simulations/:id` | JWT | Delete a saved simulation |

### External APIs Used

| API | Endpoint |
|---|---|
| Open-Meteo | `https://air-quality-api.open-meteo.com/v1/air-quality` |
| OpenWeatherMap | `https://api.openweathermap.org/data/2.5/air_pollution` |
| MapTiler | `https://api.maptiler.com/maps/hybrid/style.json` |
| Nominatim | `https://nominatim.openstreetmap.org/search` |

---

## Author

**Arun Sharma**
arun.sharma24@pccoepune.org
🔗 [GitHub — arunsharma30](https://github.com/arunsharma30)

> *ENVIRION was built as part of an academic Community Engagement Program project at PCCOE Pune, focusing on environmental digital twin technology for smart city applications.*

---

## License

This project is open-source and available for academic and non-commercial use.

---

<div align="center">

** Built for a cleaner, data-driven future.**

*ENvirion · Environmental Digital Twin · PCCOE Pune · 2025*

</div>
