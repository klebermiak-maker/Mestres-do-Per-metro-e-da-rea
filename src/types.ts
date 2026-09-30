export type UnitType = 'm' | 'cm' | 'm²' | 'cm²';

export interface GridCell {
  x: number;
  y: number;
}

export interface PolygonPoint {
  x: number;
  y: number;
}

export interface EdgeSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  length: number;
  label?: string;
}

export type ChallengeType = 
  | 'rectangle' 
  | 'square' 
  | 'l-shape' 
  | 'comparison' 
  | 'inverse' 
  | 'cross';

export interface ChallengeQuestion {
  id: string;
  type: 'perimeter' | 'area' | 'length' | 'comparison';
  prompt: string;
  expectedValue: number | string;
  unit: string;
  explanation: string;
  formula: string;
  hint: string;
}

export interface Challenge {
  id: number;
  title: string;
  scenario: string;
  theme: string;
  difficulty: 'Fácil' | 'Médio' | 'Desafiador';
  shapeType: ChallengeType;
  dimensions: {
    width?: number;
    height?: number;
    description: string;
  };
  gridSize: { cols: number; rows: number };
  activeCells: GridCell[]; // unit squares occupied
  edges: EdgeSegment[]; // external boundary segments
  unitName: 'metros' | 'centímetros';
  unitAbbr: 'm' | 'cm';
  areaUnit: 'm²' | 'cm²';
  questions: ChallengeQuestion[];
  didacticTip: string;
  funFact: string;
}

export interface ChallengeProgress {
  challengeId: number;
  completed: boolean;
  stars: number; // 1 to 3
  attempts: number;
  answers: Record<string, number | string>;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}
