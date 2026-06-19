import { ResultType } from './scoreSheet.types';

export const RESULT_OPTIONS: {
  code: ResultType;
  label: string;
  winnerPoints: number;
  loserPoints: number;
}[] = [
  { code: 'VT', label: 'Victory by Fall', winnerPoints: 5, loserPoints: 0 },
  { code: 'VA', label: 'Victory by Withdrawal', winnerPoints: 5, loserPoints: 0 },
  { code: 'VB', label: 'Victory by Injury', winnerPoints: 5, loserPoints: 0 },
  { code: 'VF', label: 'Victory by Forfeit', winnerPoints: 5, loserPoints: 0 },
  { code: 'EV', label: 'Disqualification from competition', winnerPoints: 5, loserPoints: 0 },
  { code: 'EX', label: '3 Cautions', winnerPoints: 5, loserPoints: 0 },
  { code: 'ST', label: 'Great Superiority', winnerPoints: 4, loserPoints: 0 },
  { code: 'SP', label: 'Technical Superiority with loser scoring', winnerPoints: 4, loserPoints: 1 },
  { code: 'PP', label: 'Decision by Points with loser scoring', winnerPoints: 3, loserPoints: 1 },
  { code: 'PO', label: 'Decision by Points without loser scoring', winnerPoints: 3, loserPoints: 0 },
  { code: 'E2', label: 'Both wrestlers disqualified', winnerPoints: 0, loserPoints: 0 },
];

export const getClassificationPoints = (
  resultType: ResultType,
  winner: 'RED' | 'BLUE' | ''
) => {
  const rule = RESULT_OPTIONS.find((item) => item.code === resultType);

  if (!rule || !winner) {
    return {
      redClassificationPoints: 0,
      blueClassificationPoints: 0,
    };
  }

  if (winner === 'RED') {
    return {
      redClassificationPoints: rule.winnerPoints,
      blueClassificationPoints: rule.loserPoints,
    };
  }

  return {
    redClassificationPoints: rule.loserPoints,
    blueClassificationPoints: rule.winnerPoints,
  };
};