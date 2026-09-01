import React, { useState } from 'react';
import { Truck, Anchor, ShieldCheck, PhoneCall, Plus, CheckCircle2, FileText, AlertOctagon, Send, MapPin, Printer } from 'lucide-react';

interface ResourceDispatchProps {
  city: string;
  state: string;
  totalPopulationExposed?: number;
  severity?: string;
}

export const EmergencyResourceDispatch: React.FC<ResourceDispatchProps> = ({
  city,
  state,
  totalPopulationExposed = 386792,
  severity = 'HIGH'
}) => {
  // Real NDRF Battalions mapped to Indian regional hubs
  const ndrfBattalions = [
    { id: '11-BN', name: '11th Battalion NDRF (Varanasi / Central)', location: 'Varanasi, UP', etaHours: 2.5, status: 'MOBILIZING', commander: 'Commandant R. K. Sharma' },
    { id: '8-BN', name: '8th Battalion NDRF (Ghaziabad / North)', location: 'Ghaziabad, NCR', etaHours: 4.0, status: 'STANDBY', commander: 'Commandant P. Singh' },
    { id: '10-BN', name: '10th Battalion NDRF (Guntur / South)', location: 'Guntur, AP', etaHours: 5.5, status: 'STANDBY', commander: 'Commandant K. Rao' },
  ];

  // Dynamic resource demand calculation based on exposed population
  const boatsRequired = Math.max(8, Math.min(30, Math.ceil(totalPopulationExposed / 25000)));
  const pumpsRequired = Math.max(4, Math.min(20, Math.ceil(totalPopulationExposed / 40000)));
  const rationsRequired = Math.max(2000, Math.min(25000, Math.ceil(totalPopulationExposed / 15)));

  const [resources, setResources] = useState([
    { name: 'Motorized Inflatable Rescue Boats (IRBs)', allocated: 6, required: boatsRequired, unit: 'Boats', status: 'PARTIALLY_DEPLOYED' },
    { name: 'Heavy-Duty Dewatering Pumps (500 GPM)', allocated: 3, required: pumpsRequired, unit: 'Heavy Units', status: 'IN_TRANSIT' },
    { name: 'Emergency Food & Potable Water Kits', allocated: 2500, required: rationsRequired, unit: 'Packs', status: 'DISTRIBUTING' },
    { name: 'NDRF Flood Rescue Teams (QRT)', allocated: 2, required: 4, unit: 'Companies (90 Troops)', status: 'ACTIVE_ON_SCENE' },
  ]);

  const [selectedBn, setSelectedBn] = useState(ndrfBattalions[0]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  const handleAllocate = (index: number) => {
    setResources(prev => {
      const updated = [...prev];
      if (updated[index].allocated < updated[index].required) {
        updated[index].allocated += 1;
        setDispatchSuccess(`Mobilized +1 ${updated[index].name} to ${city} Sector`);
        setTimeout(() => setDispatchSuccess(null), 3500);
      }
      return updated;
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/40">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              NDRF Logistics & Inter-Agency Resource Allocation
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              State Emergency Operation Centre (SEOC) Demand-Supply Grid • {city}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowOrderModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-950/40 transition-all cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Generate NDRF Requisition</span>
        </button>
      </div>

      {/* Real-time Notification Banner */}
      {dispatchSuccess && (
        <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{dispatchSuccess}</span>
        </div>
      )}

      {/* Resource Inventory & Shortfall Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {resources.map((item, idx) => {
          const deficit = Math.max(0, item.required - item.allocated);
          const percent = Math.min(100, Math.round((item.allocated / item.required) * 100));

          return (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-white leading-tight block">{item.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Deployed: <strong className="text-cyan-300">{item.allocated}</strong> / Required: <strong className="text-amber-400">{item.required} {item.unit}</strong>
                  </span>
                </div>
                {deficit > 0 ? (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 shrink-0">
                    Deficit: -{deficit}
                  </span>
                ) : (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                    100% Fulfilled
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div
                  style={{ width: `${percent}%` }}
                  className={`h-full rounded-full transition-all ${
                    percent >= 100 ? 'bg-emerald-500' : percent >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500 font-mono">Status: {item.status.replace(/_/g, ' ')}</span>
                <button
                  onClick={() => handleAllocate(idx)}
                  disabled={deficit === 0}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    deficit > 0
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer shadow-sm'
                      : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-3 h-3" />
                  <span>Dispatch 1 Unit</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pre-positioned NDRF Battalion Corridor */}
      <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
          Pre-Positioned National Disaster Response Force (NDRF) Battalions
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {ndrfBattalions.map((bn) => (
            <div key={bn.id} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white font-mono">{bn.id}</span>
                <span className="text-[9px] font-mono px-1 rounded bg-cyan-950 text-cyan-300">ETA: {bn.etaHours} hrs</span>
              </div>
              <div className="text-[11px] text-slate-300">{bn.name}</div>
              <div className="text-[10px] text-slate-500 font-mono">{bn.commander}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Requisition Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fade-in text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Government of India — NDRF Mobilization Order</h3>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-slate-400 hover:text-white text-xs font-mono font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-2">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>REQUISITION ID: NDRF/2026/MOES-{city.toUpperCase().slice(0, 3)}-882</span>
                <span>URGENCY: IMMEDIATE</span>
              </div>
              <div className="text-white font-bold">TARGET SECTOR: {city}, {state}</div>
              <div className="text-slate-300">INCIDENT SEVERITY: {severity} DISASTER IMPACT</div>
              <div className="text-slate-300">ESTIMATED POPULATION EXPOSED: {totalPopulationExposed.toLocaleString()} Citizens</div>
              <div className="text-emerald-400 font-bold">
                MANDATE: Immediate deployment of {boatsRequired} IRBs and {pumpsRequired} Dewatering Pumps under SDMA emergency provisions.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                  setShowOrderModal(false);
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Order</span>
              </button>
              <button
                onClick={() => {
                  setDispatchSuccess(`Official NDRF Requisition Order Dispatched to 11th Battalion HQ!`);
                  setShowOrderModal(false);
                  setTimeout(() => setDispatchSuccess(null), 4000);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit to HQ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};