# 🌧️ VARSHANET 2.0

## National Weather Big Data Analytics & AI Disaster Impact Nowcasting Grid

[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge\&logo=fastapi\&logoColor=white)](https://fastapi.tiangolo.com/)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)](https://react.dev/)
[![AI](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=for-the-badge\&logo=google\&logoColor=white)](https://ai.google.dev/)
[![GIS](https://img.shields.io/badge/GIS-Leaflet%20%2B%20ESRI-199900?style=for-the-badge\&logo=leaflet\&logoColor=white)](https://leafletjs.com/)
[![UI](https://img.shields.io/badge/UI-TailwindCSS%203.4-38B2AC?style=for-the-badge\&logo=tailwindcss\&logoColor=white)](https://tailwindcss.com/)
[![Real-Time](https://img.shields.io/badge/Streaming-WebSockets-010101?style=for-the-badge\&logo=socketdotio\&logoColor=white)](https://websockets.readthedocs.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

VARSHANET 2.0 transforms real-time weather intelligence into an
AI-powered disaster impact nowcasting and decision-support platform
for India.

VARSHANET continuously ingests weather observations, citizen reports,
news signals, and other data sources to detect and correlate emerging
hazards. It then estimates population exposure, critical
infrastructure risk, disaster trajectory, operational priority, and
recommended response actions.

The platform is designed around a closed-loop intelligence cycle:

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

🎯 Problem

India receives enormous volumes of weather and disaster-related
information from heterogeneous sources:

Meteorological observations

Weather APIs

News reports

Social media

Citizen reports

Public datasets

Geospatial information

Critical infrastructure databases

The challenge is not simply detecting bad weather.

The real operational challenge is determining:

"What is happening, who is going to be affected, what infrastructure
is at risk, how severe will the situation become in the next few
hours, and what should authorities do right now?"

Traditional weather dashboards often stop at displaying observations and
warnings.

VARSHANET 2.0 extends this into an impact-centric decision-support
system.

💡 Solution

VARSHANET 2.0 creates a unified operational intelligence layer that
converts raw weather and citizen information into actionable disaster
intelligence.

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

✨ Core Capabilities

1. 🛡️ Three Independent Intelligence Metrics

VARSHANET separates evidence reliability, physical impact, and
operational urgency.

Evidence Confidence --- 0--100

Measures how strongly the available evidence supports the existence and
authenticity of an incident.

Signals may include:

Multi-source agreement

Weather-station correlation

Meteorological observations

Citizen report consistency

Image/media authenticity

Source reliability

Spatial consistency

Impact Risk Index --- 0--100

Measures the potential consequences of the event.

Factors include:

Hazard severity

Precipitation accumulation

Population exposure

Vulnerable population

Infrastructure proximity

Geographic vulnerability

Expected trajectory

Response Priority --- P1--P4

Converts risk into an operational urgency classification.

Priority   Meaning    Operational Interpretation

🔴 P1      Critical   Immediate emergency response
🟠 P2      High       Rapid intervention required
🟡 P3      Moderate   Active monitoring and preparation
🟢 P4      Monitor    Continue observation

Keeping these three dimensions separate prevents a highly uncertain
report from being treated as automatically high-impact.

2. ⏱️ Explainable 3-Hour Impact Nowcasting

VARSHANET projects how an incident may evolve over the next three hours.

The Incident Command Room provides a trajectory across:

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

Each prediction can contain:

Projected risk score

Confidence

Expected severity

Affected area

Population exposure

Infrastructure exposure

Escalation probability

Explanation of contributing factors

The objective is not merely to answer:

"Where is the disaster?"

but:

"Where is the disaster likely to become dangerous next?"

3. 👥 Population & Vulnerability Exposure

The Impact Engine evaluates the population located within an event's
potential impact zone.

Example spatial model:

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

The system can estimate:

Total population exposed

Vulnerable population

Population density

Urban/rural distribution

High-risk population concentration

Geographic exposure

Potential vulnerability indicators include:

Elderly populations

Infants and children

High-density settlements

Informal settlements

Other locally relevant vulnerability indicators

4. 🏥 Critical Infrastructure Risk

VARSHANET evaluates the proximity of hazards to critical infrastructure.

Supported infrastructure categories include:

🏥 Hospitals

🏫 Schools

🚆 Railway stations

✈️ Airports

🌉 Bridges

🛣️ Highways

🏠 Emergency shelters

For every potentially affected asset, the platform can calculate:

Distance from Hazard
        +
Hazard Severity
        +
Asset Vulnerability
        +
Expected Trajectory
        ↓
Infrastructure Risk

This allows operators to prioritize incidents that threaten critical
public infrastructure.

5. 🗺️ Map-to-Incident Command Room

The national map is directly connected to operational intelligence.

When an operator clicks:

Map Marker
    │
    ▼
Incident / Cluster
    │
    ▼
Incident Command Room

The system opens the corresponding incident rather than forcing the
operator to manually search for it.

The Incident Command Room can display:

Incident identity

Location

Evidence Confidence

Impact Risk

Response Priority

Population exposure

Infrastructure risk

Nowcast trajectory

Evidence chain

Recommended actions

Information gaps

Citizen verification

Prediction accuracy

6. 📍 One-Click Google Street View Pinpointing

Each report and incident can provide a ground-location launcher.

Operators can use the incident's latitude and longitude to inspect the
surrounding location using Google Maps / Street View.

Example:

Incident Coordinates
        │
        ▼
┌─────────────────────┐
│ Open Street View    │
└──────────┬──────────┘
           │
           ▼
Google Maps Ground View

This provides an additional visual context layer for operational
assessment.

7. 🤖 Google Gemini AI Action Recommender

VARSHANET uses Google Gemini as an AI decision-support layer.

Gemini can analyze structured and unstructured incident information and
generate operational recommendations.

Example input:

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

Possible recommendation categories include:

Immediate life-safety actions

Evacuation considerations

Road closure recommendations

Emergency resource prioritization

Verification requests

Infrastructure protection

Communication priorities

Important: Gemini recommendations are decision-support outputs and
should not replace authorized emergency-management procedures,
official warnings, or human command decisions.

8. 🌐 Multilingual Intelligence

VARSHANET is designed to handle Indian disaster information across
multiple language styles.

The NLP layer can process:

English

Hindi

Hinglish

Multilingual citizen reports

Example:

"Road pe bahut paani hai, gaadi nahi ja rahi"

        ↓

Language Normalization

        ↓

Semantic Extraction

        ↓

Impact Tags

        ↓

"ROAD_PASSABILITY = BLOCKED"

This allows citizen-generated information to become structured
operational intelligence.

9. 📢 Emergency Multilingual Audio Dispatcher

The platform includes an in-browser emergency communication layer.

Supported capabilities include:

Hindi emergency announcements

English emergency announcements

Synthetic emergency radio-style bulletins

Emergency siren/audio cues

Operator-controlled playback

This provides an additional communication mechanism for demonstrations
and operational interfaces.

10. 📱 Common Alerting Protocol (CAP) Simulation

VARSHANET includes a CAP-style emergency communication simulator.

The simulator can demonstrate:

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

This is intended as a simulation capability and does not directly
transmit cellular broadcast messages.

11. 📄 Automated Situation Report (SitRep)

Operators can generate a structured disaster Situation Report from the
current incident intelligence.

The generated dossier can contain:

Incident summary

Location

Current severity

Evidence confidence

Impact risk

Response priority

Population exposure

Infrastructure exposure

Current situation

Predicted trajectory

Recommended actions

Information gaps

Verification status

Prediction accuracy

The system supports export/printing for operational workflows.

12. 🔄 Information Gaps & Citizen Verification Loop

A major feature of VARSHANET 2.0 is that uncertainty becomes an
actionable task.

Example:

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

Instead of simply displaying:

"Insufficient information"

the platform asks:

"What information is missing, and how can we obtain it?"

13. 🎯 Prediction vs Actual Outcome

VARSHANET includes a post-event evaluation layer.

After an incident:

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

This enables operators and developers to measure:

Prediction error

Risk estimation error

Population exposure error

Infrastructure prediction accuracy

Escalation prediction accuracy

This creates a foundation for improving future models.

14. 🔐 Role-Based Operational Access

VARSHANET provides role-specific interfaces.

👤 Citizen Mode

Designed for public users.

Features include:

Submit disaster reports

GPS-based reporting

Public safety guidance

Gemini-generated safety instructions

View relevant alerts

🧑‍💻 Analyst Mode

Designed for disaster analysts.

Features include:

Incident analysis

3-hour impact nowcasting

Population exposure

Infrastructure risk

Evidence analysis

Information gaps

SitRep generation

🛡️ Admin Mode

Designed for operational verification.

Features include:

Report verification

Report rejection

Misinformation flagging

Verification queue

Incident management

Operational monitoring

🧠 AI & Intelligence Architecture

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

🏗️ Technology Stack

Layer                Technology

Frontend         React 18, TypeScript, Vite
UI               Tailwind CSS 3.4, Lucide Icons
Mapping / GIS    Leaflet, ESRI, OpenStreetMap
Backend          FastAPI, Python 3.10+
API Server       Uvicorn
Validation       Pydantic v2
Database         SQLite / PostgreSQL
ORM              SQLAlchemy 2.0
Geospatial       PostGIS-compatible architecture
Real-Time        Native WebSockets
Cloud AI         Google Gemini API
Local ML         Scikit-Learn
NLP              TF-IDF / language normalization
Deduplication    Simhash
Data Ingestion   RSS / Weather APIs / Citizen APIs
Visualization    Leaflet / Charts
Automation       Background synchronization workers

📂 Project Structure

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

🔌 API Architecture

VARSHANET 2.0 maintains backward compatibility with the existing API
surface.

Existing APIs

GET /api/v1/reports
GET /api/v1/events
GET /api/v1/analytics
GET /api/v1/citizen
WS  /ws/weather

New Impact APIs

GET /api/v1/impact/{event_id}

GET /api/v1/impact/{event_id}/nowcast

GET /api/v1/impact/{event_id}/recommendations

GET /api/v1/impact/{event_id}/information-gaps

POST /api/v1/verification-requests

The new functionality extends the existing platform without
intentionally removing the legacy routes.

🔄 Closed-Loop Decision Workflow

A typical operational cycle is:

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

This workflow can be demonstrated automatically using:

python scripts/simulate_closed_loop_demo.py

🧪 Verification & Testing

Backend API Verification

Test the major impact endpoints:

GET /api/v1/impact/{event_id}
GET /api/v1/impact/{event_id}/nowcast
GET /api/v1/impact/{event_id}/recommendations
GET /api/v1/impact/{event_id}/information-gaps
POST /api/v1/verification-requests

Closed-Loop Demonstration

Run:

python scripts/simulate_closed_loop_demo.py

The demonstration validates the complete intelligence pipeline from
detection through verification and prediction evaluation.

Frontend Build

From the frontend directory:

npm run build

The build should complete without TypeScript or bundling errors.

🚀 Quick Start

Prerequisites

Make sure the following are installed:

Python 3.10+

Node.js 18+

npm

Git

Optional: PostgreSQL + PostGIS

Optional: Google Gemini API key

1. Clone the Repository

git clone https://github.com/your-username/varshanet.git

cd varshanet

2. Backend Setup

Create a Python virtual environment:

Windows

python -m venv venv

venv\Scripts\activate

Linux / macOS

python3 -m venv venv

source venv/bin/activate

Install dependencies:

pip install -r requirements.txt

3. Environment Configuration

Create your environment file:

Windows

copy .env.example .env

Linux / macOS

cp .env.example .env

Configure the required environment variables.

Example:

ENVIRONMENT=development

GEMINI_API_KEY=your_gemini_api_key

DATABASE_URL=sqlite:///./varshanet.db

ALLOWED_ORIGINS=http://localhost:5173

Keep API keys and secrets out of Git. Never commit .env to the
repository.

4. Seed Infrastructure Data

Run:

python scripts/seed_impact_data.py

This initializes the demonstration infrastructure dataset used by the
Impact Engine.

The repository may use deterministic simulation data for hackathon
demonstrations where live national datasets are unavailable.

5. Start the Backend

Run:

uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload

The backend will be available at:

http://localhost:8000

FastAPI documentation:

http://localhost:8000/docs

6. Start the Frontend

Open another terminal:

cd frontend

Install dependencies:

npm install

Start the development server:

npm run dev

Open:

http://localhost:5173

🔐 Environment Variables

Typical configuration:

Variable              Required Description

GEMINI_API_KEY      Optional Google Gemini API access
DATABASE_URL             Yes Database connection
ALLOWED_ORIGINS          Yes Frontend/backend CORS configuration
ENVIRONMENT              Yes Development / production
LOG_LEVEL           Optional Application logging level

If Gemini is unavailable, the platform can use local processing and
deterministic fallback logic for demonstration scenarios where
implemented.

🧭 Incident Command Room

The Incident Command Room is the central operational interface of
VARSHANET 2.0.

A typical incident view contains:

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

🗺️ Operator Demonstration Flow

A complete judge demonstration can follow this sequence:

1. Open National Dashboard

Display the national map and active weather/disaster events.

2. Select an Incident

Click an event marker or cluster.

3. Automatic Incident Redirection

The map opens the corresponding Incident Command Room.

4. Inspect Ground Location

Select:

Open in Google Street View

to inspect the incident coordinates.

5. Review Intelligence Scores

View:

Evidence Confidence
Impact Risk
Response Priority

6. Review Impact

Inspect:

Population exposure

Vulnerable population

Critical infrastructure

7. Review Nowcast

Inspect:

Current
+30 min
+60 min
+120 min
+3 hours

8. Review AI Recommendations

Gemini generates structured decision-support actions.

9. Identify Information Gap

Example:

Road passability unknown

10. Trigger Citizen Verification

Create a verification request.

11. Receive Citizen Response

Citizen provides ground-level information.

12. Update Intelligence

Confidence, risk, and recommendations are recalculated.

13. Generate SitRep

Export the current incident intelligence as a Situation Report.

14. Evaluate Outcome

Compare predicted impact against the actual event outcome.

📊 Real Data vs Demonstration Data

VARSHANET distinguishes between real operational information and
demonstration/synthetic information.

Where live national-scale datasets are unavailable, the platform may use
deterministic simulation data for:

Critical infrastructure

Population exposure

Demonstration incidents

Prediction trajectories

Verification responses

Post-event outcomes

This ensures:

Reproducible demonstrations

Deterministic hackathon judging

Stable UI behavior

Clear distinction between simulated and live information

Simulation data must never be represented as verified real-world
observations.

🛡️ Safety & Operational Disclaimer

VARSHANET is a decision-support and research prototype.

AI-generated recommendations, nowcasts, simulated infrastructure
datasets, and citizen reports should be treated as supporting
information rather than authoritative emergency instructions.

For real-world deployment, all emergency actions should be validated
against:

Official IMD warnings

NDMA/SDMA procedures

Local administration

Authorized emergency operations centers

Applicable disaster-management SOPs

The platform does not replace trained emergency personnel or official
disaster-management authorities.

🇮🇳 Intended Users

VARSHANET is designed around the needs of multiple stakeholders.

User                           Primary Use

👤 Citizens                    Reporting & safety guidance

🧑‍💻 Disaster Analysts           Intelligence & impact analysis

🛡️ Administrators              Verification & operational control

🚨 Emergency Operations        Incident command
Centers

🏛️ Government Authorities      Situation awareness & decision support

🏥 Infrastructure Operators    Asset-risk awareness

🔬 Researchers                 Disaster intelligence & model evaluation

🌐 Potential Future Extensions

The architecture can be extended toward:

Satellite imagery integration

Radar data assimilation

Flood-depth modelling

River-level forecasting

Landslide susceptibility modelling

Cyclone trajectory integration

Computer-vision analysis of citizen images

Drone imagery integration

Advanced PostGIS spatial analytics

Graph-based infrastructure dependency modelling

Automated multilingual alerts

Federated state-level disaster intelligence

Historical disaster model training

Real-world CAP integrations

Model calibration using post-event outcomes

🏆 Why VARSHANET 2.0?

Most weather platforms answer:

"What is the weather?"

VARSHANET attempts to answer the operational questions that follow:

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

This transforms a conventional weather dashboard into an
impact-centric disaster intelligence and decision-support platform.

🤝 Contributing

Contributions are welcome.

Suggested workflow:

git clone <repository-url>

git checkout -b feature/your-feature

# Make your changes

git add .

git commit -m "feat: add your feature"

git push origin feature/your-feature

Then open a Pull Request.

📜 License

This project is licensed under the MIT License.

See:

LICENSE

for details.

🇮🇳 Acknowledgements

VARSHANET is inspired by established Indian meteorological and
disaster-management practices.

Special acknowledgement to:

India Meteorological Department (IMD)

Ministry of Earth Sciences (MoES)

National Disaster Management Authority (NDMA)

State Disaster Management Authorities (SDMAs)

Open-source GIS and geospatial communities

Google Gemini / Google AI ecosystem

Open-source Python and JavaScript communities

📌 Project Vision

From Weather Detection → To Disaster Impact Intelligence → To Actionable Decision Support

VARSHANET 2.0 aims to build an intelligence layer that connects
weather, people, infrastructure, AI, geospatial information, and field
verification into one continuous disaster-management feedback loop.

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

VARSHANET 2.0 --- Detect earlier. Understand impact. Prioritize
action. Close the loop.

🏗️ Complete Build & Implementation Explanation

1. What VARSHANET 2.0 Is

VARSHANET 2.0 is a national-scale weather and disaster intelligence
platform designed to move beyond a conventional weather dashboard.

A conventional dashboard primarily answers:

What is the weather?

VARSHANET adds the operational questions:

What happened?
Is it real?
Where is it happening?
Who is exposed?
What infrastructure is threatened?
How bad could it become in the next few hours?
What information is missing?
What action should responders consider?
Can citizens verify the situation?
Was the prediction correct?

The platform therefore follows a closed-loop intelligence model:

WEATHER / NEWS / CITIZEN SIGNALS
                │
                ▼
        DATA INGESTION
                │
                ▼
       NLP + NORMALIZATION
                │
                ▼
     DEDUPLICATION + GEOLOCATION
                │
                ▼
 EVENT DETECTION + SPATIOTEMPORAL
          CORRELATION
                │
                ▼
         INCIDENT CREATION
                │
        ┌───────┴────────┐
        ▼                ▼
 EVIDENCE CONFIDENCE   IMPACT ENGINE
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
          POPULATION  INFRASTRUCTURE NOWCAST
           EXPOSURE       RISK
              │          │          │
              └──────────┼──────────┘
                         ▼
                RESPONSE PRIORITY
                     P1–P4
                         │
                         ▼
                 GEMINI DECISION
                    SUPPORT
                         │
                         ▼
                INFORMATION GAPS
                         │
                         ▼
              CITIZEN VERIFICATION
                         │
                         ▼
                INTELLIGENCE UPDATE
                         │
                         ▼
                 SITREP / ACTION
                         │
                         ▼
              PREDICTION VS ACTUAL
                         │
                         ▼
                  MODEL LEARNING

2. System Architecture

VARSHANET is divided into six major logical layers.

Layer 1 --- Data Ingestion

This layer collects information from multiple sources.

Examples:

Weather APIs

Meteorological observations

RSS/news feeds

Citizen reports

Public datasets

Social/weather signals

Geospatial datasets

The ingestion layer converts heterogeneous inputs into a common internal
representation.

Weather API ───────┐
News/RSS ──────────┤
Citizen Reports ───┼──► Normalized Event/Report Records
Public Data ───────┤
Other Sources ─────┘

The repository separates ingestion connectors from processing logic so
that additional sources can be added without rewriting the impact
engine.

3. NLP and Text Normalization

Citizen and news information may not arrive in a consistent format.

For example:

"Road pe bahut paani hai, gaadi nahi ja rahi"

can be converted into structured information:

language = Hinglish
hazard = FLOOD
road_passability = BLOCKED
impact_type = TRANSPORT_DISRUPTION

The NLP layer is designed around:

Language normalization

TF-IDF/local NLP processing

Semantic extraction

Disaster-related keyword/entity detection

Multilingual handling

Structured impact tags

Supported language styles include:

English

Hindi

Hinglish

Multilingual citizen reports

The objective is to transform unstructured human reports into
machine-processable intelligence.

4. Simhash Deduplication

Large-scale ingestion can receive multiple copies of the same event.

For example:

Source A:
"Heavy flooding reported in Bhopal"

Source B:
"Flooding has been reported in Bhopal"

Source C:
"Bhopal roads are heavily flooded"

These reports may refer to the same underlying event.

The deduplication layer uses similarity-based processing, including
Simhash, to reduce repeated signals.

Conceptually:

SOURCE 1 ──┐
SOURCE 2 ──┼──► Similarity Analysis ──► Same Event?
SOURCE 3 ──┘

This prevents a single event from being incorrectly interpreted as many
independent disasters.

5. Geolocation

Reports need a geographic context before they can be correlated
spatially.

The geolocation layer associates reports with:

Latitude

Longitude

Place names

Administrative areas

Event regions

Once reports have coordinates, they can be compared spatially.

Report
  │
  ├── Text
  ├── Timestamp
  └── Location
          │
          ▼
    Spatial Processing

6. Spatiotemporal Clustering

Disaster information is both geographic and time-dependent.

Two reports may belong to the same incident when:

They occur near one another.

They occur within a relevant time window.

Their hazard categories are compatible.

Their descriptions provide supporting evidence.

The clustering layer therefore combines:

SPACE + TIME + SEMANTIC SIMILARITY

to form incident clusters.

Example:

Citizen Report A ─┐
Weather Signal ───┼──► Cluster ─► Incident
News Report B ────┤
Citizen Report C ─┘

7. Incident Creation

After correlation, the system creates an operational incident.

An incident is more useful than an isolated report because it can
contain:

Incident identity

Hazard type

Coordinates

Supporting evidence

Evidence confidence

Impact risk

Response priority

Population exposure

Infrastructure exposure

Nowcast trajectory

Recommendations

Information gaps

Verification state

Prediction accuracy

The incident becomes the central object shared by the map, dashboard,
command room, APIs, and decision-support engine.

8. Three Independent Intelligence Metrics

One of the most important architectural decisions is keeping three
different concepts separate.

Evidence Confidence

Range:

0–100

It answers:

How strongly does the evidence support the existence and authenticity
of the incident?

Possible inputs:

Multi-source agreement

Weather-station correlation

Citizen report consistency

Media authenticity

Source reliability

Spatial consistency

Impact Risk

Range:

0–100

It answers:

How serious could the consequences be?

Possible inputs:

Hazard severity

Rainfall accumulation

Population exposure

Vulnerable population

Infrastructure proximity

Geographic vulnerability

Predicted trajectory

Response Priority

Range:

P1–P4

P1 = Critical
P2 = High
P3 = Moderate
P4 = Monitor

Keeping these metrics independent prevents a low-confidence report from
automatically becoming a high-priority emergency.

9. Population Exposure Engine

The population engine estimates how many people may fall inside a
potential impact area.

A simplified spatial model is:

                15 km Impact Zone
        ┌─────────────────────────────┐
        │                             │
        │       Vulnerable Area       │
        │        ┌───────────┐        │
        │        │   5 km    │        │
        │        │   CORE    │        │
        │        └───────────┘        │
        │                             │
        └─────────────────────────────┘

The engine can calculate or expose:

Total population exposed

Vulnerable population

Population density

Urban/rural distribution

High-risk population concentration

Geographic exposure

Potential vulnerability indicators include:

Elderly populations

Infants and children

High-density settlements

Informal settlements

Other locally relevant vulnerability indicators

For demonstrations, these values may come from deterministic/synthetic
datasets where live national-scale datasets are unavailable.

10. Infrastructure Risk Engine

Critical infrastructure is evaluated spatially against the hazard.

Supported categories include:

Hospitals

Schools

Railway stations

Airports

Bridges

Highways

Emergency shelters

A conceptual risk model is:

Distance from Hazard
        +
Hazard Severity
        +
Asset Vulnerability
        +
Expected Trajectory
        │
        ▼
Infrastructure Risk

The output can identify assets that deserve immediate operator
attention.

Example:

Incident
  │
  ├── 2 Hospitals
  ├── 1 Railway Station
  └── 3 Schools

11. Impact Engine

The impact engine combines the different impact components.

                  IMPACT ENGINE
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
 Population       Infrastructure   Vulnerability
 Exposure             Risk             Model
        │              │              │
        └──────────────┼──────────────┘
                       ▼
                  Impact Risk
                       │
                       ▼
                Response Priority

The engine is implemented through modular processing components so that
population, infrastructure, vulnerability, nowcasting, recommendations,
information gaps, and explainability can evolve independently.

12. Three-Hour Impact Nowcasting

The nowcasting layer does not only report current conditions.

It estimates how the incident may evolve.

The operational timeline is:

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

Each nowcast can include:

Projected risk

Confidence

Expected severity

Affected area

Population exposure

Infrastructure exposure

Escalation probability

Explanation of contributing factors

The objective is:

Where is the incident likely to become dangerous next?

13. Explainability

A disaster intelligence system should not only provide a number.

For example:

Impact Risk = 87

should be explainable through factors such as:

High rainfall
      +
Dense population
      +
Hospital proximity
      +
Increasing trajectory
      ↓
High Impact Risk

The repository therefore includes an explainability component intended
to expose contributing factors alongside predictions.

14. Google Gemini Decision-Support Layer

Google Gemini acts as a decision-support layer rather than the source of
the core deterministic measurements.

The platform can provide Gemini with structured incident information
such as:

Hazard:
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

Gemini can then generate structured recommendation categories:

Life-safety considerations

Evacuation considerations

Road closure considerations

Emergency resource prioritization

Verification requests

Infrastructure protection

Communication priorities

Important:

Gemini recommendations are decision-support outputs. They do not replace
authorized emergency-management procedures, official warnings, or human
command decisions.

15. Local ML Fallback

The architecture also provides a local-processing path.

The AI architecture includes:

                    ┌───────────────┐
                    │ Incident Data │
                    └───────┬───────┘
                            │
                 ┌──────────┴──────────┐
                 ▼                     ▼
          Google Gemini          Local ML Fallback
                 │                     │
                 │             TF-IDF / Simhash
                 │                     │
                 └──────────┬──────────┘
                            ▼
                  Decision-Support Layer

This allows demonstration scenarios to remain functional when cloud AI
is unavailable, where fallback logic has been implemented.

16. Information Gap Detection

A major design principle is:

Uncertainty becomes an actionable task.

Instead of merely saying:

Road status unknown

the system converts the uncertainty into:

Information Gap
      ↓
Verification Request
      ↓
Citizen Ground Report
      ↓
Evidence Updated
      ↓
Confidence/Risk Recalculated
      ↓
Recommendations Updated

This creates a closed feedback loop.

17. Citizen Verification

Citizens can provide ground-level observations.

A verification cycle can be:

Operator identifies gap
          ↓
Verification request
          ↓
Citizen submits report
          ↓
GPS/location + observation
          ↓
Backend receives report
          ↓
Evidence chain updated
          ↓
Incident intelligence recalculated

This turns citizen participation into a structured evidence source
rather than simply a generic feedback form.

18. Incident Command Room

The Incident Command Room is the central operational interface.

A typical incident view contains:

┌────────────────────────────────────────────────────┐
│ INCIDENT HEADER                                    │
│ P1 • Critical • Confidence 92 • Risk 87            │
├──────────────────────┬─────────────────────────────┤
│ IMPACT SUMMARY       │ 3-HOUR NOWCAST              │
│                      │                             │
│ Population: 42,500   │ Current → +30m → +60m       │
│ Vulnerable: 8,200    │       → +120m → +3h         │
├──────────────────────┼─────────────────────────────┤
│ INFRASTRUCTURE       │ RESPONSE ACTIONS            │
│                      │                             │
│ 2 Hospitals          │ 1. Verify road closure     │
│ 1 Railway Station    │ 2. Prepare evacuation      │
│ 3 Schools            │ 3. Alert local authority   │
├──────────────────────┴─────────────────────────────┤
│ INFORMATION GAPS                                   │
│ Road passability unknown                           │
│ [ Trigger Citizen Verification ]                  │
├─────────────────────────────────────────────────────┤
│ EVIDENCE CHAIN                                     │
│ Weather → News → Citizen → Verification            │
├─────────────────────────────────────────────────────┤
│ PREDICTION ACCURACY                                │
│ Predicted vs Actual Outcome                        │
└─────────────────────────────────────────────────────┘

The command room connects:

Map
 ↓
Incident
 ↓
Impact
 ↓
Nowcast
 ↓
Recommendations
 ↓
Verification
 ↓
SitRep
 ↓
Evaluation

19. Map-to-Incident Navigation

The map is not isolated from the rest of the application.

When an operator selects a map marker:

Map Marker
    ↓
Incident / Cluster
    ↓
Incident Command Room

The corresponding incident is opened directly.

This reduces the number of manual steps required by an operator.

20. Google Street View Pinpointing

Each incident can expose its latitude and longitude.

The UI can provide a ground-location launcher:

Incident Coordinates
        ↓
Open Street View
        ↓
Google Maps Ground View

This provides additional visual context for assessing the surrounding
environment.

This is a navigation/visual-assessment feature and should not be
interpreted as proof that an incident exists.

21. Multilingual Emergency Audio

The platform includes an in-browser communication layer.

Capabilities include:

Hindi announcements

English announcements

Synthetic radio-style bulletins

Emergency siren/audio cues

Operator-controlled playback

The audio layer is intended as an additional communication mechanism for
the prototype and demonstrations.

22. CAP-Style Alert Simulation

VARSHANET includes a Common Alerting Protocol-style simulator.

The conceptual flow is:

Incident
   ↓
Geo-fenced Impact Area
   ↓
Affected Population
   ↓
Emergency Alert
   ↓
Estimated Subscriber Reach

This is a simulation capability.

It does not directly transmit cellular broadcast messages.

23. Automated Situation Report

The platform can generate a structured Situation Report.

A SitRep may contain:

Incident summary

Location

Current severity

Evidence confidence

Impact risk

Response priority

Population exposure

Infrastructure exposure

Current situation

Predicted trajectory

Recommended actions

Information gaps

Verification status

Prediction accuracy

The report can be exported or printed for operational workflows.

24. Prediction vs Actual Evaluation

After an incident, VARSHANET can compare:

Predicted Impact
       ↓
Actual Outcome
       ↓
Prediction Delta
       ↓
Accuracy Evaluation

Possible evaluation metrics include:

Prediction error

Risk estimation error

Population exposure error

Infrastructure prediction accuracy

Escalation prediction accuracy

This creates a foundation for future model calibration.

25. Role-Based Interfaces

Citizen Mode

Designed for public users.

Capabilities:

Disaster reports

GPS-based reporting

Public safety guidance

Gemini safety guidance

Relevant alerts

Analyst Mode

Designed for disaster analysts.

Capabilities:

Incident analysis

Impact nowcasting

Population exposure

Infrastructure risk

Evidence analysis

Information gaps

SitRep generation

Admin Mode

Designed for operational verification.

Capabilities:

Report verification

Report rejection

Misinformation flagging

Verification queue

Incident management

Operational monitoring

26. Frontend Architecture

The frontend uses:

React 18
TypeScript
Vite
Tailwind CSS
Leaflet
Charts
Lucide Icons

The frontend is organized into:

frontend/
└── src/
    ├── components/
    │   ├── map/
    │   ├── incident/
    │   │   ├── IncidentHeader.tsx
    │   │   ├── StreetViewPin.tsx
    │   │   ├── ImpactSummary.tsx
    │   │   ├── RiskTrajectory.tsx
    │   │   ├── InfrastructureRisk.tsx
    │   │   ├── ResponseActions.tsx
    │   │   ├── InformationGaps.tsx
    │   │   ├── EvidenceChain.tsx
    │   │   └── PredictionAccuracy.tsx
    │   └── common/
    │
    ├── pages/
    │   ├── IncidentCommandRoomPage.tsx
    │   ├── CitizenPage.tsx
    │   ├── DashboardPage.tsx
    │   ├── MapPage.tsx
    │   ├── AnalyticsPage.tsx
    │   └── AdminPage.tsx
    │
    ├── services/
    │   └── api.ts
    │
    └── types/
        └── index.ts

Frontend responsibilities

The frontend:

Requests data from FastAPI.

Maintains application state.

Displays maps and incidents.

Visualizes risk and trajectory.

Displays infrastructure and population impact.

Sends citizen/admin actions to APIs.

Connects to the WebSocket weather stream.

Provides operator workflows.

The frontend should not be responsible for authoritative risk
calculations. Those belong in backend/processing services.

27. Backend Architecture

The backend uses:

Python
FastAPI
Uvicorn
Pydantic v2
SQLAlchemy 2.0
SQLite / PostgreSQL

Structure:

backend/
└── app/
    ├── api/
    │   └── v1/
    │       ├── reports.py
    │       ├── events.py
    │       ├── analytics.py
    │       ├── citizen.py
    │       ├── impact.py
    │       └── verification_requests.py
    │
    ├── core/
    │   ├── config.py
    │   ├── database.py
    │   └── security.py
    │
    ├── models/
    │   └── models.py
    │
    ├── schemas/
    │   └── schemas.py
    │
    └── main.py

Backend responsibilities

The backend:

Exposes REST APIs.

Validates incoming requests.

Handles database access.

Coordinates processing services.

Provides incident data.

Provides impact intelligence.

Handles citizen reports.

Handles verification requests.

Provides the WebSocket weather stream.

Integrates AI services where configured.

28. Processing Architecture

Processing services are intentionally separated from API route handlers.

processing/
├── clustering/
├── deduplication/
├── geolocation/
├── nlp/
├── verification/
└── impact/
    ├── population_exposure.py
    ├── infrastructure_risk.py
    ├── vulnerability_engine.py
    ├── impact_nowcaster.py
    ├── response_recommender.py
    ├── information_gaps.py
    ├── explainability.py
    └── impact_engine.py

This separation makes the architecture easier to test and extend.

For example:

API Route
   ↓
Impact Engine
   ├── Population Exposure
   ├── Infrastructure Risk
   ├── Vulnerability
   ├── Nowcast
   ├── Recommendations
   └── Information Gaps

29. Database Layer

The architecture supports:

SQLite
PostgreSQL
PostGIS-compatible spatial architecture

SQLite is useful for local demonstrations because it has minimal setup
requirements.

PostgreSQL/PostGIS is more appropriate for a larger production-oriented
deployment where advanced spatial queries and concurrent workloads are
required.

SQLAlchemy 2.0 provides the database abstraction layer.

30. API Architecture

The platform maintains the existing API surface.

Existing APIs

GET /api/v1/reports
GET /api/v1/events
GET /api/v1/analytics
GET /api/v1/citizen
WS  /ws/weather

Impact APIs

GET /api/v1/impact/{event_id}

GET /api/v1/impact/{event_id}/nowcast

GET /api/v1/impact/{event_id}/recommendations

GET /api/v1/impact/{event_id}/information-gaps

POST /api/v1/verification-requests

The new impact functionality extends the existing API surface rather
than intentionally removing the legacy routes.

31. End-to-End Request Flow

A typical frontend request works like this:

React Component
      ↓
services/api.ts
      ↓
HTTP Request
      ↓
FastAPI Route
      ↓
Pydantic Validation
      ↓
Service / Processing Layer
      ↓
Database / Intelligence Engine
      ↓
Structured Response
      ↓
React State
      ↓
Visualization

For example:

User clicks incident
       ↓
GET /api/v1/impact/{event_id}
       ↓
FastAPI
       ↓
Impact Engine
       ↓
Population + Infrastructure + Risk
       ↓
JSON Response
       ↓
Incident Command Room

32. WebSocket Real-Time Flow

Real-time weather/event information uses the WebSocket endpoint:

Frontend
   │
   │ WebSocket
   ▼
/ws/weather
   │
   ▼
FastAPI WebSocket Handler
   │
   ▼
Real-Time Weather/Event Data
   │
   ▼
Frontend Live Components

The WebSocket feed is separate from normal REST API requests.

REST is appropriate for request/response operations.

WebSockets are appropriate for continuously changing live information.

33. Environment Configuration

Create:

.env

from:

.env.example

Example:

ENVIRONMENT=development

GEMINI_API_KEY=your_gemini_api_key

DATABASE_URL=sqlite:///./varshanet.db

ALLOWED_ORIGINS=http://localhost:5173

LOG_LEVEL=info

Typical variables:

Variable              Required Purpose

GEMINI_API_KEY      Optional Google Gemini access
DATABASE_URL             Yes Database connection
ALLOWED_ORIGINS          Yes CORS configuration
ENVIRONMENT              Yes Development/production mode
LOG_LEVEL           Optional Logging level

Never commit .env to GitHub.

34. Complete Local Build Procedure

Prerequisites

Install:

Python 3.10+
pip
Node.js 18+
npm
Git

Optional:

PostgreSQL
PostGIS
Google Gemini API key

Step 1 --- Navigate to the Repository

cd C:\Users\himar\.gemini\antigravity\scratch\varshanet

Step 2 --- Create the Python Environment

python -m venv venv

Activate it:

venv\Scripts\activate

Step 3 --- Install Backend Dependencies

pip install -r requirements.txt

Step 4 --- Configure Environment Variables

copy .env.example .env

Edit .env with your local configuration.

Step 5 --- Seed Demonstration Infrastructure

python scripts/seed_impact_data.py

This initializes the demonstration infrastructure dataset used by the
Impact Engine.

Step 6 --- Start Backend

python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload

Open:

http://localhost:8000

Swagger:

http://localhost:8000/docs

WebSocket:

ws://localhost:8000/ws/weather

Step 7 --- Start Frontend

Open a second terminal:

cd C:\Users\himar\.gemini\antigravity\scratch\varshanet\frontend

Install packages:

npm install

Start Vite:

npm run dev

Open:

http://localhost:5173

Step 8 --- Run the Closed-Loop Simulation

Open a third terminal:

cd C:\Users\himar\.gemini\antigravity\scratch\varshanet

Run:

python scripts/simulate_closed_loop_demo.py

This demonstrates the complete intelligence lifecycle.

35. Three-Terminal Development Setup

For the easiest local workflow:

Terminal 1 --- Backend

cd C:\Users\himar\.gemini\antigravity\scratch\varshanet
venv\Scripts\activate
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload

Terminal 2 --- Frontend

cd C:\Users\himar\.gemini\antigravity\scratch\varshanet\frontend
npm run dev

Terminal 3 --- Simulation

cd C:\Users\himar\.gemini\antigravity\scratch\varshanet
python scripts/simulate_closed_loop_demo.py

36. Verification Checklist

After starting the system, verify:

Backend

Open:

http://localhost:8000

Then:

http://localhost:8000/docs

Confirm Swagger loads.

Frontend

Open:

http://localhost:5173

Confirm the dashboard loads.

Database

Confirm the configured database can be accessed.

API

Test:

GET /api/v1/reports
GET /api/v1/events
GET /api/v1/analytics
GET /api/v1/citizen

Then test:

GET /api/v1/impact/{event_id}
GET /api/v1/impact/{event_id}/nowcast
GET /api/v1/impact/{event_id}/recommendations
GET /api/v1/impact/{event_id}/information-gaps

Frontend Build

From frontend:

npm run build

The build should complete without TypeScript or bundling errors.

37. Project Scripts

The repository includes important utility scripts:

scripts/
├── seed_impact_data.py
└── simulate_closed_loop_demo.py

seed_impact_data.py

Purpose:

Initialize demonstration infrastructure/impact data

Use:

python scripts/seed_impact_data.py

simulate_closed_loop_demo.py

Purpose:

Demonstrate the end-to-end disaster intelligence workflow

Use:

python scripts/simulate_closed_loop_demo.py

38. Complete Repository Structure

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
│   ├── clustering/
│   ├── deduplication/
│   ├── geolocation/
│   ├── nlp/
│   ├── verification/
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
│   │   │   └── common/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
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

39. Technology Stack

Layer                  Technology

Frontend               React 18
Language               TypeScript
Build Tool             Vite
UI                     Tailwind CSS 3.4
Icons                  Lucide
Mapping                Leaflet
GIS                    ESRI / OpenStreetMap
Backend                FastAPI
Runtime                Python 3.10+
API Server             Uvicorn
Validation             Pydantic v2
Database               SQLite / PostgreSQL
ORM                    SQLAlchemy 2.0
Spatial Architecture   PostGIS-compatible
Real-Time              Native WebSockets
Cloud AI               Google Gemini API
Local ML               Scikit-Learn
NLP                    TF-IDF / language normalization
Deduplication          Simhash
Ingestion              RSS / Weather APIs / Citizen APIs
Visualization          Leaflet / Charts
Automation             Background synchronization workers

40. Operator Demonstration Flow

A strong hackathon demonstration should show the complete chain rather
than only the dashboard.

1. Open Overview

Show:

National counters

Active incidents

National map

Live emergency status

2. Select Incident

Click an incident on the map.

3. Open Command Room

Show the incident-specific intelligence.

4. Show Ground Location

Use the Street View launcher.

5. Explain Three Scores

Show:

Evidence Confidence
Impact Risk
Response Priority

6. Show Population Exposure

Explain:

Total population
Vulnerable population
Impact zone

7. Show Infrastructure

Point out:

Hospitals
Railway stations
Schools
Roads
Bridges

8. Show Nowcast

Walk through:

Current
+30m
+60m
+120m
+3h

9. Show AI Recommendations

Explain that Gemini provides decision-support suggestions.

10. Show Information Gap

Example:

Road passability unknown

11. Trigger Citizen Verification

Create the verification request.

12. Submit Ground Report

Show the citizen-side response.

13. Recalculate Intelligence

Show how evidence, risk, and recommendations can change.

14. Generate SitRep

Create the operational report.

15. Evaluate Prediction

Show:

Predicted
   vs
Actual

This demonstrates the complete closed loop.

41. Real Data vs Demonstration Data

VARSHANET explicitly distinguishes between real operational information
and simulation data.

Where live national-scale data is unavailable, the platform may use
deterministic data for:

Critical infrastructure

Population exposure

Demonstration incidents

Prediction trajectories

Verification responses

Post-event outcomes

This approach provides:

Reproducible demonstrations

Deterministic hackathon judging

Stable UI behavior

Clear separation between simulated and live information

Simulation data must never be presented as verified real-world
observations.

42. Safety and Operational Boundaries

VARSHANET is a:

Decision-support and research prototype.

The system should not be presented as an autonomous emergency authority.

AI recommendations, citizen reports, nowcasts, and simulated data are
supporting information.

Real-world emergency actions should be validated against:

Official IMD warnings

NDMA/SDMA procedures

Local administration

Authorized Emergency Operations Centers

Applicable disaster-management SOPs

43. Scalability Direction

The architecture is designed so that local demonstration components can
evolve toward larger deployments.

Potential production evolution includes:

SQLite
  ↓
PostgreSQL/PostGIS

Local connectors
  ↓
Distributed ingestion

Single worker
  ↓
Background worker cluster

Local simulation
  ↓
Live data pipelines

Simple spatial calculations
  ↓
Advanced PostGIS analytics

Basic nowcasting
  ↓
Trained forecasting models

Single application
  ↓
Distributed services

The repository's architecture should therefore be treated as a prototype
foundation rather than a claim of production-scale infrastructure.

44. Future Extensions

Possible extensions include:

Satellite imagery

Radar data assimilation

Flood-depth modelling

River-level forecasting

Landslide susceptibility modelling

Cyclone trajectory integration

Computer-vision analysis of citizen images

Drone imagery

Advanced PostGIS analytics

Infrastructure dependency graphs

Automated multilingual alerts

Federated state-level disaster intelligence

Historical disaster model training

Real-world CAP integrations

Post-event model calibration

45. What Happens When a Disaster Signal Arrives?

The complete system behavior can be understood through one example.

Suppose the system receives:

"Heavy flooding reported near Bhopal railway station."

Stage 1 --- Ingestion

The report enters the ingestion layer.

Stage 2 --- NLP

The system extracts:

Hazard = Flood
Location = Bhopal
Infrastructure = Railway Station

Stage 3 --- Deduplication

The system checks whether similar reports already exist.

Stage 4 --- Geolocation

The report is associated with coordinates.

Stage 5 --- Clustering

The system checks nearby reports and weather signals.

Stage 6 --- Incident Creation

A correlated incident is created or updated.

Stage 7 --- Evidence Confidence

Multiple supporting sources can increase confidence.

Stage 8 --- Impact Engine

The engine evaluates:

Population
Infrastructure
Vulnerability
Hazard severity
Trajectory

Stage 9 --- Impact Risk

The system calculates the impact-risk representation.

Stage 10 --- Response Priority

The risk is converted into an operational priority.

Stage 11 --- Nowcasting

The system estimates how the situation could evolve over the next three
hours.

Stage 12 --- Gemini

Gemini receives structured incident information and generates
decision-support recommendations.

Stage 13 --- Information Gap

Suppose road status is unknown.

The system creates:

Road Passability Verification Request

Stage 14 --- Citizen Verification

A citizen provides a ground report.

Stage 15 --- Recalculation

The evidence state and associated intelligence can be updated.

Stage 16 --- SitRep

The operator generates a structured Situation Report.

Stage 17 --- Evaluation

The prediction is later compared with the actual outcome.

This is the central VARSHANET closed-loop concept.

46. Troubleshooting

Backend does not start

Check:

python --version

Then:

pip --version

Confirm the virtual environment is active.

Reinstall dependencies:

pip install -r requirements.txt

uvicorn is not recognized

Use:

python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload

instead of calling uvicorn directly.

Frontend dependencies are missing

From frontend:

npm install

Then:

npm run dev

Frontend build fails

Run:

npm run build

Read the first TypeScript or bundling error and fix that error before
addressing downstream errors.

API returns errors

First open:

http://localhost:8000/docs

Use Swagger to determine whether the backend endpoint itself is working.

If Swagger works but the frontend fails, inspect the frontend API base
URL and request path.

CORS problems

Check:

ALLOWED_ORIGINS=http://localhost:5173

Restart the backend after changing .env.

Gemini does not respond

Check:

GEMINI_API_KEY=your_gemini_api_key

Then restart the backend.

If the implementation includes local fallback logic, the system may
still support demonstration scenarios without cloud AI.

47. Development Principles

The project follows several architectural principles.

Separation of Concerns

Frontend, API, processing, ingestion, and database responsibilities are
separated.

Explainability

Important predictions should expose contributing factors.

Human-in-the-Loop

AI supports operators instead of replacing authorized decision-makers.

Evidence Before Escalation

Confidence, impact, and urgency are separate dimensions.

Closed-Loop Verification

Unknown information becomes a verification task.

Reproducibility

Demonstration data can be deterministic where live data is unavailable.

Extensibility

New ingestion sources, models, and spatial datasets can be added without
redesigning the entire application.

48. Final Architecture Summary

                         VARSHANET 2.0
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
       WEATHER              NEWS             CITIZENS
          │                   │                   │
          └───────────────────┼───────────────────┘
                              ▼
                       INGESTION LAYER
                              │
                              ▼
                  NLP / NORMALIZATION
                              │
                              ▼
                DEDUPLICATION / GEOLOCATION
                              │
                              ▼
               SPATIOTEMPORAL CLUSTERING
                              │
                              ▼
                     INCIDENT CREATION
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
          EVIDENCE          IMPACT           NOWCAST
          CONFIDENCE        ENGINE            ENGINE
                              │
                 ┌────────────┼────────────┐
                 ▼            ▼            ▼
             POPULATION   INFRASTRUCTURE VULNERABILITY
                              │
                              ▼
                       RESPONSE PRIORITY
                              │
                              ▼
                      GEMINI AI SUPPORT
                              │
                              ▼
                      INFORMATION GAPS
                              │
                              ▼
                    CITIZEN VERIFICATION
                              │
                              ▼
                      INTELLIGENCE UPDATE
                              │
                  ┌───────────┴───────────┐
                  ▼                       ▼
               SITREP             PREDICTION EVALUATION
                                          │
                                          ▼
                                  MODEL CALIBRATION

49. One-Line Project Explanation

VARSHANET 2.0 is an impact-centric national weather intelligence
platform that converts multi-source weather and citizen signals into
verified incidents, population and infrastructure exposure, three-hour
impact nowcasts, response priorities, AI-assisted recommendations,
citizen verification tasks, and post-event learning.

50. Project Vision

FROM

Weather Detection

        ↓

TO

Disaster Impact Intelligence

        ↓

TO

Operational Decision Support

        ↓

TO

Citizen-Verified Intelligence

        ↓

TO

Continuous Learning

VARSHANET 2.0 --- Detect earlier. Understand impact. Prioritize
action. Close the loop.
