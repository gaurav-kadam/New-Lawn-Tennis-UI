import ApiService from '../api/api.service';
import type { ScoreSheetData, ScoreSheetRecording, RecordedSet, RecordedGame, RecordedPoint } from '../../components/results/score-sheet/scoreSheet.types';
import { checkGameWin, checkSetWin, checkMatchWin, checkTiebreakWin, getServerForTiebreak, getDisplayPoints } from '../../components/tennis-match/logic/tennisLogic';
import type { TennisMatchParams } from '../../components/tennis-match/hooks/useTennisMatchParams';
import type { PlayerId, TeamId, SetScore, ServingStateSnapshot, TennisEventRecord, TennisEventType, TennisMatchState } from '../../components/tennis-match/types/tennis.types';

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

  throw new Error('This saved match contains an unsupported event type');
}

export type CompletedMatchResult = {
  completed: true;
  scoreSheet: ScoreSheetData;
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
  let eventFailure: ScoreSheetRecording | null = null;
  let chronological: { order: number; event: TennisEventRecord }[] = [];
  try {
    if (!Array.isArray(rows)) throw new Error('Invalid saved events');
    chronological = rows.map(value => {
    const row = record(value);
    const recordedAt = row.recorded_at == null ? 0 : Date.parse(name(row.recorded_at));
    if (!Number.isFinite(recordedAt)) throw new Error('Invalid saved event timestamp');
    return { order: count(row.event_number), event: {
      id: String(count(row.id)), type: eventType(row.event_type), player: player(row.player),
      ...(row.server == null ? {} : { server: player(row.server) }),
      elapsedSeconds: count(row.elapsed_seconds), recordedAt,
    } };
  }).sort((a, b) => a.order - b.order);
    if (chronological.some((row, index) => row.order !== index + 1)) {
      eventFailure = { status: 'INCONSISTENT', reason: 'Saved event numbers are not sequential from 1.' };
    }
  } catch (error) {
    // Unsupported history must not prevent viewing the authoritative summary.
    eventFailure = { status: 'UNAVAILABLE', reason: error instanceof Error ? error.message : 'Invalid saved events.' };
  }
  const events = chronological.map(row => row.event).reverse();
  if (typeof match.is_tiebreak !== 'boolean') throw new Error('Invalid saved tiebreak state');
  return {
    completed: true,
    scoreSheet: {
      recording: eventFailure ?? (matchType === 'DOUBLES'
        ? deriveDoublesRecording(matchFormat, completedSets, match.winner, chronological,
          count(match.player1_sets), count(match.player2_sets))
        : deriveSinglesRecording(matchType, matchFormat, completedSets, match.winner, chronological,
          count(match.player1_sets), count(match.player2_sets))),
      certification: 'NON_CERTIFIED',
      matchId,
      matchNumber: optionalText(match.match_no),
      metadata: {
        event: optionalText(match.match_category),
        ageCategory: optionalText(match.age_category),
        gender: optionalText(match.gender),
        tournamentCode: optionalText(match.tournament_code),
        tournamentName: null,
        round: optionalText(match.round_name),
        court: optionalText(match.court_no),
        scheduledDate: optionalText(match.match_date),
      },
      matchType, matchFormat,
      participants: matchType === 'DOUBLES' ? [
        { slot: 'PLAYER1', side: 'TEAM1', name: player1Name, country: null },
        { slot: 'PLAYER2', side: 'TEAM1', name: player2Name, country: null },
        { slot: 'PLAYER3', side: 'TEAM2', name: player3Name, country: null },
        { slot: 'PLAYER4', side: 'TEAM2', name: player4Name, country: null },
      ] : [
        { slot: 'PLAYER1', side: 'TEAM1', name: player1Name, country: null },
        { slot: 'PLAYER2', side: 'TEAM2', name: player2Name, country: null },
      ],
      winnerSide: match.winner === 'PLAYER1' ? 'TEAM1' : 'TEAM2',
      completedSets,
      events: chronological.map(row => row.event),
      serving: {
        currentServer: server,
        serviceOrder: doublesServeOrder,
        snapshot: rawServingState as Partial<ServingStateSnapshot> | null,
        courtEnd: null, doublesReceivers: null,
      },
      timing: {
        scheduledTime: optionalText(match.match_time),
        calledAt: null, startedAt: null, finishedAt: null, durationSeconds: null,
        maxRecordedElapsedSeconds: events.length
          ? events.reduce((max, event) => Math.max(max, event.elapsedSeconds), 0) : null,
      },
      officials: {
        digitalScorerId: optionalId(match.digital_scorer_id),
        referee1Id: optionalId(match.referee_1_id),
        referee2Id: optionalId(match.referee_2_id),
        umpireId: optionalId(match.umpire_id),
        supervisor: null, chairUmpire: null, netUmpire: null, lineUmpires: null,
      },
      ballChanges: null, signatures: null,
    },
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

    elapsedSeconds: events.reduce((max, event) => Math.max(max, event.elapsedSeconds), 0),
    events,
  };
}

