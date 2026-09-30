import React, { useEffect, useState, useRef } from 'react';
import { Challenge, ChallengeQuestion } from '../types';
import { Play, Pause, RotateCcw, Sparkles, Lightbulb, Check, ChevronRight } from 'lucide-react';
import { sounds } from '../utils/audio';

interface AnimatedHintGuideProps {
  challenge: Challenge;
  question: ChallengeQuestion;
  isOpen: boolean;
  onClose: () => void;
  onStepChange: (step: {
    activeEdgeIdx: number | null;
    activeCellIdx: number | null;
    activeCellsCount: number;
    cumulativeSum: number;
    description: string;
  }) => void;
}

interface StepItem {
  activeEdgeIdx: number | null;
  activeCellIdx: number | null;
  activeCellsCount: number;
  cumulativeSum: number;
  edgeLength?: number;
  title: string;
  description: string;
}

export const AnimatedHintGuide: React.FC<AnimatedHintGuideProps> = ({
  challenge,
  question,
  isOpen,
  onClose,
  onStepChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [speed, setSpeed] = useState<number>(1000); // 1 second per step
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Build the animation steps according to question type
  const isPerimeter = question.type === 'perimeter';
  const isArea = question.type === 'area';
  const isLength = question.type === 'length';

  // Steps definition
  const steps: StepItem[] = React.useMemo(() => {
    if (isPerimeter) {
      let cumulative = 0;
      return challenge.edges.map((edge, idx) => {
        cumulative += edge.length;
        const sideNames = ['Superior (Topo)', 'Direito', 'Inferior (Base)', 'Esquerdo'];
        const sideName = sideNames[idx % sideNames.length] || `Lado ${idx + 1}`;
        return {
          activeEdgeIdx: idx,
          activeCellIdx: null,
          activeCellsCount: 0,
          cumulativeSum: cumulative,
          edgeLength: edge.length,
          title: `Lado ${idx + 1} (${sideName})`,
          description: `Percorrendo a borda: adicionamos +${edge.length}m de cerca. Soma acumulada: ${cumulative}m.`,
        };
      });
    }

    if (isArea) {
      const total = challenge.activeCells.length;
      const width = challenge.dimensions.width || challenge.gridSize.cols;
      const height = challenge.dimensions.height || challenge.gridSize.rows;

      // Group into row-by-row or sequential counting steps
      // For 4th grade: show sequential with row milestones!
      return challenge.activeCells.map((cell, idx) => {
        const count = idx + 1;
        const row = Math.floor(idx / width) + 1;
        const col = (idx % width) + 1;
        return {
          activeEdgeIdx: null,
          activeCellIdx: idx,
          activeCellsCount: count,
          cumulativeSum: count,
          title: `Quadradinho ${count} de ${total}`,
          description: `Preenchendo a superfície: ${count}º metro quadrado (${count} m²). [Linha ${row}, Coluna ${col}].`,
        };
      });
    }

    if (isLength) {
      // Inverse reasoning steps
      return [
        {
          activeEdgeIdx: 1, // Right
          activeCellIdx: null,
          activeCellsCount: 0,
          cumulativeSum: 4,
          title: 'Etapa 1: Lado Conhecido da Direita',
          description: 'Sabemos que a largura direita mede 4 metros.',
        },
        {
          activeEdgeIdx: 3, // Left
          activeCellIdx: null,
          activeCellsCount: 0,
          cumulativeSum: 8,
          title: 'Etapa 2: Lado Conhecido da Esquerda',
          description: 'O lado esquerdo também mede 4 metros. Juntos: 4 + 4 = 8 metros conhecidos.',
        },
        {
          activeEdgeIdx: 0, // Top unknown
          activeCellIdx: null,
          activeCellsCount: 0,
          cumulativeSum: 13,
          title: 'Etapa 3: Subtraindo do Perímetro Total',
          description: 'Perímetro total (18m) - 8m = 10m restantes para os dois lados compridos!',
        },
        {
          activeEdgeIdx: 2, // Bottom unknown
          activeCellIdx: null,
          activeCellsCount: 0,
          cumulativeSum: 18,
          title: 'Etapa 4: Dividindo por 2 Lados Iguais',
          description: '10 metros divididos por 2 lados iguais = 5 metros para cada comprimento!',
        },
      ];
    }

    return [];
  }, [challenge, isPerimeter, isArea, isLength]);

  const totalSteps = steps.length;

  // Clear timer helper
  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Step change notification
  useEffect(() => {
    if (!isOpen || steps.length === 0) return;

    const cur = steps[currentStepIndex];
    if (cur) {
      onStepChange({
        activeEdgeIdx: cur.activeEdgeIdx,
        activeCellIdx: cur.activeCellIdx,
        activeCellsCount: cur.activeCellsCount,
        cumulativeSum: cur.cumulativeSum,
        description: cur.description,
      });
    }
  }, [currentStepIndex, isOpen, steps]);

  // Animation ticker
  useEffect(() => {
    if (!isOpen || !isPlaying || totalSteps === 0) {
      clearTimer();
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= totalSteps - 1) {
          // Pause at end
          setIsPlaying(false);
          return prev;
        }
        sounds.playClick();
        return prev + 1;
      });
    }, speed);

    return () => clearTimer();
  }, [isOpen, isPlaying, totalSteps, speed]);

  // Reset when dialog opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      clearTimer();
      onStepChange({
        activeEdgeIdx: null,
        activeCellIdx: null,
        activeCellsCount: 0,
        cumulativeSum: 0,
        description: '',
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStep = steps[currentStepIndex] || steps[0];

  const handleRestart = () => {
    sounds.playClick();
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    sounds.playClick();
    setIsPlaying((prev) => !prev);
  };

  const handleStepForward = () => {
    sounds.playClick();
    setIsPlaying(false);
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-amber-100/60 to-amber-500/10 border-2 border-amber-400/80 rounded-2xl p-4 shadow-sm space-y-3 animate-fadeIn">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 border-b border-amber-200 pb-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500 text-white font-bold text-xs">
            💡
          </span>
          <div>
            <h4 className="text-xs font-extrabold text-amber-950 uppercase tracking-wide">
              Pista Animada do Professor!
            </h4>
            <p className="text-[11px] text-amber-900">
              {isPerimeter
                ? 'Acompanhe a caminhada pelo contorno para somar todos os lados'
                : isArea
                ? 'Veja o preenchimento de cada quadradinho de 1m² na malha'
                : 'Acompanhe a resolução passo a passo'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="px-3 py-1 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg transition-colors flex items-center gap-1"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Entendi, tentar de novo!</span>
        </button>
      </div>

      {/* Dynamic Animated Status Display */}
      <div className="bg-white/90 p-3 rounded-xl border border-amber-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-amber-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            {currentStep?.title}
          </span>
          <span className="font-mono text-slate-500 font-bold">
            Passo {currentStepIndex + 1} de {totalSteps}
          </span>
        </div>

        <p className="text-xs text-slate-800 leading-relaxed font-medium">
          {currentStep?.description}
        </p>

        {/* Live Mathematical Formula Accumulator */}
        {isPerimeter && (
          <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between font-mono text-xs text-amber-950">
            <span className="font-semibold">Soma dos lados até agora:</span>
            <span className="font-extrabold text-amber-900 text-sm">
              {steps
                .slice(0, currentStepIndex + 1)
                .map((s) => `${s.edgeLength}m`)
                .join(' + ')}{' '}
              = {currentStep?.cumulativeSum}m
            </span>
          </div>
        )}

        {isArea && (
          <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between font-mono text-xs text-emerald-950">
            <span className="font-semibold">Área contada:</span>
            <span className="font-extrabold text-emerald-900 text-sm">
              {currentStepIndex + 1} de {challenge.activeCells.length} m²
              {challenge.dimensions.width && challenge.dimensions.height && (
                <span className="text-[11px] text-slate-600 font-sans ml-2">
                  (ou {challenge.dimensions.width} × {challenge.dimensions.height} = {challenge.activeCells.length} m²)
                </span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Playback Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-600" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                <span>Continuar</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors"
            title="Reiniciar animação do início"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>

          <button
            type="button"
            onClick={handleStepForward}
            disabled={currentStepIndex >= totalSteps - 1}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 border border-slate-300 rounded-lg shadow-2xs transition-colors"
            title="Avançar um passo"
          >
            <span>Passo a passo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed toggle */}
        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-white/70 px-2 py-1 rounded-lg border border-amber-200">
          <span>Velocidade:</span>
          <button
            type="button"
            onClick={() => setSpeed(1400)}
            className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
              speed === 1400 ? 'bg-amber-500 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Devagar
          </button>
          <button
            type="button"
            onClick={() => setSpeed(800)}
            className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
              speed === 800 ? 'bg-amber-500 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Normal
          </button>
        </div>
      </div>
    </div>
  );
};
