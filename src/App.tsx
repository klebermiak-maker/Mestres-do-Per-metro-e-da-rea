/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CHALLENGES, INITIAL_BADGES } from './data/challenges';
import { ChallengeProgress, Badge } from './types';
import { Navbar } from './components/Navbar';
import { LevelSelector } from './components/LevelSelector';
import { ChallengeView } from './components/ChallengeView';
import { LabSandbox } from './components/LabSandbox';
import { HelpGuideModal } from './components/HelpGuideModal';
import { AchievementsModal } from './components/AchievementsModal';
import { CertificateModal } from './components/CertificateModal';
import { sounds } from './utils/audio';
import confetti from 'canvas-confetti';
import { Award, BookOpen, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'matematica_4ano_area_perimetro_v1';

export default function App() {
  const [activeChallengeId, setActiveChallengeId] = useState<number>(1);
  const [currentTab, setCurrentTab] = useState<'challenges' | 'sandbox'>('challenges');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  // Game Progress
  const [progressList, setProgressList] = useState<Record<number, ChallengeProgress>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return {};
  });

  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressList));
    } catch {}
  }, [progressList]);

  // Recalculate badges based on progress
  useEffect(() => {
    const completedChallenges = Object.values(progressList).filter((p) => p.completed);
    const count = completedChallenges.length;

    setBadges((prev) =>
      prev.map((b) => {
        if (b.id === 'first_step') {
          return { ...b, unlocked: progressList[1]?.completed || false };
        }
        if (b.id === 'l_master') {
          return { ...b, unlocked: progressList[5]?.completed || false };
        }
        if (b.id === 'detective') {
          return { ...b, unlocked: progressList[8]?.completed || false };
        }
        if (b.id === 'grand_architect') {
          return { ...b, unlocked: count === 10 };
        }
        if (b.id === 'perimeter_pro') {
          return { ...b, unlocked: count >= 5 };
        }
        if (b.id === 'area_expert') {
          return { ...b, unlocked: count >= 5 };
        }
        return b;
      })
    );
  }, [progressList]);

  const totalStars = Object.values(progressList).reduce(
    (acc, cur) => acc + (cur.stars || 0),
    0
  );
  const completedCount = Object.values(progressList).filter(
    (p) => p.completed
  ).length;

  const handleCompleteChallenge = (
    challengeId: number,
    stars: number,
    answers: Record<string, number | string>
  ) => {
    setProgressList((prev) => {
      const existing = prev[challengeId];
      const newStars = existing ? Math.max(existing.stars, stars) : stars;
      return {
        ...prev,
        [challengeId]: {
          challengeId,
          completed: true,
          stars: newStars,
          attempts: (existing?.attempts || 0) + 1,
          answers,
        },
      };
    });

    // If completing the 10th challenge, trigger grand celebration
    if (challengeId === 10) {
      setTimeout(() => {
        sounds.playFanfare();
        try {
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 },
          });
        } catch {}
      }, 700);
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
  };

  const activeChallenge =
    CHALLENGES.find((c) => c.id === activeChallengeId) || CHALLENGES[0];

  const handleResetProgress = () => {
    if (window.confirm('Tem certeza de que deseja reiniciar o progresso dos desafios?')) {
      setProgressList({});
      setActiveChallengeId(1);
      sounds.playClick();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        totalStars={totalStars}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Editorial Subtitle Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Matemática Fundamental I</span>
            <span aria-hidden="true">·</span>
            <span>4º Ano (BNCC)</span>
            <span aria-hidden="true">·</span>
            <span>Área e Perímetro na Malha Quadriculada</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsHelpOpen(true)}
              className="hover:text-indigo-600 font-semibold transition-colors flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Diferença entre Área e Perímetro</span>
            </button>

            <button
              type="button"
              onClick={handleResetProgress}
              className="text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
              title="Reiniciar jogo"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reiniciar</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Content */}
        {currentTab === 'challenges' ? (
          <div className="space-y-6">
            {/* 10 Level Selector Map */}
            <LevelSelector
              challenges={CHALLENGES}
              activeChallengeId={activeChallengeId}
              progressList={progressList}
              onSelectLevel={(id) => setActiveChallengeId(id)}
            />

            {/* Current Active Challenge */}
            <ChallengeView
              challenge={activeChallenge}
              progress={progressList[activeChallenge.id]}
              onCompleteChallenge={handleCompleteChallenge}
              onNextChallenge={() => {
                if (activeChallengeId < 10) {
                  setActiveChallengeId((prev) => prev + 1);
                }
              }}
              onPrevChallenge={() => {
                if (activeChallengeId > 1) {
                  setActiveChallengeId((prev) => prev - 1);
                }
              }}
              isFirst={activeChallengeId === 1}
              isLast={activeChallengeId === 10}
            />

            {/* Grand Completion Banner when all 10 are solved */}
            {completedCount === 10 && (
              <div className="p-6 bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 rounded-2xl border-2 border-amber-300 text-center space-y-3">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-amber-400 text-slate-900 shadow-sm">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Parabéns! Você Concluiu os 10 Desafios de Geometria!
                </h3>
                <p className="text-sm text-slate-700 max-w-xl mx-auto">
                  Você dominou com perfeição os cálculos de Perímetro (contorno) e Área (superfície) do 4º ano do Ensino Fundamental. Seu diploma oficial está pronto!
                </p>
                <button
                  type="button"
                  onClick={() => setIsCertificateOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 font-bold text-sm text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-colors"
                >
                  <Award className="w-4 h-4" />
                  <span>Emitir Meu Certificado de Mestre</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <LabSandbox />
        )}
      </main>

      {/* Modals */}
      <HelpGuideModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        badges={badges}
        totalStars={totalStars}
        completedCount={completedCount}
        onOpenCertificate={() => setIsCertificateOpen(true)}
      />

      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        totalStars={totalStars}
        completedCount={completedCount}
      />
    </div>
  );
}
