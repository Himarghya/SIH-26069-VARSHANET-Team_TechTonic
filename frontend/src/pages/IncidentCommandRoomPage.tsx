import React, { useState, useEffect } from 'react';
import {
  Radio,
  AlertTriangle,
  ShieldCheck,
  Activity,
  RefreshCw,
  ChevronRight,
  FileText,
  PhoneCall,
  ShieldAlert,
  HeartHandshake,
  MapPin,
  Users,
  Cpu,
  FileCheck,
  Layers
} from 'lucide-react';
import { EventCluster, EventImpactResponse } from '../types';
import { fetchEventImpact } from '../services/api';
import { IncidentHeader } from '../components/incident/IncidentHeader';
import { ImpactSummary } from '../components/incident/ImpactSummary';
import { RiskTrajectory } from '../components/incident/RiskTrajectory';
import { InfrastructureRiskPanel } from '../components/incident/InfrastructureRiskPanel';
import { ResponseRecommendations } from '../components/incident/ResponseRecommendations';
import { InformationGapPanel } from '../components/incident/InformationGapPanel';
import { EvidenceChain } from '../components/incident/EvidenceChain';
import { PredictionAccuracy } from '../components/incident/PredictionAccuracy';
import { AudioEmergencyBroadcast } from '../components/incident/AudioEmergencyBroadcast';
import { CapBroadcastSimulator } from '../components/incident/CapBroadcastSimulator';
import { EmergencyResourceDispatch } from '../components/incident/EmergencyResourceDispatch';
import { SitRepDossierModal } from '../components/incident/SitRepDossierModal';
import { VerifiedGroundEvidenceGallery } from '../components/incident/VerifiedGroundEvidenceGallery';
import { SeverityForecastRadar } from '../components/ml/SeverityForecastRadar';
import { MultimodalFusionInspector } from '../components/ml/MultimodalFusionInspector';

interface IncidentCommandRoomPageProps {
  events: EventCluster[];
  selectedEventId?: string;
  onSelectEventId?: (id: string) => void;
  userRole?: string;
}

