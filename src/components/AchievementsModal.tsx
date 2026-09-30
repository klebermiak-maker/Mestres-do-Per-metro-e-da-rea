import React from 'react';
import { X, Award, Star } from 'lucide-react';
import { Badge } from '../types';
import { sounds } from '../utils/audio';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: Badge[];
  totalStars: number;
  completedCount: number;
  onOpenCertificate: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  badges,
  totalStars,
  completedCount,
  onOpenCertificate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-900">
              Suas Medalhas & Conquistas
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

        {/* Stats summary bar */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
            <div className="text-2xl font-extrabold font-mono text-amber-800 tabular-nums flex items-center justify-center gap-1">
              <Star className="w-5 h-5 fill-amber-400 stroke-amber-500" />
              <span>{totalStars} / 30</span>
            </div>
            <span className="text-xs font-semibold text-amber-900">Estrelas Coletadas</span>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
            <div className="text-2xl font-extrabold font-mono text-emerald-800 tabular-nums">
              {completedCount} / 10
            </div>
            <span className="text-xs font-semibold text-emerald-900">Desafios Concluídos</span>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                b.unlocked
                  ? 'bg-amber-50/60 border-amber-200 text-slate-900'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div className="text-2xl select-none p-1 bg-white rounded-lg border border-slate-100 shadow-2xs">
                {b.unlocked ? b.icon : '🔒'}
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">
                  {b.title}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {b.description}
                </p>
                {b.unlocked ? (
                  <span className="text-[10px] font-bold text-emerald-700 mt-1 inline-block">
                    ✓ Desbloqueada
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 mt-1 inline-block">
                    Bloqueada
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Certificate Callout if completed enough */}
        <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-amber-400">
              Certificado Oficial do 4º Ano
            </p>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {completedCount === 10
                ? 'Você concluiu todos os 10 desafios! Seu diploma de Mestre está pronto!'
                : `Complete os 10 desafios para gerar seu diploma oficial (${completedCount}/10 feitos).`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
              onOpenCertificate();
            }}
            className="px-3 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shrink-0 transition-colors"
          >
            Ver Diploma
          </button>
        </div>
      </div>
    </div>
  );
};
