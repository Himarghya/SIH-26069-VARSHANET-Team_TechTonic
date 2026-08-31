import React, { useState } from 'react';
import { Truck, Anchor, ShieldCheck, PhoneCall, Plus, CheckCircle2, RefreshCw } from 'lucide-react';

interface ResourceDispatchProps {
  city: string;
  state: string;
}

export const EmergencyResourceDispatch: React.FC<ResourceDispatchProps> = ({ city, state }) => {
  const [resources, setResources] = useState([
    { name: 'NDRF Quick Response Team (QRT)', count: 4, unit: 'Battalions', status: 'STATIONED', deployed: 1 },
    { name: 'Inflatable Motorized Rescue Boats', count: 12, unit: 'Boats', status: 'READY', deployed: 3 },
    { name: 'High-Capacity Dewatering Pumps (500 GPM)', count: 8, unit: 'Heavy Units', status: 'DISPATCHED', deployed: 5 },
    { name: 'Emergency Rations & Potable Water Kits', count: 5000, unit: 'Supply Packs', status: 'IN_TRANSIT', deployed: 2000 },
  ]);

  const [dispatchedSuccess, setDispatchedSuccess] = useState<string | null>(null);

  const handleDeployMore = (index: number) => {
    setResources(prev => {
      const updated = [...prev];
      if (updated[index].deployed < updated[index].count) {
        updated[index].deployed += 1;
        setDispatchedSuccess(`+1 Unit deployed to ${city} Sector`);
        setTimeout(() => setDispatchedSuccess(null), 3000);
      }
      return updated;
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/40">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Emergency Logistics & NDRF Resource Mobilization
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              State Disaster Management Operations Grid ({city})
            </p>
          </div>
        </div>

        {dispatchedSuccess && (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50 animate-bounce">
            {dispatchedSuccess}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {resources.map((item, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white">{item.name}</div>
              <div className="text-[11px] text-cyan-400 font-mono font-semibold mt-0.5">
                {item.deployed} of {item.count} {item.unit} Active
              </div>
            </div>

            <button
              onClick={() => handleDeployMore(idx)}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer"
              title="Mobilize additional units to incident coordinates"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Deploy</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};