export const IncidentCommandRoomPage: React.FC<IncidentCommandRoomPageProps> = ({
  events,
  selectedEventId,
  onSelectEventId,
  userRole = 'analyst'
}) => {
  const isCitizen = userRole === 'citizen';
  const activeId = selectedEventId || (events.length > 0 ? events[0].id : null);
  const [currentEventId, setCurrentEventId] = useState<string | null>(activeId);
  const [impactData, setImpactData] = useState<EventImpactResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSitRepModal, setShowSitRepModal] = useState(false);
  const [activeApproach, setActiveApproach] = useState<string>('ALL');

  useEffect(() => {
    if (selectedEventId) {
      setCurrentEventId(selectedEventId);
    } else if (events.length > 0 && !currentEventId) {
      setCurrentEventId(events[0].id);
    }
  }, [selectedEventId, events]);

  const loadImpactData = async (evtId: string) => {
    setIsLoading(true);
    try {
      const data = await fetchEventImpact(evtId);
      setImpactData(data);
    } catch (err) {
      console.error('Error fetching event impact', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentEventId) {
      loadImpactData(currentEventId);
    }
  }, [currentEventId]);

  const handleSwitchEvent = (id: string) => {
    setCurrentEventId(id);
    if (onSelectEventId) onSelectEventId(id);
  };

  return (
    <div className="space-y-6">
      {/* Event Cluster Selector Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl shadow-sm dark:shadow-xl">
        <div className="flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-500 dark:text-cyan-400 shrink-0" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
              {isCitizen ? 'Public Weather Incident Information:' : 'Incident Command Operations:'}
            </span>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {!isCitizen && (
              <button
                onClick={() => setShowSitRepModal(true)}
                disabled={!impactData}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-[11px] font-bold shadow-md cursor-pointer shrink-0"
              >
                <FileText className="w-3 h-3" />
                <span>SitRep</span>
              </button>
            )}
            <button
              onClick={() => currentEventId && loadImpactData(currentEventId)}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-x-auto py-0.5 no-scrollbar lg:justify-end">
          {events.map((evt) => {
            const isSelected = currentEventId === evt.id;
            return (
              <button
                key={evt.id}
                onClick={() => handleSwitchEvent(evt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold shrink-0 transition-all border cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-900/20'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                📍 {evt.city || evt.state} ({evt.event_type})
              </button>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {!isCitizen && (
            <button
              onClick={() => setShowSitRepModal(true)}
              disabled={!impactData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-indigo-950/40 transition-all cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Official SitRep Dossier</span>
            </button>
          )}

          <button
            onClick={() => currentEventId && loadImpactData(currentEventId)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors shrink-0 cursor-pointer"
            title="Recalculate AI Nowcasts"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      {impactData ? (
        <div className="space-y-6 animate-fade-in">
          {/* Header with 3 Scores & Google Street View Button */}
          <IncidentHeader incident={impactData} />

          {/* Emergency Audio Radio Broadcast Dispatcher */}
          <AudioEmergencyBroadcast
            eventTitle={impactData.event_title}
            city={impactData.city || impactData.state}
            state={impactData.state}
            severity={impactData.severity}
            priority={impactData.impact_evaluation.scores.response_priority}
            recommendations={impactData.impact_evaluation.response_recommendations.map(r => r.action)}
          />

          {/* CITIZEN VIEW: Clean Public Safety & Emergency Directives Card */}
          {isCitizen ? (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-rose-200 dark:border-rose-500/30 space-y-4 shadow-sm dark:shadow-xl">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Official Public Safety Advisory &amp; Emergency Helplines
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    State Disaster Management Authority (SDMA) Public Guidance for {impactData.city || impactData.state}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block font-mono">National Emergency</span>
                  <div className="text-xl font-black text-rose-600 dark:text-rose-400 font-mono flex items-center gap-1.5">
                    <PhoneCall className="w-4 h-4" /> 112
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">24x7 Unified Emergency Response</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block font-mono">Disaster Management Relief</span>
                  <div className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono flex items-center gap-1.5">
                    <PhoneCall className="w-4 h-4" /> 1070 / 1077
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">State / District Control Room</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block font-mono">Designated Relief Centers</span>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    Government Higher Secondary Shelters
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">Equipped with dry rations &amp; drinking water</p>
                </div>
              </div>

              {/* Citizen safety recommendations */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">Immediate Life-Safety Instructions:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                  <li>Avoid walking or driving through waterlogged underpasses or flooded roads.</li>
                  <li>Keep mobile devices charged and keep emergency contact numbers handy.</li>
                  <li>Report local waterlogging or distress directly via the <strong>Citizen Portal</strong>.</li>
                </ul>
              </div>

              {/* Verified Ground Truth & Citizen Photo Evidence Gallery */}
              <VerifiedGroundEvidenceGallery
                photos={impactData.verified_ground_photos}
                city={impactData.city || impactData.state}
                state={impactData.state}
                eventType={impactData.event_type}
              />
            </div>
          ) : (
            <>
              {/* ANALYST / ADMIN VIEW: Structured Operational Approaches */}
              {/* Operational Approach Selector Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl scrollbar-none">
                {[
                  { id: 'ALL', label: 'All Operational Modules', icon: Activity, count: '6 Sectors' },
                  { id: 'THREAT', label: '1. Threat & Exposure', icon: Users, tag: 'Impact' },
                  { id: 'TACTICAL', label: '2. Tactical Response & NDRF', icon: ShieldAlert, tag: 'Logistics' },
                  { id: 'ALERTS', label: '3. Alerts & Ground Intel', icon: Radio, tag: 'CAP & Gaps' },
                  { id: 'AI_NOWCAST', label: '4. AI Radar & Multimodal', icon: Cpu, tag: 'Forecaster' },
                  { id: 'FORENSICS', label: '5. Ground Evidence & Audit', icon: FileCheck, tag: 'Forensics' }
                ].map((approach) => {
                  const isSelected = activeApproach === approach.id;
                  const Icon = approach.icon;
                  return (
                    <button
                      key={approach.id}
                      onClick={() => setActiveApproach(approach.id)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                        isSelected
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{approach.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* APPROACH 1: Threat Assessment & Demographic Exposure */}
              {(activeApproach === 'ALL' || activeApproach === 'THREAT') && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-400 font-mono font-black text-xs flex items-center justify-center border border-cyan-300/60 dark:border-cyan-800">
                        01
                      </div>
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          Hazard Assessment & Demographic Exposure
                        </h2>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Population vulnerability mapping and 3-hour radar nowcast trajectories
                        </p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-block text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                      Threat Assessment
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    <div className="lg:col-span-6 flex flex-col">
                      <ImpactSummary exposure={impactData.impact_evaluation.population_exposure} />
                    </div>
                    <div className="lg:col-span-6 flex flex-col">
                      <RiskTrajectory
                        trajectory={impactData.impact_evaluation.nowcast_trajectory}
                        escalationProbability={impactData.impact_evaluation.scores.escalation_probability}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* APPROACH 2: Tactical Action Plan & Emergency NDRF Dispatch */}
              {(activeApproach === 'ALL' || activeApproach === 'TACTICAL') && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 font-mono font-black text-xs flex items-center justify-center border border-amber-300/60 dark:border-amber-800">
                        02
                      </div>
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          Tactical Action Plan & Emergency NDRF Dispatch
                        </h2>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          AI Standard Operating Procedures (SOPs), 16 NDRF battalion routing, and critical infrastructure protection
                        </p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-block text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      Emergency Operations
                    </span>
                  </div>

                  {/* SOP Recommendations & Critical Infrastructure */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    <div className="lg:col-span-6 flex flex-col">
                      <ResponseRecommendations
                        recommendations={impactData.impact_evaluation.response_recommendations}
                      />
                    </div>
                    <div className="lg:col-span-6 flex flex-col">
                      <InfrastructureRiskPanel infrastructure={impactData.impact_evaluation.infrastructure} />
                    </div>
                  </div>

                  {/* NDRF Logistics Dispatcher */}
                  <EmergencyResourceDispatch
                    city={impactData.city || impactData.state}
                    state={impactData.state}
                    latitude={impactData.latitude}
                    longitude={impactData.longitude}
                    totalPopulationExposed={impactData.impact_evaluation.population_exposure.total_population_exposed}
                    severity={impactData.severity}
                  />
                </div>
              )}

              {/* APPROACH 3: Public Warning Broadcast & Ground Verification */}
              {(activeApproach === 'ALL' || activeApproach === 'ALERTS') && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 font-mono font-black text-xs flex items-center justify-center border border-rose-300/60 dark:border-rose-800">
                        03
                      </div>
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          Public Warning Broadcast & Field Intelligence Gaps
                        </h2>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Common Alerting Protocol (CAP) cellular broadcast simulator and telemetry reconciliation
                        </p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-block text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                      Public Advisory
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    <div className="lg:col-span-6 flex flex-col">
                      <CapBroadcastSimulator
                        city={impactData.city || impactData.state}
                        state={impactData.state}
                        severity={impactData.severity}
                        eventType={impactData.event_type}
                        recommendations={impactData.impact_evaluation.response_recommendations.map(r => r.action)}
                      />
                    </div>
                    <div className="lg:col-span-6 flex flex-col">
                      <InformationGapPanel
                        gaps={impactData.impact_evaluation.information_gaps}
                        verificationRequests={impactData.impact_evaluation.verification_requests}
                        onVerificationDone={() => currentEventId && loadImpactData(currentEventId)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* APPROACH 4: AI Radar Nowcasting & Multimodal Fusion */}
              {(activeApproach === 'ALL' || activeApproach === 'AI_NOWCAST') && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400 font-mono font-black text-xs flex items-center justify-center border border-purple-300/60 dark:border-purple-800">
                        04
                      </div>
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          AI Radar Nowcasting & Multimodal Fusion Telemetry
                        </h2>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Spatiotemporal escalation radar and deep learning multimodal sensor fusion diagnostics
                        </p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-block text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      Machine Intelligence
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    <div className="lg:col-span-6 flex flex-col">
                      <SeverityForecastRadar />
                    </div>
                    <div className="lg:col-span-6 flex flex-col">
                      <MultimodalFusionInspector />
                    </div>
                  </div>
                </div>
              )}

              {/* APPROACH 5: Ground Truth Evidence & Forensic Provenance */}
              {(activeApproach === 'ALL' || activeApproach === 'FORENSICS') && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-mono font-black text-xs flex items-center justify-center border border-emerald-300/60 dark:border-emerald-800">
                        05
                      </div>
                      <div>
                        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          Ground Truth Evidence & Forensic Provenance
                        </h2>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Verified citizen image telemetry, explainable multi-source evidence chain, and calibration delta
                        </p>
                      </div>
                    </div>
                    <span className="hidden sm:inline-block text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Forensic Audit
                    </span>
                  </div>

                  {/* Citizen Photo Evidence */}
                  <VerifiedGroundEvidenceGallery
                    photos={impactData.verified_ground_photos}
                    city={impactData.city || impactData.state}
                    state={impactData.state}
                    eventType={impactData.event_type}
                  />

                  {/* Multi-Source Evidence Chain & Calibration Delta */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    <div className="lg:col-span-6 flex flex-col">
                      <EvidenceChain evidenceChain={impactData.impact_evaluation.evidence_chain} />
                    </div>
                    <div className="lg:col-span-6 flex flex-col">
                      <PredictionAccuracy
                        predictedExposure={impactData.impact_evaluation.population_exposure.total_population_exposed}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="h-72 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-cyan-600 dark:text-cyan-400" />
            <span className="text-sm font-medium">Loading Incident Impact Intelligence...</span>
          </div>
          <button
            onClick={() => loadImpactData(currentEventId || 'default')}
            className="px-3 py-1.5 bg-cyan-50 dark:bg-cyan-500/20 hover:bg-cyan-100 dark:hover:bg-cyan-500/30 text-cyan-700 dark:text-cyan-300 rounded-xl text-xs font-semibold border border-cyan-200 dark:border-cyan-500/30 transition-all cursor-pointer"
          >
            Retry Loading Incident Feed
          </button>
        </div>
      )}

      {/* Official SitRep Dossier Modal */}
      {showSitRepModal && (
        <SitRepDossierModal
          incident={impactData}
          onClose={() => setShowSitRepModal(false)}
        />
      )}
    </div>
  );
};