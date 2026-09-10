import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  TennisEventRecord,
  TennisMatchState,
} from '../../components/tennis-match/types/tennis.types';

import {
  MatchTimerStatus,
} from '../../components/tennis-match/hooks/useMatchTimer';

export type MatchDraft = {
  version: 1;
  matchId: string;
  state: TennisMatchState;
  events: TennisEventRecord[];
  elapsedSeconds: number;
  timerStatus: MatchTimerStatus;
  updatedAt: number;
};

type DraftInput = Omit<
  MatchDraft,
  'version' | 'updatedAt'
>;

const getDraftKey = (matchId: string) =>
  `tennis-match-draft:${matchId}`;

const getBackupDraftKey = (matchId: string) =>
  `tennis-match-draft-backup:${matchId}`;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;
const isCount = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
const isPlayer = (value: unknown) =>
  ['PLAYER1', 'PLAYER2', 'PLAYER3', 'PLAYER4'].includes(String(value));
const isEventType = (value: unknown) =>
  ['POINT', 'ACE', 'FAULT', 'DOUBLE_FAULT', 'SERVE', 'WINNER', 'UNFORCED_ERROR', 'VOLLEY'].includes(String(value));

function isState(value: unknown, includeHistory = true): value is TennisMatchState {
  if (!isObject(value)) return false;
  return ['SINGLES', 'DOUBLES'].includes(String(value.matchType)) &&
    ['BEST_OF_3', 'BEST_OF_5'].includes(String(value.matchFormat)) &&
    ['player1Name', 'player2Name', 'player3Name', 'player4Name'].every(key => typeof value[key] === 'string') &&
    ['player1Points', 'player2Points', 'player1Games', 'player2Games', 'player1Sets', 'player2Sets',
      'tiebreakPlayer1Points', 'tiebreakPlayer2Points', 'tiebreakServeCount', 'doublesServeIndex'].every(key => isCount(value[key])) &&
    isPlayer(value.server) && (value.serveNumber === 1 || value.serveNumber === 2) &&
    (value.currentSetFirstServer === undefined || isPlayer(value.currentSetFirstServer)) &&
    (value.pendingDoublesServerSelection === undefined || value.pendingDoublesServerSelection === null ||
      (isObject(value.pendingDoublesServerSelection) &&
        ['TEAM1', 'TEAM2'].includes(String(value.pendingDoublesServerSelection.team)) &&
        Array.isArray(value.pendingDoublesServerSelection.players) &&
        value.pendingDoublesServerSelection.players.every(isPlayer))) &&
    typeof value.isTiebreak === 'boolean' &&
    (value.matchWinner === null || isPlayer(value.matchWinner)) &&
    (value.tiebreakFirstServer === null || isPlayer(value.tiebreakFirstServer)) &&
    (value.lastAction === null || (isObject(value.lastAction) && isPlayer(value.lastAction.player) && isEventType(value.lastAction.type))) &&
    Array.isArray(value.doublesServeOrder) && value.doublesServeOrder.every(isPlayer) &&
    Array.isArray(value.completedSets) && value.completedSets.every(set => isObject(set) &&
      isCount(set.player1Games) && isCount(set.player2Games) && typeof set.wasTiebreak === 'boolean' &&
      (set.tiebreakPlayer1Points === undefined || isCount(set.tiebreakPlayer1Points)) &&
      (set.tiebreakPlayer2Points === undefined || isCount(set.tiebreakPlayer2Points))) &&
    Array.isArray(value.history) && (!includeHistory || value.history.every(state => isState(state, false)));
}

const parseDraft = (rawValue: string | null, matchId: string): MatchDraft | null => {
  if (rawValue === null) return null;
  try {
    const draft: unknown = JSON.parse(rawValue);
    if (!isObject(draft) || draft.version !== 1 || draft.matchId !== matchId ||
      !isState(draft.state) || !isCount(draft.elapsedSeconds) || !isCount(draft.updatedAt) ||
      !['idle', 'running', 'paused', 'stopped'].includes(String(draft.timerStatus)) ||
      !Array.isArray(draft.events) || !draft.events.every(event => isObject(event) &&
        typeof event.id === 'string' && isEventType(event.type) && isPlayer(event.player) &&
        (event.server === undefined || isPlayer(event.server)) &&
        isCount(event.elapsedSeconds) && isCount(event.recordedAt))) return null;
    // All version-1 fields have been validated; storage format is unchanged.
    return draft as MatchDraft;
  } catch { return null; }
};

class MatchDraftService {
  private operations = new Map<string, Promise<void>>();

  private enqueue<T>(matchId: string, operation: () => Promise<T>): Promise<T> {
    const result = (this.operations.get(matchId) ?? Promise.resolve()).then(operation);
    const tail = result.then(() => undefined, () => undefined);
    this.operations.set(matchId, tail);
    void tail.then(() => {
      if (this.operations.get(matchId) === tail) this.operations.delete(matchId);
    });
    return result;
  }

  saveDraft(input: DraftInput): Promise<void> {
    // Snapshot at request time, not when a delayed operation finally runs.
    const serializedDraft = JSON.stringify({ ...input, version: 1, updatedAt: Date.now() });
    return this.enqueue(input.matchId, async () => {
      await AsyncStorage.setItem(getBackupDraftKey(input.matchId), serializedDraft);
      await AsyncStorage.setItem(getDraftKey(input.matchId), serializedDraft);
    });
  }

  loadDraft(matchId: string): Promise<MatchDraft | null> {
    return this.enqueue(matchId, async () => {
      const results = await Promise.allSettled([
        AsyncStorage.getItem(getDraftKey(matchId)),
        AsyncStorage.getItem(getBackupDraftKey(matchId)),
      ]);
      const [primary, backup] = results;
      // An unread copy may be newer: do not overwrite it using an older copy.
      if (primary.status === 'rejected' || backup.status === 'rejected') {
        throw new Error('Local match storage could not be read. Please retry.');
      }
      const a = parseDraft(primary.value, matchId);
      const b = parseDraft(backup.value, matchId);
      if (a && b) return a.updatedAt >= b.updatedAt ? a : b;
      if (a || b) return a ?? b;
      if (primary.value !== null || backup.value !== null) {
        throw new Error('The local match draft is corrupt or incompatible. It has been preserved.');
      }
      return null;
    });
  }

  deleteDraft(matchId: string): Promise<void> {
    return this.enqueue(matchId, async () => {
      // Wait for both removals even if one fails before admitting the next operation.
      const results = await Promise.allSettled([
        AsyncStorage.removeItem(getDraftKey(matchId)),
        AsyncStorage.removeItem(getBackupDraftKey(matchId)),
      ]);
      if (results.some(result => result.status === 'rejected')) {
        throw new Error('Local match cleanup failed');
      }
    });
  }
}

export default new MatchDraftService();
