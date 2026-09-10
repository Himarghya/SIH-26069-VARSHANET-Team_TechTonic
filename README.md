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
  <b>An open-standard disaster intelligence grid uniting 33 IMD Doppler Radars, INSAT-3DR Satellites, CWC Flood Telemetry, and VayuScore™ Multi-Modal AI Ground Verification across all 36 Indian States and Union Territories into automated NDRF Convoy Routing & OASIS CAP 1.2 Cell Siren Alerting.</b>
</p>

---

## 🚀 Live Platform & Workflow Links

| 🌐 **LIVE DEPLOYED WEBSITE** | 📊 **INTERACTIVE SYSTEM WORKFLOW** |
| :---: | :---: |
| [![Live Website](https://img.shields.io/badge/🌐_LIVE_WEBSITE-VISIT_NOW-00C49F?style=for-the-badge&logo=googlechrome&logoColor=white)](https://varshanet-backend.onrender.com) | [![Workflow Diagram](https://img.shields.io/badge/📊_WORKFLOW_DIAGRAM-DIAGRAMS.NET-F08705?style=for-the-badge&logo=diagramsdotnet&logoColor=white)](https://app.diagrams.net/) |
| <h1><a href="https://varshanet-backend.onrender.com">👉 Open Live Website ↗</a></h1> | <h1><a href="https://app.diagrams.net/">👉 Open diagrams.net Workflow ↗</a></h1> |
| 🔗 **[`https://varshanet-backend.onrender.com`](https://varshanet-backend.onrender.com)** | 🔗 **[`https://app.diagrams.net/`](https://app.diagrams.net/)** |
| *Live Deployment on Render • Interactive GIS Map • Real-Time AI Verification* | *Full Interactive Closed-Loop System & Multi-Modal ML Flowchart* |

---

<p align="center">
  <a href="#-system-architecture--closed-loop-diagram">🏗️ <b>Architecture</b></a> •
  <a href="#-multimodal-ai-pipelines-architecture">🧠 <b>AI Pipelines</b></a> •
  <a href="#-key-highlights--operational-capabilities">⚡ <b>Features</b></a> •
  <a href="#-system-requirements--prerequisites">💻 <b>Requirements</b></a> •
  <a href="#-step-by-step-setup--installation-guide">🚀 <b>Setup Guide</b></a> •
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
2. [System Architecture & Closed-Loop Diagram](#-system-architecture--closed-loop-diagram)
3. [Multi-Modal AI Pipelines Architecture](#-multimodal-ai-pipelines-architecture)
4. [Key Highlights & Operational Capabilities](#-key-highlights--operational-capabilities)
5. [Operational Navigation & UI Suite](#-operational-navigation--ui-suite)
6. [Technology Stack](#-technology-stack)
7. [System Requirements & Prerequisites](#-system-requirements--prerequisites)
8. [Step-by-Step Setup & Installation Guide](#-step-by-step-setup--installation-guide)
9. [Pre-Flight Health Checks & Verification](#-pre-flight-health-checks--verification)
10. [Configuration & Environment Variables (.env)](#-configuration--environment-variables-env)
11. [Troubleshooting & FAQ](#-troubleshooting--faq)
12. [REST API & WebSocket Documentation](#-rest-api--websocket-documentation)
13. [Deployment (Render & Cloud Platforms)](#-deployment-render--cloud-platforms)
14. [License](#-license)

---

## 🌧️ Platform Overview

**VARSHANET 2.0** is an enterprise-grade National Weather Big Data Analytics, Real-Time AI Verification, and Disaster Nowcasting Grid engineered specifically for India.

It continuously ingests real-time observations across:
* **33 IMD Doppler Weather Radars (DWR)** with reflectivity (dBZ), rain rates, and hydrometeor classifications.
* **INSAT-3DR/3DS Satellite Imagers** measuring Cloud Top Temperatures (CTT) and convective divergence.
* **Central Water Commission (CWC)** river gauge levels and discharge telemetry.
* **Multi-Channel News Feed Ingestion** (*Times of India, NDTV, India Today, Down To Earth, Google News*).
* **Social Media Firehose** with automated categorization into trending disaster hashtags.
* **Citizen Ground Intelligence** featuring 3-photo/video geotagged evidence with optical forensics.

VARSHANET translates raw telemetry into life-safety decision support:
* **VayuScore™ (0–100)**: Composite multi-modal credibility metric fusing 5 independent verification vectors.
* **TextGuard Multilingual NLP**: Real-time disaster threat detection with instant visual feedback across English, Hindi, and Hinglish.
* **VisionGuard Forensics**: Dual-stage binary PyTorch disaster classification + 64-bit Perceptual DHash deduplication + HSV turbidity checks.
* **Flood-Aware Convoy Routing**: Graph detour routing for **16 official NDRF Battalions** that automatically avoids submerged bridges and inundated underpasses.

---

## 🏗️ System Architecture & Closed-Loop Diagram

The following diagram illustrates the closed-loop architecture of VARSHANET 2.0, from multi-source data ingestion through the AI core engine to operational emergency action:

<div align="center">
  <img src="docs/images/varshanet_closed_loop_architecture.jpg" alt="VARSHANET Closed Loop Architecture" width="100%" style="border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.5); margin: 16px 0;" />
  
  <p align="center">
    <a href="https://app.diagrams.net/" target="_blank">
      <img src="https://img.shields.io/badge/📊_INTERACTIVE_WORKFLOW-OPEN_ON_DIAGRAMS.NET-F08705?style=for-the-badge&logo=diagramsdotnet&logoColor=white" height="40" alt="Open on diagrams.net" />
    </a>
  </p>
</div>

> [!TIP]
> ### 📊 [Click Here to View the Interactive Full Workflow Diagram on diagrams.net ↗](https://app.diagrams.net/)
> **Interactive Workflow Link:** [https://app.diagrams.net/](https://app.diagrams.net/)

### Operational Workflow Stages:
1. **Multi-Source Ingestion**: Ingests feeds from 33 IMD Doppler radars, INSAT-3DR thermal satellites, CWC flood gauges, automated RSS news media, and citizen observation reports.
2. **AI Core Engine**: Runs parallel dual-model inference (VisionGuard CNN + TextGuard Multilingual NLP), computes the composite VayuScore™ (0–100), clusters events spatiotemporally, and classifies trending hashtags with #IMD fallback.
3. **Action & Emergency Response**: Pins verified incidents on the Leaflet national map with Google Street View linking, calculates flood-aware convoy detours for all 16 NDRF battalions, broadcasts OASIS CAP 1.2 XML emergency cell alerts, and generates NDMA situation reports (SitRep).

---

## 🧠 Multi-Modal AI Pipelines Architecture

VARSHANET employs two distinct, specialized machine learning pipelines that operate in parallel to verify multi-modal ground evidence without altering pre-trained weights:

<div align="center">
  <img src="docs/images/varshanet_dual_ml_pipeline.jpg" alt="VARSHANET Dual Multimodal ML Pipelines Architecture" width="100%" style="border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.5); margin: 16px 0;" />
</div>

### Pipeline Breakdown:

#### Pipeline A: VisionGuard Two-Stage Forensics (Images & Videos)
1. **Input Normalization**: Resizes images to 224 × 224 with ImageNet RGB mean/std tensor normalization (`[0.485, 0.456, 0.406]`, `[0.229, 0.224, 0.225]`).
2. **Stage 1: MobileNetV3 Semantic Entity Discriminator (ImageNet-1K)**:
   * Classifies 1,000 ImageNet categories with low latency on CPU.
   * Discriminates non-disaster entities with high precision:
     * **Wildlife & Animals** (classes `0..397`: elephants, dogs, foxes, birds, reptiles).
     * **Domestic Indoor Electronics & Everyday Items** (screens, home appliances).
     * **Food & Agricultural Produce** (classes `923..965`: dishes, fruits, vegetables).
     * **Normal Residential Houses & Buildings** (intact architecture without structural collapse or fire).
     * **Calm Scenic Rivers, Lakes & Landscapes** (clean water bodies without muddy flood sediment).
3. **Stage 2: Fine-Tuned PyTorch Disaster Classifier (Kaggle CDD)**:
   * Custom ResNet18 model fine-tuned on the benchmark **Kaggle Comprehensive Disaster Dataset (CDD - 13,557 images)** (`varpit94/disaster-images-dataset`).
   * Evaluates across 6 disaster & non-disaster classes (*Fire/Wildfire, Flood/Water Disaster, Human Impact, Infrastructure Damage, Landslide/Drought, Non-Damage Everyday*).
   * Benchmark metrics: **78.66% Train Accuracy**, **74.67% Test Accuracy**, and **0.75 F1-Score** over 100 epochs.
4. **Optical Forensics & Anti-Spoofing Suite**:
   * **64-bit Perceptual DHash**: Detects near-identical duplicates and past photo re-use across reports.
   * **HSV Turbidity Color Distribution**: Analyzes flood water sediment turbidity and storm cloud overcast signatures.
   * **Strict < 20% Quarantine Rule**: Flags wildlife, domestic pets, memes, or unrelated visuals with an automatic rejection recommendation.
5. **Live ML Forensic Inspector**:
   * In-browser live radar scanning animation with dataset citations, classification probability breakdown, and forensic telemetry.

#### Pipeline B: TextGuard Multilingual NLP (Text & Hinglish)
1. **Multilingual Text Preprocessing**: Normalizes English, Hindi, and Hinglish observations.
2. **Dual-Classifier Architecture**:
   * **Fine-Tuned DistilBERT Transformer Pipeline**: Evaluates contextual semantic threat severity.
   * **Calibrated Scikit-Learn Model (`text_classifier.joblib`)**: Fast CPU-level inference for high-throughput stream processing.
3. **Keyword Grounding & Prior Calibration**:
   * Dynamically boosts probability when disaster keywords (*flood, waterlogging, cloudburst, paani, baadh, toofan*) are detected.
   * Attenuates prior probability when zero hazard keywords are present, eliminating false-positive alarms.
4. **Real-Time Visual Threat Feedback**:
   * **Disaster Threat Detected → Green (emerald)** (🚨 Disaster Threat Detected).
   * **Non-Disaster / Normal Text → Red (rose)** (❌ Non-Disaster / Normal Text).

---

## ⚡ Key Highlights & Operational Capabilities

### 1. 🔍 Explainable AI (XAI) & TreeSHAP Waterfall Decomposition for VayuScore™
* Replaces black-box scoring with an interpretable **Gradient Boosted Tree Ensemble + TreeSHAP Explainer**.
* Breaks down the composite **VayuScore™ (0–100)** into 5 mathematically rigorous feature attribution deltas relative to base prior probability ($E[f(x)] = 25.0$):
  1. **Independent Cross-Report Corroboration** ($-14.0$ to $+17.5$ SHAP): Density of corroborating citizen reports & sensor feeds within 500m radius.
  2. **Radar & Synoptic Correlation Rate** ($-12.0$ to $+16.5$ SHAP): Precipitation rate agreement from 33 IMD Doppler radars and automated rain gauges.
  3. **Vision Authenticity & Kaggle CDD Forensic CNN** ($-20.0$ to $+15.0$ SHAP): Optical credibility, HSV flood turbidity, and Stage 1/Stage 2 classifier certainty.
  4. **Source Trust & Historical Credibility** ($-12.0$ to $+12.5$ SHAP): Historical verification accuracy and penalty score of the submitting entity.
  5. **Spatiotemporal & Geographic Consistency** ($-10.0$ to $+7.5$ SHAP): Proximity alignment with active flood basins and meteorological hazard perimeters.
* **Interactive Waterfall Inspector UI**: Color-coded feature contribution bars (**Emerald +** / **Rose -**) giving disaster commanders full explainability for every single report.

### 2. 🇮🇳 Complete Coverage of All 36 Indian States & Union Territories
* Full interactive support across **all 28 States and 8 Union Territories**:
  * **28 States**: *Andhra Pradesh, Arunachal Pradesh, Assam, Bihar, Chhattisgarh, Goa, Gujarat, Haryana, Himachal Pradesh, Jharkhand, Karnataka, Kerala, Madhya Pradesh, Maharashtra, Manipur, Meghalaya, Mizoram, Nagaland, Odisha, Punjab, Rajasthan, Sikkim, Tamil Nadu, Telangana, Tripura, Uttar Pradesh, Uttarakhand, West Bengal.*
  * **8 UTs**: *Andaman and Nicobar Islands, Chandigarh, Dadra and Nagar Haveli and Daman and Diu, Delhi (NCR), Jammu and Kashmir, Ladakh, Lakshadweep, Puducherry.*
* **Tactical Camera Jump (flyTo)**: Selecting any State/UT in the National Weather Map smoothly re-centers and zooms the viewport directly onto that territory while dynamically filtering incident clusters and verified ground pins.
* **Backend Geo-Resolver**: `indian_geo_resolver.py` resolves city landmarks, union territories, and districts into verified GPS coordinates.

### 3. 🛡️ Strict All-Green Citizen Verification Gate
* Citizen hazard reporting includes real-time pre-flight verification gating.
* Submission button is strictly locked until **all 3 verification indicators turn green**:
  1. 📍 **GPS Geolocation**: Valid latitude/longitude pinned or auto-detected.
  2. 📝 **TextGuard NLP**: Confirmed disaster threat signature (Green badge).
  3. 📷 **VisionGuard Optical AI**: Verified genuine disaster proof passing Stage 1 & Stage 2 classifiers (Green badge).

### 4. 🏷️ Automated AI Trending Hashtags with #IMD Fallback
* Every ingested observation is automatically classified into trending meteorological categories:
  * **#Monsoon2026**: Monsoon surge, seasonal rainfall, southwest/northeast monsoon currents.
  * **#MumbaiRains**: Mumbai, MMR, Thane, Navi Mumbai, Santacruz rainfall and local inundation.
  * **#DelhiWeather**: Delhi NCR, Safdarjung, Palam, Yamuna flood levels, dense smog/fog.
  * **#Cloudburst**: Localized extreme deluges, flash runoffs, and mountain slope failures.
  * **#FloodAlert**: Urban waterlogging, river flood basins, dam discharges, rising waters.
  * **#HeatwaveWarning**: Severe heatwaves, loo winds, extreme temperatures (≥ 40°C).
  * **#CycloneAlert**: Depressions, cyclonic storms, gale warnings, coastal landfall cones.
  * **#IMD (Official Meteorological Fallback)**: Any observation outside the 7 specific categories automatically defaults to #IMD.

### 5. 🛡️ Admin Verification & Live Map Pinning with Google Street View
* Reports verified by emergency command admins immediately transform into interactive verified pins on the National Weather Map.
* **Animated Pulsing Emerald Shield Marker (🛡️)** renders at the verified GPS location.
* **Interactive Ground Popup**: Displays the AI-assigned incident category, credibility trust percentage (≥ 95%), observation text, author attribution, and direct **Google Street View** integration for instant visual ground verification.

### 6. 📅 Functional Date & Clean Operational Status Filters
* **Date Filter**:
  * **Today**: Real-time matching for today's calendar date and current 24-hour cycle.
  * **Past 24 Hours**: Instant filtering of reports from the preceding 24 hours.
  * **Past 7 Days**: Comprehensive weekly review.
  * **All Dates**: Access to all historical and real-time records.
  * Handled via cross-platform ISO-8601 parsing resilient to SQLite datetimes and timezone skews.
* **Clean Operational Status Filtering**:
  * Removed unverified noise (UNVERIFIED), pending reviews (REQUIRES_REVIEW), and misleading flags (LIKELY_MISLEADING) from the operational reports view.
  * Clean filtering between: **All Verification States**, **Verified Official**, and **Likely Authentic**.

### 7. 🚒 Flood-Aware 16 NDRF Battalion Tactical Routing
* Direct integration of all **16 official NDRF Battalions** (*Guwahati, Kolkata, Cuttack, Arakkonam, Pune, Vadodara, Bhatinda, Ghaziabad, Patna, Vijayawada, Varanasi, Itanagar, Ludhiana, Jasur, Srinagar, Bhopal*).
* Dynamic graph routing applies a **1.22× detour factor** during flood events, automatically routing convoys away from submerged bridges and waterlogged underpasses.
* 1-click **Official Requisition Order Generator** formatted for immediate administrative dispatch.

### 8. 🎭 Glassmorphic Role Switcher & Bidirectional GIS Sync
* Custom glassmorphic navbar role selector with active state persistence:
  * **Citizen (Default)**: Clean reporting flow, live weather feed, and ticket tracking.
  * **NDRF Tactical Commander**: Tactical routing, battalion dispatch, and convoy requisition.
  * **SDMA Regional Official**: State-level event clustering and demographic impact buffers.
  * **Central Meteorology Admin**: 100% pre-verified incident publishing and radar health monitoring.
* **Bidirectional Sync**: Overview metric cards dynamically link and filter both the GIS map and tabular observation feeds with auto-focus.

---

## 🧭 Operational Navigation & UI Suite

The platform's operational tabs are ordered logically for emergency triage:

```text
Overview ➔ Reports ➔ Map ➔ Incident Room ➔ Events ➔ Analytics
```

1. **Overview** (`DashboardPage.tsx`): High-level operational metrics, live observation cards, and active weather summaries.
2. **Reports** (`ReportsPage.tsx` / `ReportTable.tsx`): Real-time observation tabular feed, dynamic AI hashtag bar, date-wise filter, and verified status selectors.
3. **Map** (`MapPage.tsx` / `IndiaWeatherMap.tsx`): Leaflet/ESRI interactive GIS with 33 Doppler radars, NDRF battalions, CWC river flood polylines, cyclone cones, and 🛡️ verified reports.
4. **Incident Room** (`IncidentCommandRoomPage.tsx`): Incident deep-dive, 16 NDRF battalion convoy requisition, 2-photo evidence lightbox, and NDMA SitRep generator.
5. **Events** (`EventsPage.tsx`): Active spatiotemporal event clusters grouped by geographic proximity.
6. **Analytics** (`AnalyticsPage.tsx`): Interactive Big Data SQL query runner, VayuScore™ composite scorecard, and public sentiment panic index.
7. **Citizen Portal** (`CitizenPage.tsx`): Citizen hazard reporting with drag-and-drop 3-photo proof, real-time Green/Red NLP threat feedback, and ticket tracking.
8. **Admin Ops** (`AdminPage.tsx`): 100% pre-verified official incident publisher, verification queue, and distributed system health diagnostics.

---

## 🛠️ Technology Stack

| Domain | Technologies & Libraries |
| :--- | :--- |
| **Backend Framework** | **FastAPI** (Python 3.10+), **Uvicorn** ASGI server, **Pydantic v2**, Native **WebSockets** |
| **Machine Learning & AI** | **PyTorch** (ResNet-18, MobileNetV3), **Hugging Face Transformers** (DistilBERT), **Scikit-Learn**, **TreeSHAP (SHapley Additive exPlanations)** |
| **Vision & Forensics** | **MobileNetV3** Semantic Entity Discriminator (ImageNet-1K), **Kaggle Comprehensive Disaster Dataset (CDD)** fine-tuned CNN, **64-bit Perceptual DHash**, HSV Turbidity Profiler |
| **GenAI & LLM** | **Google Gemini API** (`gemini-1.5-flash` / `gemini-pro`) for multi-modal reasoning & NDMA SitRep generation |
| **Frontend Framework** | **React 18**, **TypeScript**, **Vite 8** (Rolldown / ESBuild), **TailwindCSS**, **Lucide React Icons** |
| **GIS & Mapping** | **Leaflet**, **React-Leaflet**, **ESRI World Imagery**, **OpenStreetMap**, **Google Street View Ground Integration** |
| **Database & ORM** | **SQLite / PostgreSQL**, **SQLAlchemy ORM**, Automatic timestamp sync & schema migration |
| **DevOps & Deployment** | **Docker**, **Docker Compose**, **Render Cloud Blueprint** (`render.yaml`), **Vercel** (`vercel.json`), **GitHub Actions CI/CD** |

---

## 💻 System Requirements & Prerequisites

### 1. Hardware Requirements
| Component | Minimum Specification | Recommended Specification |
| :--- | :--- | :--- |
| **Processor (CPU)** | Dual-core x86_64 / ARM64 (2.0 GHz+) | Quad-core x86_64 / Apple Silicon (3.0 GHz+) |
| **Memory (RAM)** | 4 GB RAM | 8 GB+ RAM (for local PyTorch / DistilBERT inference) |
| **Disk Space** | 2 GB free disk space | 5 GB+ free disk space |
| **GPU (Optional)** | Not required (CPU-optimized inference) | NVIDIA CUDA GPU (optional for PyTorch acceleration) |
| **Network** | Broadband internet connection | Low-latency connection for WebSocket stream |

### 2. Software Prerequisites
Ensure the following runtimes and tools are installed on your host machine:

| Software | Minimum Version | Verification Command | Download Link |
| :--- | :--- | :--- | :--- |
| **Python** | 3.10.x or higher | `python --version` | [python.org](https://www.python.org/downloads/) |
| **Node.js** | 18.x or higher (LTS) | `node --version` | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.x or higher | `npm --version` | Included with Node.js |
| **Git** | 2.30+ | `git --version` | [git-scm.com](https://git-scm.com/) |

### 3. Operating System Compatibility
* **Windows**: Windows 10 / 11 (PowerShell 5.1+ or PowerShell 7+ recommended)
* **Linux**: Ubuntu 20.04+, Debian 11+, Fedora 36+, Arch Linux
* **macOS**: macOS Monterey (12.0+), Ventura, Sonoma, Sequoia (Intel & Apple Silicon)

---

## 🚀 Step-by-Step Setup & Installation Guide

### Step 1: Clone the Repository
```bash
git clone https://github.com/Himarghya/SIH-26069-VARSHANET-Team_TechTonic.git
cd SIH-26069-VARSHANET-Team_TechTonic
```

### Step 2: Backend Environment & Dependencies

1. **Create and Activate Python Virtual Environment**:
   ```bash
   # On Windows (PowerShell):
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # On Windows (Command Prompt):
   python -m venv venv
   venv\Scripts\activate.bat

   # On Linux / macOS:
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Upgrade pip and Install Dependencies**:
   ```bash
   python -m pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**:
   Copy or create the `.env` configuration file in the project root:
   ```bash
   # On Linux / macOS:
   cp .env.example .env

   # On Windows (PowerShell):
   Copy-Item .env.example .env
   ```
   *(Ensure `GEMINI_API_KEY` is provided if you wish to use live Google Gemini multimodal reasoning).*

4. **Initialize Database & Seed Data**:
   The database automatically initializes upon server startup. To verify or manually seed the database:
   ```bash
   python -c "from backend.app.core.init_db import init_and_refresh_database; init_and_refresh_database()"
   ```

5. **Start the FastAPI Backend Server**:
   ```bash
   python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   * Backend REST API: http://localhost:8000
   * Swagger Interactive Docs: http://localhost:8000/docs
   * Redoc Documentation: http://localhost:8000/redoc

---

### Step 3: Frontend Environment & Dependencies

1. **Navigate to the Frontend Directory**:
   Open a **new terminal window** and run:
   ```bash
   cd frontend
   ```

2. **Install Node.js Packages**:
   ```bash
   npm install
   ```

3. **Start the Vite Development Server**:
   ```bash
   npm run dev
   ```
   * Frontend Web Application: http://localhost:5173

4. **Build Production Bundle (Optional Verification)**:
   ```bash
   npm run build
   ```
   * Generates optimized production assets in `frontend/dist/`.

---

## 🩺 Pre-Flight Health Checks & Verification

You can execute the following quick verification commands to ensure all AI models, database tables, and services are operational:

### 1. Verify Dual ML Pipelines (Vision & NLP)
```bash
python -c "
from processing.nlp.text_analyzer import text_analyzer
from processing.geolocation.indian_geo_resolver import IndianGeoResolver

r1 = text_analyzer.analyze_text('Heavy flood and cloudburst submerged roads in Dehradun')
r2 = text_analyzer.analyze_text('Sunny pleasant afternoon walking in the city park')

print('Disaster NLP Test -> is_disaster:', r1['is_disaster'], '| color:', r1['badge_color'])
print('Normal Text NLP Test -> is_disaster:', r2['is_disaster'], '| color:', r2['badge_color'])

geo = IndianGeoResolver()
print('GeoResolver Port Blair ->', geo.extract_location_from_text('Flash flood in Port Blair'))
print('GeoResolver Leh ->', geo.extract_location_from_text('Cloudburst in Leh Ladakh'))
"
```
*Expected Output:*
```text
Disaster NLP Test -> is_disaster: True | color: emerald
Normal Text NLP Test -> is_disaster: False | color: rose
GeoResolver Port Blair -> {'city': 'Port Blair', 'state': 'Andaman and Nicobar Islands', ...}
GeoResolver Leh -> {'city': 'Leh', 'state': 'Ladakh', ...}
```

### 2. Verify Database Report Counts & Freshness
```bash
python -c "
from backend.app.core.database import SessionLocal
from backend.app.models.models import WeatherReport
from datetime import datetime, timedelta

db = SessionLocal()
now = datetime.now()
total = db.query(WeatherReport).count()
last_24h = db.query(WeatherReport).filter(WeatherReport.timestamp >= now - timedelta(hours=24)).count()
print(f'Total Database Reports: {total} | Reports in Past 24 Hours: {last_24h}')
db.close()
"
```

---

## 🔒 Configuration & Environment Variables (.env)

Create a `.env` file in the root directory:
```env
# ==========================================================
# VARSHANET 2.0 CONFIGURATION
# ==========================================================

# Google Gemini API Key (Required for live Gemini LLM multi-modal reasoning & SitRep generation)
GEMINI_API_KEY=your_gemini_api_key_here

# Automated Data Ingestion
AUTO_SYNC_INTERVAL_SECONDS=300
OBSERVATION_LIFECYCLE_HOURS=6
ENABLE_MULTI_CHANNEL_NEWS=true

# AI / ML Classification Thresholds
TEXT_DISASTER_THRESHOLD=0.65
IMAGE_AUTHENTICITY_THRESHOLD=20.0

# Server Ports & Hosts
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
FRONTEND_PORT=5173

# Database Settings (Defaults to local SQLite if omitted)
# DATABASE_URL=postgresql://user:password@localhost:5432/varshanet
```

---

## ❓ Troubleshooting & FAQ

### Q1: PowerShell script execution error when activating `venv` on Windows
* **Error**: `File ... Activate.ps1 cannot be loaded because running scripts is disabled on this system.`
* **Solution**: Open PowerShell as Administrator and run:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

### Q2: Port 8000 or 5173 is already in use
* **Solution**: You can specify alternate ports:
  * For Backend: `python -m uvicorn backend.app.main:app --port 8001`
  * For Frontend: `npm run dev -- --port 5174`
  * Set `VITE_API_BASE_URL=http://localhost:8001/api/v1` in `frontend/.env.local`.

### Q3: PyTorch CPU vs CUDA installation
* The provided `requirements.txt` installs the lightweight, CPU-optimized build of PyTorch by default via `--extra-index-url https://download.pytorch.org/whl/cpu`. If you have an NVIDIA GPU and want CUDA acceleration:
  ```bash
  pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
  ```

### Q4: Database timestamps are older than today
* Run the built-in database refresh script to roll forward timestamps to current time:
  ```bash
  python -c "from backend.app.core.init_db import init_and_refresh_database; init_and_refresh_database()"
  ```

---

## 🌐 REST API & WebSocket Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/reports` | Get observations (supports `limit=500`, event types, dates, verification status) |
| `POST` | `/api/v1/reports/admin-publish` | Publish 100% pre-verified official incident with automatic map placement |
| `POST` | `/api/v1/media/analyze-text` | Real-time multilingual NLP threat inference (returns `is_disaster` and `badge_color`) |
| `POST` | `/api/v1/media/analyze-photo` | Two-Stage VisionGuard forensics (MobileNetV3 + Kaggle CDD ResNet18 + DHash + HSV) |
| `GET` | `/api/v1/ml/explain-vayuscore` | TreeSHAP waterfall feature attribution breakdown & XAI diagnostics for VayuScore™ |
| `POST` | `/api/v1/verification/{report_id}/action` | Admin verify action; auto-assigns AI hashtags and creates/links EventCluster |
| `GET` | `/api/v1/events` | List active spatiotemporal disaster clusters |
| `GET` | `/api/v1/impact/{event_id}` | Impact nowcasting, demographic buffers, and verified photo proofs |
| `GET` | `/api/v1/meteorology/dwr-radar` | 33 IMD Doppler radar station sweeps, reflectivity (dBZ), and rain rates |
| `GET` | `/api/v1/meteorology/insat-satellite` | INSAT-3DR multi-spectral thermal CTT cloud telemetry |
| `GET` | `/api/v1/meteorology/extreme-ml` | Cloudburst CPI (0–100) and WBGT Heatwave ML predictions |
| `POST` | `/api/v1/analytics/sql-query` | Live read-only Big Data SQL query runner with telemetry |
| `GET` | `/api/v1/analytics/sentiment-panic` | Public Panic Index (0–100) and trending disaster hashtags |
| `WS` | `/ws/weather` | Real-time WebSocket streaming (<50ms event broadcasting) |

---

## ☁️ Deployment (Render & Cloud Platforms)

> [!IMPORTANT]
> ### 🌐 [Click Here to Open the Live Deployed Platform on Render ↗](https://varshanet-backend.onrender.com)
> **Live Production Website:** [https://varshanet-backend.onrender.com](https://varshanet-backend.onrender.com)

VARSHANET 2.0 includes a production-ready `render.yaml` blueprint for one-click deployment:
* Automatically builds the React 18 production bundle (`npm run build` in `frontend/`).
* Mounts FastAPI ASGI server via `uvicorn` on Python 3.10+.
* Connects continuous deployment webhooks from the GitHub repository `main` branch.

To deploy on Render:
1. Connect the repository in your [Render Dashboard](https://dashboard.render.com).
2. Choose **Blueprint** and select `render.yaml`.
3. Add `GEMINI_API_KEY` in the environment settings and click **Apply**.

---

## 📄 License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
