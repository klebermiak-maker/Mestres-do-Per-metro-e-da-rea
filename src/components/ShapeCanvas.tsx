import React, { useState } from 'react';
import { Challenge, EdgeSegment, GridCell } from '../types';
import { Eye, Layers, Ruler, Sparkles } from 'lucide-react';

interface ShapeCanvasProps {
  challenge: Challenge;
  showGridCount?: boolean;
  highlightPerimeter?: boolean;
  selectedComparison?: 'A' | 'B';
  animatedActiveEdgeIdx?: number | null;
  animatedActiveCellIdx?: number | null;
  animatedActiveCellsCount?: number;
}

export const ShapeCanvas: React.FC<ShapeCanvasProps> = ({
  challenge,
  showGridCount = false,
  highlightPerimeter = false,
  selectedComparison = 'A',
  animatedActiveEdgeIdx = null,
  animatedActiveCellIdx = null,
  animatedActiveCellsCount = 0,
}) => {
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<number | null>(null);

  // Handle comparison challenge (Challenge 6)
  const isComparison = challenge.shapeType === 'comparison';
  const effectiveCols = isComparison
    ? selectedComparison === 'A' ? 6 : 4
    : challenge.gridSize.cols;
  const effectiveRows = isComparison
    ? selectedComparison === 'A' ? 2 : 3
    : challenge.gridSize.rows;

  const effectiveCells: GridCell[] = isComparison
    ? (selectedComparison === 'A'
        ? Array.from({ length: 12 }, (_, i) => ({ x: i % 6, y: Math.floor(i / 6) }))
        : Array.from({ length: 12 }, (_, i) => ({ x: i % 4, y: Math.floor(i / 4) })))
    : challenge.activeCells;

  const effectiveEdges: EdgeSegment[] = isComparison
    ? (selectedComparison === 'A'
        ? [
            { x1: 0, y1: 0, x2: 6, y2: 0, length: 6, label: '6 m' },
            { x1: 6, y1: 0, x2: 6, y2: 2, length: 2, label: '2 m' },
            { x1: 6, y1: 2, x2: 0, y2: 2, length: 6, label: '6 m' },
            { x1: 0, y1: 2, x2: 0, y2: 0, length: 2, label: '2 m' },
          ]
        : [
            { x1: 0, y1: 0, x2: 4, y2: 0, length: 4, label: '4 m' },
            { x1: 4, y1: 0, x2: 4, y2: 3, length: 3, label: '3 m' },
            { x1: 4, y1: 3, x2: 0, y2: 3, length: 4, label: '4 m' },
            { x1: 0, y1: 3, x2: 0, y2: 0, length: 3, label: '3 m' },
          ])
    : challenge.edges;

  // ViewBox calculations with padding for labels
  const cellSize = 60;
  const paddingX = 70;
  const paddingY = 65;
  const svgWidth = effectiveCols * cellSize + paddingX * 2;
  const svgHeight = effectiveRows * cellSize + paddingY * 2;

  // Color theme helper
  const getThemeColors = () => {
    switch (challenge.theme) {
      case 'horta':
        return {
          fill: '#86efac', // light green
          hoverFill: '#4ade80',
          border: '#15803d',
          gridLine: '#bbf7d0',
          accent: '#16a34a',
          labelBg: '#dcfce7',
          labelText: '#14532d',
          iconName: '🥕',
        };
      case 'piscina':
        return {
          fill: '#7dd3fc', // light sky
          hoverFill: '#38bdf8',
          border: '#0369a1',
          gridLine: '#bae6fd',
          accent: '#0284c7',
          labelBg: '#e0f2fe',
          labelText: '#075985',
          iconName: '🏊',
        };
      case 'esporte':
        return {
          fill: '#fed7aa', // orange/amber court
          hoverFill: '#fdba74',
          border: '#c2410c',
          gridLine: '#ffedd5',
          accent: '#ea580c',
          labelBg: '#ffedd5',
          labelText: '#9a3412',
          iconName: '⚽',
        };
      case 'quarto':
      case 'arte':
        return {
          fill: '#fde047', // warm yellow
          hoverFill: '#facc15',
          border: '#a16207',
          gridLine: '#fef08a',
          accent: '#ca8a04',
          labelBg: '#fef9c3',
          labelText: '#713f12',
          iconName: '🎨',
        };
      case 'misterio':
        return {
          fill: '#c4b5fd', // purple
          hoverFill: '#a78bfa',
          border: '#6d28d9',
          gridLine: '#ddd6fe',
          accent: '#7c3aed',
          labelBg: '#ede9fe',
          labelText: '#4c1d95',
          iconName: '🔍',
        };
      default:
        return {
          fill: '#a7f3d0',
          hoverFill: '#6ee7b7',
          border: '#047857',
          gridLine: '#d1fae5',
          accent: '#059669',
          labelBg: '#ecfdf5',
          labelText: '#064e3b',
          iconName: '🌳',
        };
    }
  };

  const colors = getThemeColors();

  return (
    <div className="flex flex-col items-center w-full">
      {/* SVG Canvas Area */}
      <div className="relative w-full max-w-xl flex items-center justify-center p-3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto max-h-[380px] transition-all duration-300"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.04))' }}
        >
          <defs>
            <pattern id="grid-pattern" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
              <path
                d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </pattern>
          </defs>

          {/* Background grid guide */}
          <rect
            x={paddingX}
            y={paddingY}
            width={effectiveCols * cellSize}
            height={effectiveRows * cellSize}
            fill="url(#grid-pattern)"
            opacity={0.7}
          />

          {/* Render Active Grid Unit Squares (Área) */}
          <g id="cells">
            {effectiveCells.map((cell, idx) => {
              const cx = paddingX + cell.x * cellSize;
              const cy = paddingY + cell.y * cellSize;
              const isHovered = hoveredCell === idx;

              // Animation states
              const isAnimatedTarget = animatedActiveCellIdx === idx;
              const isAnimatedPast = animatedActiveCellIdx !== null && idx <= animatedActiveCellIdx;
              const shouldShowNumber = showGridCount || isAnimatedPast;

              let cellFill = colors.fill;
              if (isAnimatedTarget) {
                cellFill = '#fde047'; // bright pulsing yellow
              } else if (isAnimatedPast) {
                cellFill = '#4ade80'; // verified light green
              } else if (isHovered) {
                cellFill = colors.hoverFill;
              }

              return (
                <g
                  key={`cell-${cell.x}-${cell.y}`}
                  onMouseEnter={() => setHoveredCell(idx)}
                  onMouseLeave={() => setHoveredCell(null)}
                  className="cursor-pointer transition-transform"
                >
                  {/* Base Square */}
                  <rect
                    x={cx}
                    y={cy}
                    width={cellSize}
                    height={cellSize}
                    fill={cellFill}
                    stroke={isAnimatedTarget ? '#b45309' : colors.border}
                    strokeWidth={isAnimatedTarget ? '2.5' : '1.5'}
                    strokeOpacity={shouldShowNumber ? 0.9 : 0.4}
                    rx="2"
                    className="transition-colors duration-150"
                  />

                  {/* Highlight pulse ring for current target cell */}
                  {isAnimatedTarget && (
                    <rect
                      x={cx + 2}
                      y={cy + 2}
                      width={cellSize - 4}
                      height={cellSize - 4}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      rx="3"
                      className="animate-spin"
                      style={{ transformOrigin: `${cx + cellSize / 2}px ${cy + cellSize / 2}px` }}
                    />
                  )}

                  {/* Inner unit grid indicator */}
                  <circle
                    cx={cx + cellSize / 2}
                    cy={cy + cellSize / 2}
                    r="2"
                    fill={colors.border}
                    opacity={0.3}
                  />

                  {/* Unit Square Number / Badge when enabled or animated */}
                  {shouldShowNumber && (
                    <g>
                      <circle
                        cx={cx + cellSize / 2}
                        cy={cy + cellSize / 2}
                        r="14"
                        fill={isAnimatedTarget ? '#fef3c7' : 'white'}
                        stroke={isAnimatedTarget ? '#d97706' : colors.border}
                        strokeWidth={isAnimatedTarget ? '2' : '1.5'}
                      />
                      <text
                        x={cx + cellSize / 2}
                        y={cy + cellSize / 2 + 4.5}
                        textAnchor="middle"
                        fontSize="13"
                        fontWeight="700"
                        fill={isAnimatedTarget ? '#92400e' : colors.labelText}
                        className="font-mono select-none"
                      >
                        {idx + 1}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* Render Outer Boundary Edges (Perímetro) */}
          <g id="edges">
            {effectiveEdges.map((edge, idx) => {
              const x1 = paddingX + edge.x1 * cellSize;
              const y1 = paddingY + edge.y1 * cellSize;
              const x2 = paddingX + edge.x2 * cellSize;
              const y2 = paddingY + edge.y2 * cellSize;

              const isHoriz = y1 === y2;
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;

              // Offset label position based on side
              let labelX = midX;
              let labelY = midY;
              const offset = 22;

              if (isHoriz) {
                // Top or bottom edge
                labelY = y1 === paddingY ? midY - offset : midY + offset + 4;
              } else {
                // Left or right edge
                labelX = x1 === paddingX ? midX - offset - 10 : midX + offset + 10;
              }

              // Animated step checks
              const isCurrentlyAnimatedEdge = animatedActiveEdgeIdx === idx;
              const isHighlighted =
                isCurrentlyAnimatedEdge ||
                (animatedActiveEdgeIdx === null && (highlightPerimeter || hoveredEdge === idx));

              return (
                <g
                  key={`edge-${idx}`}
                  onMouseEnter={() => setHoveredEdge(idx)}
                  onMouseLeave={() => setHoveredEdge(null)}
                  className="cursor-pointer"
                >
                  {/* Glow outline if perimeter highlighted or currently animated */}
                  {isHighlighted && (
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isCurrentlyAnimatedEdge ? '#f59e0b' : '#f59e0b'}
                      strokeWidth={isCurrentlyAnimatedEdge ? '12' : '9'}
                      strokeLinecap="round"
                      opacity={isCurrentlyAnimatedEdge ? 0.95 : 0.8}
                      className={isCurrentlyAnimatedEdge ? 'animate-pulse' : ''}
                    />
                  )}

                  {/* Animated walking dashed line on the active edge */}
                  {isCurrentlyAnimatedEdge && (
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#92400e"
                      strokeWidth="4"
                      strokeDasharray="6 4"
                      strokeLinecap="round"
                      className="animate-pulse"
                    />
                  )}

                  {/* Primary edge line */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isHighlighted ? '#b45309' : colors.border}
                    strokeWidth={isHighlighted ? 4 : 3}
                    strokeLinecap="round"
                    className="transition-colors duration-200"
                  />

                  {/* Corner vertices */}
                  <circle
                    cx={x1}
                    cy={y1}
                    r="4.5"
                    fill={isHighlighted ? '#f59e0b' : '#0f172a'}
                    stroke="white"
                    strokeWidth="1.5"
                  />

                  {/* Dimension Label Tag */}
                  <g transform={`translate(${labelX}, ${labelY})`}>
                    <rect
                      x={isCurrentlyAnimatedEdge ? '-32' : '-26'}
                      y={isCurrentlyAnimatedEdge ? '-15' : '-13'}
                      width={isCurrentlyAnimatedEdge ? '64' : '52'}
                      height={isCurrentlyAnimatedEdge ? '30' : '26'}
                      rx="6"
                      fill={isCurrentlyAnimatedEdge ? '#fef08a' : isHighlighted ? '#fef3c7' : 'white'}
                      stroke={isCurrentlyAnimatedEdge ? '#b45309' : isHighlighted ? '#d97706' : '#cbd5e1'}
                      strokeWidth={isCurrentlyAnimatedEdge ? '2.5' : '1.5'}
                      filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"
                    />
                    <text
                      x="0"
                      y={isCurrentlyAnimatedEdge ? '5' : '4'}
                      textAnchor="middle"
                      fontSize={isCurrentlyAnimatedEdge ? '13' : '12'}
                      fontWeight="800"
                      fill={isCurrentlyAnimatedEdge ? '#78350f' : isHighlighted ? '#92400e' : '#1e293b'}
                      className="font-mono select-none"
                    >
                      {isCurrentlyAnimatedEdge
                        ? `+${edge.label || `${edge.length}m`}`
                        : edge.label || `${edge.length}m`}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* Scale unit legend */}
          <g transform={`translate(${paddingX}, ${svgHeight - 16})`}>
            <rect x="0" y="-8" width="16" height="16" fill={colors.fill} stroke={colors.border} strokeWidth="1" rx="2" />
            <text x="24" y="5" fontSize="11" fill="#64748b" fontWeight="600">
              1 quadradinho = 1 {challenge.unitAbbr} × 1 {challenge.unitAbbr} = 1 {challenge.areaUnit}
            </text>
          </g>
        </svg>
      </div>

      {/* Helpful context caption below canvas */}
      <div className="flex items-center justify-between w-full max-w-xl mt-2 px-1 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Ruler className="w-3.5 h-3.5 text-amber-600" />
          <span>Contorno (Borda) = <strong>Perímetro ({challenge.unitAbbr})</strong></span>
        </span>
        <span className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          <span>Superfície (Quadradinhos) = <strong>Área ({challenge.areaUnit})</strong></span>
        </span>
      </div>
    </div>
  );
};
