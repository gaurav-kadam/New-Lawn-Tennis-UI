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

const parseDraft = (
  rawValue: string | null,
  matchId: string
): MatchDraft | null => {
  if (!rawValue) {
    return null;
  }

  try {
    const draft = JSON.parse(rawValue) as MatchDraft;

    if (
      draft.version !== 1 ||
      draft.matchId !== matchId ||
      !draft.state ||
      !Array.isArray(draft.events)
    ) {
      return null;
    }

    return draft;
  } catch {
    return null;
  }
};

class MatchDraftService {
  async saveDraft(input: DraftInput): Promise<void> {
    const draft: MatchDraft = {
      ...input,
      version: 1,
      updatedAt: Date.now(),
    };

    const serializedDraft = JSON.stringify(draft);

    // Save backup first. If primary storage fails,
    // the backup still preserves the match.
    await AsyncStorage.setItem(
      getBackupDraftKey(input.matchId),
      serializedDraft
    );

    await AsyncStorage.setItem(
      getDraftKey(input.matchId),
      serializedDraft
    );
  }

  async loadDraft(
    matchId: string
  ): Promise<MatchDraft | null> {
    const [primaryRaw, backupRaw] = await Promise.all([
      AsyncStorage.getItem(getDraftKey(matchId)),
      AsyncStorage.getItem(getBackupDraftKey(matchId)),
    ]);

    const primaryDraft = parseDraft(
      primaryRaw,
      matchId
    );

    const backupDraft = parseDraft(
      backupRaw,
      matchId
    );

    if (!primaryDraft) {
      return backupDraft;
    }

    if (!backupDraft) {
      return primaryDraft;
    }

    return primaryDraft.updatedAt >= backupDraft.updatedAt
      ? primaryDraft
      : backupDraft;
  }

  async deleteDraft(
    matchId: string
  ): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(getDraftKey(matchId)),
      AsyncStorage.removeItem(
        getBackupDraftKey(matchId)
      ),
    ]);
  }
}

export default new MatchDraftService();