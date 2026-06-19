import { useEffect, useMemo, useState } from 'react';

import {
  MATCH_SESSION_TIME,
  MatchAgeCategory,
} from '@/components/match/constants/matchConfig';

type Props = {
  onTimeEnd: () => void;
  ageCategory: MatchAgeCategory;
};

export function useMatchTimer({ onTimeEnd, ageCategory }: Props) {
  const sessionTime = MATCH_SESSION_TIME[ageCategory];

  const [secondsLeft, setSecondsLeft] = useState(sessionTime);
  const [running, setRunning] = useState(false);

  const timerText = useMemo(() => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;

    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, [secondsLeft]);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          onTimeEnd();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running, onTimeEnd]);

  const toggleTimer = () => {
    setRunning((prev) => !prev);
  };

  const stopTimer = () => {
    setRunning(false);
  };

  const resetTimer = () => {
    setSecondsLeft(sessionTime);
    setRunning(false);
  };
const totalTime = sessionTime;
  return {
    secondsLeft,
    timerText,
    running,
    toggleTimer,
    stopTimer,
    resetTimer,
    totalTime,
  };
}