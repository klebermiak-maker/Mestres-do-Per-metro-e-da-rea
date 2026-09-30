import React from 'react';
import { Delete, Check } from 'lucide-react';
import { sounds } from '../utils/audio';

interface KeypadProps {
  onDigit: (digit: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export const Keypad: React.FC<KeypadProps> = ({
  onDigit,
  onDelete,
  onSubmit,
  disabled = false,
}) => {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  const handlePress = (d: string) => {
    sounds.playClick();
    onDigit(d);
  };

  const handleDelete = () => {
    sounds.playClick();
    onDelete();
  };

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <div className="grid grid-cols-3 gap-1.5 w-full max-w-[260px] mx-auto select-none">
      {digits.slice(0, 9).map((d) => (
        <button
          key={d}
          type="button"
          disabled={disabled}
          onClick={() => handlePress(d)}
          className="h-12 text-lg font-bold font-mono text-slate-800 bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-xl shadow-xs transition-colors flex items-center justify-center disabled:opacity-50"
        >
          {d}
        </button>
      ))}

      <button
        type="button"
        disabled={disabled}
        onClick={handleDelete}
        className="h-12 text-slate-600 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
        title="Apagar"
      >
        <Delete className="w-5 h-5" />
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => handlePress('0')}
        className="h-12 text-lg font-bold font-mono text-slate-800 bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-xl shadow-xs transition-colors flex items-center justify-center disabled:opacity-50"
      >
        0
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={handleSubmit}
        className="h-12 font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
        title="Confirmar Resposta"
      >
        <Check className="w-5 h-5 stroke-[2.5]" />
      </button>
    </div>
  );
};
