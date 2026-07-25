import React from 'react';
import { 
  Webhook, 
  Sparkles, 
  GitFork, 
  Mail, 
  MessageSquare, 
  Database, 
  ShieldCheck, 
  ShoppingBag, 
  GitPullRequest, 
  Plus, 
  Settings, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  X, 
  Loader2, 
  CornerDownRight,
  ArrowRight,
  Package,
  AlertTriangle,
  Globe
} from 'lucide-react';
import type { WorkflowNode, StepLog, ExecutionStatus } from '../types/workflow';

interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  activeStepId: string | null;
  stepLogs: StepLog[];
  executionStatus: ExecutionStatus;
  onSelectNode: (node: WorkflowNode) => void;
  onDeleteNode: (nodeId: string) => void;
  onMoveNode: (index: number, direction: 'up' | 'down') => void;
  onAddStepAt: (index: number) => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  activeStepId,
  stepLogs,
  onSelectNode,
  onDeleteNode,
  onMoveNode,
  onAddStepAt
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Webhook': return <Webhook className="w-5 h-5 text-cyan-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'GitFork': return <GitFork className="w-5 h-5 text-purple-400" />;
      case 'Mail': return <Mail className="w-5 h-5 text-blue-400" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-emerald-400" />;
      case 'Database': return <Database className="w-5 h-5 text-indigo-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-pink-400" />;
      case 'GitPullRequest': return <GitPullRequest className="w-5 h-5 text-amber-400" />;
      case 'Package': return <Package className="w-5 h-5 text-amber-400" />;
      case 'AlertTriangle': return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      default: return <Globe className="w-5 h-5 text-slate-400" />;
    }
  };

  const getLogForNode = (nodeId: string) => {
    return stepLogs.find((log) => log.nodeId === nodeId);
  };

  return (
    <div className="flex-1 canvas-grid-bg p-8 overflow-y-auto min-h-[calc(100vh-4rem)] flex flex-col items-center">
      <div className="w-full max-w-3xl flex flex-col items-center space-y-4 pb-32">
        {nodes.map((node, index) => {
          const isTrigger = node.type === 'trigger';
          const isLogic = node.type === 'logic';
          const isRunning = activeStepId === node.id;
          const log = getLogForNode(node.id);
          const isSuccess = log?.status === 'success';
          const isFailed = log?.status === 'failed';
          const isSkipped = log?.status === 'skipped';

          return (
            <React.Fragment key={node.id}>
              {/* Connector line between steps */}
              {index > 0 && (
                <div className="flex flex-col items-center py-1 group relative">
                  <div className={`w-0.5 h-8 transition-colors ${
                    isRunning || log?.status === 'running'
                      ? 'bg-gradient-to-b from-indigo-500 to-cyan-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]'
                      : isSuccess
                      ? 'bg-emerald-500/80'
                      : 'bg-slate-700'
                  }`} />
                  <button
                    onClick={() => onAddStepAt(index)}
                    title="Insert Step Here"
                    className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-indigo-300 hover:border-indigo-500 hover:scale-110 flex items-center justify-center transition shadow-lg z-10"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Node Card */}
              <div 
                className={`w-full glass-panel rounded-2xl p-5 border transition-all duration-300 relative group ${
                  isRunning 
                    ? 'running-node-pulse border-indigo-500 bg-indigo-950/40 shadow-xl shadow-indigo-500/20' 
                    : isSuccess
                    ? 'border-emerald-500/50 bg-emerald-950/10'
                    : isFailed
                    ? 'border-rose-500/50 bg-rose-950/10'
                    : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Icon & Details */}
                  <div className="flex items-start gap-4 flex-1 cursor-pointer" onClick={() => onSelectNode(node)}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                      isTrigger
                        ? 'bg-cyan-950/50 border-cyan-500/30'
                        : isLogic
                        ? 'bg-purple-950/50 border-purple-500/30'
                        : 'bg-indigo-950/50 border-indigo-500/30'
                    }`}>
                      {getIcon(node.iconName)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isTrigger 
                            ? 'badge-trigger' 
                            : isLogic 
                            ? 'badge-logic' 
                            : 'badge-action'
                        }`}>
                          Step {index + 1} • {node.type}
                        </span>

                        {/* Status Badges */}
                        {isRunning && (
                          <span className="flex items-center gap-1 text-xs text-amber-300 font-semibold animate-pulse">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Executing...
                          </span>
                        )}
                        {isSuccess && (
                          <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                            <Check className="w-3.5 h-3.5" /> Completed ({log?.durationMs}ms)
                          </span>
                        )}
                        {isFailed && (
                          <span className="flex items-center gap-1 text-xs text-rose-400 font-medium">
                            <X className="w-3.5 h-3.5" /> Failed
                          </span>
                        )}
                        {isSkipped && (
                          <span className="text-xs text-slate-500 italic">
                            Skipped (Branch condition)
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-100 text-base group-hover:text-indigo-300 transition">
                        {node.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {node.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions (Configure, Order, Delete) */}
                  <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => onMoveNode(index, 'up')}
                      disabled={index === 0}
                      title="Move Up"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onMoveNode(index, 'down')}
                      disabled={index === nodes.length - 1}
                      title="Move Down"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onSelectNode(node)}
                      title="Configure Step"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    {!isTrigger && (
                      <button
                        onClick={() => onDeleteNode(node.id)}
                        title="Delete Step"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* If logic step, show branch indicators */}
                {isLogic && (
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                      <CornerDownRight className="w-3.5 h-3.5" />
                      <span>If True: Proceed to Step {index + 2}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>If False: Skip next step</span>
                    </div>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}

        {/* Bottom Append Step Button */}
        <div className="pt-4">
          <button
            onClick={() => onAddStepAt(nodes.length)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 border-dashed text-slate-300 hover:text-indigo-300 hover:border-indigo-500/50 hover:bg-slate-900 transition font-semibold text-sm shadow-md"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            Append New Automation Step
          </button>
        </div>
      </div>
    </div>
  );
};
