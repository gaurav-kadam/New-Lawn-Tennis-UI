import { PointType } from '@/components/constants/scoringMoves';

export type Wrestler = 'RED' | 'BLUE';

export type MatchEvent = {
  id: string;
  wrestler: Wrestler;
  type: PointType;
  move: string;
  points: number;
  remarks: string;
  redScore?: number;
  blueScore?: number;
};

export type MatchScore = {
  redScore: number;
  blueScore: number;
};