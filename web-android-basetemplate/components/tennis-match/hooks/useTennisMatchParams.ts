import { useLocalSearchParams } from 'expo-router';

import {
  MatchFormat,
  MatchType,
  PlayerId,
  ServingStateSnapshot,
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
  servingState?: string | string[];
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
  servingState: ServingStateSnapshot | null;
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

function parseServingState(
  rawValue: string,
  matchType: MatchType
): ServingStateSnapshot | null {
  if (!rawValue) return null;
  try {
    const parsed: any = JSON.parse(rawValue);
    const players = ['PLAYER1', 'PLAYER2', 'PLAYER3', 'PLAYER4'];
    if (!parsed || (parsed.match_type && parsed.match_type !== matchType) ||
      !players.includes(parsed.first_server) ||
      !players.includes(parsed.current_server) ||
      !players.includes(parsed.current_set_first_server) ||
      !Array.isArray(parsed.current_set_service_order)) return null;
    return {
      version: typeof parsed.version === 'number' ? parsed.version : undefined,
      match_type: matchType,
      first_server: parsed.first_server,
      current_server: parsed.current_server,
      current_set_first_server: parsed.current_set_first_server,
      current_set_service_order: parsed.current_set_service_order.filter(
        (player: unknown): player is PlayerId => players.includes(String(player))
      ),
      doubles_serve_index: Number.isInteger(parsed.doubles_serve_index)
        ? parsed.doubles_serve_index
        : 0,
      tiebreak_first_server: parsed.tiebreak_first_server ?? null,
      is_tiebreak: Boolean(parsed.is_tiebreak),
    };
  } catch {
    return null;
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

  const servingState = parseServingState(
    getParamValue(params.servingState),
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
    servingState,
    team1DisplayName,
    team2DisplayName,
  };
}
