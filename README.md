# 🌧️ VARSHANET 2.0 — National Weather Big Data Analytics & AI Disaster Impact Nowcasting Grid

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Google Gemini](https://img.shields.io/badge/AI%20Engine-Google%20Gemini%20LLM-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Leaflet](https://img.shields.io/badge/GIS-Leaflet%20%2B%20ESRI-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![TailwindCSS](https://img.shields.io/badge/UI-TailwindCSS%203.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![WebSockets](https://img.shields.io/badge/Streaming-Real--time%20WebSockets-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://websockets.readthedocs.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **VARSHANET 2.0 is an AI-powered national disaster impact nowcasting and decision-support platform for India. It ingests multi-source weather data, runs 3-hour impact trajectories, evaluates population & infrastructure risk, and delivers explainable emergency action recommendations using Google Gemini and real-time GIS.**

---

## 🧭 The Closed-Loop Intelligence Cycle

```
  ┌──────────┐     ┌──────────┐     ┌───────────┐     ┌────────────────┐
  │  DETECT  │ ──► │  VERIFY  │ ──► │ CORRELATE │ ──► │ PREDICT IMPACT │
  └──────────┘     └──────────┘     └───────────┘     └────────────────┘
                                                               │
  ┌──────────┐     ┌──────────┐     ┌───────────┐              ▼
  │  LEARN   │ ◄── │  VERIFY  │ ◄── │ RECOMMEND │ ◄────────────┘
  │ (SitRep) │     │  AGAIN   │     │  ACTIONS  │
  └──────────┘     └──────────┘     └───────────┘
```

---

## ✨ Key Capabilities & Modules

### 1. 🛡️ Three Strictly Distinct Intelligence Metrics
* **Evidence Confidence (0–100%)**: Evaluates how confident the platform is that the event is physically authentic (computed via multi-source consensus, AWS Doppler agreement, and image authenticity).
* **Impact Risk Index (0–100)**: Evaluates the potential danger and severity of the event (computed from precipitation accumulation, demographic vulnerability, and infrastructure proximity).
* **Response Priority (P1–P4)**: Operational urgency rating (`P1 - Critical`, `P2 - High`, `P3 - Moderate`, `P4 - Monitor`) with escalation probabilities.

### 2. ⏱️ Explainable 3-Hour Impact Nowcast Trajectory
* Transparent nowcasting model predicting disaster evolution across **Current (0m)**, **+30m**, **+60m**, **+120m**, and **+3 Hours** with confidence intervals.

### 3. 👥 Demographic & Vulnerable Population Exposure
* Uses Indian district demographic data and spatial buffer radii (5 km core, 15 km buffer) to calculate:
  * Total population exposed in the active impact zone.
  * **High-risk vulnerable count** (infants, elderly, informal settlements).
  * Urban vs. rural ratio and population density ($\text{persons/km}^2$).

### 4. 🏥 Critical Infrastructure Inundation Risk
* Monitors proximity and vulnerability of critical national assets:
  * Tertiary health centers and regional hospitals.
  * School and university emergency shelters.
  * Railway stations and airport terminals.
  * Submersible bridges, flyovers, and arterial highways.

### 5. 👁️ 1-Click Google Street View Ground Pinpointing
* Direct coordinate launcher (`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint={lat},{lon}`) allowing operators and citizens to inspect 360° ground panoramas at exact disaster GPS coordinates in one click.

### 6. 🤖 Google Gemini AI & Hybrid ML Engine
* **Cloud LLM (Google Gemini)**: Analyzes unstructured multilingual text (Hindi, English, Hinglish), extracts physical impact tags, and produces structured disaster reasoning.
* **Local Machine Learning**: Scikit-Learn TF-IDF classification and Simhash near-duplicate grouping for high-speed local failover.

### 7. 📢 Emergency Multi-Lingual Audio Dispatcher (TTS + Siren)
* In-browser synthetic emergency radio broadcaster in **Hindi (हिंदी)** and **English** styled after All India Radio (AIR) and DD News emergency bulletins with Doppler radar acoustic chimes.

### 8. 📱 Common Alerting Protocol (CAP) Cell Broadcast Simulator
* Simulates geo-fenced mobile phone emergency push notifications sent to citizens in the buffer zone with red alert headers and estimated subscriber reach.

### 9. 📄 Official NDMA / SDMA Situation Report (SitRep) Dossier Exporter
* 1-click generator to **Print** or **Export Markdown (`.MD`)** standardized Government of India Disaster Situation Reports formatted for emergency operations centers.

### 10. 🔄 Information Gaps & Citizen Crowdsourcing Feedback Loop
* Detects missing intelligence (e.g. road passability) and triggers crowdsourced verification requests. When citizens respond with ground confirmation, risk scores update dynamically in real time.

### 11. 🔐 Role-Based Dynamic Operational Access
* **Citizen Mode**: Public safety alerts, GPS reporting, and instant Google Gemini safety guidance.
* **Analyst Mode**: 3-hour nowcast trajectories, demographic casualty exposure, and SitRep generation.
* **Admin Mode**: Master operational verification queue (34 pending reports) with 1-click verification, rejection, and misinformation flagging.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend UI** | React 18, TypeScript, Tailwind CSS 3.4, Lucide Icons, Vite |
| **Mapping & GIS** | Leaflet, ESRI Cyber Dark Gray Canvas, OpenStreetMap, Dynamic Inundation Buffers |
| **Backend API** | FastAPI (Python 3.10+), Uvicorn, Pydantic v2 |
| **Database & ORM** | SQLite / PostgreSQL with PostGIS, SQLAlchemy 2.0 |
| **Real-Time Streaming** | Native WebSockets with exponential reconnection |
| **AI / NLP Models** | Google Gemini API (`gemma-4-26b-a4b-it` / `gemini-2.5-flash`), Scikit-Learn TF-IDF, Simhash |
| **Automation** | Multi-threaded background sync workers for live Indian news RSS & AWS stations |

---

## 📂 Project Structure

```
varshanet/
├── backend/
│   └── app/
│       ├── api/v1/          # REST routes (reports, events, impact, verification, analytics)
│       ├── core/            # Config, database engine, security
│       ├── models/          # SQLAlchemy ORM models (Reports, Clusters, Impact, Infrastructure)
│       ├── schemas/         # Pydantic validation schemas
│       └── main.py          # FastAPI application entrypoint & Lifespan worker
├── processing/
│   ├── clustering/          # Spatiotemporal event clustering
│   ├── deduplication/       # Text & media Simhash deduplication
│   ├── geolocation/         # Indian PostGIS boundary & gazetteer resolver
│   ├── impact/              # AI Impact Engine, Population Exposure, Nowcaster, Recommendations
│   ├── nlp/                 # Indian language cleaner & tokenizers
│   └── verification/        # Google Gemini LLM analyzer & ML credibility scorer
├── ingestion/
│   ├── automation/          # 90-second background news & weather station sync worker
│   └── connectors/          # Google News RSS, Open-Meteo AWS, Citizen API
├── frontend/
│   ├── src/
│   │   ├── components/      # Incident Command Room, Map, Reports, Navbar, Citizen form
│   │   ├── pages/           # Command Center, Incident Room, Map, Reports, Analytics, Admin
│   │   ├── services/        # Axios API client & WebSockets client
│   │   └── types/           # TypeScript interfaces
│   └── package.json
└── scripts/
    ├── seed_impact_data.py          # Seeds critical infrastructure assets across Indian districts
    └── simulate_closed_loop_demo.py # 17-step end-to-end judge demonstration simulation
```

---

## 🚀 Quick Start Guide

### Prerequisites
* **Python 3.10+**
* **Node.js 18+** & **npm**
* **Google Gemini API Key** (optional, fallback local ML active)

### 1. Clone Repository
```bash
git clone https://github.com/your-username/varshanet.git
cd varshanet
```

### 2. Backend Setup
```bash
# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Set GEMINI_API_KEY inside .env

# Seed initial critical infrastructure data
python scripts/seed_impact_data.py

# Start FastAPI backend server
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Frontend Setup
```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```

Open **`http://localhost:5173`** in your browser.

---

## 🧪 Automated 17-Step Demonstration Flow

To verify the closed-loop intelligence cycle in terminal mode:

```bash
python scripts/simulate_closed_loop_demo.py
```

### Verified Demo Steps:
1. **Telemetry Initialization**: Pan-India observation grid active.
2. **Event Ingestion**: Real-time burst of citizen reports for Bhopal.
3. **AI Deduplication**: Simhash grouping of near-duplicate posts.
4. **Spatiotemporal Clustering**: Unified incident cluster generated (`#EVT-YYYYMMDD-001`).
5. **Impact Evaluation**: 386,792 citizens exposed (108,301 vulnerable), 2 hospitals, 2 bridges at risk.
6. **Nowcast Trajectory**: 3-Hour escalation from Risk 72.8 (HIGH) to 91.1 (CRITICAL).
7. **Information Gap Detection**: Identifies unknown arterial road passability.
8. **Citizen Verification Trigger**: Dispatches targeted crowdsourced verification prompt.
9. **Evidence Recalculation**: Citizen response closes uncertainty gap; Evidence Confidence rises to 98%.
10. **Action Directives**: Google Gemini & NDRF SOP recommendations generated.
11. **Post-Event Accuracy**: Evaluates prediction error ($\pm 6.38\%$) with 93.6% model accuracy.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🇮🇳 Acknowledgements

* **Ministry of Earth Sciences (MoES) & India Meteorological Department (IMD)** for meteorological guidelines and synoptic standards.
* **National Disaster Management Authority (NDMA)** for Standard Operating Procedure (SOP) structures and Common Alerting Protocol (CAP) standards.