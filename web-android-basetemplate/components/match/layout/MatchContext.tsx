// MatchContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import logService from '../../../services/log/Log.service'; 

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

export function MatchProvider({ children }: { children: React.ReactNode }) {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentQuarter, setCurrentQuarter] = useState(1);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [penaltyPhase, setPenaltyPhase] = useState(false);
  const [penaltyLogs, setPenaltyLogs] = useState<PenaltyLog[]>([]);
  const [penaltyLineup, setPenaltyLineup] = useState<PenaltyLineup | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<{ number: string; side: 'left' | 'right' } | null>(null);
  const [activeMatch, setActiveMatch] = useState<any | null>(null);
  const [currentPenaltyIndex, setCurrentPenaltyIndex] = useState(0);
  const [isPenaltyRoundComplete, setIsPenaltyRoundComplete] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

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

  const scoreA = logs.filter(item => item.team === 'White' && item.type.includes('Goal')).length;
  const scoreB = logs.filter(item => item.team === 'Blue' && item.type.includes('Goal')).length;

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
      if (logTeam === 'White') prospectiveScoreA += 1;
      if (logTeam === 'Blue') prospectiveScoreB += 1;
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
  };

  const updateLog = (id: string, updatedFields: Partial<LogItem>) => {
    setLogs(prev => prev.map(log => log.id === id ? { ...log, ...updatedFields } : log));
  };

  const deleteLog = (id: string) => {
    setLogs(prev => prev.filter(log => log.id !== id));
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
    // 1. Save all pending logs first
    await saveAllLogs();

    // 2. Call the backend API to mark match as complete
    // You'll need to use your API Service instance
    await ApiService.post(`/matches/${activeMatch.id}/complete`);

    // 3. Optional: Update local state or notify user
    Alert.alert("Success", "Match has been marked as completed.");
    
    // 4. Reset or navigate away if needed
    // resetMatchState(); 
  } catch (error) {
    console.error("Failed to finalize match:", error);
    Alert.alert("Error", "Could not mark match as completed.");
  }
};

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const endQuarter = () => { 
    setIsRunning(false); 
    setSecondsElapsed(0); 
    setCurrentQuarter(prev => (prev >= 4 ? 1 : prev + 1)); 
  };
  
  const resetMatchState = () => { 
    setIsRunning(false); 
    setSecondsElapsed(0); 
    setCurrentQuarter(1); 
    setLogs([]); 
    setPenaltyLogs([]);
    setPenaltyLineup(null);
    setPenaltyPhase(false);
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
    return logs.filter(item => item.team === team && item.quarter === quarter && item.type.includes('Goal')).length;
  };

  return (
    <MatchContext.Provider value={{ 
      secondsElapsed, isRunning, currentQuarter, logs, penaltyPhase, penaltyLogs, selectedPlayer, 
      penaltyLineup, scoreA, scoreB, activeMatch, currentPenaltyIndex, isPenaltyRoundComplete, setIsPenaltyRoundComplete, resetPenaltyOnlyForContinuation, setActiveMatch, toggleTimer, endQuarter, setPenaltyPhase, setPenaltyLineup, addPenaltyLog,
      selectPlayer: (n, s) => setSelectedPlayer({ number: n, side: s }), 
      clearSelection: () => setSelectedPlayer(null), 
      addLog, updateLog, deleteLog, saveAllLogs,finalizeAndEndMatch, formatTime, getQuarterScore, resetMatchState 
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