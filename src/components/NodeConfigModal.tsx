import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Play, 
  Code
} from 'lucide-react';
import type { WorkflowNode } from '../types/workflow';

interface NodeConfigModalProps {
  node: WorkflowNode | null;
  allNodes: WorkflowNode[];
  onClose: () => void;
  onSave: (updatedNode: WorkflowNode) => void;
  onTestStep: (node: WorkflowNode) => void;
}

export const NodeConfigModal: React.FC<NodeConfigModalProps> = ({
  node,
  onClose,
  onSave,
  onTestStep
}) => {
  if (!node) return null;

  const [name, setName] = useState(node.name);
  const [description, setDescription] = useState(node.description);
  const [config, setConfig] = useState<Record<string, any>>({ ...node.config });

  // Available previous step variables for autocompletion pills
  const availableVars = [
    { label: 'Trigger Lead Name', value: '{{trigger.lead_name}}' },
    { label: 'Trigger Email', value: '{{trigger.email}}' },
    { label: 'Trigger Company Size', value: '{{trigger.company_size}}' },
    { label: 'Trigger Order ID', value: '{{trigger.order_id}}' },
    { label: 'AI Score Output', value: '{{step-2.score}}' },
    { label: 'HTTP Status Code', value: '{{step-2.status}}' },
    { label: 'Fraud Risk Score', value: '{{step-2.risk_score}}' },
  ];

  const handleConfigChange = (key: string, val: any) => {
    setConfig((prev) => ({ ...prev, [key]: val }));
  };

  const handleInsertVar = (fieldKey: string, varText: string) => {
    const currentVal = config[fieldKey] || '';
    handleConfigChange(fieldKey, `${currentVal} ${varText}`.trim());
  };

  const handleSave = () => {
    onSave({
      ...node,
      name,
      description,
      config
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-950 border border-indigo-800/50 text-indigo-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-100 text-lg">Configure Step Settings</h2>
              <p className="text-xs text-slate-400">Category: {node.category} • Type: {node.type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Step Name & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Step Title
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Description / Purpose
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:border-indigo-500 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Dynamic Configuration Inputs based on node category */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Code className="w-4 h-4" /> Parameters & Variables
            </h3>

            {/* AI Node Config */}
            {node.category === 'ai' && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">AI Prompt Template</label>
                    <span className="text-[11px] text-slate-400">Click pill below to insert payload variable</span>
                  </div>
                  <textarea
                    rows={4}
                    value={config.prompt || ''}
                    onChange={(e) => handleConfigChange('prompt', e.target.value)}
                    placeholder="Enter prompt with {{variable}} placeholders..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-sm font-mono focus:border-indigo-500 focus:outline-none transition"
                  />
                  {/* Dynamic variable pills */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableVars.map((v) => (
                      <button
                        key={v.value}
                        type="button"
                        onClick={() => handleInsertVar('prompt', v.value)}
                        className="var-pill"
                      >
                        + {v.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">AI Model</label>
                    <select
                      value={config.model || 'gemini-3.5-flash'}
                      onChange={(e) => handleConfigChange('model', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="gemini-3.5-flash">Gemini 3.5 Flash (Fast)</option>
                      <option value="gemini-3.5-pro">Gemini 3.5 Pro (Deep Reasoning)</option>
                      <option value="gpt-4o">GPT-4o</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Temperature (Creativity)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={config.temperature ?? 0.2}
                      onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Condition Node Config */}
            {node.category === 'condition' && (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-300">If Rule Evaluation</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Field e.g. {{step-2.score}}"
                    value={config.field || ''}
                    onChange={(e) => handleConfigChange('field', e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-sm font-mono"
                  />
                  <select
                    value={config.operator || 'equals'}
                    onChange={(e) => handleConfigChange('operator', e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-sm"
                  >
                    <option value="equals">Equals</option>
                    <option value="not_equals">Does Not Equal</option>
                    <option value="contains">Contains</option>
                    <option value="less_than">Less Than</option>
                    <option value="greater_than">Greater Than</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Value e.g. High"
                    value={config.value || ''}
                    onChange={(e) => handleConfigChange('value', e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-sm font-mono"
                  />
                </div>
              </div>
            )}

            {/* HTTP / API Node Config */}
            {node.category === 'http' && (
              <>
                <div className="grid grid-cols-4 gap-2">
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Method</label>
                    <select
                      value={config.method || 'POST'}
                      onChange={(e) => handleConfigChange('method', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-sm font-bold"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Target Endpoint URL</label>
                    <input
                      type="text"
                      value={config.url || ''}
                      onChange={(e) => handleConfigChange('url', e.target.value)}
                      placeholder="https://api.service.com/v1/webhook"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-sm font-mono"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email / Slack Node Config */}
            {(node.category === 'email' || node.category === 'slack') && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {node.category === 'email' ? 'Recipient Email' : 'Slack Channel'}
                  </label>
                  <input
                    type="text"
                    value={config.to || config.channel || ''}
                    onChange={(e) => handleConfigChange(node.category === 'email' ? 'to' : 'channel', e.target.value)}
                    placeholder={node.category === 'email' ? 'user@domain.com' : '#general'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {node.category === 'email' ? 'Email Body' : 'Notification Message'}
                  </label>
                  <textarea
                    rows={3}
                    value={config.message || config.subject || ''}
                    onChange={(e) => handleConfigChange(node.category === 'email' ? 'subject' : 'message', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 text-sm"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={() => onTestStep(node)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold transition"
          >
            <Play className="w-3.5 h-3.5 text-cyan-400" />
            Test Step Execution
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
