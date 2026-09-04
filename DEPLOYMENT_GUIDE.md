# 🚀 VARSHANET 2.0: Online Cloud Deployment Guide

VARSHANET 2.0 is fully pre-configured for instant zero-downtime deployment on cloud platforms (**Render, Vercel, Railway, AWS, or Docker**).

---

## 🌟 Production Features Pre-Configured:
1. **Dynamic 6-Hour Timers & Auto-Seeding (`init_db.py`)**:
   * On startup, the backend checks if the database is fresh and automatically seeds default admin users, critical infrastructure assets, and disaster scenarios.
   * If timestamps are older than 1.5 hours, it automatically rolls forward all timestamps relative to `datetime.now()` so that reports, clusters, and countdown timers are **always live and active** in the `<6h` window!
2. **Universal CORS (`main.py`)**:
   * Pre-configured with wildcard production regex `allow_origin_regex=r".*"` and `allow_credentials=True` to eliminate cross-origin blocks across Vercel, Render, Railway, or custom domains.
3. **Smart Cloud API & WebSocket Inference (`api.ts` & `useWebSocket.ts`)**:
   * Automatically detects the public cloud domain and connects to the correct backend API and WebSocket endpoints without hardcoded `localhost` issues.

---

## ⚡ Option 1: 1-Click Deployment on Render
1. Push this repository to GitHub.
2. Go to [https://dashboard.render.com/](https://dashboard.render.com/) and click **New +** ➔ **Web Service**.
3. Select your GitHub repository.
4. Set:
   * **Runtime:** `Python 3`
   * **Build Command:** `pip install -r requirements.txt`
   * **Start Command:** `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
5. Click **Deploy Web Service**!

---

## ⚡ Option 2: Deploying with Docker
```bash
# Build and run the unified container
docker build -t varshanet .
docker run -p 8000:8000 varshanet
```
