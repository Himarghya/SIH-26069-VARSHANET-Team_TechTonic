export interface WeatherReport {
  id: string;
  source_id?: string;
  source_type: 'citizen_report' | 'weather_api' | 'rss_news' | 'social_media' | 'government_open_data';
  source_name?: string;
  author?: string;
  text: string;
  original_language?: string;
  normalized_text?: string;
  event_type: string;
  event_confidence: number;
  raw_classification_details?: Record<string, any>;
  latitude: number;
  longitude: number;
  city?: string;
  district?: string;
  state: string;
  location_confidence: number;
  timestamp: string;
  ingestion_timestamp: string;
  credibility_score: number;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  verification_status: 'UNVERIFIED' | 'LIKELY_AUTHENTIC' | 'LIKELY_MISLEADING' | 'REQUIRES_REVIEW' | 'VERIFIED' | 'REJECTED' | 'DUPLICATE';
  verification_notes?: string;
  duplicate_group_id?: string;
  is_duplicate: boolean;
  duplicate_count: number;
  event_cluster_id?: string;
  media_urls: string[];
  hashtags: string[];
  image_analysis_results?: Record<string, any>;
  created_at: string;
}

export interface EventCluster {
  id: string;
  title: string;
  event_type: string;
  city?: string;
  district?: string;
  state: string;
  latitude: number;
  longitude: number;
  status: 'ACTIVE' | 'VERIFIED' | 'RESOLVED' | 'UNDER_REVIEW';
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  total_reports: number;
  independent_sources_count: number;
  citizen_reports_count: number;
  weather_api_confirmed: boolean;
  confidence_score: number;
  overall_credibility: number;
  started_at: string;
  last_reported_at: string;
  summary?: string;
}

export interface Alert {
  id: string;
  alert_code: string;
  title: string;
  message: string;
  severity: 'INFO' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  event_type: string;
  city?: string;
  state: string;
  latitude: number;
  longitude: number;
  reports_count: number;
  event_cluster_id?: string;
  is_active: boolean;
  created_at: string;
}

export interface AnalyticsOverview {
  total_reports: number;
  active_events: number;
  verified_events: number;
  reports_today: number;
  critical_alerts: number;
  states_affected: number;
  avg_credibility: number;
  source_distribution: Record<string, number>;
  event_distribution: Record<string, number>;
  verification_distribution: Record<string, number>;
  state_activity: Record<string, number>;
}

export interface SystemHealth {
  status: string;
  database: string;
  redis: string;
  kafka: string;
  ai_workers: string;
  ingestion_rate_per_min: number;
  processing_latency_ms: number;
  active_connections: number;
}

// === VARSHANET 2.0 Impact & Nowcasting Types ===

export interface ImpactScores {
  evidence_confidence: number;
  impact_risk: number;
  response_priority: 'P1' | 'P2' | 'P3' | 'P4';
  escalation_probability: number;
}

export interface PopulationExposure {
  total_population_exposed: number;
  vulnerable_population_exposed: number;
  urban_population: number;
  rural_population: number;
  population_density_per_sqkm: number;
  impact_radius_km: number;
  data_source_mode: string;
}

export interface AtRiskAsset {
  name: string;
  type: string;
  distance_km: number;
  vulnerability: number;
  asset_risk_score: number;
}

export interface InfrastructureRisk {
  infrastructure_risk_score: number;
  at_risk_assets: AtRiskAsset[];
  hospitals_at_risk_count: number;
  schools_at_risk_count: number;
  bridges_roads_at_risk_count: number;
  total_assets_in_zone: number;
}

export interface NowcastStep {
  forecast_offset_minutes: number;
  time_label: string;
  predicted_risk_score: number;
  predicted_rainfall_mm: number;
  predicted_severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  confidence: number;
}

export interface ResponseRecommendation {
  priority: number;
  priority_label: 'P1' | 'P2' | 'P3' | 'P4';
  action: string;
  reason: string;
  supporting_evidence: string[];
  confidence: number;
  affected_area?: string;
  status: string;
}

