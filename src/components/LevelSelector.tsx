import React from 'react';
import { Challenge, ChallengeProgress } from '../types';
import { Star, CheckCircle, Lock } from 'lucide-react';
import { sounds } from '../utils/audio';

interface LevelSelectorProps {
  challenges: Challenge[];
  activeChallengeId: number;
  progressList: Record<number, ChallengeProgress>;
  onSelectLevel: (id: number) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  challenges,
  activeChallengeId,
  progressList,
  onSelectLevel,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
      <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-600">
        <span className="font-bold text-slate-800">Mapa dos 10 Desafios</span>
        <span>
          Clique no número para navegar entre os desafios
        </span>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {challenges.map((c) => {
          const prog = progressList[c.id];
          const isActive = c.id === activeChallengeId;
          const isDone = prog?.completed;

          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                sounds.playClick();
                onSelectLevel(c.id);
              }}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-bold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm scale-105 z-10'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="text-sm font-mono">{c.id}</span>

              {/* Star or Status indicator */}
              <div className="flex items-center gap-0.5 mt-1 h-3.5">
                {isDone ? (
                  <div className="flex items-center">
                    {Array.from({ length: prog.stars || 1 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-2.5 h-2.5 ${
                          isActive
                            ? 'fill-amber-300 stroke-amber-200'
                            : 'fill-amber-400 stroke-amber-500'
                        }`}
                      />
                    ))}
                  </div>
                ) : (
                  <span className="text-[10px] opacity-60">···</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
