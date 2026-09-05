import axios from 'axios';
import {
  WeatherReport, EventCluster, Alert, AnalyticsOverview, SystemHealth,
  EventImpactResponse, VerificationRequestItem,
  RadarGridResponse, InsatSatelliteResponse, ClimatologyAnomalyResponse,
  ExtremeWeatherMlResponse, StreamTelemetryResponse
} from '../types';

const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // If frontend is deployed online, default to the backend API
    const port = window.location.port ? `:${window.location.port}` : '';
    return `${window.location.protocol}//${window.location.hostname}${port === ':5173' ? ':8000' : port}/api/v1`;
  }
  return 'http://localhost:8000/api/v1';
};

const API_BASE = getApiBaseUrl();

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchReports = async (params?: Record<string, any>): Promise<WeatherReport[]> => {
  const { data } = await api.get('/reports', { params });
  return data;
};

export const fetchReportById = async (id: string): Promise<WeatherReport> => {
  const { data } = await api.get(`/reports/${id}`);
  return data;
};

export const fetchEvents = async (params?: Record<string, any>): Promise<EventCluster[]> => {
  const { data } = await api.get('/events', { params });
  return data;
};

export const fetchAlerts = async (): Promise<Alert[]> => {
  const { data } = await api.get('/alerts');
  return data;
};

export const fetchAnalyticsOverview = async (): Promise<AnalyticsOverview> => {
  const { data } = await api.get('/analytics/overview');
  return data;
};

export const fetchMapEvents = async (params?: Record<string, any>) => {
  const { data } = await api.get('/map/events', { params });
  return data;
};

export const fetchHeatmap = async () => {
  const { data } = await api.get('/map/heatmap');
  return data;
};

export const fetchPendingVerification = async (): Promise<WeatherReport[]> => {
  const { data } = await api.get('/verification/pending');
  return data;
};

export const performVerificationAction = async (reportId: string, action: string, reason?: string): Promise<WeatherReport> => {
  const { data } = await api.post(`/verification/${reportId}/action`, { action, reason });
  return data;
};

export const submitCitizenReport = async (payload: any): Promise<WeatherReport> => {
  const { data } = await api.post('/citizen/submit', payload);
  return data;
};

export const trackCitizenReport = async (ticketId: string): Promise<WeatherReport> => {
  const { data } = await api.get(`/citizen/track/${ticketId}`);
  return data;
};

export const analyzeMedia = async (mediaUrl: string) => {
  try {
    const { data } = await api.post('/media/analyze-json', { media_url: mediaUrl });
    return data.analysis;
  } catch (err) {
    console.warn('API media analysis failed, falling back to local heuristic:', err);
    return null;
  }
};

export const fetchSystemHealth = async (): Promise<SystemHealth> => {
  const { data } = await api.get('/system/health');
  return data;
};

export const fetchSources = async () => {
  const { data } = await api.get('/sources');
  return data;
};

export const triggerLiveSync = async () => {
  const { data } = await api.post('/sources/sync-live');
  return data;
};

export const fetchAutomationStatus = async () => {
  const { data } = await api.get('/sources/automation-status');
  return data;
};

export const toggleAutomation = async () => {
  const { data } = await api.post('/sources/toggle-automation');
  return data;
};

// === VARSHANET 2.0 Impact & Decision Support APIs ===

export const fetchEventImpact = async (eventId: string): Promise<EventImpactResponse> => {
  const { data } = await api.get(`/impact/${eventId}`);
  return data;
};

export const publishAdminVerifiedReport = async (payload: {
  title: string;
  event_type: string;
  description: string;
  city: string;
  state: string;
  severity: string;
  latitude?: number;
  longitude?: number;
  media_urls?: string[];
  author?: string;
}): Promise<any> => {
  const { data } = await api.post('/reports/admin-publish', payload);
  return data;
};

export const updateInformationGap = async (gapId: string, resolutionData: Record<string, any>) => {
  const { data } = await api.post(`/impact/gaps/${gapId}/resolve`, resolutionData);
  return data;
};

export const updateResponseRecommendation = async (recommendationId: string, status: string) => {
  const { data } = await api.post(`/impact/recommendations/${recommendationId}/status`, { status });
  return data;
};

export const fetchVerificationRequests = async (): Promise<VerificationRequestItem[]> => {
  const { data } = await api.get('/impact/verification-requests');
  return data;
};

export const respondToVerificationRequest = async (requestId: string, payload: any) => {
  const { data } = await api.post(`/impact/verification-requests/${requestId}/respond`, payload);
  return data;
};

// === Meteorological & Big Data Radar Endpoints ===

export const fetchDwrRadarGrid = async (): Promise<RadarGridResponse> => {
  const { data } = await api.get('/meteorology/dwr-radar');
  return data;
};

export const fetchInsatSatellite = async (): Promise<InsatSatelliteResponse> => {
  const { data } = await api.get('/meteorology/insat-satellite');
  return data;
};

export const fetchClimatologyAnomaly = async (
  city: string = 'Bhopal',
  rain24hMm: number = 85.0,
  tempC: number = 31.0
): Promise<ClimatologyAnomalyResponse> => {
  const { data } = await api.get('/meteorology/climatology-anomaly', {
    params: { city, rain_24h_mm: rain24hMm, temp_c: tempC }
  });
  return data;
};