function optionalText(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value : null;
}

function optionalId(value: unknown): number | null {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0 ? value : null;
}

/** Historical calculation only: no live state, handlers, or persistence writes. */
export function deriveSinglesRecording(
  matchType: TennisMatchState['matchType'],
  format: TennisMatchState['matchFormat'],
  savedSets: SetScore[],
  savedWinner: PlayerId,
  events: { order: number; event: TennisEventRecord }[],
  savedPlayer1Sets: number,
  savedPlayer2Sets: number
): ScoreSheetRecording {
  const unavailable = (reason: string): ScoreSheetRecording => ({ status: 'UNAVAILABLE', reason });
  const inconsistent = (reason: string): ScoreSheetRecording => ({ status: 'INCONSISTENT', reason });
  if (matchType !== 'SINGLES') return unavailable('Detailed historical reconstruction is currently available for Singles only.');
  if (!events.length) return unavailable('No saved events are available.');
  const singlesPlayer = (value: unknown): value is 'PLAYER1' | 'PLAYER2' => value === 'PLAYER1' || value === 'PLAYER2';
  const opposite = (value: PlayerId): PlayerId => value === 'PLAYER1' ? 'PLAYER2' : 'PLAYER1';
  const sets: RecordedSet[] = [];
  let games: RecordedGame[] = [];
  let points: RecordedPoint[] = [];
  let p1 = 0, p2 = 0, g1 = 0, g2 = 0, s1 = 0, s2 = 0, pointCount = 0;
  let gameServer: PlayerId | null = null;
  let matchWinner: PlayerId | null = null;
  let isTiebreak = false;

  for (const [index, { order, event }] of events.entries()) {
    if (order !== index + 1) return inconsistent('Saved event numbers are not sequential from 1.');
    if (matchWinner) return inconsistent(`Event ${order} occurs after match completion.`);
    if (!singlesPlayer(event.player)) return inconsistent(`Event ${order} has a non-Singles player.`);
    if (!singlesPlayer(event.server)) return unavailable(`Event ${order} has no reliable Singles server. No historical server was inferred.`);
    let winner: PlayerId | null;
    switch (event.type) {
      case 'POINT': case 'ACE': case 'WINNER': case 'VOLLEY': winner = event.player; break;
      case 'DOUBLE_FAULT': case 'UNFORCED_ERROR': winner = opposite(event.player); break;
      case 'FAULT': case 'SERVE': winner = null; break;
      default: return unavailable(`Unsupported event type at event ${order}.`);
    }
    gameServer ??= event.server;
    const expectedServer = isTiebreak ? getServerForTiebreak(gameServer, p1 + p2) : gameServer;
    if (event.server !== expectedServer) return inconsistent(`Server sequence disagrees at event ${order}.`);
    if (['ACE', 'FAULT', 'DOUBLE_FAULT', 'SERVE'].includes(event.type) && event.player !== event.server) {
      return inconsistent(`Serving action actor disagrees with server at event ${order}.`);
    }
    const context = savedSets[sets.length]?.servingState;
    if (games.length === 0 && points.length === 0 && context &&
        (context.current_set_first_server !== gameServer || context.first_server !== gameServer)) {
      return inconsistent(`Saved opening server disagrees in set ${sets.length + 1}.`);
    }
    if (isTiebreak && context?.tiebreak_first_server != null && context.tiebreak_first_server !== gameServer) {
      return inconsistent(`Saved tie-break server disagrees in set ${sets.length + 1}.`);
    }
    if (!winner) continue;
    if (winner === 'PLAYER1') p1++; else p2++;
    pointCount++;
    const gameWinner: PlayerId | null = isTiebreak ? checkTiebreakWin(p1, p2) : checkGameWin(p1, p2);
    const display = getDisplayPoints(p1, p2);
    const scoreAfterPoint = isTiebreak ? `${p1}–${p2}` : gameWinner ? 'GAME'
      : display.player1Display === '40' && display.player2Display === '40' ? 'DEUCE'
      : `${display.player1Display}–${display.player2Display}`;
    points.push({ number: points.length + 1, scoreAfterPoint, winner, server: event.server, eventNumber: order, event: { ...event } });
    if (!gameWinner) continue;
    games.push({ number: games.length + 1, server: gameServer, isTiebreak, points, winner: gameWinner });
    if (gameWinner === 'PLAYER1') g1++; else g2++;
    const setWinner: PlayerId | 'TIEBREAK' | null = isTiebreak ? gameWinner : checkSetWin(g1, g2);
    if (setWinner && setWinner !== 'TIEBREAK') {
      const saved = savedSets[sets.length];
      if (!saved || saved.player1Games !== g1 || saved.player2Games !== g2 || saved.wasTiebreak !== isTiebreak) {
        return inconsistent(`Derived score disagrees with saved set ${sets.length + 1}.`);
      }
      if (isTiebreak) {
        if (saved.tiebreakPlayer1Points == null || saved.tiebreakPlayer2Points == null) {
          return unavailable(`Saved tie-break totals are missing for set ${sets.length + 1}.`);
        }
        if (saved.tiebreakPlayer1Points !== p1 || saved.tiebreakPlayer2Points !== p2) {
          return inconsistent(`Tie-break totals disagree in set ${sets.length + 1}.`);
        }
      }
      sets.push({ number: sets.length + 1, score: saved, games });
      if (setWinner === 'PLAYER1') s1++; else s2++;
      matchWinner = checkMatchWin(s1, s2, format);
      games = [];
      g1 = 0; g2 = 0;
    }
    // Singles alternate games; after a tie-break the opening receiver serves.
    gameServer = opposite(gameServer);
    isTiebreak = setWinner === 'TIEBREAK';
    points = [];
    p1 = 0; p2 = 0;
  }
  if (points.length || games.length || sets.length !== savedSets.length || !matchWinner ||
      matchWinner !== savedWinner || s1 !== savedPlayer1Sets || s2 !== savedPlayer2Sets) {
    return inconsistent('Derived match completion, set count, or winner disagrees with the saved result.');
  }
  return { status: 'VALIDATED', sets, eventCount: events.length, pointCount };
}

