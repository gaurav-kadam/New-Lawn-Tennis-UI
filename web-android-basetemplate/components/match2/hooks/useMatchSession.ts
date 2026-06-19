import { useMemo, useState } from 'react';

import { TOTAL_SESSIONS } from '@/components/match/constants/matchConfig';

import { SessionResult } from '@/components/results/types';

type Props = {
  redScore: number;
  blueScore: number;
  resetSessionScore: () => void;
  resetTimer: () => void;
};

export function useMatchSession({
  redScore,
  blueScore,
  resetSessionScore,
  resetTimer,
}: Props) {
  const [session, setSession] = useState(1);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);

  const leaderText = useMemo(() => {
    if (redScore > blueScore) return 'RED is leading';
    if (blueScore > redScore) return 'BLUE is leading';
    return 'Match is tied';
  }, [redScore, blueScore]);

  const saveSessionResult = () => {
    setSessionResults((prev) => {
      const alreadySaved = prev.some((item) => item.session === session);

      if (alreadySaved) {
        return prev.map((item) =>
          item.session === session
            ? { session, redScore, blueScore }
            : item
        );
      }

      return [...prev, { session, redScore, blueScore }];
    });
  };

  const openSessionEnd = () => {
    saveSessionResult();
    setSessionModalOpen(true);
  };

  const endMatch = () => {
    saveSessionResult();

    if (session < TOTAL_SESSIONS) {
      setSessionModalOpen(true);
      return;
    }

    setSessionModalOpen(false);

    setTimeout(() => {
      setShowResultModal(true);
    }, 100);
  };

  const continueSession = () => {
    saveSessionResult();

    if (session < TOTAL_SESSIONS) {
      setSessionModalOpen(false);
      setSession((prev) => prev + 1);

      resetSessionScore();
      resetTimer();

      return;
    }

    setSessionModalOpen(false);

    setTimeout(() => {
      setShowResultModal(true);
    }, 100);
  };

  const resetSession = () => {
    setSession(1);
    setSessionModalOpen(false);
    setSessionResults([]);
    setShowResultModal(false);
  };

  return {
    session,
    sessionModalOpen,
    sessionResults,
    showResultModal,
    leaderText,

    openSessionEnd,
    endMatch,
    continueSession,
    resetSession,

    setShowResultModal,
  };
}