export const fetchExtremeWeatherMl = async (params?: {
  radar_dbz?: number;
  cloud_top_temp_c?: number;
  rainfall_rate_mmh?: number;
  temp_c?: number;
  humidity_pct?: number;
}): Promise<ExtremeWeatherMlResponse> => {
  const { data } = await api.get('/meteorology/extreme-ml', { params });
  return data;
};

export const fetchStreamTelemetry = async (): Promise<StreamTelemetryResponse> => {
  const { data } = await api.get('/meteorology/stream-telemetry');
  return data;
};

// === Advanced Analytics & SQL Explorer APIs ===

export const executeCustomSqlQuery = async (query: string): Promise<{
  columns: string[];
  rows: any[][];
  row_count: number;
  execution_time_ms: number;
  query_executed: string;
  status: string;
}> => {
  const { data } = await api.post('/analytics/sql-query', { query });
  return data;
};

export const fetchDataQualityMetrics = async (): Promise<any> => {
  const { data } = await api.get('/analytics/data-quality');
  return data;
};

export const fetchSentimentPanicMetrics = async (): Promise<any> => {
  const { data } = await api.get('/analytics/sentiment-panic');
  return data;
};

// === X (Twitter) Automated Disaster Broadcaster APIs ===

export const broadcastAlertToX = async (payload: {
  city: string;
  state: string;
  event_type: string;
  severity: string;
  directive?: string;
  event_id?: string;
}): Promise<any> => {
  const { data } = await api.post('/alerts/broadcast-x', payload);
  return data;
};

export const fetchXDispatcherStatus = async (): Promise<any> => {
  const { data } = await api.get('/alerts/x-dispatcher-status');
  return data;
};
// === VARSHANET 2.0 Enterprise ML Intelligence APIs ===

export const fetchMultimodalVerify = async (payload: {
  text: string;
  city?: string;
  state?: string;
  media_urls?: string[];
  rainfall_mmh?: number;
  radar_dbz?: number;
  elevation_m?: number;
  co_located_reports?: number;
}): Promise<any> => {
  const { data } = await api.post('/ml/multimodal-verify', payload);
  return data;
};

export const fetchSeverityForecast = async (payload: {
  cluster_id?: string;
  event_type?: string;
  current_severity?: string;
  rainfall_rate_mmh?: number;
  rainfall_acc_24h?: number;
  radar_dbz?: number;
  river_level_trend?: string;
  report_velocity_per_min?: number;
  elevation_m?: number;
  drainage_susceptibility?: number;
  social_media_burst_ratio?: number;
}): Promise<any> => {
  const { data } = await api.post('/ml/severity-forecast', payload);
  return data;
};

export const fetchAnomalyDetection = async (payload: {
  city?: string;
  zone?: string;
  normal_hourly_rate?: number;
  current_10m_reports?: number;
  rainfall_dev_zscore?: number;
  water_level_rise_rate_cm_hr?: number;
  social_burst_spike?: number;
}): Promise<any> => {
  const { data } = await api.post('/ml/anomaly-detect', payload);
  return data;
};

export const fetchHdbscanClusters = async (): Promise<any> => {
  const { data } = await api.get('/ml/hdbscan-clusters');
  return data;
};

export const fetchImageForensics = async (payload: {
  image_url?: string;
  city?: string;
  event_type?: string;
  timestamp?: string;
}): Promise<any> => {
  const { data } = await api.post('/ml/image-forensics', payload);
  return data;
};

export const fetchVayuScoreShap = async (payload: {
  report_text?: string;
  independent_reports_count?: number;
  rainfall_correlation_rate?: number;
  image_authenticity_score?: number;
  source_reliability_score?: number;
  geographic_consistency_km?: number;
  temporal_window_minutes?: number;
}): Promise<any> => {
  const { data } = await api.post('/ml/vayuscore-shap', payload);
  return data;
};

export const fetchActiveLearningTelemetry = async (): Promise<any> => {
  const { data } = await api.get('/ml/active-learning');
  return data;
};

export const submitActiveLearningFeedback = async (payload: {
  report_id: string;
  human_label: string;
  initial_confidence?: number;
  reviewer_notes?: string;
}): Promise<any> => {
  const { data } = await api.post('/ml/active-learning/feedback', payload);
  return data;
};

export const fetchDynamicSources = async (): Promise<any[]> => {
  const { data } = await api.get('/ml/dynamic-sources');
  return data;
};

export const uploadMedia = async (file: File, simulateFake: boolean = false): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  if (simulateFake) {
    formData.append('simulate_fake', 'true');
  }
  const { data } = await api.post('/media/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const fetchModelReport = async (): Promise<any> => {
  const { data } = await api.get('/media/model-report');
  return data;
};

export interface TextAnalysisResult {
  text: string;
  is_disaster: boolean;
  verdict: string;
  disaster_prob: number;
  confidence_pct: number;
  disaster_score_pct?: number;
  label: string;
  badge_color: string;
  threshold?: number;
  source?: string;
}

export const analyzeObservationText = async (text: string, threshold?: number): Promise<{ status: string; analysis: TextAnalysisResult }> => {
  const { data } = await api.post('/media/analyze-text', { text, threshold });
  return data;
};