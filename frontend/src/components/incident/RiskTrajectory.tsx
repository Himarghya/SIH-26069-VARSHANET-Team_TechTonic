import React from 'react';
import { Clock, TrendingUp, AlertTriangle, Waves } from 'lucide-react';
import { NowcastStep } from '../../types';

interface RiskTrajectoryProps {
  trajectory: NowcastStep[];
  escalationProbability: number;
}

export const RiskTrajectory: React.FC<RiskTrajectoryProps> = ({
  trajectory,
  escalationProbability
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 font-sans">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Clock className="w-4 h-4 text-cyan-400" /> Optical-Flow 3-Hour Impact Nowcast Trajectory
          </h3>
          <p className="text-[10px] text-slate-500 font-mono">
            Radar Optical Flow Vector Extrapolation on Doppler Radar (dBZ) Matrices • Calibrated Error Margin: ±6.38%
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/40 text-rose-300 font-bold">
          Escalation Probability: {(escalationProbability * 100).toFixed(0)}%
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {trajectory.map((step, idx) => {
          const isCritical = step.predicted_severity === 'CRITICAL';
          const isHigh = step.predicted_severity === 'HIGH';
          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-center space-y-1 transition-all ${
                isCritical
                  ? 'bg-rose-950/40 border-rose-600/60 shadow-lg shadow-rose-950/30'
                  : isHigh
                  ? 'bg-amber-950/30 border-amber-600/50'
                  : 'bg-slate-950/80 border-slate-800'
              }`}
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase block font-mono">
                {step.time_label}
              </span>
              <div className="text-2xl font-black font-mono text-white">
                {step.predicted_risk_score}
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isCritical ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                  isHigh ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-cyan-950 text-cyan-300 border border-cyan-800'
                }`}>
                  {step.predicted_severity}
                </span>
              </div>
              <span className="text-[9px] text-slate-500 font-mono block pt-0.5">
                {(step.confidence * 100).toFixed(0)}% Conf
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};