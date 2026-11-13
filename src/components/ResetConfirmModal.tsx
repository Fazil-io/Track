import React, { useState } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
}) => {
  const [typedConfirmation, setTypedConfirmation] = useState('');

  if (!isOpen) return null;

  const isConfirmed = typedConfirmation.trim().toLowerCase() === 'reset';

  const handleReset = () => {
    if (!isConfirmed) return;
    onConfirmReset();
    setTypedConfirmation('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-rose-200 dark:border-rose-950 animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
            <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Reset All Application Data?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This action cannot be undone
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          This will wipe all tracked days, tasks, progress history, and custom settings stored in your browser's local storage.
        </p>

        <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300">
          To confirm, please type <strong className="font-bold underline">RESET</strong> in the input field below:
        </div>

        <input
          type="text"
          value={typedConfirmation}
          onChange={(e) => setTypedConfirmation(e.target.value)}
          placeholder="Type RESET"
          className="mt-3 w-full text-sm bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono tracking-wider"
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              setTypedConfirmation('');
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            disabled={!isConfirmed}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-rose-600 hover:bg-rose-700 active:scale-95 text-white shadow-md shadow-rose-600/25 disabled:opacity-40 disabled:pointer-events-none transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Confirm Reset</span>
          </button>
        </div>

      </div>
    </div>
  );
};

