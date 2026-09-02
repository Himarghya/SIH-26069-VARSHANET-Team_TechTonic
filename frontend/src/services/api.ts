import axios from 'axios';
import {
  WeatherReport, EventCluster, Alert, AnalyticsOverview, SystemHealth,
  EventImpactResponse, VerificationRequestItem,
  RadarGridResponse, InsatSatelliteResponse, ClimatologyAnomalyResponse,
  ExtremeWeatherMlResponse, StreamTelemetryResponse
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

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