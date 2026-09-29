import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { AlertsBanner } from './components/common/AlertsBanner';
import { ReportDetailModal } from './components/reports/ReportDetailModal';
import { DashboardPage } from './pages/DashboardPage';
import { IncidentCommandRoomPage } from './pages/IncidentCommandRoomPage';
import { MapPage } from './pages/MapPage';
import { ReportsPage } from './pages/ReportsPage';
import { EventsPage } from './pages/EventsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CitizenPage } from './pages/CitizenPage';
import { AdminPage } from './pages/AdminPage';
import { useWeatherWebSocket } from './hooks/useWebSocket';
import { useTheme } from './context/ThemeContext';
import { fetchReports, fetchEvents, fetchAlerts, fetchAnalyticsOverview, fetchPendingVerification, fetchSystemHealth } from './services/api';
import { WeatherReport, EventCluster, Alert, AnalyticsOverview, SystemHealth } from './types';

export function App() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState('citizen');
  const [reports, setReports] = useState<WeatherReport[]>([]);
  const [events, setEvents] = useState<EventCluster[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [pendingReports, setPendingReports] = useState<WeatherReport[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [selectedReport, setSelectedReport] = useState<WeatherReport | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);
  const [reportFilterStatus, setReportFilterStatus] = useState<string>('All');
  const [reportSearchTerm, setReportSearchTerm] = useState<string>('');

  // WebSocket Live Stream Listener
  const { isConnected } = useWeatherWebSocket((message) => {
    if (
      message.type === 'NEW_WEATHER_REPORT' ||
      message.type === 'NEW_CITIZEN_REPORT' ||
      message.type === 'CITIZEN_VERIFICATION_FULFILLED' ||
      message.type === 'VERIFICATION_UPDATED'
    ) {
      loadAllData();
    }
  });

  const loadAllData = async () => {
    try {
      const results = await Promise.allSettled([
        fetchReports({ limit: 500 }),
        fetchEvents(),
        fetchAlerts(),
        fetchAnalyticsOverview(),
        fetchPendingVerification(),
        fetchSystemHealth()
      ]);
      if (results[0].status === 'fulfilled' && Array.isArray(results[0].value)) setReports(results[0].value);
      if (results[1].status === 'fulfilled' && Array.isArray(results[1].value)) setEvents(results[1].value);
      if (results[2].status === 'fulfilled' && Array.isArray(results[2].value)) setAlerts(results[2].value);
      if (results[3].status === 'fulfilled' && results[3].value) setOverview(results[3].value);
      if (results[4].status === 'fulfilled' && Array.isArray(results[4].value)) setPendingReports(results[4].value);
      if (results[5].status === 'fulfilled' && results[5].value) setSystemHealth(results[5].value);
    } catch (err) {
      console.error('Error loading VARSHANET platform data', err);
    }
  };

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Map / Report click handler -> Redirects straight to Incident Command Room for that incident!
  const handleSelectEvent = (evt: EventCluster) => {
    setSelectedEventId(evt.id);
    setActiveTab('incident');
  };

  const handleOpenIncidentRoom = (clusterId: string) => {
    setSelectedEventId(clusterId);
    setActiveTab('incident');
  };

  // Dedicated Metric Card Click Handler with tab navigation and pre-filtering
  const handleNavigateFromMetricCard = (
    tab: string,
    filter?: { status?: string; eventId?: string; search?: string }
  ) => {
    if (filter?.status) {
      setReportFilterStatus(filter.status);
    } else if (tab === 'reports') {
      setReportFilterStatus('All');
    }

    if (filter?.search !== undefined) {
      setReportSearchTerm(filter.search);
    } else if (tab === 'reports') {
      setReportSearchTerm('');
    }

    if (filter?.eventId) {
      setSelectedEventId(filter.eventId);
    } else if (tab === 'incident' && events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id);
    }

    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 selection:bg-cyan-500 selection:text-white ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLiveConnected={isConnected}
        alertCount={pendingReports.length}
        userRole={userRole}
        setUserRole={setUserRole}
        onLiveSyncDone={loadAllData}
      />

      {/* Emergency Weather Alert Ticker Banner (Live, Auto-Rotating & Interactive) */}
      <AlertsBanner
        alerts={alerts}
        onSelectAlert={(alert) => {
          const match = events.find(e => 
            (alert.event_cluster_id && e.id === alert.event_cluster_id) ||
            (alert.city && e.city && e.city.toLowerCase() === alert.city.toLowerCase()) ||
            (e.state && e.state.toLowerCase() === alert.state.toLowerCase())
          );
          if (match) {
            setSelectedEventId(match.id);
          } else if (events.length > 0) {
            setSelectedEventId(events[0].id);
          }
          setActiveTab('incident');
        }}
      />

      {/* Main Content View Switcher (Full Width Layout) */}
      <main className="flex-1 w-full p-3 sm:p-4 md:p-6 lg:px-8 xl:px-10 overflow-x-hidden">
        {activeTab === 'dashboard' && (
          <DashboardPage
            reports={reports}
            events={events}
            alerts={alerts}
            overview={overview}
            onSelectReport={setSelectedReport}
            onSelectEvent={handleSelectEvent}
            onNavigateTab={handleNavigateFromMetricCard}
          />
        )}

        {activeTab === 'incident' && (
          <IncidentCommandRoomPage
            events={events}
            selectedEventId={selectedEventId}
            onSelectEventId={setSelectedEventId}
            userRole={userRole}
          />
        )}

        {activeTab === 'map' && (
          <MapPage
            events={events}
            reports={reports}
            onSelectEvent={handleSelectEvent}
            onSelectReport={setSelectedReport}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsPage
            reports={reports}
            onSelectReport={setSelectedReport}
            initialStatusFilter={reportFilterStatus}
            initialSearchTerm={reportSearchTerm}
          />
        )}

        {activeTab === 'events' && (
          <EventsPage
            events={events}
            onSelectEvent={handleSelectEvent}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsPage overview={overview} />
        )}

        {activeTab === 'citizen' && (
          <CitizenPage />
        )}

        {activeTab === 'admin' && (
          <AdminPage
            pendingReports={pendingReports}
            systemHealth={systemHealth}
            onRefreshData={loadAllData}
            onSelectReport={setSelectedReport}
            onNavigateToTab={setActiveTab}
          />
        )}
      </main>

      {/* Deep Inspection Modal */}
      <ReportDetailModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onReportUpdated={loadAllData}
        onOpenIncidentRoom={handleOpenIncidentRoom}
        userRole={userRole}
      />

      {/* National Platform Footer (Full Width) */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 py-4 px-3 sm:px-6 lg:px-8 xl:px-10 text-xs text-slate-500 font-mono flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span>VARSHANET 2.0 National Disaster Decision Support Grid | v2.0.0</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/20 dark:bg-cyan-950/60 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300 font-bold tracking-wide">
          <span>Crafted by</span>
          <span className="text-cyan-700 dark:text-cyan-200">Team Tech_Tonic</span>
        </div>
        <div>
          Ministry of Earth Sciences / IMD AI Impact Nowcasting & Citizen Response Protocol
        </div>
      </footer>
    </div>
  );
}

export default App;