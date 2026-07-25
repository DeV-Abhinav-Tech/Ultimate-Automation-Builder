import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Mail, 
  MessageSquare, 
  Database, 
  GitFork, 
  Clock, 
  Globe, 
  Plus
} from 'lucide-react';
import type { WorkflowNode, Category } from '../types/workflow';

interface StepPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (stepTemplate: Partial<WorkflowNode>) => void;
}

export const StepPickerModal: React.FC<StepPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectType
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'all' | 'ai' | 'integrations' | 'logic'>('all');

  const catalog: Array<{
    name: string;
    type: 'action' | 'logic';
    category: Category;
    description: string;
    iconName: string;
    defaultConfig: Record<string, any>;
    group: 'ai' | 'integrations' | 'logic';
  }> = [
    {
      name: 'AI Text & Data Summarizer',
      type: 'action',
      category: 'ai',
      description: 'Analyze, score, or extract structured data using Gemini 3.5 AI',
      iconName: 'Sparkles',
      defaultConfig: { prompt: 'Summarize text: {{trigger.message}}', model: 'gemini-3.5-flash' },
      group: 'ai'
    },
    {
      name: 'If / Else Condition Branch',
      type: 'logic',
      category: 'condition',
      description: 'Branch your workflow based on custom logic evaluation',
      iconName: 'GitFork',
      defaultConfig: { field: '{{trigger.score}}', operator: 'equals', value: 'High' },
      group: 'logic'
    },
    {
      name: 'HTTP / API Request',
      type: 'action',
      category: 'http',
      description: 'Send custom REST API requests (GET, POST, PUT, DELETE)',
      iconName: 'Globe',
      defaultConfig: { method: 'POST', url: 'https://api.external.com/v1/event' },
      group: 'integrations'
    },
    {
      name: 'Send Email (SMTP / SendGrid)',
      type: 'action',
      category: 'email',
      description: 'Dispatch automated email to users or internal staff',
      iconName: 'Mail',
      defaultConfig: { to: '{{trigger.email}}', subject: 'Notification Alert' },
      group: 'integrations'
    },
    {
      name: 'Slack Channel Alert',
      type: 'action',
      category: 'slack',
      description: 'Broadcast instant updates or team alerts to Slack',
      iconName: 'MessageSquare',
      defaultConfig: { channel: '#general', message: 'Alert triggered!' },
      group: 'integrations'
    },
    {
      name: 'Database Query / Upsert',
      type: 'action',
      category: 'database',
      description: 'Read or write rows in PostgreSQL / MySQL / Supabase',
      iconName: 'Database',
      defaultConfig: { table: 'records', operation: 'UPSERT' },
      group: 'integrations'
    },
    {
      name: 'Delay / Sleep Buffer',
      type: 'logic',
      category: 'delay',
      description: 'Pause execution for specified duration before next step',
      iconName: 'Clock',
      defaultConfig: { seconds: 5 },
      group: 'logic'
    }
  ];

  const filteredCatalog = catalog.filter((item) => {
    if (activeTab === 'all') return true;
    return item.group === activeTab;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-950 border border-indigo-800/50 text-indigo-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-100 text-lg">Add Automation Step</h2>
              <p className="text-xs text-slate-400">Choose action or control logic node from catalog</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-slate-800/80 flex gap-2">
          {[
            { id: 'all', label: 'All Nodes' },
            { id: 'ai', label: 'AI Intelligence' },
            { id: 'integrations', label: 'Integrations & Web APIs' },
            { id: 'logic', label: 'Control & Logic' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Node Selection Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {filteredCatalog.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSelectType({
                  name: item.name,
                  type: item.type,
                  category: item.category,
                  description: item.description,
                  iconName: item.iconName,
                  config: item.defaultConfig
                });
                onClose();
              }}
              className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 hover:border-indigo-500/50 cursor-pointer transition flex items-start gap-3.5 group shadow-sm"
            >
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/60 text-indigo-400 group-hover:scale-105 transition">
                {item.category === 'ai' && <Sparkles className="w-5 h-5 text-amber-400" />}
                {item.category === 'condition' && <GitFork className="w-5 h-5 text-purple-400" />}
                {item.category === 'http' && <Globe className="w-5 h-5 text-cyan-400" />}
                {item.category === 'email' && <Mail className="w-5 h-5 text-blue-400" />}
                {item.category === 'slack' && <MessageSquare className="w-5 h-5 text-emerald-400" />}
                {item.category === 'database' && <Database className="w-5 h-5 text-indigo-400" />}
                {item.category === 'delay' && <Clock className="w-5 h-5 text-slate-400" />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-200 text-sm group-hover:text-indigo-300 transition">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
