# 🌧️ VARSHANET 2.0

## National Weather Big Data Analytics & AI Disaster Impact Nowcasting Grid

[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge\&logo=fastapi\&logoColor=white)](https://fastapi.tiangolo.com/)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)](https://react.dev/)
[![AI](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=for-the-badge\&logo=google\&logoColor=white)](https://ai.google.dev/)
[![GIS](https://img.shields.io/badge/GIS-Leaflet%20%2B%20ESRI-199900?style=for-the-badge\&logo=leaflet\&logoColor=white)](https://leafletjs.com/)
[![UI](https://img.shields.io/badge/UI-TailwindCSS%203.4-38B2AC?style=for-the-badge\&logo=tailwindcss\&logoColor=white)](https://tailwindcss.com/)
[![Real-Time](https://img.shields.io/badge/Streaming-WebSockets-010101?style=for-the-badge\&logo=socketdotio\&logoColor=white)](https://websockets.readthedocs.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

> **VARSHANET 2.0 transforms real-time weather intelligence into an AI-powered disaster impact nowcasting and decision-support platform for India.**

VARSHANET continuously ingests weather observations, citizen reports, news signals, and other data sources to detect and correlate emerging hazards. It then estimates **population exposure, critical infrastructure risk, disaster trajectory, operational priority, and recommended response actions**.

The platform is designed around a **closed-loop intelligence cycle**:

```text
┌──────────┐
│  DETECT  │
└────┬─────┘
     │
     ▼
┌──────────┐
│  VERIFY  │
└────┬─────┘
     │
     ▼
┌────────────┐
│ CORRELATE  │
└─────┬──────┘
      │
      ▼
┌─────────────────┐
│ PREDICT IMPACT  │
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│ RECOMMEND ACTION│
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│ CITIZEN VERIFY  │
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│ LEARN / SITREP  │
└───────┬─────────┘
        │
        └──────────────► Updated Intelligence
```

---

# 🎯 Problem

India receives enormous volumes of weather and disaster-related information from heterogeneous sources:

* Meteorological observations
* Weather APIs
* News reports
* Social media
* Citizen reports
* Public datasets
* Geospatial information
* Critical infrastructure databases

The challenge is not simply **detecting bad weather**.

The real operational challenge is determining:

> **"What is happening, who is going to be affected, what infrastructure is at risk, how severe will the situation become in the next few hours, and what should authorities do right now?"**

Traditional weather dashboards often stop at displaying observations and warnings.

VARSHANET 2.0 extends this into an **impact-centric decision-support system**.

---

# 💡 Solution

VARSHANET 2.0 creates a unified operational intelligence layer that converts raw weather and citizen information into actionable disaster intelligence.

```text
MULTI-SOURCE DATA
       │
       ▼
┌───────────────────────┐
│ Data Ingestion Layer  │
│ Weather / News /      │
│ Citizen / Public Data │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ NLP + Deduplication   │
│ + Geolocation         │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Event Detection &     │
│ Spatiotemporal        │
│ Clustering            │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ AI Impact Engine      │
│                       │
│ Population Exposure   │
│ Infrastructure Risk   │
│ Vulnerability         │
│ Nowcasting            │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Decision Support      │
│                       │
│ Gemini Recommendations│
│ Information Gaps      │
│ Verification Requests │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Incident Command Room │
└───────────┬───────────┘
            │
            ▼
       FIELD ACTION
            │
            ▼
     CITIZEN FEEDBACK
            │
            └──────────► MODEL UPDATE
```

---

# ✨ Core Capabilities

## 1. 🛡️ Three Independent Intelligence Metrics

VARSHANET separates **evidence reliability**, **physical impact**, and **operational urgency**.

### Evidence Confidence — 0–100

Measures how strongly the available evidence supports the existence and authenticity of an incident.

Signals may include:

* Multi-source agreement
* Weather-station correlation
* Meteorological observations
* Citizen report consistency
* Image/media authenticity
* Source reliability
* Spatial consistency

### Impact Risk Index — 0–100

Measures the potential consequences of the event.

Factors include:

* Hazard severity
* Precipitation accumulation
* Population exposure
* Vulnerable population
* Infrastructure proximity
* Geographic vulnerability
* Expected trajectory

### Response Priority — P1–P4

Converts risk into an operational urgency classification.

| Priority | Meaning  | Operational Interpretation        |
| -------- | -------- | --------------------------------- |
| 🔴 P1    | Critical | Immediate emergency response      |
| 🟠 P2    | High     | Rapid intervention required       |
| 🟡 P3    | Moderate | Active monitoring and preparation |
| 🟢 P4    | Monitor  | Continue observation              |

Keeping these three dimensions separate prevents a highly uncertain report from being treated as automatically high-impact.

---

# 2. ⏱️ Explainable 3-Hour Impact Nowcasting

VARSHANET projects how an incident may evolve over the next three hours.

The Incident Command Room provides a trajectory across:

```text
CURRENT
   │
   ▼
+30 MIN
   │
   ▼
+60 MIN
   │
   ▼
+120 MIN
   │
   ▼
+3 HOURS
```

Each prediction can contain:

* Projected risk score
* Confidence
* Expected severity
* Affected area
* Population exposure
* Infrastructure exposure
* Escalation probability
* Explanation of contributing factors

The objective is not merely to answer:

> "Where is the disaster?"

but:

> **"Where is the disaster likely to become dangerous next?"**

---

# 3. 👥 Population & Vulnerability Exposure

The Impact Engine evaluates the population located within an event's potential impact zone.

Example spatial model:

```text
                 15 km Impact Buffer
          ┌─────────────────────────────┐
          │                             │
          │       Vulnerable Zone       │
          │        ┌───────────┐        │
          │        │  5 km     │        │
          │        │   CORE    │        │
          │        └───────────┘        │
          │                             │
          └─────────────────────────────┘
```

The system can estimate:

* Total population exposed
* Vulnerable population
* Population density
* Urban/rural distribution
* High-risk population concentration
* Geographic exposure

Potential vulnerability indicators include:

* Elderly populations
* Infants and children
* High-density settlements
* Informal settlements
* Other locally relevant vulnerability indicators

---

# 4. 🏥 Critical Infrastructure Risk

VARSHANET evaluates the proximity of hazards to critical infrastructure.

Supported infrastructure categories include:

* 🏥 Hospitals
* 🏫 Schools
* 🚆 Railway stations
* ✈️ Airports
* 🌉 Bridges
* 🛣️ Highways
* 🏠 Emergency shelters

For every potentially affected asset, the platform can calculate:

```text
Distance from Hazard
        +
Hazard Severity
        +
Asset Vulnerability
        +
Expected Trajectory
        ↓
Infrastructure Risk
```

This allows operators to prioritize incidents that threaten critical public infrastructure.

---

# 5. 🗺️ Map-to-Incident Command Room

The national map is directly connected to operational intelligence.

When an operator clicks:

```text
Map Marker
    │
    ▼
Incident / Cluster
    │
    ▼
Incident Command Room
```

The system opens the corresponding incident rather than forcing the operator to manually search for it.

The Incident Command Room can display:

* Incident identity
* Location
* Evidence Confidence
* Impact Risk
* Response Priority
* Population exposure
* Infrastructure risk
* Nowcast trajectory
* Evidence chain
* Recommended actions
* Information gaps
* Citizen verification
* Prediction accuracy

---

# 6. 📍 One-Click Google Street View Pinpointing

Each report and incident can provide a ground-location launcher.

Operators can use the incident's latitude and longitude to inspect the surrounding location using Google Maps / Street View.

Example:

```text
Incident Coordinates
        │
        ▼
┌─────────────────────┐
│ Open Street View    │
└──────────┬──────────┘
           │
           ▼
Google Maps Ground View
```

This provides an additional visual context layer for operational assessment.

---

# 7. 🤖 Google Gemini AI Action Recommender

VARSHANET uses Google Gemini as an AI decision-support layer.

Gemini can analyze structured and unstructured incident information and generate operational recommendations.

Example input:

```text
Incident:
Urban Flash Flood

Location:
Bhopal

Risk:
87/100

Population Exposed:
42,500

Critical Assets:
2 hospitals
1 railway station
3 schools

Information Gap:
Road passability unknown
```

Possible recommendation categories include:

* Immediate life-safety actions
* Evacuation considerations
* Road closure recommendations
* Emergency resource prioritization
* Verification requests
* Infrastructure protection
* Communication priorities

> **Important:** Gemini recommendations are decision-support outputs and should not replace authorized emergency-management procedures, official warnings, or human command decisions.

---

# 8. 🌐 Multilingual Intelligence

VARSHANET is designed to handle Indian disaster information across multiple language styles.

The NLP layer can process:

* English
* Hindi
* Hinglish
* Multilingual citizen reports

Example:

```text
"Road pe bahut paani hai, gaadi nahi ja rahi"

        ↓

Language Normalization

        ↓

Semantic Extraction

        ↓

Impact Tags

        ↓

"ROAD_PASSABILITY = BLOCKED"
```

This allows citizen-generated information to become structured operational intelligence.

---

# 9. 📢 Emergency Multilingual Audio Dispatcher

The platform includes an in-browser emergency communication layer.

Supported capabilities include:

* Hindi emergency announcements
* English emergency announcements
* Synthetic emergency radio-style bulletins
* Emergency siren/audio cues
* Operator-controlled playback

This provides an additional communication mechanism for demonstrations and operational interfaces.

---

# 10. 📱 Common Alerting Protocol (CAP) Simulation

VARSHANET includes a CAP-style emergency communication simulator.

The simulator can demonstrate:

```text
Incident
   │
   ▼
Geo-fenced Impact Area
   │
   ▼
Affected Population
   │
   ▼
Emergency Alert
   │
   ▼
Estimated Subscriber Reach
```

This is intended as a **simulation capability** and does not directly transmit cellular broadcast messages.

---

# 11. 📄 Automated Situation Report (SitRep)

Operators can generate a structured disaster Situation Report from the current incident intelligence.

The generated dossier can contain:

* Incident summary
* Location
* Current severity
* Evidence confidence
* Impact risk
* Response priority
* Population exposure
* Infrastructure exposure
* Current situation
* Predicted trajectory
* Recommended actions
* Information gaps
* Verification status
* Prediction accuracy

The system supports export/printing for operational workflows.

---

# 12. 🔄 Information Gaps & Citizen Verification Loop

A major feature of VARSHANET 2.0 is that uncertainty becomes an actionable task.

Example:

```text
Incident Detected
       │
       ▼
Information Gap
"Road status unknown"
       │
       ▼
Verification Request
       │
       ▼
Citizen Ground Report
       │
       ▼
Evidence Updated
       │
       ▼
Confidence / Risk Recalculated
       │
       ▼
Recommendations Updated
```

Instead of simply displaying:

> "Insufficient information"

the platform asks:

> **"What information is missing, and how can we obtain it?"**

---

# 13. 🎯 Prediction vs Actual Outcome

VARSHANET includes a post-event evaluation layer.

After an incident:

```text
Predicted Impact
       │
       ▼
Actual Outcome
       │
       ▼
Prediction Delta
       │
       ▼
Accuracy Evaluation
```

This enables operators and developers to measure:

* Prediction error
* Risk estimation error
* Population exposure error
* Infrastructure prediction accuracy
* Escalation prediction accuracy

This creates a foundation for improving future models.

---

# 14. 🔐 Role-Based Operational Access

VARSHANET provides role-specific interfaces.

### 👤 Citizen Mode

Designed for public users.

Features include:

* Submit disaster reports
* GPS-based reporting
* Public safety guidance
* Gemini-generated safety instructions
* View relevant alerts

### 🧑‍💻 Analyst Mode

Designed for disaster analysts.

Features include:

* Incident analysis
* 3-hour impact nowcasting
* Population exposure
* Infrastructure risk
* Evidence analysis
* Information gaps
* SitRep generation

### 🛡️ Admin Mode

Designed for operational verification.

Features include:

* Report verification
* Report rejection
* Misinformation flagging
* Verification queue
* Incident management
* Operational monitoring

---

# 🧠 AI & Intelligence Architecture

```text
                    ┌──────────────────┐
                    │ Weather Sources  │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ News / RSS Feeds  │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ Citizen Reports  │
                    └────────┬─────────┘
                             │
                             ▼
                 ┌────────────────────────┐
                 │    INGESTION LAYER     │
                 └────────────┬───────────┘
                              │
                              ▼
                 ┌────────────────────────┐
                 │ NLP + Deduplication    │
                 │ + Geolocation           │
                 └────────────┬───────────┘
                              │
                              ▼
                 ┌────────────────────────┐
                 │ Event Detection &      │
                 │ Spatiotemporal Cluster │
                 └────────────┬───────────┘
                              │
                              ▼
                 ┌────────────────────────┐
                 │     IMPACT ENGINE      │
                 │                        │
                 │ Population Exposure    │
                 │ Infrastructure Risk    │
                 │ Vulnerability          │
                 │ Nowcasting              │
                 └────────────┬───────────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
                 ▼                         ▼
       ┌─────────────────┐       ┌──────────────────┐
       │ Gemini AI       │       │ Local ML Fallback│
       │ Recommendations │       │ TF-IDF / Simhash │
       └────────┬────────┘       └────────┬─────────┘
                │                         │
                └────────────┬────────────┘
                             ▼
                 ┌────────────────────────┐
                 │ Incident Command Room  │
                 └────────────┬───────────┘
                              │
                              ▼
                 ┌────────────────────────┐
                 │ Citizen Verification   │
                 └────────────┬───────────┘
                              │
                              ▼
                     Updated Intelligence
```

---

# 🏗️ Technology Stack

| Layer              | Technology                         |
| ------------------ | ---------------------------------- |
| **Frontend**       | React 18, TypeScript, Vite         |
| **UI**             | Tailwind CSS 3.4, Lucide Icons     |
| **Mapping / GIS**  | Leaflet, ESRI, OpenStreetMap       |
| **Backend**        | FastAPI, Python 3.10+              |
| **API Server**     | Uvicorn                            |
| **Validation**     | Pydantic v2                        |
| **Database**       | SQLite / PostgreSQL                |
| **ORM**            | SQLAlchemy 2.0                     |
| **Geospatial**     | PostGIS-compatible architecture    |
| **Real-Time**      | Native WebSockets                  |
| **Cloud AI**       | Google Gemini API                  |
| **Local ML**       | Scikit-Learn                       |
| **NLP**            | TF-IDF / language normalization    |
| **Deduplication**  | Simhash                            |
| **Data Ingestion** | RSS / Weather APIs / Citizen APIs  |
| **Visualization**  | Leaflet / Charts                   |
| **Automation**     | Background synchronization workers |

---

# 📂 Project Structure

```text
varshanet/
│
├── backend/
│   └── app/
│       ├── api/
│       │   └── v1/
│       │       ├── reports.py
│       │       ├── events.py
│       │       ├── analytics.py
│       │       ├── citizen.py
│       │       ├── impact.py
│       │       └── verification_requests.py
│       │
│       ├── core/
│       │   ├── config.py
│       │   ├── database.py
│       │   └── security.py
│       │
│       ├── models/
│       │   └── models.py
│       │
│       ├── schemas/
│       │   └── schemas.py
│       │
│       └── main.py
│
├── processing/
│   │
│   ├── clustering/
│   │   └── ...
│   │
│   ├── deduplication/
│   │   └── ...
│   │
│   ├── geolocation/
│   │   └── ...
│   │
│   ├── nlp/
│   │   └── ...
│   │
│   ├── verification/
│   │   └── ...
│   │
│   └── impact/
│       ├── __init__.py
│       ├── population_exposure.py
│       ├── infrastructure_risk.py
│       ├── vulnerability_engine.py
│       ├── impact_nowcaster.py
│       ├── response_recommender.py
│       ├── information_gaps.py
│       ├── explainability.py
│       └── impact_engine.py
│
├── ingestion/
│   ├── automation/
│   │   └── ...
│   │
│   └── connectors/
│       ├── news.py
│       ├── weather.py
│       └── citizen.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── map/
│   │   │   ├── incident/
│   │   │   │   ├── IncidentHeader.tsx
│   │   │   │   ├── StreetViewPin.tsx
│   │   │   │   ├── ImpactSummary.tsx
│   │   │   │   ├── RiskTrajectory.tsx
│   │   │   │   ├── InfrastructureRisk.tsx
│   │   │   │   ├── ResponseActions.tsx
│   │   │   │   ├── InformationGaps.tsx
│   │   │   │   ├── EvidenceChain.tsx
│   │   │   │   └── PredictionAccuracy.tsx
│   │   │   └── common/
│   │   │
│   │   ├── pages/
│   │   │   ├── IncidentCommandRoomPage.tsx
│   │   │   ├── CitizenPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── MapPage.tsx
│   │   │   ├── AnalyticsPage.tsx
│   │   │   └── AdminPage.tsx
│   │   │
│   │   ├── services/
│   │   │   └── api.ts
│   │   │
│   │   └── types/
│   │       └── index.ts
│   │
│   └── package.json
│
├── scripts/
│   ├── seed_impact_data.py
│   └── simulate_closed_loop_demo.py
│
├── .env.example
├── README.md
├── LICENSE
└── requirements.txt
```

---

# 🔌 API Architecture

VARSHANET 2.0 maintains backward compatibility with the existing API surface.

### Existing APIs

```text
GET /api/v1/reports
GET /api/v1/events
GET /api/v1/analytics
GET /api/v1/citizen
WS  /ws/weather
```

### New Impact APIs

```text
GET /api/v1/impact/{event_id}

GET /api/v1/impact/{event_id}/nowcast

GET /api/v1/impact/{event_id}/recommendations

GET /api/v1/impact/{event_id}/information-gaps

POST /api/v1/verification-requests
```

The new functionality extends the existing platform without intentionally removing the legacy routes.

---

# 🔄 Closed-Loop Decision Workflow

A typical operational cycle is:

```text
01. Weather / Citizen / News Signal
             ↓
02. Event Detection
             ↓
03. Source Verification
             ↓
04. Spatiotemporal Correlation
             ↓
05. Incident Creation
             ↓
06. Population Exposure Analysis
             ↓
07. Infrastructure Risk Analysis
             ↓
08. Evidence Confidence Calculation
             ↓
09. Impact Risk Calculation
             ↓
10. P1–P4 Response Prioritization
             ↓
11. 3-Hour Impact Nowcast
             ↓
12. Gemini Action Recommendations
             ↓
13. Information Gap Detection
             ↓
14. Citizen Verification Request
             ↓
15. Evidence / Risk Recalculation
             ↓
16. Operational SitRep
             ↓
17. Prediction vs Actual Evaluation
```

This workflow can be demonstrated automatically using:

```bash
python scripts/simulate_closed_loop_demo.py
```

---

# 🧪 Verification & Testing

## Backend API Verification

Test the major impact endpoints:

```bash
GET /api/v1/impact/{event_id}
GET /api/v1/impact/{event_id}/nowcast
GET /api/v1/impact/{event_id}/recommendations
GET /api/v1/impact/{event_id}/information-gaps
POST /api/v1/verification-requests
```

---

## Closed-Loop Demonstration

Run:

```bash
python scripts/simulate_closed_loop_demo.py
```

The demonstration validates the complete intelligence pipeline from detection through verification and prediction evaluation.

---

## Frontend Build

From the `frontend` directory:

```bash
npm run build
```

The build should complete without TypeScript or bundling errors.

---

# 🚀 Quick Start

## Prerequisites

Make sure the following are installed:

* Python 3.10+
* Node.js 18+
* npm
* Git
* Optional: PostgreSQL + PostGIS
* Optional: Google Gemini API key

---

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/varshanet.git

cd varshanet
```

---

# 2. Backend Setup

Create a Python virtual environment:

### Windows

```powershell
python -m venv venv

venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv

source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# 3. Environment Configuration

Create your environment file:

### Windows

```powershell
copy .env.example .env
```

### Linux / macOS

```bash
cp .env.example .env
```

Configure the required environment variables.

Example:

```env
ENVIRONMENT=development

GEMINI_API_KEY=your_gemini_api_key

DATABASE_URL=sqlite:///./varshanet.db

ALLOWED_ORIGINS=http://localhost:5173
```

> Keep API keys and secrets out of Git. Never commit `.env` to the repository.

---

# 4. Seed Infrastructure Data

Run:

```bash
python scripts/seed_impact_data.py
```

This initializes the demonstration infrastructure dataset used by the Impact Engine.

The repository may use deterministic simulation data for hackathon demonstrations where live national datasets are unavailable.

---

# 5. Start the Backend

Run:

```bash
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend will be available at:

```text
http://localhost:8000
```

FastAPI documentation:

```text
http://localhost:8000/docs
```

---

# 6. Start the Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# 🔐 Environment Variables

Typical configuration:

| Variable          | Required | Description                         |
| ----------------- | -------: | ----------------------------------- |
| `GEMINI_API_KEY`  | Optional | Google Gemini API access            |
| `DATABASE_URL`    |      Yes | Database connection                 |
| `ALLOWED_ORIGINS` |      Yes | Frontend/backend CORS configuration |
| `ENVIRONMENT`     |      Yes | Development / production            |
| `LOG_LEVEL`       | Optional | Application logging level           |

If Gemini is unavailable, the platform can use local processing and deterministic fallback logic for demonstration scenarios where implemented.

---

# 🧭 Incident Command Room

The Incident Command Room is the central operational interface of VARSHANET 2.0.

A typical incident view contains:

```text
┌────────────────────────────────────────────────────┐
│ INCIDENT HEADER                                    │
│ P1 • Critical • Confidence 92 • Risk 87            │
├──────────────────────┬─────────────────────────────┤
│ IMPACT SUMMARY       │ 3-HOUR NOWCAST              │
│                      │                             │
│ Population: 42,500   │ Current ──► +30m ──► +60m │
│ Vulnerable: 8,200    │       ──► +120m ──► +3h   │
├──────────────────────┼─────────────────────────────┤
│ INFRASTRUCTURE       │ RESPONSE ACTIONS            │
│                      │                             │
│ 2 Hospitals          │ 1. Verify road closure     │
│ 1 Railway Station    │ 2. Prepare evacuation      │
│ 3 Schools            │ 3. Alert local authority   │
├──────────────────────┴─────────────────────────────┤
│ INFORMATION GAPS                                   │
│                                                     │
│ ⚠ Road passability unknown                         │
│ [ Trigger Citizen Verification ]                  │
├─────────────────────────────────────────────────────┤
│ EVIDENCE CHAIN                                     │
│ Weather → News → Citizen → Verification            │
├─────────────────────────────────────────────────────┤
│ PREDICTION ACCURACY                                │
│ Predicted vs Actual Outcome                       │
└─────────────────────────────────────────────────────┘
```

---

# 🗺️ Operator Demonstration Flow

A complete judge demonstration can follow this sequence:

### 1. Open National Dashboard

Display the national map and active weather/disaster events.

### 2. Select an Incident

Click an event marker or cluster.

### 3. Automatic Incident Redirection

The map opens the corresponding Incident Command Room.

### 4. Inspect Ground Location

Select:

```text
Open in Google Street View
```

to inspect the incident coordinates.

### 5. Review Intelligence Scores

View:

```text
Evidence Confidence
Impact Risk
Response Priority
```

### 6. Review Impact

Inspect:

* Population exposure
* Vulnerable population
* Critical infrastructure

### 7. Review Nowcast

Inspect:

```text
Current
+30 min
+60 min
+120 min
+3 hours
```

### 8. Review AI Recommendations

Gemini generates structured decision-support actions.

### 9. Identify Information Gap

Example:

```text
Road passability unknown
```

### 10. Trigger Citizen Verification

Create a verification request.

### 11. Receive Citizen Response

Citizen provides ground-level information.

### 12. Update Intelligence

Confidence, risk, and recommendations are recalculated.

### 13. Generate SitRep

Export the current incident intelligence as a Situation Report.

### 14. Evaluate Outcome

Compare predicted impact against the actual event outcome.

---

# 📊 Real Data vs Demonstration Data

VARSHANET distinguishes between real operational information and demonstration/synthetic information.

Where live national-scale datasets are unavailable, the platform may use deterministic simulation data for:

* Critical infrastructure
* Population exposure
* Demonstration incidents
* Prediction trajectories
* Verification responses
* Post-event outcomes

This ensures:

1. Reproducible demonstrations
2. Deterministic hackathon judging
3. Stable UI behavior
4. Clear distinction between simulated and live information

> **Simulation data must never be represented as verified real-world observations.**

---

# 🛡️ Safety & Operational Disclaimer

VARSHANET is a **decision-support and research prototype**.

AI-generated recommendations, nowcasts, simulated infrastructure datasets, and citizen reports should be treated as supporting information rather than authoritative emergency instructions.

For real-world deployment, all emergency actions should be validated against:

* Official IMD warnings
* NDMA/SDMA procedures
* Local administration
* Authorized emergency operations centers
* Applicable disaster-management SOPs

The platform does not replace trained emergency personnel or official disaster-management authorities.

---

# 🇮🇳 Intended Users

VARSHANET is designed around the needs of multiple stakeholders.

| User                            | Primary Use                              |
| ------------------------------- | ---------------------------------------- |
| 👤 Citizens                     | Reporting & safety guidance              |
| 🧑‍💻 Disaster Analysts         | Intelligence & impact analysis           |
| 🛡️ Administrators              | Verification & operational control       |
| 🚨 Emergency Operations Centers | Incident command                         |
| 🏛️ Government Authorities      | Situation awareness & decision support   |
| 🏥 Infrastructure Operators     | Asset-risk awareness                     |
| 🔬 Researchers                  | Disaster intelligence & model evaluation |

---

# 🌐 Potential Future Extensions

The architecture can be extended toward:

* Satellite imagery integration
* Radar data assimilation
* Flood-depth modelling
* River-level forecasting
* Landslide susceptibility modelling
* Cyclone trajectory integration
* Computer-vision analysis of citizen images
* Drone imagery integration
* Advanced PostGIS spatial analytics
* Graph-based infrastructure dependency modelling
* Automated multilingual alerts
* Federated state-level disaster intelligence
* Historical disaster model training
* Real-world CAP integrations
* Model calibration using post-event outcomes

---

# 🏆 Why VARSHANET 2.0?

Most weather platforms answer:

> **"What is the weather?"**

VARSHANET attempts to answer the operational questions that follow:

```text
What happened?
      ↓
Is it real?
      ↓
Where is it?
      ↓
Who is exposed?
      ↓
What infrastructure is threatened?
      ↓
How bad could it become?
      ↓
What information is missing?
      ↓
What should responders consider doing?
      ↓
Can citizens verify the situation?
      ↓
Was our prediction correct?
```

This transforms a conventional weather dashboard into an **impact-centric disaster intelligence and decision-support platform**.

---

# 🤝 Contributing

Contributions are welcome.

Suggested workflow:

```bash
git clone <repository-url>

git checkout -b feature/your-feature

# Make your changes

git add .

git commit -m "feat: add your feature"

git push origin feature/your-feature
```

Then open a Pull Request.

---

# 📜 License

This project is licensed under the **MIT License**.

See:

```text
LICENSE
```

for details.

---

# 🇮🇳 Acknowledgements

VARSHANET is inspired by established Indian meteorological and disaster-management practices.

Special acknowledgement to:

* **India Meteorological Department (IMD)**
* **Ministry of Earth Sciences (MoES)**
* **National Disaster Management Authority (NDMA)**
* **State Disaster Management Authorities (SDMAs)**
* Open-source GIS and geospatial communities
* Google Gemini / Google AI ecosystem
* Open-source Python and JavaScript communities

---

# 📌 Project Vision

> ### **From Weather Detection → To Disaster Impact Intelligence → To Actionable Decision Support**

VARSHANET 2.0 aims to build an intelligence layer that connects **weather, people, infrastructure, AI, geospatial information, and field verification** into one continuous disaster-management feedback loop.

```text
                    VARSHANET 2.0

              ┌─────────────────────┐
              │   WEATHER & EVENTS  │
              └──────────┬──────────┘
                         ↓
              ┌─────────────────────┐
              │  AI EVENT ANALYSIS  │
              └──────────┬──────────┘
                         ↓
              ┌─────────────────────┐
              │   IMPACT NOWCAST    │
              └──────────┬──────────┘
                         ↓
              ┌─────────────────────┐
              │ INCIDENT COMMAND    │
              │       ROOM          │
              └──────────┬──────────┘
                         ↓
              ┌─────────────────────┐
              │ RESPONSE SUPPORT    │
              └──────────┬──────────┘
                         ↓
              ┌─────────────────────┐
              │ CITIZEN VERIFICATION│
              └──────────┬──────────┘
                         ↓
              ┌─────────────────────┐
              │ LEARN & EVALUATE    │
              └──────────┬──────────┘
                         │
                         └───────────────► CONTINUOUS
                                            INTELLIGENCE
```

**VARSHANET 2.0 — Detect earlier. Understand impact. Prioritize action. Close the loop.**
