import React from 'react';
import { X, Layers, ArrowRight } from 'lucide-react';
import type { Workflow } from '../types/workflow';
import { PRESET_TEMPLATES } from '../data/templates';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Workflow) => void;
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-950 border border-indigo-800/50 text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-100 text-lg">Pre-built Workflow Templates</h2>
              <p className="text-xs text-slate-400">Load ready-to-run automation pipelines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {PRESET_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => {
                onSelectTemplate(tmpl);
                onClose();
              }}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 hover:border-indigo-500/50 cursor-pointer transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group shadow-md"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                    {tmpl.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    {tmpl.nodes.length} Steps Sequence
                  </span>
                </div>
                <h3 className="font-bold text-slate-100 text-base group-hover:text-indigo-300 transition">
                  {tmpl.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {tmpl.description}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
                  Load Template <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
