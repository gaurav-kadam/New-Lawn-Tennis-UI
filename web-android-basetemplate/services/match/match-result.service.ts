import ApiService from '../api/api.service';
import type { TennisMatchParams } from '../../components/tennis-match/hooks/useTennisMatchParams';
import type { PlayerId, SetScore, ServingStateSnapshot, TennisEventRecord, TennisEventType, TennisMatchState } from '../../components/tennis-match/types/tennis.types';

const object = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export function isCompletedMatch(value: unknown): boolean {
  return object(value) && (value.status === 'COMPLETED' || value.is_complete === true ||
    value.is_completed === true || value.winner === 'PLAYER1' || value.winner === 'PLAYER2');
}

function record(value: unknown): Record<string, unknown> {
  if (!object(value)) throw new Error('Invalid saved match response');
  return value;
}
function count(value: unknown): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) throw new Error('Invalid saved match score');
  return value;
}
function name(value: unknown): string {
  if (typeof value !== 'string') throw new Error('Invalid saved player name');
  return value;
}
function player(value: unknown): PlayerId {
  if (value === 'PLAYER1' || value === 'PLAYER2' || value === 'PLAYER3' || value === 'PLAYER4') return value;
  throw new Error('Invalid saved player');
}
function eventType(value: unknown): TennisEventType {
  if (value === 'POINT' || value === 'ACE' || value === 'FAULT' || value === 'DOUBLE_FAULT' ||
    value === 'SERVE' || value === 'WINNER' || value === 'UNFORCED_ERROR' || value === 'VOLLEY') return value;
  // Do not reinterpret older/other event semantics as a current scorer action.
  throw new Error('This saved match contains an unsupported event type');
}

export type CompletedMatchResult = {
  completed: true;
  params: TennisMatchParams;
  state: TennisMatchState;
  events: TennisEventRecord[];
  elapsedSeconds: number;
};

export type LiveMatchResult = {
  completed: false;
  servingState?: ServingStateSnapshot;
};

