import React, { useState, useEffect } from 'react';
import { Radio, AlertTriangle, ShieldCheck, Activity, RefreshCw, ChevronRight, FileText, PhoneCall, ShieldAlert, HeartHandshake, MapPin } from 'lucide-react';
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
      <div className="flex items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shadow-xl overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200">
            {isCitizen ? 'Public Weather Incident Information:' : 'Incident Command Operations:'}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {events.map((evt) => {
            const isSelected = evt.id === currentEventId;
            return (
              <button
                key={evt.id}
                onClick={() => handleSwitchEvent(evt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-900/40 font-bold'
                    : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                <span>{evt.city || evt.state}</span>
                <span className="text-[10px] font-mono opacity-80">({evt.event_type})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isCitizen && (
            <button
              onClick={() => setShowSitRepModal(true)}
              disabled={!impactData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-indigo-950/40 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Official SitRep Dossier</span>
            </button>
          )}

          <button
            onClick={() => currentEventId && loadImpactData(currentEventId)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0 cursor-pointer"
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
            <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border border-rose-500/30 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-900/60 text-rose-300">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Official Public Safety Advisory & Emergency Helplines
                  </h3>
                  <p className="text-xs text-slate-400">
                    State Disaster Management Authority (SDMA) Public Guidance for {impactData.city || impactData.state}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">National Emergency</span>
                  <div className="text-xl font-black text-rose-400 font-mono flex items-center gap-1.5">
                    <PhoneCall className="w-4 h-4" /> 112
                  </div>
                  <p className="text-[11px] text-slate-400">24x7 Unified Emergency Response</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">Disaster Management Relief</span>
                  <div className="text-xl font-black text-amber-400 font-mono flex items-center gap-1.5">
                    <PhoneCall className="w-4 h-4" /> 1070 / 1077
                  </div>
                  <p className="text-[11px] text-slate-400">State / District Control Room</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">Designated Relief Centers</span>
                  <div className="text-sm font-bold text-emerald-400">
                    Government Higher Secondary Shelters
                  </div>
                  <p className="text-[11px] text-slate-400">Equipped with dry rations & drinking water</p>
                </div>
              </div>

              {/* Citizen safety recommendations */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-2">
                <span className="font-bold text-white block">Immediate Life-Safety Instructions:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
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
            /* ANALYST / ADMIN VIEW: Full Tactical Command Suite */
            <>
              {/* CAP Cell Broadcast Early Warning Simulator */}
              <CapBroadcastSimulator
                city={impactData.city || impactData.state}
                state={impactData.state}
                severity={impactData.severity}
                eventType={impactData.event_type}
                recommendations={impactData.impact_evaluation.response_recommendations.map(r => r.action)}
              />
            </>
          )}

          {/* Demographic Exposure & 3-Hour Nowcast Trajectory (Visible to all) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <ImpactSummary exposure={impactData.impact_evaluation.population_exposure} />
            </div>
            <div className="lg:col-span-6">
              <RiskTrajectory
                trajectory={impactData.impact_evaluation.nowcast_trajectory}
                escalationProbability={impactData.impact_evaluation.scores.escalation_probability}
              />
            </div>
          </div>

          {/* OPERATOR COMMAND MODULES: Only visible to Analyst & Admin */}
          {!isCitizen && (
            <>
              {/* NDRF Logistics Demand-Supply Grid & AI Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6">
                  <EmergencyResourceDispatch
                    city={impactData.city || impactData.state}
                    state={impactData.state}
                    latitude={impactData.latitude}
                    longitude={impactData.longitude}
                    totalPopulationExposed={impactData.impact_evaluation.population_exposure.total_population_exposed}
                    severity={impactData.severity}
                  />
                </div>
                <div className="lg:col-span-6">
                  <ResponseRecommendations
                    recommendations={impactData.impact_evaluation.response_recommendations}
                  />
                </div>
              </div>

              {/* Infrastructure Risk & Information Gaps Resolver */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6">
                  <InfrastructureRiskPanel infrastructure={impactData.impact_evaluation.infrastructure} />
                </div>
                <div className="lg:col-span-6">
                  <InformationGapPanel
                    gaps={impactData.impact_evaluation.information_gaps}
                    verificationRequests={impactData.impact_evaluation.verification_requests}
                    onVerificationDone={() => currentEventId && loadImpactData(currentEventId)}
                  />
                </div>
              </div>

              {/* Verified Ground Truth & Citizen Photo Evidence Gallery */}
              <VerifiedGroundEvidenceGallery
                photos={impactData.verified_ground_photos}
                city={impactData.city || impactData.state}
                state={impactData.state}
                eventType={impactData.event_type}
              />

              {/* Evidence Chain */}
              <EvidenceChain evidenceChain={impactData.impact_evaluation.evidence_chain} />

              {/* Post-Incident Prediction Accuracy */}
              <PredictionAccuracy
                predictedExposure={impactData.impact_evaluation.population_exposure.total_population_exposed}
              />
            </>
          )}
        </div>
      ) : (
        <div className="h-72 rounded-2xl border border-slate-800 bg-slate-900/50 flex items-center justify-center text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin mr-2 text-cyan-400" />
          Loading Incident Impact Intelligence...
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