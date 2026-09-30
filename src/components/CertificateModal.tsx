import React, { useState } from 'react';
import { X, Printer, Award, Star, CheckCircle } from 'lucide-react';
import { sounds } from '../utils/audio';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalStars: number;
  completedCount: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  totalStars,
  completedCount,
}) => {
  const [studentName, setStudentName] = useState('Campeão da Geometria');

  if (!isOpen) return null;

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-4">
        {/* Header toolbar */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">
              Certificado de Conclusão do 4º Ano
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-amber-300 hover:bg-amber-400 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
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
        </div>

        {/* Student name input */}
        <div className="flex items-center gap-3 print:hidden bg-slate-50 p-3 rounded-xl border border-slate-200">
          <label htmlFor="student-name" className="text-xs font-bold text-slate-700 whitespace-nowrap">
            Nome do Aluno(a):
          </label>
          <input
            id="student-name"
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Digite o nome..."
            className="flex-1 h-9 px-3 text-sm font-semibold bg-white border border-slate-300 rounded-lg focus:outline-indigo-500"
          />
        </div>

        {/* Printable Certificate Frame */}
        <div
          id="certificate-print-area"
          className="relative p-8 bg-amber-50/40 border-8 border-double border-amber-600/60 rounded-2xl text-center space-y-6 shadow-inner select-none"
        >
          {/* Decorative Corner Seals */}
          <div className="text-amber-800/20 text-4xl font-serif absolute top-2 left-4 select-none">❧</div>
          <div className="text-amber-800/20 text-4xl font-serif absolute top-2 right-4 select-none">☙</div>
          <div className="text-amber-800/20 text-4xl font-serif absolute bottom-2 left-4 select-none">❧</div>
          <div className="text-amber-800/20 text-4xl font-serif absolute bottom-2 right-4 select-none">☙</div>

          {/* Certificate Badge */}
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-md border-2 border-white">
              <Award className="w-9 h-9 text-slate-900" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-800">
              Certificado Oficial de Honra ao Mérito
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
              MESTRE EM ÁREA E PERÍMETRO
            </h2>
            <p className="text-xs text-slate-500">
              Matemática Fundamental I · BNCC 4º Ano
            </p>
          </div>

          <div className="py-2">
            <p className="text-xs text-slate-600">Certificamos com orgulho que</p>
            <p className="text-2xl font-extrabold text-indigo-950 underline decoration-amber-400 decoration-4 underline-offset-8 mt-2">
              {studentName || 'Estudante Dedicado'}
            </p>
          </div>

          <p className="text-xs text-slate-700 max-w-lg mx-auto leading-relaxed">
            demonstrou excelência, raciocínio lógico e dedicação impecável ao resolver os 10 desafios de medição e cálculo de área e perímetro com figuras planas e malha quadriculada.
          </p>

          {/* Stats on Certificate */}
          <div className="flex items-center justify-center gap-6 py-2 border-y border-amber-200/70 max-w-md mx-auto">
            <div className="text-center">
              <span className="text-xs font-semibold text-slate-500">Desafios Feitos</span>
              <p className="text-lg font-extrabold font-mono text-emerald-800">
                {completedCount} de 10
              </p>
            </div>
            <div className="h-8 w-px bg-amber-200" />
            <div className="text-center">
              <span className="text-xs font-semibold text-slate-500">Estrelas de Ouro</span>
              <p className="text-lg font-extrabold font-mono text-amber-700 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />
                {totalStars} / 30
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 px-6 text-xs text-slate-500">
            <div>
              <div className="w-32 border-b border-slate-400 mb-1" />
              <span>Professor(a) / Orientador(a)</span>
            </div>
            <div>
              <div className="w-32 border-b border-slate-400 mb-1" />
              <span>Data: {currentDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
