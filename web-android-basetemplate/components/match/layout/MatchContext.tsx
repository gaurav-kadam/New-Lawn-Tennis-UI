// MatchContext.tsx
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
  isHubConnected: boolean; // Tells Scorer if Mobile remote link is active
  toggleTimer: () => void;
  endQuarter: () => void; 
  selectPlayer: (playerNumber: string, side: 'left' | 'right') => void;
  clearSelection: () => void;
  addLog: (type: string, targetSide?: 'left' | 'right', assist?: string, explicitPlayerNum?: string) => void; 
  updateLog: (id: string, updatedFields: Partial<LogItem>) => void; 
  deleteLog: (id: string) => void;
  formatTime: (totalSeconds: number) => string;
  getQuarterScore: (teamSide: 'left' | 'right', quarter: number) => number;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export function MatchProvider({ children }: { children: React.ReactNode }) {
  const [secondsLeft, setSecondsLeft] = useState(8 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentQuarter, setCurrentQuarter] = useState(1);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<{ number: string; side: 'left' | 'right' } | null>(null);
  const [isHubConnected, setIsHubConnected] = useState(false);

  const intervalRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // CHANGE THIS TO YOUR LAPTOP'S LOCAL LAN IP ADDRESS SO MOBILE CAN CONNECT OVER WI-FI
  const LOCAL_HUB_IP = '192.168.0.102';

  // Establish local websocket bridge loop
  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket(`ws://${LOCAL_HUB_IP}:8080`);
      wsRef.current = ws;

      ws.onopen = () => setIsHubConnected(true);
      ws.onclose = () => {
        setIsHubConnected(false);
        // Retry connection gracefully every 4 seconds if hub restarts
        setTimeout(connectWebSocket, 4000);
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'CLOCK_UPDATE' || message.type === 'SYNC_STATE') {
          setIsRunning(message.isRunning);
        }
      };
    };

    connectWebSocket();
    return () => wsRef.current?.close();
  }, []);

  // Standard standalone count-down clock engine
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

  const scoreA = logs.filter(log => log.team === 'White' && goalTypes.includes(log.type)).length;
  const scoreB = logs.filter(log => log.team === 'Blue' && goalTypes.includes(log.type)).length;

  const getQuarterScore = (teamSide: 'left' | 'right', quarter: number) => {
    const targetTeamColor = teamSide === 'left' ? 'White' : 'Blue';
    return logs.filter(
      (log) => 
        log.team === targetTeamColor && 
        log.period === `Quarter ${quarter}` && 
        goalTypes.includes(log.type)
    ).length;
  };

  // Hybrid Toggle Option: Fires network message if available, else handles locally instantly
  const toggleTimer = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'TOGGLE_CLOCK', isRunning: !isRunning }));
    } else {
      setIsRunning(!isRunning);
    }
  };
  
  const endQuarter = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'TOGGLE_CLOCK', isRunning: false }));
    }
    setIsRunning(false);
    setSecondsLeft(8 * 60);
    setCurrentQuarter(prev => (prev >= 4 ? 1 : prev + 1));
  };

  const selectPlayer = (playerNumber: string, side: 'left' | 'right') => setSelectedPlayer({ number: playerNumber, side });
  const clearSelection = () => setSelectedPlayer(null);
  const formatTime = (total: number) => `${Math.floor(total / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}`;

  const addLog = (type: string, targetSide?: 'left' | 'right', assist: string = '----------', explicitPlayerNum?: string) => {
    const isCoachAction = coachActions.includes(type);
    const finalPlayerNum = explicitPlayerNum || selectedPlayer?.number;
    const finalSide = explicitPlayerNum ? targetSide : (isCoachAction ? targetSide : selectedPlayer?.side);

    if (!finalSide) return;
    if (!finalPlayerNum && !isCoachAction) return;

    const isGoal = goalTypes.includes(type);
    
    const newLog: LogItem = {
      id: `${Date.now()}`,
      period: `Quarter ${currentQuarter}`, 
      time: formatTime(secondsLeft),
      team: finalSide === 'left' ? 'White' : 'Blue',
      type,
      playerCap: isCoachAction ? '-' : parseInt(finalPlayerNum!, 10),
      assist: isCoachAction ? '-' : assist,
      scoreAtEvent: `${finalSide === 'left' && isGoal ? scoreA + 1 : scoreA}-${finalSide === 'right' && isGoal ? scoreB + 1 : scoreB}`, 
    };

    setLogs((prev) => [newLog, ...prev]);
    if (!explicitPlayerNum) clearSelection(); 
  };

  const updateLog = (id: string, updatedFields: Partial<LogItem>) => {
    setLogs((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item)));
  };

  const deleteLog = (id: string) => setLogs((prev) => prev.filter((item) => item.id !== id));

  return (
    <MatchContext.Provider value={{ secondsLeft, isRunning, currentQuarter, logs, selectedPlayer, scoreA, scoreB, isHubConnected, toggleTimer, endQuarter, selectPlayer, clearSelection, addLog, updateLog, deleteLog, formatTime, getQuarterScore }}>
      {children}
    </MatchContext.Provider>
  );
}

export function useMatch() {
  const context = useContext(MatchContext);
  if (!context) throw new Error('useMatch must be used within a MatchProvider');
  return context;
}