export async function loadMatchResult(matchId: string): Promise<CompletedMatchResult | LiveMatchResult> {
  const response: unknown = await ApiService.get(`/matches/${matchId}/scoreboard`);
  const data = record(record(response).data);
  const match = record(data.match);
  if (String(match.id) !== matchId || typeof match.status !== 'string') throw new Error('Invalid match identity');
  if (!isCompletedMatch(match)) {
    const state = object(match.serving_state) ? match.serving_state : null;
    if (!state || !Array.isArray(state.current_set_service_order)) {
      return { completed: false };
    }
    return {
      completed: false,
      servingState: state as unknown as ServingStateSnapshot,
    };
  }
  const matchType = match.match_type;
  const matchFormat = match.match_format;
  if (matchType !== 'SINGLES' && matchType !== 'DOUBLES') throw new Error('Invalid match type');
  if (matchFormat !== 'BEST_OF_3' && matchFormat !== 'BEST_OF_5') throw new Error('Invalid match format');
  if (match.winner !== 'PLAYER1' && match.winner !== 'PLAYER2') throw new Error('Missing saved winner');
  const player1Name = name(match.player1_name);
  const player2Name = name(match.player2_name);
  const player3Name = matchType === 'DOUBLES' ? name(match.player3_name) : '';
  const player4Name = matchType === 'DOUBLES' ? name(match.player4_name) : '';
  const team1DisplayName = matchType === 'DOUBLES' ? `${player1Name} / ${player2Name}` : player1Name;
  const team2DisplayName = matchType === 'DOUBLES' ? `${player3Name} / ${player4Name}` : player2Name;
  if (!Array.isArray(match.service_order) || !Array.isArray(data.completed_sets)) throw new Error('Invalid saved sets or service order');
  const doublesServeOrder = match.service_order.map(player);
  const rawServingState = object(match.serving_state)
    ? match.serving_state
    : null;
  const server = player(rawServingState?.current_server ?? match.current_server ?? match.server);
  const restoredSetOrder = Array.isArray(rawServingState?.current_set_service_order)
    ? rawServingState.current_set_service_order.map(player)
    : doublesServeOrder;
  const restoredDoublesOrder = matchType === 'DOUBLES' && restoredSetOrder.length === 4
    ? restoredSetOrder
    : doublesServeOrder;
  const persistedDoublesIndex = matchType === 'DOUBLES' && typeof rawServingState?.doubles_serve_index === 'number'
    ? rawServingState.doubles_serve_index
    : -1;
  const restoredDoublesIndex = matchType === 'DOUBLES' &&
    persistedDoublesIndex >= 0 &&
    persistedDoublesIndex < restoredDoublesOrder.length &&
    restoredDoublesOrder[persistedDoublesIndex] === server
    ? persistedDoublesIndex
    : Math.max(0, restoredDoublesOrder.indexOf(server));
  const servingState: ServingStateSnapshot = {
    version: typeof rawServingState?.version === 'number' ? rawServingState.version : 1,
    match_type: matchType,
    first_server: player(rawServingState?.first_server ?? server),
    current_server: player(rawServingState?.current_server ?? server),
    current_set_first_server: player(rawServingState?.current_set_first_server ?? server),
    current_set_service_order: restoredSetOrder,
    doubles_serve_index: restoredDoublesIndex,
    tiebreak_first_server: rawServingState?.tiebreak_first_server == null
      ? null
      : player(rawServingState.tiebreak_first_server),
    is_tiebreak: Boolean(rawServingState?.is_tiebreak ?? match.is_tiebreak),
  };
  const completedSets: SetScore[] = data.completed_sets.map(value => {
    const set = record(value);
    if (typeof set.was_tiebreak !== 'boolean') throw new Error('Invalid saved set');
    return {
      player1Games: count(set.player1_games), player2Games: count(set.player2_games), wasTiebreak: set.was_tiebreak,
      tiebreakPlayer1Points: set.tiebreak_player1_points == null ? undefined : count(set.tiebreak_player1_points),
      tiebreakPlayer2Points: set.tiebreak_player2_points == null ? undefined : count(set.tiebreak_player2_points),
      ...(object(set.serving_state) ? { servingState: set.serving_state as unknown as ServingStateSnapshot } : {}),
    };
  });
  const eventResponse: unknown = await ApiService.get(`/matches/${matchId}/events`);
  const rows = record(eventResponse).data;
  if (!Array.isArray(rows)) throw new Error('Invalid saved events');
  const chronological = rows.map(value => {
    const row = record(value);
    const recordedAt = row.recorded_at == null ? 0 : Date.parse(name(row.recorded_at));
    if (!Number.isFinite(recordedAt)) throw new Error('Invalid saved event timestamp');
    return { order: count(row.event_number), event: {
      id: String(count(row.id)), type: eventType(row.event_type), player: player(row.player),
      ...(row.server == null ? {} : { server: player(row.server) }),
      elapsedSeconds: count(row.elapsed_seconds), recordedAt,
    } };
  }).sort((a, b) => a.order - b.order);
  if (chronological.some((row, index) => row.order !== index + 1)) throw new Error('Invalid saved event ordering');
  const events = chronological.map(row => row.event).reverse();
  if (typeof match.is_tiebreak !== 'boolean') throw new Error('Invalid saved tiebreak state');
  return {
    completed: true,
    params: { matchId, matchType, matchFormat, player1Name, player2Name, player3Name, player4Name,
      team1DisplayName, team2DisplayName, doublesServeOrder, servingState,
      matchNo: String(match.match_no ?? ''), courtNo: String(match.court_no ?? '1') },
    state: {
      matchType, matchFormat, player1Name: team1DisplayName, player2Name: team2DisplayName, player3Name, player4Name,
      server, serveNumber: 1, doublesServeOrder: restoredDoublesOrder, doublesServeIndex: restoredDoublesIndex,
      player1Points: count(match.player1_points), player2Points: count(match.player2_points),
      player1Games: count(match.player1_games), player2Games: count(match.player2_games),
      player1Sets: count(match.player1_sets), player2Sets: count(match.player2_sets),
      isTiebreak: match.is_tiebreak, tiebreakPlayer1Points: count(match.tiebreak_player1_points),
      tiebreakPlayer2Points: count(match.tiebreak_player2_points),
      tiebreakServeCount: 0, tiebreakFirstServer: servingState.tiebreak_first_server,
      currentSetFirstServer: servingState.current_set_first_server,
      pendingDoublesServerSelection: null,
      completedSets,
      matchWinner: match.winner, lastAction: null, history: [],
    },
    // The API has event elapsed times, not a separate final timer snapshot.
    elapsedSeconds: events.reduce((max, event) => Math.max(max, event.elapsedSeconds), 0),
    events,
  };
}