/** Historical doubles recording: team winners, individual servers, saved set context only. */
export function deriveDoublesRecording(
  format: TennisMatchState['matchFormat'],
  savedSets: SetScore[],
  savedWinner: PlayerId,
  events: { order: number; event: TennisEventRecord }[],
  savedPlayer1Sets: number,
  savedPlayer2Sets: number
): ScoreSheetRecording {
  const unavailable = (reason: string): ScoreSheetRecording => ({ status: 'UNAVAILABLE', reason });
  const inconsistent = (reason: string): ScoreSheetRecording => ({ status: 'INCONSISTENT', reason });
  const individual = (value: unknown): value is PlayerId =>
    value === 'PLAYER1' || value === 'PLAYER2' || value === 'PLAYER3' || value === 'PLAYER4';
  const team = (slot: PlayerId): TeamId => slot === 'PLAYER1' || slot === 'PLAYER2' ? 'TEAM1' : 'TEAM2';
  const opposite = (side: TeamId): TeamId => side === 'TEAM1' ? 'TEAM2' : 'TEAM1';
  const winningSide = (side: PlayerId): TeamId => side === 'PLAYER1' ? 'TEAM1' : 'TEAM2';
  if (!events.length) return unavailable('No saved events are available.');
  const sets: RecordedSet<TeamId, PlayerId | null>[] = [];
  let games: RecordedGame<TeamId, PlayerId | null>[] = [];
  let points: RecordedPoint<TeamId, PlayerId | null>[] = [];
  let p1 = 0, p2 = 0, g1 = 0, g2 = 0, s1 = 0, s2 = 0, pointCount = 0;
  let matchWinner: PlayerId | null = null;
  let isTiebreak = false;
  let serviceOrder: PlayerId[] | null = null;
  const limitations = new Set<string>();
  let gameServer: PlayerId | null = null;
  let gameStarted = false;
  let observedGameServer: PlayerId | null = null;
  let nextSetServingTeam: TeamId | null = null;

  for (const [index, { order, event }] of events.entries()) {
    if (order !== index + 1) return inconsistent('Saved event numbers are not sequential from 1.');
    if (matchWinner) return inconsistent(`Event ${order} occurs after match completion.`);
    if (!individual(event.player)) return unavailable(`Event ${order} has no reliable Doubles actor.`);
    if (event.server != null && !individual(event.server)) return unavailable(`Event ${order} has an unsupported Doubles server.`);
    const historicalServer = event.server ?? null;
    if (historicalServer === null) limitations.add('Historical individual server information is unavailable for some or all events.');
    let winner: TeamId | null;
    switch (event.type) {
      case 'POINT': case 'ACE': case 'WINNER': case 'VOLLEY': winner = team(event.player); break;
      case 'DOUBLE_FAULT': case 'UNFORCED_ERROR': winner = opposite(team(event.player)); break;
      case 'FAULT': case 'SERVE': winner = null; break;
      default: return unavailable(`Unsupported event type at event ${order}.`);
    }
    const context = savedSets[sets.length]?.servingState;
    if (games.length === 0 && points.length === 0) {
      if (!savedSets[sets.length]) return inconsistent(`No saved result exists for set ${sets.length + 1}.`);
      if (!context || !Array.isArray(context.current_set_service_order) ||
          !individual(context.current_set_first_server) || !individual(context.first_server)) {
        limitations.add(`Historical serving context is incomplete for set ${sets.length + 1}; full service-order validation is unavailable.`);
      }
      const order = context?.current_set_service_order;
      if (Array.isArray(order)) {
        if (order.length !== 4 || !order.every(individual) || new Set(order).size !== 4 ||
            order.some((slot, i) => team(slot) === team(order[(i + 1) % 4])) ||
            (context?.match_type != null && context.match_type !== 'DOUBLES') ||
            (context?.first_server != null && context.current_set_first_server != null && context.first_server !== context.current_set_first_server) ||
            (context?.current_set_first_server != null && context.current_set_first_server !== order[0])) {
          return inconsistent(`Invalid saved Doubles serving context in set ${sets.length + 1}.`);
        }
        if (nextSetServingTeam && team(order[0]) !== nextSetServingTeam) {
          return inconsistent(`Saved opening serving team disagrees in set ${sets.length + 1}.`);
        }
        serviceOrder = [...order];
      }
    }
    // Only observed events populate historical server fields; context validates, never fills gaps.
    if (!gameStarted) {
      gameServer = historicalServer;
      gameStarted = true;
    }
    const openingServer = serviceOrder?.[games.length % 4] ?? null;
    const expectedServer = openingServer === null ? null
      : isTiebreak ? getServerForTiebreak(openingServer, p1 + p2, serviceOrder ?? undefined) : openingServer;
    if (historicalServer !== null && expectedServer !== null && historicalServer !== expectedServer) {
      return inconsistent(`Server sequence disagrees at event ${order}.`);
    }
    if (!isTiebreak && historicalServer !== null) {
      if (observedGameServer !== null && observedGameServer !== historicalServer) {
        return inconsistent(`Server changes within game at event ${order}.`);
      }
      observedGameServer = historicalServer;
    }
    if (historicalServer !== null && ['ACE', 'FAULT', 'DOUBLE_FAULT', 'SERVE'].includes(event.type) && event.player !== historicalServer) {
      return inconsistent(`Serving action actor disagrees with server at event ${order}.`);
    }
    if (isTiebreak && context?.tiebreak_first_server != null &&
        ((openingServer !== null && context.tiebreak_first_server !== openingServer) ||
         (gameServer !== null && context.tiebreak_first_server !== gameServer))) {
      return inconsistent(`Saved tie-break server disagrees in set ${sets.length + 1}.`);
    }
    if (!winner) continue;
    if (winner === 'TEAM1') p1++; else p2++;
    pointCount++;
    const gameWinner: PlayerId | null = isTiebreak ? checkTiebreakWin(p1, p2) : checkGameWin(p1, p2);
    const display = getDisplayPoints(p1, p2);
    const scoreAfterPoint = isTiebreak ? `${p1}–${p2}` : gameWinner ? 'GAME'
      : display.player1Display === '40' && display.player2Display === '40' ? 'DEUCE'
      : `${display.player1Display}–${display.player2Display}`;
    points.push({ number: points.length + 1, scoreAfterPoint, winner, server: historicalServer, eventNumber: order, event: { ...event } });
    if (!gameWinner) continue;
    games.push({ number: games.length + 1, server: gameServer, isTiebreak, points, winner: winningSide(gameWinner) });
    if (gameWinner === 'PLAYER1') g1++; else g2++;
    const setWinner: PlayerId | 'TIEBREAK' | null = isTiebreak ? gameWinner : checkSetWin(g1, g2);
    if (setWinner && setWinner !== 'TIEBREAK') {
      const saved = savedSets[sets.length];
      if (saved.player1Games !== g1 || saved.player2Games !== g2 || saved.wasTiebreak !== isTiebreak ||
          (context?.is_tiebreak != null && context.is_tiebreak !== isTiebreak)) {
        return inconsistent(`Derived score disagrees with saved set ${sets.length + 1}.`);
      }
      if (isTiebreak) {
        if (saved.tiebreakPlayer1Points == null || saved.tiebreakPlayer2Points == null) {
          return unavailable(`Saved tie-break totals are missing for set ${sets.length + 1}.`);
        }
        if (saved.tiebreakPlayer1Points !== p1 || saved.tiebreakPlayer2Points !== p2) {
          return inconsistent(`Tie-break totals disagree in set ${sets.length + 1}.`);
        }
      }
      nextSetServingTeam = serviceOrder === null ? null
        : isTiebreak ? opposite(team(serviceOrder[0])) : team(serviceOrder[games.length % 4]);
      sets.push({ number: sets.length + 1, score: saved, games });
      if (setWinner === 'PLAYER1') s1++; else s2++;
      matchWinner = checkMatchWin(s1, s2, format);
      games = [];
      g1 = 0; g2 = 0;
      serviceOrder = null;
    }
    gameServer = null;
    gameStarted = false;
    observedGameServer = null;
    isTiebreak = setWinner === 'TIEBREAK';
    points = [];
    p1 = 0; p2 = 0;
  }
  if (points.length || games.length || sets.length !== savedSets.length || !matchWinner ||
      matchWinner !== savedWinner || s1 !== savedPlayer1Sets || s2 !== savedPlayer2Sets) {
    return inconsistent('Derived match completion, set count, or winner disagrees with the saved result.');
  }
  if (limitations.size) {
    return { status: 'PARTIAL', matchType: 'DOUBLES', sets, eventCount: events.length, pointCount,
      limitations: [...limitations, 'Receiver identity is unavailable.', 'Receiver position is unavailable.',
        'Court-end assignment is unavailable.', 'Correction/undo history is unavailable.'] };
  }
  return { status: 'VALIDATED', matchType: 'DOUBLES', sets, eventCount: events.length, pointCount };
}
