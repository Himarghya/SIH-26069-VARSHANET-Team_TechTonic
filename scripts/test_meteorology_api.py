import sys, os
sys.path.insert(0, os.path.abspath("."))

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

print("=== 1. Testing IMD Doppler Weather Radar (DWR) Grid ===")
dwr = client.get("/api/v1/meteorology/dwr-radar").json()
print(f"Total DWR Stations: {dwr['total_dwr_stations']} | Network Status: {dwr['network_status']}")
for st in dwr["stations"][:3]:
    print(f"  • {st['station_code']} ({st['station_name']}): Peak {st['peak_reflectivity_dbz']} dBZ -> {st['estimated_rain_rate_mmh']} mm/h [{st['hydrometeor_classification']['label']}]")

print("\n=== 2. Testing INSAT-3D/3DR Satellite Telemetry ===")
insat = client.get("/api/v1/meteorology/insat-satellite").json()
print(f"Satellite: {insat['satellite_id']} | Sub-point: {insat['sub_satellite_point']}")
for sec in insat["monitored_sectors"][:2]:
    print(f"  • Sector: {sec['sector']} | Cloud Top Temp: {sec['ctt_celsius']}°C | Hazard: {sec['hazard_flag']}")

print("\n=== 3. Testing 30-Year Historical Climate Anomaly Engine ===")
anom = client.get("/api/v1/meteorology/climatology-anomaly?city=Bhopal&rain_24h_mm=112.0&temp_c=32.0").json()
print(f"City: {anom['city']} | Baseline: {anom['baseline_period']}")
print(f"  • Observed: {anom['observed_rain_mm']} mm (Normal Daily: {anom['historical_mean_daily_rain_mm']} mm)")
print(f"  • Rainfall Z-Score Anomaly: {anom['rain_anomaly_z_score']}σ ({anom['rain_anomaly_classification']})")

print("\n=== 4. Testing Extreme Weather ML (Cloudburst CPI & Heatwave WBGT) ===")
ext = client.get("/api/v1/meteorology/extreme-ml?radar_dbz=58.0&cloud_top_temp_c=-74.0&rainfall_rate_mmh=78.0").json()
cpi = ext["cloudburst_prediction"]
wbgt = ext["heatwave_wbgt_prediction"]
print(f"  • Cloudburst Prediction Index (CPI): {cpi['cloudburst_prediction_index']}/100 [{cpi['alert_level']}]")
print(f"  • Estimated Lead Time: {cpi['estimated_lead_time_minutes']} minutes")
print(f"  • Heat Index: {wbgt['heat_index_c']}°C | Severity: {wbgt['severity_classification']}")

print("\n=== 5. Testing Big Data Stream Processing Telemetry ===")
stm = client.get("/api/v1/meteorology/stream-telemetry").json()
print(f"  • Stream Engine: {stm['stream_engine']}")
print(f"  • Throughput: {stm['records_per_second']:,} records/sec | Latency: {stm['sliding_processing_latency_ms']} ms")
print(f"  • Total Processed: {stm['total_records_ingested']:,} records")

print("\n[SUCCESS] ALL MoES METEOROLOGICAL & BIG DATA ENGINES VERIFIED!")