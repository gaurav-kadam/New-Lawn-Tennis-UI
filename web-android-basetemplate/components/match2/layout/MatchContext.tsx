import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export interface LogItem {
  id: string;
  period: string; 
  time: string;
  team: 'White' | 'Blue'; 
  type: string;
  playerCap: number | string; 
  assist: string;
  scoreAtEvent: string; 
}

interface MatchContextType {
  secondsLeft: number;
  isRunning: boolean;
  currentQuarter: number; 
  logs: LogItem[];
  selectedPlayer: { number: string; side: 'left' | 'right' } | null;
  scoreA: number; 
  scoreB: number; 
  toggleTimer: () => void;
  endQuarter: () => void; 
  selectPlayer: (playerNumber: string, side: 'left' | 'right') => void;
  clearSelection: () => void;
  addLog: (type: string, targetSide?: 'left' | 'right', assist?: string) => void; 
  updateLog: (id: string, updatedFields: Partial<LogItem>) => void; 
  deleteLog: (id: string) => void;
  formatTime: (totalSeconds: number) => string;
  getQuarterScore: (teamSide: 'left' | 'right', quarter: number) => number; // Added context selector signature
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export function MatchProvider({ children }: { children: React.ReactNode }) {
  const [secondsLeft, setSecondsLeft] = useState(8 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentQuarter, setCurrentQuarter] = useState(1);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<{ number: string; side: 'left' | 'right' } | null>(null);
  
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const goalTypes = ['Action Goal', 'Extra Man Goal', 'Penalty Goal', 'Counter Goal', '6M Goal'];
  const coachActions = ['YELLOW CARD', 'RED CARD', 'TIMEOUT']; 

  // Calculate global scores based on mapped standard layout context attributes
  const scoreA = logs.filter(log => log.team === 'White' && goalTypes.includes(log.type)).length;
  const scoreB = logs.filter(log => log.team === 'Blue' && goalTypes.includes(log.type)).length;

  // Real calculation parser checking event periods matching target integer indexes
  const getQuarterScore = (teamSide: 'left' | 'right', quarter: number) => {
    const targetTeamColor = teamSide === 'left' ? 'White' : 'Blue';
    return logs.filter(
      (log) => 
        log.team === targetTeamColor && 
        log.period === `Quarter ${quarter}` && 
        goalTypes.includes(log.type)
    ).length;
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const endQuarter = () => {
    setIsRunning(false);
    setSecondsLeft(8 * 60);
    setCurrentQuarter(prev => (prev >= 4 ? 1 : prev + 1));
  };

  const selectPlayer = (playerNumber: string, side: 'left' | 'right') => setSelectedPlayer({ number: playerNumber, side });
  const clearSelection = () => setSelectedPlayer(null);
  const formatTime = (total: number) => `${Math.floor(total / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}`;

  const addLog = (type: string, targetSide?: 'left' | 'right', assist: string = '----------') => {
    const isCoachAction = coachActions.includes(type);
    
    if (!selectedPlayer && !isCoachAction) return;

    const resolvedSide = isCoachAction ? targetSide : selectedPlayer?.side;
    if (!resolvedSide) return;

    const isGoal = goalTypes.includes(type);
    
    const newLog: LogItem = {
      id: `${Date.now()}`,
      period: `Quarter ${currentQuarter}`, 
      time: formatTime(secondsLeft),
      team: resolvedSide === 'left' ? 'White' : 'Blue',
      type,
      playerCap: isCoachAction ? '-' : parseInt(selectedPlayer!.number, 10),
      assist: isCoachAction ? '-' : assist,
      scoreAtEvent: `${resolvedSide === 'left' && isGoal ? scoreA + 1 : scoreA}-${resolvedSide === 'right' && isGoal ? scoreB + 1 : scoreB}`, 
    };

    setLogs((prev) => [newLog, ...prev]);
    clearSelection(); 
  };

  const updateLog = (id: string, updatedFields: Partial<LogItem>) => {
    setLogs((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item)));
  };

  const deleteLog = (id: string) => setLogs((prev) => prev.filter((item) => item.id !== id));

  return (
    <MatchContext.Provider value={{ secondsLeft, isRunning, currentQuarter, logs, selectedPlayer, scoreA, scoreB, toggleTimer, endQuarter, selectPlayer, clearSelection, addLog, updateLog, deleteLog, formatTime, getQuarterScore }}>
      {children}
    </MatchContext.Provider>
  );
}

export function useMatch() {
  const context = useContext(MatchContext);
  if (!context) throw new Error('useMatch must be used within a MatchProvider');
  return context;
}