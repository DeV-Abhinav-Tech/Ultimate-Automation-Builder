import React, { useState } from 'react';
import { X, FileCode, Check, AlertCircle } from 'lucide-react';

interface PayloadModalProps {
  isOpen: boolean;
  triggerPayload: Record<string, any>;
  onClose: () => void;
  onSave: (payload: Record<string, any>) => void;
}

export const PayloadModal: React.FC<PayloadModalProps> = ({
  isOpen,
  triggerPayload,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const [jsonText, setJsonText] = useState(JSON.stringify(triggerPayload, null, 2));
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onSave(parsed);
      onClose();
    } catch (e: any) {
      setError('Invalid JSON syntax: ' + e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800/50 text-cyan-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-100 text-lg">Trigger Payload JSON</h2>
              <p className="text-xs text-slate-400">Mock event data fed into step 1 trigger</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* JSON Editor */}
        <div className="p-6 space-y-3">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <textarea
            rows={10}
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setError(null);
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-emerald-300 font-mono text-xs focus:border-cyan-500 focus:outline-none transition leading-relaxed"
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 transition flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Save Payload
          </button>
        </div>
      </div>
    </div>
  );
};
