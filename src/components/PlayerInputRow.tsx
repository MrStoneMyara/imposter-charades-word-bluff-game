import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface PlayerInputRowProps {
  index: number;
  initialName: string;
  onUpdate: (newName: string) => void;
  onDelete?: () => void;
  canDelete: boolean;
  dir: 'ltr' | 'rtl';
}

export const PlayerInputRow: React.FC<PlayerInputRowProps> = ({
  index,
  initialName,
  onUpdate,
  onDelete,
  canDelete,
  dir,
}) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    onUpdate(val);
  };

  return (
    <div className="relative flex items-center gap-2 group">
      {/* Input container */}
      <div className="relative flex-1">
        <input
          key={`player-input-${index}`}
          type="text"
          value={name}
          onChange={handleChange}
          className={`w-full bg-[#f3f4f6] hover:bg-[#ebeef2] focus:bg-white text-slate-900 font-semibold text-sm rounded-2xl py-3 px-4 border border-slate-200/80 focus:border-slate-400 focus:outline-none transition-all shadow-sm ${
            dir === 'rtl' ? 'text-right pl-10' : 'text-left pr-10'
          }`}
          placeholder={`Player ${index + 1}`}
        />
        {canDelete && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className={`absolute top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer ${
              dir === 'rtl' ? 'left-2.5' : 'right-2.5'
            }`}
            title="Remove player"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Number Badge */}
      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200/80 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0 select-none">
        {index + 1}
      </div>
    </div>
  );
};
