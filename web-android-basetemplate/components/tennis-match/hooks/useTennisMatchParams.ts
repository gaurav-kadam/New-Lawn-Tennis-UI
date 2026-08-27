import { useLocalSearchParams } from 'expo-router';

import {
  MatchFormat,
  MatchType,
  PlayerId,
} from '../types/tennis.types';

type TennisMatchRouteParams = {
  matchId?: string | string[];
  player1Name?: string | string[];
  player2Name?: string | string[];
  player3Name?: string | string[];
  player4Name?: string | string[];
  matchType?: string | string[];
  matchFormat?: string | string[];
  matchNo?: string | string[];
  courtNo?: string | string[];
  serviceOrder?: string | string[];
};

export type TennisMatchParams = {
  matchId: string;
  player1Name: string;
  player2Name: string;
  player3Name: string;
  player4Name: string;
  matchType: MatchType;
  matchFormat: MatchFormat;
  matchNo: string;
  courtNo: string;
  doublesServeOrder: PlayerId[];
  team1DisplayName: string;
  team2DisplayName: string;
};

const VALID_PLAYER_IDS: PlayerId[] = [
  'PLAYER1',
  'PLAYER2',
  'PLAYER3',
  'PLAYER4',
];

function getParamValue(
  value: string | string[] | undefined
): string {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

function parseMatchType(
  value: string
): MatchType {
  return value === 'DOUBLES'
    ? 'DOUBLES'
    : 'SINGLES';
}

function parseMatchFormat(
  value: string
): MatchFormat {
  return value === 'BEST_OF_5'
    ? 'BEST_OF_5'
    : 'BEST_OF_3';
}

function parseDoublesServeOrder(
  rawValue: string,
  matchType: MatchType
): PlayerId[] {
  if (matchType !== 'DOUBLES' || !rawValue) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (player): player is PlayerId =>
        typeof player === 'string' &&
        VALID_PLAYER_IDS.includes(
          player as PlayerId
        )
    );
  } catch {
    return [];
  }
}

export function useTennisMatchParams(): TennisMatchParams {
  const params =
    useLocalSearchParams<TennisMatchRouteParams>();

  const player1Name =
    getParamValue(params.player1Name) ||
    'Player 1';

  const player2Name =
    getParamValue(params.player2Name) ||
    'Player 2';

  const player3Name =
    getParamValue(params.player3Name);

  const player4Name =
    getParamValue(params.player4Name);

  const matchType =
    parseMatchType(
      getParamValue(params.matchType)
    );

  const matchFormat =
    parseMatchFormat(
      getParamValue(params.matchFormat)
    );

  const matchId =
    getParamValue(params.matchId);

  const matchNo =
    getParamValue(params.matchNo);

  const courtNo =
    getParamValue(params.courtNo) || '1';

  const doublesServeOrder =
    parseDoublesServeOrder(
      getParamValue(params.serviceOrder),
      matchType
    );

  /*
   * IMPORTANT:
   * Preserve the current application's
   * existing doubles display convention.
   *
   * Do NOT change player mapping in this
   * refactor.
   */
  const team1DisplayName =
  matchType === 'DOUBLES'
    ? `${player1Name} / ${
        player2Name || 'Player 2'
      }`
    : player1Name;

const team2DisplayName =
  matchType === 'DOUBLES'
    ? `${player3Name || 'Player 3'} / ${
        player4Name || 'Player 4'
      }`
    : player2Name;

  return {
    matchId,
    player1Name,
    player2Name,
    player3Name,
    player4Name,
    matchType,
    matchFormat,
    matchNo,
    courtNo,
    doublesServeOrder,
    team1DisplayName,
    team2DisplayName,
  };
}