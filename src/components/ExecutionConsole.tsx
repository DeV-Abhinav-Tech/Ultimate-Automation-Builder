import React, { useState } from 'react';
import { 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronDown, 
  ChevronRight, 
  Minimize2, 
  Maximize2,
  Trash2,
  Cpu,
  Layers
} from 'lucide-react';
import type { StepLog, ExecutionStatus } from '../types/workflow';

interface ExecutionConsoleProps {
  logs: StepLog[];
  status: ExecutionStatus;
  totalDurationMs?: number;
  onClearLogs: () => void;
}

export const ExecutionConsole: React.FC<ExecutionConsoleProps> = ({
  logs,
  status,
  totalDurationMs,
  onClearLogs
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [isMinimized, setIsMinimized] = useState(false);

  if (logs.length === 0 && status === 'idle') {
    return null;
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-30 transition-all duration-300 ${
      isMinimized ? 'h-12' : 'h-72'
    } bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl flex flex-col shadow-2xl`}>
      {/* Header Bar */}
      <div className="h-12 border-b border-slate-800/80 px-6 flex items-center justify-between bg-slate-900/60 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-200 text-sm">Execution Console</span>
          </div>

          {/* Status badge */}
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
            status === 'running'
              ? 'bg-amber-950/80 text-amber-300 border border-amber-800/50 animate-pulse'
              : status === 'completed'
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
              : status === 'failed'
              ? 'bg-rose-950/80 text-rose-300 border border-rose-800/50'
              : 'bg-slate-800 text-slate-400'
          }`}>
            {status === 'running' && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
            {status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
            {status === 'failed' && <XCircle className="w-3.5 h-3.5" />}
            <span className="uppercase">{status}</span>
          </span>

          {totalDurationMs !== undefined && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Total: {totalDurationMs} ms
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClearLogs}
            title="Clear Logs"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Logs List & Payload Details */}
      {!isMinimized && (
        <div className="flex-1 flex overflow-hidden">
          {/* Steps Timeline Sidebar */}
          <div className="w-1/3 border-r border-slate-800/80 overflow-y-auto p-3 space-y-2 bg-slate-950/40">
            {logs.map((log, idx) => (
              <div
                key={idx}
                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                  expandedIndex === idx
                    ? 'bg-slate-900 border-indigo-500/60 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/60 hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {log.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {log.status === 'failed' && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                  {log.status === 'running' && <Cpu className="w-4 h-4 text-amber-400 animate-spin shrink-0" />}
                  {log.status === 'skipped' && <Clock className="w-4 h-4 text-slate-500 shrink-0" />}
                  <span className="font-semibold text-slate-200 truncate">{log.nodeName}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {log.durationMs && <span className="text-[10px] text-slate-500">{log.durationMs}ms</span>}
                  {expandedIndex === idx ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Payload View */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-xs text-slate-300">
            {expandedIndex !== null && logs[expandedIndex] ? (
              <div className="space-y-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 mb-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Output Payload
                  </div>
                  <pre className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-emerald-300 overflow-x-auto">
                    {JSON.stringify(logs[expandedIndex].outputPayload, null, 2)}
                  </pre>
                </div>

                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Input Parameters
                  </div>
                  <pre className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-slate-300 overflow-x-auto">
                    {JSON.stringify(logs[expandedIndex].inputPayload, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 italic">
                Select a step log on the left to view output payloads and details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
