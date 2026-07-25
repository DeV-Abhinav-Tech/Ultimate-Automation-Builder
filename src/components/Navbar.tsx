import React from 'react';
import { 
  Play, 
  Layers, 
  Download, 
  Plus, 
  FileCode,
  Sparkles,
  CheckCircle2,
  Activity
} from 'lucide-react';
import type { Workflow, ExecutionStatus } from '../types/workflow';

interface NavbarProps {
  workflow: Workflow;
  onUpdateWorkflow: (updated: Partial<Workflow>) => void;
  onRunWorkflow: () => void;
  executionStatus: ExecutionStatus;
  onOpenTemplates: () => void;
  onOpenStepPicker: () => void;
  onOpenPayloadModal: () => void;
  onExportJson: () => void;
  onImportJson: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  workflow,
  onUpdateWorkflow,
  onRunWorkflow,
  executionStatus,
  onOpenTemplates,
  onOpenStepPicker,
  onOpenPayloadModal,
  onExportJson,
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Title Edit */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-1 ring-indigo-400/40">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 text-sm uppercase tracking-wider">
                Ultimate Automation Builder
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 font-semibold border border-indigo-800/50">
                AI Powered
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={workflow.name}
                onChange={(e) => onUpdateWorkflow({ name: e.target.value })}
                className="bg-transparent font-bold text-slate-100 hover:bg-slate-800/50 focus:bg-slate-800 px-1 py-0 rounded border border-transparent focus:border-indigo-500 text-xs outline-none transition"
              />
              <span className="text-[10px] text-slate-400">
                • {workflow.nodes.length} Steps Sequence
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Template Gallery */}
        <button
          onClick={onOpenTemplates}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 hover:text-white transition"
        >
          <Layers className="w-4 h-4 text-indigo-400" />
          AI Templates
        </button>

        {/* Trigger Payload Edit */}
        <button
          onClick={onOpenPayloadModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-800 hover:text-white transition"
        >
          <FileCode className="w-4 h-4 text-cyan-400" />
          Mock Payload
        </button>

        {/* Add Step Button */}
        <button
          onClick={onOpenStepPicker}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-700/50 text-indigo-300 text-sm font-medium hover:bg-indigo-900/80 transition"
        >
          <Plus className="w-4 h-4" />
          Add AI Step
        </button>

        {/* Export */}
        <button
          onClick={onExportJson}
          title="Export Workflow JSON"
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Run Workflow Test Button */}
        <button
          onClick={onRunWorkflow}
          disabled={executionStatus === 'running'}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold shadow-lg transition-all ${
            executionStatus === 'running'
              ? 'bg-amber-600/50 text-amber-200 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          {executionStatus === 'running' ? (
            <>
              <Activity className="w-4 h-4 animate-spin text-amber-300" />
              Executing AI Flow...
            </>
          ) : executionStatus === 'completed' ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              Re-run Test
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              Run AI Workflow
            </>
          )}
        </button>
      </div>
    </header>
  );
};
