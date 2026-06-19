export type ResultType =
  | 'VT'
  | 'VA'
  | 'VB'
  | 'VF'
  | 'EV'
  | 'EX'
  | 'ST'
  | 'SP'
  | 'PP'
  | 'PO'
  | 'E2';

export type ScoreSheetData = {
  matchNumber: string;
  sportWeightRound: string;

  referee: string;
  judge: string;
  matChairman: string;

  redName: string;
  redCountry: string;
  redNo: string;

  blueName: string;
  blueCountry: string;
  blueNo: string;

  redPeriod1: number;
  redPeriod2: number;
  bluePeriod1: number;
  bluePeriod2: number;

  redTotal: number;
  blueTotal: number;

  redClassificationPoints: number;
  blueClassificationPoints: number;

  winner: 'RED' | 'BLUE' | '';
  finishTime: string;

  resultType: ResultType;
};