// MatchContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import logService from '../../../services/log/Log.service';
import ApiService from '../../../services/api/api.service';
import { environment } from '../../../environment/environment';

export interface LogItem {
  id: string;
  match_id: number;
  quarter: number;
  time: string;
  team: 'White' | 'Blue';
  type: string;
  player: string;
  assist: string;
  score: string;
}

interface PenaltyLog {
  result: 'goal' | 'save' | 'bar';
  side: 'left' | 'right';
  targetCell: number;
}

export interface PenaltyLineup {
  whiteShooters: string[];
  blueShooters: string[];
  whiteGoalkeeper: string;
  blueGoalkeeper: string;
}

interface MatchContextType {
  secondsElapsed: number;
  isRunning: boolean;
  quarterDurationSeconds: number;
  currentQuarter: number;
  logs: LogItem[];
  penaltyPhase: boolean;
  penaltyLogs: PenaltyLog[];
  penaltyLineup: PenaltyLineup | null;
  selectedPlayer: { number: string; side: 'left' | 'right' } | null;
  scoreA: number;
  scoreB: number;
  activeMatch: any | null;
  currentPenaltyIndex: number;
  isPenaltyRoundComplete: boolean;
  setIsPenaltyRoundComplete: (val: boolean) => void;
  resetPenaltyOnlyForContinuation: () => void;
  setActiveMatch: (match: any) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  toggleTimer: () => void;
  endQuarter: () => void;
  setPenaltyPhase: (val: boolean) => void;
  setPenaltyLineup: (lineup: PenaltyLineup | null) => void;
  addPenaltyLog: (result: 'goal' | 'save' | 'bar', side: 'left' | 'right', targetCell: number, shooterCap: string) => void;
  selectPlayer: (playerNumber: string, side: 'left' | 'right') => void;
  clearSelection: () => void;
  addLog: (type: string, targetSide?: 'left' | 'right', assist?: string, explicitPlayerNum?: string, quarterOverride?: number) => void;
  updateLog: (id: string, updatedFields: Partial<LogItem>) => void;
  deleteLog: (id: string) => void;
  saveAllLogs: () => Promise<void>;
  finalizeAndEndMatch: () => Promise<void>;
  formatTime: (totalSeconds: number) => string;
  getQuarterScore: (teamSide: 'left' | 'right', quarter: number) => number;
  resetMatchState: () => void;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

// Derive WebSocket base URL from the REST API URL (strips /api/v1, swaps http→ws)
const WS_BASE = environment.API_URL
  .replace(/\/api\/v1\/?$/, '')
  .replace(/^http/, 'ws');

export function MatchProvider({ children }: { children: React.ReactNode }) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentQuarter, setCurrentQuarter] = useState(1);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [penaltyPhase, _setPenaltyPhase] = useState(false);
  const [penaltyLogs, setPenaltyLogs] = useState<PenaltyLog[]>([]);
  const [penaltyLineup, setPenaltyLineup] = useState<PenaltyLineup | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<{ number: string; side: 'left' | 'right' } | null>(null);
  const [activeMatch, setActiveMatch] = useState<any | null>(null);
  const [currentPenaltyIndex, setCurrentPenaltyIndex] = useState(0);
  const [isPenaltyRoundComplete, setIsPenaltyRoundComplete] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Refs always hold the current value so action callbacks are never stale
  const secondsElapsedRef = useRef(0);
  const currentQuarterRef = useRef(1);
  useEffect(() => { secondsElapsedRef.current = secondsElapsed; }, [secondsElapsed]);
  useEffect(() => { currentQuarterRef.current = currentQuarter; }, [currentQuarter]);

  // Quarter length comes from the match record (minutes); fall back to the
  // standard 8-minute water polo quarter only when a match has no value set.
  const DEFAULT_QUARTER_DURATION_MINUTES = 8;
  const quarterDurationSeconds =
    (Number(activeMatch?.quarter_duration) > 0
      ? Number(activeMatch.quarter_duration)
      : DEFAULT_QUARTER_DURATION_MINUTES) * 60;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsElapsed((prev) => {
          const next = prev + 1;
          if (next >= quarterDurationSeconds) {
            setIsRunning(false);
            return quarterDurationSeconds;
          }
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, quarterDurationSeconds]);

  // ── WebSocket: real-time sync between mobile timekeeper and web scorer ──────
  // Each device sends events (timer controls, score logs) to the backend relay
  // which broadcasts them to all other devices watching the same match.
  useEffect(() => {
    if (!activeMatch?.id) return;
    const matchId = String(activeMatch.id);
    let active = true;

    const connect = () => {
      if (!active) return;
      const ws = new WebSocket(`${WS_BASE}/ws/match/${matchId}`);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string);
          switch (msg.type) {
            case 'TIMER_START':
              if (typeof msg.secondsElapsed === 'number') setSecondsElapsed(msg.secondsElapsed);
              setIsRunning(true);
              break;
            case 'TIMER_PAUSE':
              if (typeof msg.secondsElapsed === 'number') setSecondsElapsed(msg.secondsElapsed);
              setIsRunning(false);
              break;
            case 'TIMER_RESET':
              setIsRunning(false);
              setSecondsElapsed(0);
              break;
            case 'QUARTER_END':
              setIsRunning(false);
              setSecondsElapsed(0);
              if (typeof msg.newQuarter === 'number') setCurrentQuarter(msg.newQuarter);
              break;
            case 'LOG_ADD':
              if (msg.log) setLogs((prev) => [...prev, msg.log]);
              break;
            case 'LOG_UPDATE':
              if (msg.id && msg.fields) {
                setLogs((prev) =>
                  prev.map((l) => (l.id === msg.id ? { ...l, ...msg.fields } : l))
                );
              }
              break;
            case 'LOG_DELETE':
              if (msg.id) setLogs((prev) => prev.filter((l) => l.id !== msg.id));
              break;
            case 'PENALTY_PHASE':
              _setPenaltyPhase(msg.active);
              break;
          }
        } catch { /* ignore malformed messages */ }
      };

      ws.onclose = () => {
        if (wsRef.current === ws) wsRef.current = null;
        // Auto-reconnect after 3 s if the match is still active
        if (active) setTimeout(connect, 3000);
      };

      ws.onerror = () => ws.close();
    };

    connect();

    return () => {
      active = false;
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [activeMatch?.id]);

  useEffect(() => {
    if (activeMatch?.id) {
      fetchLogs(activeMatch.id);
    } else {
      setLogs([]);
    }
  }, [activeMatch?.id]);

  const fetchLogs = async (matchId: number) => {
    try {
      const response = await logService.getLogs(matchId);
      setLogs(response.data || []);
    } catch (err) {
      console.error("Failed to fetch match database logs:", err);
    }
  };

  const scoreA = logs.filter(item => {
    if (item.type === 'Self Goal') return item.team === 'Blue';
    return item.team === 'White' && item.type.includes('Goal');
  }).length;
  const scoreB = logs.filter(item => {
    if (item.type === 'Self Goal') return item.team === 'White';
    return item.team === 'Blue' && item.type.includes('Goal');
  }).length;

  // Send an event to all other connected devices; no-op when WS is not open
  const wsSend = (msg: object) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === 1) {
      ws.send(JSON.stringify(msg));
    }
  };

  const addPenaltyLog = (result: 'goal' | 'save' | 'bar', side: 'left' | 'right', targetCell: number, shooterCap: string) => {
    setPenaltyLogs(prev => {
      const updated = [...prev];
      updated[currentPenaltyIndex] = { result, side, targetCell };
      return updated;
    });

    const type = result === 'goal' ? 'Penalty Goal' : 'Penalty Missed';
    addLog(type, side, '----------', shooterCap, 5);

    setCurrentPenaltyIndex(prev => {
      const nextIdx = prev + 1;
      if (nextIdx >= 10) {
        setIsPenaltyRoundComplete(true);
      }
      return nextIdx;
    });
  };

  const resetPenaltyOnlyForContinuation = () => {
    setPenaltyLogs([]);
    setCurrentPenaltyIndex(0);
    setIsPenaltyRoundComplete(false);
  };

  const addLog = (type: string, targetSide?: 'left' | 'right', assist: string = '----------', explicitPlayerNum?: string, quarterOverride?: number) => {
    const logTeam = (targetSide || selectedPlayer?.side) === 'left' ? 'White' : 'Blue';

    let prospectiveScoreA = scoreA;
    let prospectiveScoreB = scoreB;

    if (type.includes('Goal')) {
      if (type === 'Self Goal') {
        if (logTeam === 'White') prospectiveScoreB += 1;
        else prospectiveScoreA += 1;
      } else {
        if (logTeam === 'White') prospectiveScoreA += 1;
        else prospectiveScoreB += 1;
      }
    }

    const resolvedPlayerNum = (explicitPlayerNum && explicitPlayerNum.trim() !== '') ? explicitPlayerNum :
                              (selectedPlayer?.number && selectedPlayer.number.trim() !== '') ? selectedPlayer.number : '0';

    const newLog: LogItem = {
      id: Date.now().toString(),
      match_id: parseInt(activeMatch?.id || 0),
      quarter: quarterOverride || currentQuarter,
      time: quarterOverride ? "00:00" : formatTime(secondsElapsed),
      team: logTeam,
      type: type,
      player: resolvedPlayerNum.toString(),
      assist: assist,
      score: `${prospectiveScoreA}-${prospectiveScoreB}`
    };

    setLogs(prev => [...prev, newLog]);
    wsSend({ type: 'LOG_ADD', log: newLog });
  };

  const updateLog = (id: string, updatedFields: Partial<LogItem>) => {
    setLogs(prev => prev.map(log => log.id === id ? { ...log, ...updatedFields } : log));
    wsSend({ type: 'LOG_UPDATE', id, fields: updatedFields });
  };

  const deleteLog = (id: string) => {
    setLogs(prev => prev.filter(log => log.id !== id));
    wsSend({ type: 'LOG_DELETE', id });
  };

  const saveAllLogs = async () => {
    if (logs.length === 0) return;
    try {
      const logsToSave = logs.map(({ id, ...rest }) => rest);
      await logService.bulkCreateLogs(logsToSave);
      if (activeMatch?.id) await fetchLogs(activeMatch.id);
    } catch (error) {
      console.error("Failed to save logs:", error);
    }
  };

  const finalizeAndEndMatch = async () => {
    if (!activeMatch?.id) return;
    try {
      await saveAllLogs();
      await ApiService.post(`/matches/${activeMatch.id}/complete`, {});
      Alert.alert("Success", "Match has been marked as completed.");
    } catch (error) {
      console.error("Failed to finalize match:", error);
      Alert.alert("Error", "Could not mark match as completed.");
    }
  };

  const startTimer = () => {
    setIsRunning(true);
    wsSend({ type: 'TIMER_START', secondsElapsed: secondsElapsedRef.current });
  };

  const pauseTimer = () => {
    setIsRunning(false);
    wsSend({ type: 'TIMER_PAUSE', secondsElapsed: secondsElapsedRef.current });
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsElapsed(0);
    wsSend({ type: 'TIMER_RESET' });
  };

  const toggleTimer = () => setIsRunning((prev) => !prev);

  const setPenaltyPhase = (val: boolean) => {
    _setPenaltyPhase(val);
    wsSend({ type: 'PENALTY_PHASE', active: val });
  };

  const endQuarter = () => {
    const newQuarter = currentQuarterRef.current >= 4 ? 1 : currentQuarterRef.current + 1;
    setIsRunning(false);
    setSecondsElapsed(0);
    setCurrentQuarter(newQuarter);
    wsSend({ type: 'QUARTER_END', newQuarter });
  };

  const resetMatchState = () => {
    setIsRunning(false);
    setSecondsElapsed(0);
    setCurrentQuarter(1);
    setLogs([]);
    setPenaltyLogs([]);
    setPenaltyLineup(null);
    _setPenaltyPhase(false);
    setCurrentPenaltyIndex(0);
    setActiveMatch(null);
    setIsPenaltyRoundComplete(false);
  };

  const formatTime = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuarterScore = (teamSide: 'left' | 'right', quarter: number) => {
    const team = teamSide === 'left' ? 'White' : 'Blue';
    const oppositeTeam = team === 'White' ? 'Blue' : 'White';
    return logs.filter(item => {
      if (item.quarter !== quarter) return false;
      if (item.type === 'Self Goal') return item.team === oppositeTeam;
      return item.team === team && item.type.includes('Goal');
    }).length;
  };

  return (
    <MatchContext.Provider value={{
      secondsElapsed, isRunning, quarterDurationSeconds, currentQuarter, logs, penaltyPhase, penaltyLogs, selectedPlayer,
      penaltyLineup, scoreA, scoreB, activeMatch, currentPenaltyIndex, isPenaltyRoundComplete, setIsPenaltyRoundComplete, resetPenaltyOnlyForContinuation, setActiveMatch, startTimer, pauseTimer, resetTimer, toggleTimer, endQuarter, setPenaltyPhase, setPenaltyLineup, addPenaltyLog,
      selectPlayer: (n, s) => setSelectedPlayer({ number: n, side: s }),
      clearSelection: () => setSelectedPlayer(null),
      addLog, updateLog, deleteLog, saveAllLogs, finalizeAndEndMatch, formatTime, getQuarterScore, resetMatchState
    }}>
      {children}
    </MatchContext.Provider>
  );
}

export function useMatch() {
  const context = useContext(MatchContext);
  if (!context) throw new Error('useMatch must be used within a MatchProvider');
  return context;
}
