import React, { useState } from 'react';
import { Terminal, Play, Download, Sparkles, CheckCircle2, AlertTriangle, Clock, Database, Code2 } from 'lucide-react';
import { executeCustomSqlQuery } from '../../services/api';

const PRESET_QUERIES = [
  {
    name: 'Top Affected States (24h)',
    query: 'SELECT state, COUNT(*) as event_count, AVG(credibility_score) as avg_confidence FROM weather_reports GROUP BY state ORDER BY event_count DESC LIMIT 10;'
  },
  {
    name: 'Hazard Category Breakdown',
    query: 'SELECT event_type, COUNT(*) as total_reports, AVG(credibility_score) as avg_confidence, SUM(CASE WHEN verification_status = "VERIFIED" THEN 1 ELSE 0 END) as verified_count FROM weather_reports GROUP BY event_type ORDER BY total_reports DESC;'
  },
  {
    name: 'High Severity Emergency Clusters',
    query: 'SELECT id, title, city, state, severity, status, created_at FROM event_clusters WHERE severity IN ("HIGH", "CRITICAL") ORDER BY created_at DESC LIMIT 10;'
  },
  {
    name: 'SimHash Deduplication Sample',
    query: 'SELECT city, state, source_type, credibility_score, verification_status FROM weather_reports WHERE verification_status = "VERIFIED" ORDER BY credibility_score DESC LIMIT 10;'
  }
];

export const CustomSqlConsole: React.FC = () => {
  const [query, setQuery] = useState(PRESET_QUERIES[0].query);
  const [result, setResult] = useState<{
    columns: string[];
    rows: any[][];
    row_count: number;
    execution_time_ms: number;
    query_executed: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunQuery = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await executeCustomSqlQuery(query);
      setResult(res);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to execute query');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCsv = () => {
    if (!result || result.rows.length === 0) return;
    const header = result.columns.join(',');
    const rows = result.rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','));
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VARSHANET_SQL_EXPORT_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 font-sans">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            Interactive Big Data SQL Query Console
          </h2>
          <p className="text-xs text-slate-400">
            Execute real-time read-only analytical SQL queries against the VARSHANET weather and incident relational database.
          </p>
        </div>

        {result && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">
              <Clock className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
              {result.execution_time_ms} ms ({result.row_count} rows)
            </span>
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        )}
      </div>

      {/* Preset Query Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-400 font-mono font-bold">Preset Queries:</span>
        {PRESET_QUERIES.map((pq, idx) => (
          <button
            key={idx}
            onClick={() => setQuery(pq.query)}
            className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-cyan-300 text-[11px] font-mono border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer"
          >
            {pq.name}
          </button>
        ))}
      </div>

      {/* Query Textarea & Run Button */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={3}
          className="w-full p-4 bg-transparent font-mono text-xs text-cyan-300 focus:outline-none resize-none leading-relaxed"
          placeholder="Enter SQL SELECT query..."
        />
        <div className="flex items-center justify-between p-2.5 bg-slate-900/80 border-t border-slate-800">
          <span className="text-[10px] font-mono text-slate-500">
            🔒 Read-only security sandbox active (SELECT queries only)
          </span>
          <button
            onClick={handleRunQuery}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold font-mono transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Executing...' : 'Run Query'}</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-mono flex items-center gap-2 animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Table */}
      {result && result.columns.length > 0 && (
        <div className="space-y-2">
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 shadow-inner max-h-[360px] overflow-y-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-400 text-[10px] font-bold border-b border-slate-800 sticky top-0">
                <tr>
                  {result.columns.map((col, idx) => (
                    <th key={idx} className="py-2.5 px-3 uppercase tracking-wider">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {result.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-900/50 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-2.5 px-3 font-medium">
                        {cell === null ? (
                          <span className="text-slate-600 italic">NULL</span>
                        ) : typeof cell === 'number' ? (
                          <span className="text-cyan-300 font-bold">{Number.isInteger(cell) ? cell : cell.toFixed(2)}</span>
                        ) : (
                          String(cell)
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};