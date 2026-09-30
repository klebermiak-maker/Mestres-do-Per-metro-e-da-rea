import React, { useState, useEffect } from 'react';
import { Challenge, ChallengeProgress } from '../types';
import { ShapeCanvas } from './ShapeCanvas';
import { Keypad } from './Keypad';
import { CalculationScratchpad } from './CalculationScratchpad';
import { AnimatedHintGuide } from './AnimatedHintGuide';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Eye,
  Ruler,
  Star,
  RefreshCw,
  Award,
  Sparkles,
} from 'lucide-react';

interface ChallengeViewProps {
  challenge: Challenge;
  progress?: ChallengeProgress;
  onCompleteChallenge: (challengeId: number, stars: number, answers: Record<string, number | string>) => void;
  onNextChallenge: () => void;
  onPrevChallenge: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const ChallengeView: React.FC<ChallengeViewProps> = ({
  challenge,
  progress,
  onCompleteChallenge,
  onNextChallenge,
  onPrevChallenge,
  isFirst,
  isLast,
}) => {
  // Question state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [selectedComparison, setSelectedComparison] = useState<'A' | 'B'>('A');

  // Interactive Visual Toggles
  const [showGridCount, setShowGridCount] = useState(false);
  const [highlightPerimeter, setHighlightPerimeter] = useState(false);
  const [showStepByStep, setShowStepByStep] = useState(false);
  const [feedback, setFeedback] = useState<{
    status: 'correct' | 'wrong' | null;
    message: string;
  }>({ status: null, message: '' });

  // Animated Hint State (triggers after 2 mistakes on current question)
  const [questionMistakes, setQuestionMistakes] = useState<Record<string, number>>({});
  const [showAnimatedHint, setShowAnimatedHint] = useState<boolean>(false);
  const [animatedStep, setAnimatedStep] = useState<{
    activeEdgeIdx: number | null;
    activeCellIdx: number | null;
    activeCellsCount: number;
    cumulativeSum: number;
    description: string;
  }>({
    activeEdgeIdx: null,
    activeCellIdx: null,
    activeCellsCount: 0,
    cumulativeSum: 0,
    description: '',
  });

  // Store answers for the current challenge
  const [userAnswers, setUserAnswers] = useState<Record<string, number | string>>(
    progress?.answers || {}
  );
  const [attemptCount, setAttemptCount] = useState(progress?.attempts || 0);

  // Sync state when challenge changes
  useEffect(() => {
    setCurrentQIndex(0);
    setInputValue('');
    setShowGridCount(false);
    setHighlightPerimeter(false);
    setShowStepByStep(false);
    setShowAnimatedHint(false);
    setQuestionMistakes({});
    setFeedback({ status: null, message: '' });
    setUserAnswers(progress?.answers || {});
    setAttemptCount(progress?.attempts || 0);
  }, [challenge.id]);

  const currentQuestion = challenge.questions[currentQIndex];
  const isQuestionAnswered = userAnswers[currentQuestion?.id] !== undefined;

  // Auto-focus highlight based on question type
  useEffect(() => {
    if (currentQuestion?.type === 'perimeter') {
      setHighlightPerimeter(true);
      setShowGridCount(false);
    } else if (currentQuestion?.type === 'area') {
      setShowGridCount(true);
      setHighlightPerimeter(false);
    }
  }, [currentQIndex, challenge.id]);

  const handleDigitInput = (d: string) => {
    if (feedback.status === 'correct') return;
    if (inputValue.length < 5) {
      setInputValue((prev) => prev + d);
    }
  };

  const handleDeleteInput = () => {
    if (feedback.status === 'correct') return;
    setInputValue((prev) => prev.slice(0, -1));
  };

  const handleDirectInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleVerify = (valToCheck?: string | number) => {
    const rawVal = valToCheck !== undefined ? valToCheck : inputValue.trim();
    if (rawVal === '' && currentQuestion.type !== 'comparison') return;

    setAttemptCount((prev) => prev + 1);

    let isCorrect = false;
    if (currentQuestion.type === 'comparison') {
      isCorrect = String(rawVal).toLowerCase() === String(currentQuestion.expectedValue).toLowerCase();
    } else {
      const numVal = parseFloat(String(rawVal));
      isCorrect = numVal === currentQuestion.expectedValue;
    }

    if (isCorrect) {
      sounds.playSuccess();
      const updatedAnswers = { ...userAnswers, [currentQuestion.id]: rawVal };
      setUserAnswers(updatedAnswers);
      setShowAnimatedHint(false);

      setFeedback({
        status: 'correct',
        message: 'Excelente! Você acertou!',
      });

      // Check if all questions in this challenge are answered
      const allAnswered = challenge.questions.every(
        (q) => updatedAnswers[q.id] !== undefined
      );

      if (allAnswered) {
        // Calculate stars: 3 for 0-1 errors, 2 for 2-3 attempts, 1 otherwise
        const starsEarned = attemptCount <= 1 ? 3 : attemptCount <= 3 ? 2 : 1;
        setTimeout(() => {
          sounds.playStar();
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.65 },
            });
          } catch {}
          onCompleteChallenge(challenge.id, starsEarned, updatedAnswers);
        }, 500);
      }
    } else {
      sounds.playGentleError();
      const currentMistakes = (questionMistakes[currentQuestion.id] || 0) + 1;
      const updatedMistakes = {
        ...questionMistakes,
        [currentQuestion.id]: currentMistakes,
      };
      setQuestionMistakes(updatedMistakes);

      if (currentMistakes >= 2) {
        setShowAnimatedHint(true);
        setFeedback({
          status: 'wrong',
          message: `Você errou este cálculo duas vezes. A Pista Animada foi aberta na tela para demonstrar a contagem passo a passo!`,
        });
      } else {
        setFeedback({
          status: 'wrong',
          message: 'Ops, ainda não é esse número! Confira a figura e tente mais uma vez (se errar de novo, uma pista animada especial aparecerá).',
        });
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < challenge.questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setInputValue('');
      setFeedback({ status: null, message: '' });
      setShowStepByStep(false);
      setShowAnimatedHint(false);
    }
  };

  const isChallengeCompleted = challenge.questions.every(
    (q) => userAnswers[q.id] !== undefined
  );

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Challenge Header & Story Context */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-100 text-amber-900 font-extrabold text-sm font-mono">
              #{challenge.id}
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                {challenge.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span>Dificuldade: <strong>{challenge.difficulty}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Unidade: <strong>{challenge.unitName}</strong></span>
                {progress?.completed && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-0.5 text-amber-600 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                      {progress.stars} estrelas
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Tools & Scratchpad */}
          <div className="flex items-center gap-2">
            <CalculationScratchpad />
          </div>
        </div>

        {/* Narrative Context Box */}
        <p className="mt-3 text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
          {challenge.scenario}
        </p>
      </div>

      {/* Main Two-Zone Sandbox: Stage & Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone: Interactive Stage (SVG Canvas & Visual Controls) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Comparison Selector for Challenge 6 */}
          {challenge.shapeType === 'comparison' && (
            <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setSelectedComparison('A');
                }}
                className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-colors ${
                  selectedComparison === 'A'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ver Horta A (6m × 2m)
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setSelectedComparison('B');
                }}
                className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg transition-colors ${
                  selectedComparison === 'B'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ver Horta B (4m × 3m)
              </button>
            </div>
          )}

          {/* The Canvas with animated hint props */}
          <ShapeCanvas
            challenge={challenge}
            showGridCount={showGridCount}
            highlightPerimeter={highlightPerimeter}
            selectedComparison={selectedComparison}
            animatedActiveEdgeIdx={showAnimatedHint ? animatedStep.activeEdgeIdx : null}
            animatedActiveCellIdx={showAnimatedHint ? animatedStep.activeCellIdx : null}
            animatedActiveCellsCount={showAnimatedHint ? animatedStep.activeCellsCount : 0}
          />

          {/* Animated Hint Guide (appears on 2 errors or manual request) */}
          {showAnimatedHint && (
            <AnimatedHintGuide
              challenge={challenge}
              question={currentQuestion}
              isOpen={showAnimatedHint}
              onClose={() => setShowAnimatedHint(false)}
              onStepChange={(step) => setAnimatedStep(step)}
            />
          )}

          {/* Reopen button if closed but student had 2 or more errors */}
          {!showAnimatedHint && (questionMistakes[currentQuestion.id] || 0) >= 2 && !isQuestionAnswered && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowAnimatedHint(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition-colors shadow-2xs self-center"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Ver Pista Animada Novamente</span>
            </button>
          )}

          {/* Visual Exploration Toggles */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setHighlightPerimeter((prev) => !prev);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                highlightPerimeter
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>{highlightPerimeter ? 'Borda de Contorno Ativa' : 'Destacar Contorno (Perímetro)'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowGridCount((prev) => !prev);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                showGridCount
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showGridCount ? 'Contagem de Quadradinhos Ativa' : 'Contar Quadradinhos (Área)'}</span>
            </button>
          </div>

          {/* Pedagogical Didactic Tip */}
          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Dica do Professor:</span> {challenge.didacticTip}
            </div>
          </div>
        </div>

        {/* Right Zone: Questions & Answer Input Deck */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Progress across questions of current challenge */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>
              Pergunta {currentQIndex + 1} de {challenge.questions.length}
            </span>
            <div className="flex items-center gap-1">
              {challenge.questions.map((q, idx) => {
                const isAnswered = userAnswers[q.id] !== undefined;
                const isCurrent = idx === currentQIndex;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setCurrentQIndex(idx);
                      setFeedback({ status: null, message: '' });
                      setShowStepByStep(false);
                    }}
                    className={`w-6 h-6 rounded-md text-xs font-mono font-bold flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-indigo-600 text-white'
                        : isAnswered
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col gap-4">
            <div className="flex items-start gap-2.5">
              <span
                className={`p-1.5 rounded-lg text-white font-bold text-xs shrink-0 ${
                  currentQuestion.type === 'perimeter'
                    ? 'bg-amber-600'
                    : currentQuestion.type === 'area'
                    ? 'bg-emerald-600'
                    : 'bg-indigo-600'
                }`}
              >
                {currentQuestion.type === 'perimeter'
                  ? 'Perímetro'
                  : currentQuestion.type === 'area'
                  ? 'Área'
                  : currentQuestion.type === 'length'
                  ? 'Comprimento'
                  : 'Comparação'}
              </span>
              <p className="text-base font-bold text-slate-900 leading-snug">
                {currentQuestion.prompt}
              </p>
            </div>

            {/* Answer Input Area */}
            {currentQuestion.type === 'comparison' ? (
              <div className="flex flex-col gap-2 pt-2">
                <span className="text-xs font-semibold text-slate-600">Escolha a resposta correta:</span>
                <div className="grid grid-cols-2 gap-2">
                  {['Horta A', 'Horta B'].map((opt) => {
                    const isSelected = String(inputValue) === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setInputValue(opt);
                          handleVerify(opt);
                        }}
                        className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Number input and display */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={inputValue}
                      onChange={handleDirectInputChange}
                      placeholder="Sua resposta..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleVerify();
                      }}
                      className="w-full h-12 px-4 text-xl font-bold font-mono text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-indigo-500 focus:bg-white text-center"
                    />
                  </div>
                  <span className="text-base font-extrabold font-mono text-slate-700 bg-slate-100 px-3 py-3 rounded-xl border border-slate-200 shrink-0">
                    {currentQuestion.unit}
                  </span>
                </div>

                {/* Kid-friendly Keypad */}
                <Keypad
                  onDigit={handleDigitInput}
                  onDelete={handleDeleteInput}
                  onSubmit={() => handleVerify()}
                />
              </div>
            )}

            {/* Feedback Message */}
            {feedback.status && (
              <div
                className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs transition-all ${
                  feedback.status === 'correct'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                {feedback.status === 'correct' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-bold">{feedback.message}</p>
                  {feedback.status === 'wrong' && (
                    <p className="mt-1 text-rose-800">{currentQuestion.hint}</p>
                  )}
                </div>
              </div>
            )}

            {/* If Correct: Button to continue to next question or challenge */}
            {feedback.status === 'correct' && (
              <div className="pt-1">
                {currentQIndex < challenge.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      handleNextQuestion();
                    }}
                    className="w-full py-3 px-4 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Próxima Pergunta deste Desafio</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-center font-bold text-sm flex items-center justify-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-700" />
                      <span>Desafio #{challenge.id} Concluído com Sucesso!</span>
                    </div>

                    {!isLast && (
                      <button
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          onNextChallenge();
                        }}
                        className="w-full py-3 px-4 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <span>Avançar para o Desafio #{challenge.id + 1}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Assistance: Hint & Step-by-Step Resolution */}
            <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowStepByStep((prev) => !prev);
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 self-start"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showStepByStep ? 'Ocultar explicação' : 'Precisa de ajuda? Ver resolução explicada'}</span>
              </button>

              {showStepByStep && (
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-slate-800 space-y-1.5 animate-fadeIn">
                  <p className="font-bold text-indigo-900">
                    Fórmula & Raciocínio:
                  </p>
                  <p className="font-mono bg-white p-2 rounded-lg border border-indigo-200 text-indigo-950 font-bold">
                    {currentQuestion.formula}
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls between challenges */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              disabled={isFirst}
              onClick={() => {
                sounds.playClick();
                onPrevChallenge();
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none border border-slate-200 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Desafio Anterior</span>
            </button>

            <button
              type="button"
              disabled={isLast}
              onClick={() => {
                sounds.playClick();
                onNextChallenge();
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none border border-slate-200 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <span>Próximo Desafio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