export interface InformationGap {
  id: string;
  missing_information: string;
  affected_decision: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommended_action: string;
}

export interface VerificationRequestItem {
  id: string;
  information_gap_id?: string;
  title: string;
  prompt: string;
  target_area: string;
  latitude: number;
  longitude: number;
  radius_km: number;
  status: string;
  responses_count: number;
}

export interface EvidenceChainItem {
  category: string;
  title: string;
  detail: string;
  impact_weight: string;
  status: string;
}

export interface MasterImpactEvaluation {
  scores: ImpactScores;
  population_exposure: PopulationExposure;
  infrastructure: InfrastructureRisk;
  nowcast_trajectory: NowcastStep[];
  response_recommendations: ResponseRecommendation[];
  information_gaps: InformationGap[];
  verification_requests: VerificationRequestItem[];
  evidence_chain: EvidenceChainItem[];
  assessed_at: string;
}

export interface VerifiedGroundPhoto {
  report_id: string;
  image_url: string;
  event_type: string;
  city: string;
  state: string;
  credibility_score: number;
  verification_status: string;
  timestamp?: string;
  caption: string;
  is_verified: boolean;
}

export interface EventImpactResponse {
  event_id: string;
  event_title: string;
  event_type: string;
  city?: string;
  state: string;
  latitude: number;
  longitude: number;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  status: string;
  verified_ground_photos?: VerifiedGroundPhoto[];
  impact_evaluation: MasterImpactEvaluation;
}

// === MoES Big Data & Meteorological Types ===

export interface DwrStation {
  station_code: string;
  station_name: string;
  latitude: number;
  longitude: number;
  state: string;
  range_km: number;
  peak_reflectivity_dbz: number;
  estimated_rain_rate_mmh: number;
  hydrometeor_classification: {
    category: string;
    color: string;
    label: string;
    hazard: string;
  };
  sweep_elevation_deg: number;
  last_scan_utc: string;
}

export interface RadarGridResponse {
  network_status: string;
  total_dwr_stations: number;
  wavelength_band: string;
  timestamp: string;
  stations: DwrStation[];
}

export interface InsatSector {
  sector: string;
  ctt_celsius: number;
  tir_kelvin: number;
  cloud_type: string;
  hazard_flag: string;
}

export interface InsatSatelliteResponse {
  satellite_id: string;
  sub_satellite_point: string;
  imager_bands: string[];
  resolution_km: number;
  scan_timestamp: string;
  cloud_motion_vectors: string;
  monitored_sectors: InsatSector[];
}

export interface ClimatologyAnomalyResponse {
  city: string;
  baseline_period: string;
  historical_mean_daily_rain_mm: number;
  observed_rain_mm: number;
  rain_anomaly_z_score: number;
  rain_anomaly_classification: string;
  historical_mean_temp_c: number;
  observed_temp_c: number;
  temp_anomaly_z_score: number;
  is_extreme_climatological_anomaly: boolean;
}

export interface ExtremeWeatherMlResponse {
  cloudburst_prediction: {
    cloudburst_prediction_index: number;
    alert_level: string;
    estimated_lead_time_minutes: number;
    radar_reflectivity_dbz: number;
    cloud_top_temperature_c: number;
    himalayan_orography_trigger: boolean;
    meteorological_rationale: string;
  };
  heatwave_wbgt_prediction: {
    ambient_temperature_c: number;
    relative_humidity_pct: number;
    heat_index_c: number;
    wet_bulb_temperature_c: number;
    severity_classification: string;
    biometeorological_impact: string;
  };
}

export interface StreamTelemetryResponse {
  stream_engine: string;
  active_topics: string[];
  records_per_second: number;
  total_records_ingested: number;
  micro_batch_window_seconds: number;
  sliding_processing_latency_ms: number;
  kafka_broker_partitions: number;
  backpressure_status: string;
  data_sources_connected: number;
}