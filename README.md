<div align="center">

# 🌧️ VARSHANET 2.0
### National Weather Big Data Analytics, Multi-Modal AI Verification & Disaster Impact Grid

<p align="center">
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Frontend-React%2018%20%2B%20TS-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Build-Vite%208-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/AI-PyTorch%20%2B%20Transformers-EE4C2C?style=flat-square&logo=pytorch&logoColor=white" alt="PyTorch" />
  <img src="https://img.shields.io/badge/GenAI-Google%20Gemini-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/GIS-Leaflet%20%2B%20ESRI-199900?style=flat-square&logo=leaflet&logoColor=white" alt="Leaflet" />
  <img src="https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Streaming-Native%20WebSockets-010101?style=flat-square&logo=socketdotio&logoColor=white" alt="WebSockets" />
  <img src="https://img.shields.io/badge/Coverage-36%20States%20%26%20UTs-FF9933?style=flat-square" alt="Pan-India Coverage" />
  <img src="https://img.shields.io/badge/Deployment-Render-46E3B7?style=flat-square&logo=render&logoColor=white" alt="Render" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="MIT License" />
</p>

<p align="center">
  <b>A unified disaster intelligence grid uniting 33 IMD Doppler Weather Radars, INSAT-3DR Satellites, CWC Flood Telemetry, and VayuScore™ Multi-Modal AI Ground Verification across all 36 Indian States and Union Territories into automated NDRF Convoy Routing & OASIS CAP 1.2 Cell Alerting.</b>
</p>

<p align="center">
  <a href="#-prototype-at-a-glance">⚡ <b>Highlights</b></a> •
  <a href="#-key-highlights--operational-capabilities">✨ <b>Features</b></a> •
  <a href="#-multimodal-ai-pipelines-architecture">🧠 <b>AI Architecture</b></a> •
  <a href="#-technology-stack">🛠️ <b>Tech Stack</b></a> •
  <a href="#-local-setup--installation-guide">🚀 <b>Quickstart</b></a> •
  <a href="#-rest-api--websocket-documentation">📖 <b>API Docs</b></a>
</p>

</div>

---

### ⚡ Prototype at a Glance

