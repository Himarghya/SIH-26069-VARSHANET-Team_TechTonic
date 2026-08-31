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
import { fetchReports, fetchEvents, fetchAlerts, fetchAnalyticsOverview, fetchPendingVerification, fetchSystemHealth } from './services/api';
import { WeatherReport, EventCluster, Alert, AnalyticsOverview, SystemHealth } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState('analyst');
  const [reports, setReports] = useState<WeatherReport[]>([]);
  const [events, setEvents] = useState<EventCluster[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [pendingReports, setPendingReports] = useState<WeatherReport[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [selectedReport, setSelectedReport] = useState<WeatherReport | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);

  // WebSocket Live Stream Listener
  const { isConnected } = useWeatherWebSocket((message) => {
    if (message.type === 'NEW_WEATHER_REPORT' || message.type === 'NEW_CITIZEN_REPORT' || message.type === 'CITIZEN_VERIFICATION_FULFILLED') {
      loadAllData();
    }
  });

  const loadAllData = async () => {
    try {
      const [reps, evts, alrts, ovr, pnd, hlth] = await Promise.all([
        fetchReports(),
        fetchEvents(),
        fetchAlerts(),
        fetchAnalyticsOverview(),
        fetchPendingVerification(),
        fetchSystemHealth()
      ]);
      setReports(reps);
      setEvents(evts);
      setAlerts(alrts);
      setOverview(ovr);
      setPendingReports(pnd);
      setSystemHealth(hlth);
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
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

      {/* Emergency Weather Alert Ticker Banner */}
      <AlertsBanner alerts={alerts} />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6">
        {activeTab === 'dashboard' && (
          <DashboardPage
            overview={overview}
            events={events}
            reports={reports}
            alerts={alerts}
            onSelectReport={setSelectedReport}
            onSelectEvent={handleSelectEvent}
          />
        )}

        {activeTab === 'incident' && (
          <IncidentCommandRoomPage
            events={events}
            selectedEventId={selectedEventId}
            onSelectEventId={setSelectedEventId}
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

      {/* National Platform Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-center text-xs text-slate-500 font-mono flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>VARSHANET 2.0 National Disaster Decision Support Grid • v2.0.0</span>
        </div>
        <div>
          Ministry of Earth Sciences / IMD AI Impact Nowcasting & Citizen Response Protocol
        </div>
      </footer>
    </div>
  );
}

export default App;