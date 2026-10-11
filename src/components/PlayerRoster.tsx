import React, { useState } from 'react';
import { GripVertical, ChevronUp, ChevronDown, X, Plus, Users } from 'lucide-react';
import { LanguageData } from '../data/languages.ts';
import { playSound } from '../utils/audio.ts';

interface PlayerRosterProps {
  players: string[];
  onChange: (players: string[]) => void;
  lang: LanguageData;
  isDark: boolean;
  soundEnabled: boolean;
}

export const PlayerRoster: React.FC<PlayerRosterProps> = ({
  players,
  onChange,
  lang,
  isDark,
  soundEnabled,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropInsertionIndex, setDropInsertionIndex] = useState<number | null>(null);

  const handleNameChange = (idx: number, val: string) => {
    const updated = [...players];
    updated[idx] = val;
    onChange(updated);
  };

  const handleAddPlayer = () => {
    if (players.length >= 16) return;
    onChange([...players, '']);
    if (soundEnabled) playSound('tap');
  };

  const handleDeletePlayer = (idx: number) => {
    if (players.length <= 3) return;
    onChange(players.filter((_, i) => i !== idx));
    if (soundEnabled) playSound('tap');
  };

  const handleMoveUp = (idx: number) => {
    if (idx <= 0) return;
    const updated = [...players];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    onChange(updated);
    if (soundEnabled) playSound('tap');
  };

  const handleMoveDown = (idx: number) => {
    if (idx >= players.length - 1) return;
    const updated = [...players];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    onChange(updated);
    if (soundEnabled) playSound('tap');
  };

  // Drag and Drop handlers: calculate insertion position (between rows)
  const handleDragStart = (e: React.DragEvent, idx: number) => {
    setDraggedIndex(idx);
    setDropInsertionIndex(null);
    e.dataTransfer.setData('text/plain', String(idx));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverRow = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    // Upper half targets before this row (idx), lower half targets after this row (idx + 1)
    const target = offsetY < rect.height / 2 ? idx : idx + 1;
    if (dropInsertionIndex !== target) {
      setDropInsertionIndex(target);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex === null || dropInsertionIndex === null) {
      setDraggedIndex(null);
      setDropInsertionIndex(null);
      return;
    }
    const from = draggedIndex;
    const to = dropInsertionIndex;
    setDraggedIndex(null);
    setDropInsertionIndex(null);

    // If dropped in the same position (before or after self), no change
    if (to === from || to === from + 1) return;

    const updated = [...players];
    const [movedItem] = updated.splice(from, 1);
    const finalIndex = from < to ? to - 1 : to;
    updated.splice(finalIndex, 0, movedItem);
    onChange(updated);
    if (soundEnabled) playSound('tap');
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropInsertionIndex(null);
  };

  const dir = lang.dir;

  return (
    <div className="space-y-2.5 w-full" dir={dir}>
      {/* Header with count badge - styled exactly like Choose Category subtitle */}
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
          <Users className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
          <span>{lang.strings.players}</span>
        </label>
        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          {players.length} {lang.strings.selectedCount || lang.strings.players}
        </span>
      </div>

      {/* Players List with Drag & Drop between rows & Reorder Arrows */}
      <div
        className="space-y-1.5"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
      >
        {players.map((pName, idx) => {
          const showLineBefore =
            draggedIndex !== null &&
            dropInsertionIndex === idx &&
            idx !== draggedIndex &&
            idx !== draggedIndex + 1;

          return (
            <React.Fragment key={`player-slot-frag-${idx}`}>
              {/* Insertion line indicator between rows */}
              {showLineBefore && (
                <div className="h-1.5 -my-0.5 rounded-full bg-blue-500 shadow-sm relative z-20 flex items-center justify-between px-1 animate-in fade-in zoom-in-95 duration-100">
                  <span className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
                  <span className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
                </div>
              )}

              <div
                key={`player-slot-${idx}`}
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={(e) => handleDragOverRow(e, idx)}
                className={`flex items-center gap-2 p-1.5 rounded-2xl border transition-all ${
                  draggedIndex === idx
                    ? 'opacity-35 border-dashed border-blue-400 scale-[0.99]'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xs'
                }`}
              >
                {/* Drag Handle & Reorder arrows */}
                <div className="flex items-center gap-0.5 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 shrink-0">
                  <div
                    className="p-1 cursor-grab active:cursor-grabbing select-none"
                    title="Drag to reorder circle"
                  >
                    <GripVertical className="w-4 h-4" />
                  </div>

                  {/* Up / Down arrows for instant mobile seating order adjustment */}
                  <div className="flex flex-col">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveUp(idx)}
                      className={`p-0.5 rounded transition-colors cursor-pointer ${
                        idx === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:text-slate-600 dark:hover:text-slate-400'
                      }`}
                      title="Move earlier in circle"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === players.length - 1}
                      onClick={() => handleMoveDown(idx)}
                      className={`p-0.5 rounded transition-colors cursor-pointer ${
                        idx === players.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:text-slate-600 dark:hover:text-slate-400'
                      }`}
                      title="Move later in circle"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Empty text input with localized placeholder */}
                <div className="relative flex-1">
                  <input
                    key={`player-input-${idx}`}
                    type="text"
                    value={pName}
                    onChange={(e) => handleNameChange(idx, e.target.value)}
                    placeholder={`${lang.strings.players} ${idx + 1}`}
                    className={`w-full font-semibold text-sm rounded-xl py-2 px-3 border transition-all focus:outline-none bg-[#f3f4f6] dark:bg-slate-950 border-transparent dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-950 focus:border-slate-400 dark:focus:border-slate-600 placeholder-slate-400 dark:placeholder-slate-600 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                  />
                </div>

                {/* Circular Number Badge (Seating order in circle) */}
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 select-none">
                  {idx + 1}
                </div>

                {/* Remove button if > 3 players */}
                {players.length > 3 && (
                  <button
                    type="button"
                    onClick={() => handleDeletePlayer(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                    title="Remove player"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </React.Fragment>
          );
        })}

        {/* Insertion line indicator at the very bottom */}
        {draggedIndex !== null &&
          dropInsertionIndex === players.length &&
          draggedIndex !== players.length - 1 && (
            <div className="h-1.5 -my-0.5 rounded-full bg-blue-500 shadow-sm relative z-20 flex items-center justify-between px-1 animate-in fade-in zoom-in-95 duration-100">
              <span className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
              <span className="w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
            </div>
          )}
      </div>

      {/* Dashed Add Player Button */}
      <button
        type="button"
        onClick={handleAddPlayer}
        className="w-full py-3 border-2 border-dashed rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 bg-transparent hover:bg-slate-50 dark:bg-slate-900/50 dark:hover:bg-slate-900"
      >
        <Plus className="w-4 h-4" />
        <span>{lang.strings.addPlayer}</span>
      </button>
    </div>
  );
};
