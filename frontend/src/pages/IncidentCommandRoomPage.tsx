import React, { useState, useEffect } from 'react';
import { Radio, AlertTriangle, ShieldCheck, Activity, RefreshCw, ChevronRight, FileText } from 'lucide-react';
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

interface IncidentCommandRoomPageProps {
  events: EventCluster[];
  selectedEventId?: string;
  onSelectEventId?: (id: string) => void;
}

export const IncidentCommandRoomPage: React.FC<IncidentCommandRoomPageProps> = ({
  events,
  selectedEventId,
  onSelectEventId
}) => {
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
          <span className="text-xs font-bold text-slate-200">Incident Command Operations:</span>
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
          <button
            onClick={() => setShowSitRepModal(true)}
            disabled={!impactData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-indigo-950/40 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Official SitRep Dossier</span>
          </button>

          <button
            onClick={() => currentEventId && loadImpactData(currentEventId)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0 cursor-pointer"
            title="Recalculate AI Nowcasts"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Incident Command Content */}
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

          {/* CAP Cell Broadcast Early Warning Simulator */}
          <CapBroadcastSimulator
            city={impactData.city || impactData.state}
            state={impactData.state}
            severity={impactData.severity}
            eventType={impactData.event_type}
            recommendations={impactData.impact_evaluation.response_recommendations.map(r => r.action)}
          />

          {/* Demographic Exposure & 3-Hour Nowcast Trajectory */}
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

          {/* NDRF Logistics & AI Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <EmergencyResourceDispatch
                city={impactData.city || impactData.state}
                state={impactData.state}
              />
            </div>
            <div className="lg:col-span-6">
              <ResponseRecommendations
                recommendations={impactData.impact_evaluation.response_recommendations}
              />
            </div>
          </div>

          {/* Infrastructure & Information Gaps */}
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

          {/* Evidence Chain */}
          <EvidenceChain evidenceChain={impactData.impact_evaluation.evidence_chain} />

          {/* Accuracy & Post-Event Evaluation */}
          <PredictionAccuracy
            predictedExposure={impactData.impact_evaluation.population_exposure.total_population_exposed}
          />
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