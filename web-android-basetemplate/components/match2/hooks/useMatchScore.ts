import { useState } from 'react';

import {
    MatchEvent,
    Wrestler,
} from '@/components/match/types/match.types';

export function useMatchScore() {
  const [selectedWrestler, setSelectedWrestler] =
    useState<Wrestler | null>(null);

  const [redScore, setRedScore] = useState(0);
  const [blueScore, setBlueScore] = useState(0);

  const [logs, setLogs] = useState<MatchEvent[]>([]);

  const addEvent = (
    event: MatchEvent,
    running: boolean
  ) => {
    if (!running) {
      if (typeof window !== 'undefined') {
        window.alert(
          'Start the timer before awarding points'
        );
      }

      return;
    }

    let newRedScore = redScore;
    let newBlueScore = blueScore;

    if (event.type === 'PENALTY') {
      if (event.wrestler === 'RED') {
        newBlueScore += event.points;
      }

      if (event.wrestler === 'BLUE') {
        newRedScore += event.points;
      }
    } else {
      if (event.wrestler === 'RED') {
        newRedScore += event.points;
      }

      if (event.wrestler === 'BLUE') {
        newBlueScore += event.points;
      }
    }

    const eventWithScores: MatchEvent = {
      ...event,
      redScore: newRedScore,
      blueScore: newBlueScore,
    };

    setLogs((prev) => [eventWithScores, ...prev]);
    setRedScore(newRedScore);
    setBlueScore(newBlueScore);
  };

  const undoLast = () => {
    const last = logs[0];
    if (!last) return;

    setLogs((prev) => prev.slice(1));

    if (last.type === 'PENALTY') {
      if (last.wrestler === 'RED') {
        setBlueScore((prev) =>
          Math.max(0, prev - last.points)
        );
      }

      if (last.wrestler === 'BLUE') {
        setRedScore((prev) =>
          Math.max(0, prev - last.points)
        );
      }

      return;
    }

    if (last.wrestler === 'RED') {
      setRedScore((prev) =>
        Math.max(0, prev - last.points)
      );
    }

    if (last.wrestler === 'BLUE') {
      setBlueScore((prev) =>
        Math.max(0, prev - last.points)
      );
    }
  };

  const resetScore = () => {
    setSelectedWrestler(null);
    setRedScore(0);
    setBlueScore(0);
    setLogs([]);
  };

  const resetSessionScore = () => {
    setRedScore(0);
    setBlueScore(0);
  };

  return {
    selectedWrestler,
    setSelectedWrestler,

    redScore,
    blueScore,
    logs,

    addEvent,
    undoLast,
    resetScore,
    resetSessionScore,
  };
}