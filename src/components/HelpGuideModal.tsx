import React from 'react';
import { X, Ruler, Layers, BookOpen, AlertTriangle } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Guia Ilustrado: Perímetro e Área
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Perímetro Card */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Ruler className="w-4 h-4 text-amber-700" />
              <span>O que é PERÍMETRO?</span>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed">
              É a medida do <strong>contorno</strong> (a cerquinha por fora).
            </p>
            <div className="p-2 bg-white rounded-lg border border-amber-200 text-xs font-mono text-amber-900">
              <strong>Como calcular:</strong>
              <br />
              Some o tamanho de <strong>TODOS os lados</strong> externos da figura!
              <br />
              <span className="text-[11px] text-slate-500">Unidades: metros (m), cm.</span>
            </div>
          </div>

          {/* Área Card */}
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>O que é ÁREA?</span>
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed">
              É a medida da <strong>superfície interior</strong> (o piso ou grama).
            </p>
            <div className="p-2 bg-white rounded-lg border border-emerald-200 text-xs font-mono text-emerald-900">
              <strong>Como calcular:</strong>
              <br />
              Multiplique <strong>Comprimento × Largura</strong> (ou conte os quadradinhos).
              <br />
              <span className="text-[11px] text-slate-500">Unidades: metros quadrados (m²), cm².</span>
            </div>
          </div>
        </div>

        {/* Macete do 4º Ano */}
        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 text-xs text-indigo-950 space-y-2">
          <p className="font-bold text-sm text-indigo-900">
            Dica de Ouro para Não Esquecer:
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>
              <strong>P de Perímetro = P de Paredes / Passos</strong> ao redor do terreno!
            </li>
            <li>
              <strong>A de Área = A de Azulejos</strong> no chão do quarto!
            </li>
          </ul>
        </div>

        {/* Atenção aos Erros Comuns */}
        <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-950 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-rose-900">Atenção no Perímetro do Retângulo:</span>
            <p className="mt-0.5 text-slate-700">
              Não se esqueça de somar os 4 lados! Se um retângulo mede 4m por 3m, o perímetro NÃO é apenas 4 + 3. É <strong>4 + 3 + 4 + 3 = 14 metros</strong>.
            </p>
          </div>
        </div>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full py-2.5 px-4 font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
          >
            Entendi, vamos jogar!
          </button>
        </div>
      </div>
    </div>
  );
};
