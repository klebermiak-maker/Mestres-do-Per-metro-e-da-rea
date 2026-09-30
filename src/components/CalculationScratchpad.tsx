import React, { useState } from 'react';
import { Calculator, X, Plus, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/audio';

export const CalculationScratchpad: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [op, setOp] = useState<'+' | '×'>('+');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    sounds.playClick();
    const n1 = parseFloat(val1);
    const n2 = parseFloat(val2);
    if (!isNaN(n1) && !isNaN(n2)) {
      if (op === '+') {
        setResult(n1 + n2);
      } else {
        setResult(n1 * n2);
      }
    }
  };

  const reset = () => {
    sounds.playClick();
    setVal1('');
    setVal2('');
    setResult(null);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => {
          sounds.playClick();
          setIsOpen(true);
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
      >
        <Calculator className="w-3.5 h-3.5 text-indigo-600" />
        <span>Rascunho de Cálculo</span>
      </button>
    );
  }

  return (
    <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl max-w-sm w-full transition-all">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-indigo-100">
        <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
          <Calculator className="w-3.5 h-3.5 text-indigo-600" />
          Rascunho Rápido de Contas
        </span>
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setIsOpen(false);
          }}
          className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 justify-center">
        <input
          type="number"
          value={val1}
          placeholder="ex: 4"
          onChange={(e) => setVal1(e.target.value)}
          className="w-16 h-9 px-2 text-center text-sm font-bold font-mono bg-white border border-slate-300 rounded-lg focus:outline-indigo-500"
        />

        <div className="flex rounded-md bg-white border border-slate-200 p-0.5">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setOp('+');
            }}
            className={`px-2 py-0.5 text-xs font-bold rounded ${op === '+' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
          >
            + (Soma)
          </button>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setOp('×');
            }}
            className={`px-2 py-0.5 text-xs font-bold rounded ${op === '×' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
          >
            × (Vezes)
          </button>
        </div>

        <input
          type="number"
          value={val2}
          placeholder="ex: 3"
          onChange={(e) => setVal2(e.target.value)}
          className="w-16 h-9 px-2 text-center text-sm font-bold font-mono bg-white border border-slate-300 rounded-lg focus:outline-indigo-500"
        />

        <button
          type="button"
          onClick={calculate}
          className="h-9 px-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          =
        </button>
      </div>

      {result !== null && (
        <div className="mt-2.5 p-2 bg-white border border-indigo-200 rounded-lg text-center flex items-center justify-between">
          <span className="text-xs text-slate-600">
            {val1} {op} {val2} =
          </span>
          <span className="text-base font-extrabold font-mono text-indigo-700">
            {result}
          </span>
          <button
            type="button"
            onClick={reset}
            className="text-xs text-slate-400 hover:text-slate-600 p-1"
            title="Limpar"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
