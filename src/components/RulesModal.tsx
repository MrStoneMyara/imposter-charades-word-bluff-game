import React from 'react';
import { X, ShieldAlert, Sparkles, UserCheck, MessageSquare, Target } from 'lucide-react';
import { LanguageData } from '../data/languages.ts';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LanguageData;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg max-h-[85vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header (Outside scroll area) */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🕵️</span>
            <h2 className="text-base font-bold text-white tracking-wide">
              {lang.strings.howToPlayTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content (flex-1 overflow-y-auto) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-sm text-slate-300">
          <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-400 text-sm">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>1. Secret Roles & The Word</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang.strings.rule1}
            </p>
            <p className="text-xs text-slate-400">
              Innocents know the exact Secret Word (e.g. 🍕 Pizza). The Imposter only knows the Category (e.g. Food), but NOT the word!
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>2. Give One Clue in Turn</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang.strings.rule2}
            </p>
            <p className="text-xs text-slate-400">
              Say ONE word or short phrase. Example for Pizza: "Cheese", "Crust", "Oven". If you say "Pepperoni Pizza" you give it away to the imposter!
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
              <Target className="w-4 h-4 shrink-0" />
              <span>3. Discuss, Accuse & Vote</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang.strings.rule3}
            </p>
            <p className="text-xs text-slate-400">
              If the group votes for the real imposter, the imposter gets <strong>ONE last chance</strong> to guess the secret word! If they guess right, they win anyway!
            </p>
          </div>

          <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-xs text-indigo-300">
            <span className="font-semibold text-white">💡 Pro Tip for Imposters:</span> Listen intently to the first two clues before your turn, and say something versatile like "Hot", "Italian", or "Delicious" to blend in!
          </div>
        </div>

        {/* Footer CTA (Outside scroll area so always visible on mobile) */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg shadow-rose-900/20 cursor-pointer"
          >
            Got It, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};
