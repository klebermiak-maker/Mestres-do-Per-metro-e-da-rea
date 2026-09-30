import React from 'react';
import { Volume2, VolumeX, Star, Award, BookOpen } from 'lucide-react';
import { sounds } from '../utils/audio';

interface NavbarProps {
  currentTab: 'challenges' | 'sandbox';
  onSelectTab: (tab: 'challenges' | 'sandbox') => void;
  onOpenHelp: () => void;
  onOpenAchievements: () => void;
  totalStars: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenHelp,
  onOpenAchievements,
  totalStars,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            sounds.playClick();
            onSelectTab('challenges');
          }}
          className="text-lg font-bold tracking-tight text-slate-900 font-display whitespace-nowrap"
        >
          Mestres do Perímetro e Área
        </a>
      </div>

      {/* Zone 2: 4 clean text navigation links / segmented items */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onSelectTab('challenges');
          }}
          className={`transition-colors whitespace-nowrap ${
            currentTab === 'challenges'
              ? 'text-indigo-600 border-b-2 border-indigo-600 pb-0.5'
              : 'hover:text-slate-900'
          }`}
        >
          10 Desafios
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onSelectTab('sandbox');
          }}
          className={`transition-colors whitespace-nowrap ${
            currentTab === 'sandbox'
              ? 'text-indigo-600 border-b-2 border-indigo-600 pb-0.5'
              : 'hover:text-slate-900'
          }`}
        >
          Laboratório Livre
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onOpenHelp();
          }}
          className="hover:text-slate-900 transition-colors whitespace-nowrap"
        >
          Guia Rápido
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onOpenAchievements();
          }}
          className="hover:text-slate-900 transition-colors whitespace-nowrap"
        >
          Medalhas
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions & score badge */}
      <div className="flex items-center gap-3">
        {/* Star Counter */}
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onOpenAchievements();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors whitespace-nowrap"
          title="Ver Medalhas e Conquistas"
        >
          <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />
          <span className="font-mono tabular-nums">{totalStars} / 30</span>
        </button>

        {/* Sound toggle */}
        <button
          type="button"
          onClick={onToggleSound}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
          title={soundEnabled ? 'Desativar som' : 'Ativar som'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </div>
    </header>
  );
};
