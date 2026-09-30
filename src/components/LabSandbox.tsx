import React, { useState } from 'react';
import { Ruler, Layers, Sparkles, RefreshCcw, Plus, Minus, Info } from 'lucide-react';
import { sounds } from '../utils/audio';

export const LabSandbox: React.FC = () => {
  const [width, setWidth] = useState(5);
  const [height, setHeight] = useState(3);
  const [showCellNumbers, setShowCellNumbers] = useState(true);
  const [activeTab, setActiveTab] = useState<'preset' | 'experiments'>('preset');

  const perimeter = 2 * (width + height);
  const area = width * height;

  const handleWidthChange = (val: number) => {
    sounds.playClick();
    setWidth(Math.max(1, Math.min(10, val)));
  };

  const handleHeightChange = (val: number) => {
    sounds.playClick();
    setHeight(Math.max(1, Math.min(8, val)));
  };

  const experiments = [
    {
      title: 'O Quadrado Equilibrado',
      desc: 'Área = 16 m² e Perímetro = 16 m',
      w: 4,
      h: 4,
    },
    {
      title: 'O Retângulo Espichado',
      desc: 'Mesma área (12 m²), maior perímetro!',
      w: 6,
      h: 2,
    },
    {
      title: 'A Faixa Longa',
      desc: 'Área = 10 m², Perímetro = 22 m!',
      w: 10,
      h: 1,
    },
    {
      title: 'O Grande Terreno',
      desc: 'Área = 40 m², Perímetro = 26 m',
      w: 8,
      h: 5,
    },
  ];

  const cellSize = 42;
  const paddingX = 40;
  const paddingY = 40;
  const svgWidth = width * cellSize + paddingX * 2;
  const svgHeight = height * cellSize + paddingY * 2;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Sandbox Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight flex items-center gap-2">
              <span>Laboratório Livre do Construtor</span>
              <Sparkles className="w-5 h-5 text-amber-500" />
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Experimente mudar o comprimento e a largura! Veja como a Área e o Perímetro mudam na hora.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveTab('preset');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'preset'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ajustar Medidas
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveTab('experiments');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'experiments'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Experimentos Prontos
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Stage */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col items-center">
            {/* SVG Visualizer */}
            <div className="w-full flex items-center justify-center p-3 bg-slate-50/60 rounded-xl border border-slate-200/60 overflow-x-auto min-h-[340px]">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="max-h-[340px] w-auto transition-all duration-200"
              >
                {/* Cells */}
                {Array.from({ length: height }).map((_, r) =>
                  Array.from({ length: width }).map((_, c) => {
                    const idx = r * width + c + 1;
                    const cx = paddingX + c * cellSize;
                    const cy = paddingY + r * cellSize;
                    return (
                      <g key={`cell-${r}-${c}`}>
                        <rect
                          x={cx}
                          y={cy}
                          width={cellSize}
                          height={cellSize}
                          fill="#86efac"
                          stroke="#16a34a"
                          strokeWidth="1.5"
                          rx="2"
                        />
                        {showCellNumbers && (
                          <text
                            x={cx + cellSize / 2}
                            y={cy + cellSize / 2 + 4}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="700"
                            fill="#14532d"
                            className="font-mono select-none"
                          >
                            {idx}
                          </text>
                        )}
                      </g>
                    );
                  })
                )}

                {/* Outer Perimeter Highlight Fences */}
                <rect
                  x={paddingX}
                  y={paddingY}
                  width={width * cellSize}
                  height={height * cellSize}
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="3.5"
                  rx="3"
                />

                {/* Dimension Badges */}
                {/* Top width label */}
                <g transform={`translate(${paddingX + (width * cellSize) / 2}, ${paddingY - 14})`}>
                  <rect x="-24" y="-11" width="48" height="22" rx="5" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
                  <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400e" className="font-mono">
                    {width} m
                  </text>
                </g>

                {/* Left height label */}
                <g transform={`translate(${paddingX - 18}, ${paddingY + (height * cellSize) / 2})`}>
                  <rect x="-20" y="-11" width="40" height="22" rx="5" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
                  <text x="0" y="4" textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400e" className="font-mono">
                    {height} m
                  </text>
                </g>
              </svg>
            </div>

            {/* Toggle numbers button */}
            <div className="flex items-center justify-between w-full mt-3 px-2">
              <span className="text-xs text-slate-500">
                Figura: <strong>Retângulo de {width}m × {height}m</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowCellNumbers((prev) => !prev);
                }}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 underline"
              >
                {showCellNumbers ? 'Ocultar números dos quadradinhos' : 'Numerar cada quadradinho'}
              </button>
            </div>
          </div>
        </div>

        {/* Controls and Real-Time Results Deck */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Live Formulas & Results */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Resultados em Tempo Real
            </h3>

            {/* Perimeter Card */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Ruler className="w-4 h-4 text-amber-600" />
                  Perímetro (Contorno da cerca)
                </span>
                <span className="text-lg font-extrabold font-mono text-amber-900 tabular-nums">
                  {perimeter} m
                </span>
              </div>
              <p className="text-xs font-mono text-amber-800 bg-white/80 p-1.5 rounded-md border border-amber-200/60">
                P = {width} + {height} + {width} + {height} = {perimeter} m
              </p>
            </div>

            {/* Area Card */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  Área (Quadradinhos de grama)
                </span>
                <span className="text-lg font-extrabold font-mono text-emerald-900 tabular-nums">
                  {area} m²
                </span>
              </div>
              <p className="text-xs font-mono text-emerald-800 bg-white/80 p-1.5 rounded-md border border-emerald-200/60">
                A = {width} × {height} = {area} m²
              </p>
            </div>
          </div>

          {/* Interactive Sliders & Steppers */}
          {activeTab === 'preset' ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Modificar Medidas
              </h3>

              {/* Width Slider & Stepper */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Comprimento (Largura horizontal):</span>
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {width} metros
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleWidthChange(width - 1)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={width}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="flex-1 accent-indigo-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => handleWidthChange(width + 1)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Height Slider & Stepper */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Altura (Largura vertical):</span>
                  <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {height} metros
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleHeightChange(height - 1)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={height}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="flex-1 accent-indigo-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => handleHeightChange(height + 1)}
                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Observe: quando você aumenta a largura em 1 metro, o perímetro cresce 2 metros (topo e base) e a área cresce pelo valor da altura!
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                Casos Especiais para Explorar
              </h3>
              <div className="space-y-2">
                {experiments.map((exp, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setWidth(exp.w);
                      setHeight(exp.h);
                    }}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors"
                  >
                    <div className="font-bold text-xs text-slate-900">{exp.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{exp.desc}</div>
                    <div className="text-[11px] font-mono text-indigo-600 mt-1 font-semibold">
                      Carregar {exp.w}m × {exp.h}m
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
