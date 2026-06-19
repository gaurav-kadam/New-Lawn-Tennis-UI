export const POINT_TYPES = [
  'ATTACKING',
  'DEFENDING',
  'PENALTY',
  'VICTORY',
] as const;

export type PointType = (typeof POINT_TYPES)[number];

export const SCORING_MOVES: Record<PointType, string[]> = {
  ATTACKING: [
    'Takedown',
    'Single Leg',
    'Double Leg',
    'Throw',
    'Lift',
    'Exposure',
    'Step Out',
    'Grand Amplitude',
  ],

  DEFENDING: [
    'Escape',
    'Counter Defense',
    'Block',
    'Reversal',
    'Sprawl',
  ],

  PENALTY: [
    'Passivity',
    'Illegal Hold',
    'Fleeing Mat',
    'Warning',
  ],

  VICTORY: [
    'Fall / Chitt',
    'Technical Superiority',
    'Disqualification',
  ],
};

export const SCORE_OPTIONS: number[] = [
  0,
  1,
  2,
  3,
  4,
  5,
];