| 🛰️ **33** IMD Radar Feeds | 🇮🇳 **All 36** Indian States & UTs | 🏆 **VayuScore™ (0-100)** | ⚡ **<50ms** WebSocket Streaming |
| :---: | :---: | :---: | :---: |
| 🛡️ **16** NDRF Battalions | 🧠 **Dual ML** (Vision + NLP) | 🚨 **1-Click** CAP 1.2 XML | 📄 **1-Click** NDMA SitRep PDF |
| 🏷️ **AI Hashtags** (#IMD Fallback) | ⏱️ **6-Hour** Data Freshness | 🔄 **5-Min** News Auto-Sync | 🗺️ **Google Street View** Ground Pin |

---

## 📌 Table of Contents
1. [Platform Overview](#-platform-overview)
2. [Key Highlights & Operational Capabilities](#-key-highlights--operational-capabilities)
3. [Multi-Modal AI Pipelines Architecture](#-multimodal-ai-pipelines-architecture)
4. [Interactive Navigation & Operational Suite](#-interactive-navigation--operational-suite)
5. [Technology Stack](#-technology-stack)
6. [Repository & Directory Structure](#-repository--directory-structure)
7. [Local Setup & Installation Guide](#-local-setup--installation-guide)
8. [Configuration & Environment Variables (.env)](#-configuration--environment-variables-env)
9. [REST API & WebSocket Documentation](#-rest-api--websocket-documentation)
10. [Deployment (Render & Cloud Platforms)](#-deployment-render--cloud-platforms)
11. [License](#-license)

---

## 🌧️ Platform Overview

**VARSHANET 2.0** is an enterprise-grade National Weather Big Data Analytics, Real-Time AI Verification, and Disaster Nowcasting Grid engineered specifically for India.

It continuously ingests real-time observations across **IMD Doppler Weather Radars (DWR)**, **INSAT-3DR/3DS Satellite Multi-Spectral Imagers**, **Multi-Channel Indian News Streams** (*Times of India, NDTV, India Today, Down To Earth, Google News*), **Social Media Firehose Streams** (*#IMD, #MumbaiRains, #DelhiWeather, #FloodAlert*), **Central Water Commission (CWC) River Flood Gauges**, and **Citizen Geotagged Ground Proofs**.

VARSHANET transforms raw multispectral and citizen telemetry into life-safety intelligence:
* **VayuScore™ (0–100)**: Multi-modal composite confidence metric fusing 5 independent verification vectors.
* **TextGuard Multilingual NLP**: Real-time disaster threat detection with instant visual feedback across English, Hindi, and Hinglish.
* **VisionGuard Forensics**: Dual-stage binary PyTorch disaster classification + Perceptual DHash deduplication + HSV turbidity checks.
* **Automated AI Hashtags**: Live categorization under #Monsoon2026, #MumbaiRains, #DelhiWeather, #Cloudburst, #FloodAlert, #HeatwaveWarning, #CycloneAlert, and fallback #IMD.
* **Pan-India Coverage**: Seamless tactical navigation and nowcasting across all **36 Indian States and Union Territories**.
* **NDRF Tactical Routing**: Dynamic .22\times$ flood-aware convoy rerouting avoiding inundated highways and submerged bridges.

`
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 VARSHANET CLOSED LOOP                                   │
└─────────────────────────────────────────────────────────────────────────────────────────┘
   [IMD Radar / INSAT Sat]     [News / Social Streams]     [Citizen 3-Media Proofs]
              │                           │                           │
              ▼                           ▼                           ▼
┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
│ 33 Doppler Radar Sweeps │ │ Automated AI Hashtags   │ │ VisionGuard Forensics   │
│ & 3-Hr Optical Flow     │ │ (#FloodAlert, #IMD...)  │ │ + TextGuard NLP Engine  │
└─────────────────────────┘ └─────────────────────────┘ └─────────────────────────┘
              │                           │                           │
              └───────────────────────────┼───────────────────────────┘
                                          ▼
                      ┌───────────────────────────────────────┐
                      │ Spatiotemporal Clustering & VayuScore │
                      │  (0-100 Composite Confidence Metric)  │
                      └───────────────────────────────────────┘
                                          │
                                          ▼
                      ┌───────────────────────────────────────┐
                      │ Leaflet National GIS & Admin Verify   │
                      │  (🛡️ Verified Pins + Street View)     │
                      └───────────────────────────────────────┘
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   ▼                                             ▼
┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐
│  16 NDRF Battalions Convoy Routing   │     │  OASIS CAP 1.2 XML & NDMA SitRep     │
│  (Graph Detour Avoiding Inundation)  │     │  (Cell Siren Broadcast & PDF Export) │
└──────────────────────────────────────┘     └──────────────────────────────────────┘
`

---

## ⚡ Key Highlights & Operational Capabilities

### 1. 🇮🇳 Complete Coverage of All 36 Indian States & Union Territories
* Full interactive support for **all 28 States and 8 Union Territories**:
  * **28 States**: *Andhra Pradesh, Arunachal Pradesh, Assam, Bihar, Chhattisgarh, Goa, Gujarat, Haryana, Himachal Pradesh, Jharkhand, Karnataka, Kerala, Madhya Pradesh, Maharashtra, Manipur, Meghalaya, Mizoram, Nagaland, Odisha, Punjab, Rajasthan, Sikkim, Tamil Nadu, Telangana, Tripura, Uttar Pradesh, Uttarakhand, West Bengal.*
  * **8 UTs**: *Andaman and Nicobar Islands, Chandigarh, Dadra and Nagar Haveli and Daman and Diu, Delhi (NCR), Jammu and Kashmir, Ladakh, Lakshadweep, Puducherry.*
* **Tactical Camera Jump (lyTo)**: Selecting any State/UT in the National Weather Map smoothly re-centers and zooms the viewport directly onto that territory while dynamically filtering incident clusters and verified ground pins.
* **Backend Geo-Resolver**: indian_geo_resolver.py resolves city landmarks, union territories, and districts into verified GPS coordinates.

### 2. 🧠 Real-Time NLP Threat Color Feedback (Green: Disaster | Red: Normal)
* **TextGuard Multilingual NLP Engine** analyzes incoming observations in real-time as the citizen or reporter types:
  * **Disaster Threat Detected $\rightarrow$ Green (emerald)**:
    * Textarea outline: order-emerald-500/80 with emerald focus ring.
    * Real-time threat card: g-emerald-950/60 border-emerald-600/70 text-emerald-100.
    * Badge: g-emerald-900/80 text-emerald-200 border-emerald-700 (🚨 Disaster Threat Detected).
  * **Non-Disaster / Normal Text $\rightarrow$ Red (ose)**:
    * Textarea outline: order-rose-500/80 with rose focus ring.
    * Real-time card: g-rose-950/60 border-rose-600/70 text-rose-100.
    * Badge: g-rose-900/80 text-rose-200 border-rose-700 (❌ Non-Disaster / Normal Text).
* Grounded with hybrid NLP: Fine-tuned DistilBERT / Scikit-Learn TF-IDF classifier calibrated with English, Hindi, and Hinglish emergency lexicons.

### 3. 🏷️ Automated AI Hashtag Categorizer with #IMD Fallback
* Every ingested observation is automatically classified into trending meteorological categories:
  * **#Monsoon2026**: Monsoon surge, seasonal rainfall, southwest/northeast monsoon currents.
  * **#MumbaiRains**: Mumbai, MMR, Thane, Navi Mumbai, Santacruz rainfall and local inundation.
  * **#DelhiWeather**: Delhi NCR, Safdarjung, Palam, Yamuna flood levels, dense smog/fog.
  * **#Cloudburst**: Localized extreme deluges, flash runoffs, and mountain slope failures.
  * **#FloodAlert**: Urban waterlogging, river flood basins, dam discharges, rising waters.
  * **#HeatwaveWarning**: Severe heatwaves, loo winds, extreme temperatures ($\ge 40^\circ\text{C}$).
  * **#CycloneAlert**: Depressions, cyclonic storms, gale warnings, coastal landfall cones.
  * **#IMD (Official Meteorological Fallback)**: Any observation outside the 7 specific categories automatically defaults to #IMD.
* **Interactive Hashtags Filter Bar**: 1-click filtering by any trending tag with active toggle and #All reset button.

### 4. 🛡️ Admin Verification & Live Map Pinning with Google Street View
* Reports verified by emergency command admins immediately transform into interactive verified pins on the National Weather Map.
* **Animated Pulsing Emerald Shield Marker (🛡️)** renders at the verified GPS location.
* **Interactive Ground Popup**: Displays the AI-assigned incident category, credibility trust percentage ($\ge 95\%$), observation text, author attribution, and direct **Google Street View** integration for instant visual ground verification.

### 5. 📅 Fully Functional Date & Status Filters
* **Date Filter**:
  * **Today**: Real-time matching for today's calendar date and current 24-hour cycle.
  * **Past 24 Hours**: Instant filtering of reports from the preceding 24 hours.
  * **Past 7 Days**: Comprehensive weekly review.
  * **All Dates**: Access to all historical and real-time records.
  * Handled via cross-platform ISO-8601 parsing resilient to SQLite datetimes and timezone skews.
* **Clean Operational Status Filtering**:
  * Removed unverified noise (UNVERIFIED), pending reviews (REQUIRES_REVIEW), and misleading flags (LIKELY_MISLEADING) from the operational reports view.
  * Clean filtering between:
    * **All Verification States**
    * **Verified Official**
    * **Likely Authentic**

### 6. 🚒 Flood-Aware 16 NDRF Battalion Tactical Routing
* Direct integration of all **16 official NDRF Battalions** (*Guwahati, Kolkata, Cuttack, Arakkonam, Pune, Vadodara, Bhatinda, Ghaziabad, Patna, Vijayawada, Varanasi, Itanagar, Ludhiana, Jasur, Srinagar, Bhopal*).
* Dynamic graph routing applies a **.22\times$ detour factor** during flood events, automatically routing convoys away from submerged bridges and waterlogged underpasses.
* 1-click **Official Requisition Order Generator** formatted for immediate administrative dispatch.

---

## 🧠 Multi-Modal AI Pipelines Architecture

VARSHANET employs two distinct, specialized machine learning pipelines that operate in parallel to verify every piece of multi-modal ground evidence without altering pre-trained weights:

`
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      VARSHANET DUAL MULTI-MODAL ML PIPELINES                    │
└─────────────────────────────────────────────────────────────────────────────────┘

[ PIPELINE A: IMAGE VISIONGUARD ]              [ PIPELINE B: TEXTGUARD NLP ]
      Uploaded Photo / Video                        Observation Description
                │                                              │
                ▼                                              ▼
    Image Normalization (224x224)                  Multilingual Text Cleaner
  RGB Normalization (ImageNet stats)             (English / Hindi / Hinglish)
                │                                              │
                ▼                                              ▼
┌───────────────────────────────┐              ┌───────────────────────────────┐
│ 1. PyTorch CNN Classifier     │              │ 1. Fine-Tuned DistilBERT /    │
│    (Custom ResNet-based       │              │    TF-IDF Scikit-Learn Model  │
│    disaster binary classifier)│              │    (Trained on disaster msgs) │
└───────────────────────────────┘              └───────────────────────────────┘
                │                                              │
                ▼                                              ▼
┌───────────────────────────────┐              ┌───────────────────────────────┐
│ 2. Optical Forensics Layer    │              │ 2. Keyword Grounding & Prior  │
│    - 64-bit Perceptual DHash  │              │    Calibration Layer          │
│    - HSV Color Turbidity Check│              │    - Disaster keywords boost  │
│    - Duplicate Quarantining   │              │    - Non-hazard attenuation   │
└───────────────────────────────┘              └───────────────────────────────┘
                │                                              │
                ▼                                              ▼
     Visual Verdict Output                          Real-Time NLP Threat Verdict
  • Authenticity Score (0-100%)                  • Threat Probability (0-100%)
  • Disaster Signature Verified                  • Green: Disaster Threat
  • Fake / Meme Rejection (<20%)                 • Red: Non-Disaster / Normal
`

---

## 🧭 Interactive Navigation & Operational Suite

The platform's operational tabs are ordered logically for emergency triage:

`
Overview ➔ Reports ➔ Map ➔ Incident Room ➔ Events ➔ Analytics
`

1. **Overview** (DashboardPage.tsx): High-level operational metrics, live observation cards, and active weather summaries.
2. **Reports** (ReportsPage.tsx / ReportTable.tsx): Real-time observation tabular feed, dynamic AI hashtag bar, date-wise filter, and verified status selectors.
3. **Map** (MapPage.tsx / IndiaWeatherMap.tsx): Leaflet/ESRI interactive GIS with 33 Doppler radars, NDRF battalions, CWC river flood polylines, cyclone cones, and 🛡️ verified reports.
4. **Incident Room** (IncidentCommandRoomPage.tsx): Incident deep-dive, 16 NDRF battalion convoy requisition, 2-photo evidence lightbox, and NDMA SitRep generator.
5. **Events** (EventsPage.tsx): Active spatiotemporal event clusters grouped by geographic proximity.
6. **Analytics** (AnalyticsPage.tsx): Interactive Big Data SQL query runner, VayuScore™ composite scorecard, and public sentiment panic index.
7. **Citizen Portal** (CitizenPage.tsx): Citizen hazard reporting with drag-and-drop 3-photo proof, real-time Green/Red NLP threat feedback, and ticket tracking.
8. **Admin Ops** (AdminPage.tsx): 100% pre-verified official incident publisher, verification queue, and distributed system health diagnostics.

---

## 🛠️ Technology Stack

| Domain | Technologies & Libraries |
| :--- | :--- |
| **Frontend UI** | **React 18**, **TypeScript**, **Vite 8**, **TailwindCSS 3.4**, **Lucide React Icons**, **Axios** |
| **GIS & Mapping** | **Leaflet 1.9**, **React-Leaflet**, **ESRI World Imagery**, **OpenStreetMap GeoJSON** |
| **Backend & APIs** | **FastAPI (Python 3.10+)**, **Uvicorn ASGI**, **Native WebSockets**, **Pydantic v2** |
| **Database & Spatial** | **SQLAlchemy 2.0**, **SQLite / PostgreSQL**, **R-Tree Spatial Indexing**, **In-Console SQL Runner** |
| **Routing Engine** | **Graph Detour Engine (pgRouting / OSRM)**, **CWC Gauge Detour Modeler** |
| **ML & Vision** | **PyTorch 2.9**, **HuggingFace Transformers (DistilBERT)**, **Scikit-Learn**, **ImageHash (DHash)** |
| **GenAI & Reasoning** | **Google Gemini 2.5 Flash**, **Firebase AI Logic SDK** |
| **Standards Compliance** | **OASIS Common Alerting Protocol (CAP 1.2 XML)**, **NDMA SitRep SOPs** |

---

## 📁 Repository & Directory Structure

`
varshanet/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI server entrypoint & WebSocket routes
│   │   ├── api/v1/
│   │   │   ├── reports.py              # Ingested reports & admin-publish
│   │   │   ├── events.py               # Spatiotemporal event clustering
│   │   │   ├── impact.py               # AI nowcasting, exposure buffers & verified photos
│   │   │   ├── alerts.py               # Emergency warnings & CAP 1.2 broadcasting
│   │   │   ├── meteorology.py          # 33 DWR Radars, INSAT-3DR, CPI, WBGT
│   │   │   ├── analytics.py            # Big Data SQL Runner, VayuScore, Sentiment Panic
│   │   │   ├── verification.py         # Admin verification action & AI auto-categorization
│   │   │   ├── media.py                # Media forensics & real-time text analysis
│   │   │   └── system.py               # Distributed pipeline health & telemetry
│   │   ├── models/models.py            # SQLAlchemy database models
│   │   └── core/
│   │       ├── database.py             # Database engine & session management
│   │       └── init_db.py              # Database seeding & timestamp roll-forward
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/                  # Admin dispatch form & verification queue
│   │   │   ├── analytics/              # SQL Console, VayuScore Card, Public Sentiment
│   │   │   ├── citizen/                # Citizen form with Green/Red NLP & 3-photo upload
│   │   │   ├── common/                 # Navbar (Overview -> Reports -> Map...), Alert Ticker
│   │   │   ├── incident/               # 16 NDRF Routing, Verified Ground Evidence Gallery
│   │   │   ├── map/                    # IndiaWeatherMap with 36 States/UTs, DWR, Verified pins
│   │   │   ├── reports/                # ReportTable with date & status filter, hashtags bar
│   │   │   └── ml/                     # ML Architecture Diagrams & Forensics Inspector
│   │   ├── pages/                      # Dashboard, Incident Room, Map, Reports, Analytics...
│   │   ├── services/api.ts             # Axios API client & endpoints
│   │   └── types/
│   │       ├── index.ts                # TypeScript interface definitions
│   │       └── states.ts               # All 36 Indian States & UTs with coordinates
├── processing/
│   ├── nlp/
│   │   ├── hashtag_categorizer.py      # AI trending weather hashtag categorizer (#IMD)
│   │   ├── text_analyzer.py            # Multilingual disaster text threat classifier
│   │   └── text_classifier.joblib      # Trained ML text model
│   ├── vision/                         # Perceptual DHash & HSV color forensics
│   ├── geolocation/
│   │   └── indian_geo_resolver.py      # Indian geographic resolver for all 36 States/UTs
│   └── pipeline.py                     # Processing pipeline with automated categorization
├── ingestion/
│   └── automation/
│       └── live_ingestion_service.py   # Multi-channel auto-ingestion service
├── render.yaml                         # Production Render deployment configuration
├── requirements.txt                    # Backend Python dependencies
└── README.md                           # System documentation
`

---

## 🚀 Local Setup & Installation Guide

### Prerequisites
* **Python 3.10+**
* **Node.js 18+ & npm**
* **Git**

### 1. Clone Repository
`ash
git clone https://github.com/Himarghya/SIH-26069-VARSHANET-Team_TechTonic.git
cd SIH-26069-VARSHANET-Team_TechTonic
`

### 2. Backend Setup
`ash
# Create and activate virtual environment
python -m venv venv

# Windows:
.\venv\Scripts\Activate.ps1
# Linux / macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI backend server
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
`
API runs at http://localhost:8000 (Interactive Docs: http://localhost:8000/docs).

### 3. Frontend Setup
`ash
# In a new terminal window:
cd frontend

# Install npm dependencies
npm install

# Start Vite development server
npm run dev
`
Frontend runs at http://localhost:5173.

---

## 🔒 Configuration & Environment Variables (.env)

Create a .env file in the root directory:
`env
# Google Gemini API Key (for LLM reasoning & SitRep analysis)
GEMINI_API_KEY=your_gemini_api_key_here

# Automation & Lifecycles
AUTO_SYNC_INTERVAL_SECONDS=300
OBSERVATION_LIFECYCLE_HOURS=6
ENABLE_MULTI_CHANNEL_NEWS=true
TEXT_DISASTER_THRESHOLD=0.65

# Server Ports
BACKEND_PORT=8000
FRONTEND_PORT=5173
`

---

## 🌐 REST API & WebSocket Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /api/v1/reports | Get observations (supports limit=500, event types, dates, verification status) |
| POST | /api/v1/reports/admin-publish | Publish 100% pre-verified official incident with automatic map placement |
| POST | /api/v1/media/analyze-text | Real-time multilingual NLP threat inference (returns is_disaster and adge_color) |
| POST | /api/v1/verification/{report_id}/action| Admin verify action; auto-assigns AI hashtags and creates/links EventCluster |
| GET | /api/v1/events | List active spatiotemporal disaster clusters |
| GET | /api/v1/impact/{event_id} | Impact nowcasting, demographic buffers, and verified photo proofs |
| GET | /api/v1/meteorology/dwr-radar | 33 IMD Doppler radar station sweeps, reflectivity ($\text{dBZ}$), and rain rates |
| GET | /api/v1/meteorology/insat-satellite | INSAT-3DR multi-spectral thermal CTT cloud telemetry |
| GET | /api/v1/meteorology/extreme-ml | Cloudburst CPI (–100$) and WBGT Heatwave ML predictions |
| POST | /api/v1/analytics/sql-query | Live read-only Big Data SQL query runner with telemetry |
| GET | /api/v1/analytics/sentiment-panic| Public Panic Index (–100$) and trending disaster hashtags |
| WS | /ws/weather | Real-time WebSocket streaming (<50ms event broadcasting) |

---

## ☁️ Deployment (Render & Cloud Platforms)

VARSHANET 2.0 includes a production-ready ender.yaml blueprint for one-click deployment:
* Automatically builds the React 18 production bundle (
pm run build in rontend/).
* Mounts FastAPI ASGI server via uvicorn on Python 3.10+.
* Connects continuous deployment webhooks from the GitHub repository main branch.

To deploy on Render:
1. Connect the repository in your [Render Dashboard](https://dashboard.render.com).
2. Choose **Blueprint** and select ender.yaml.
3. Add GEMINI_API_KEY in the environment settings and click **Apply**.

---

## 📄 License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
