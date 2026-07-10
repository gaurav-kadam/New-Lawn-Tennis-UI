// PenaltyShootoutOverlay.tsx
import React, { useState, useEffect } from 'react';
import { Alert, View, Pressable, Text } from 'react-native';
import Button from '@/components/ui/Button';
import { useMatch } from '../layout/MatchContext';

type PenaltyResult = 'goal' | 'save' | 'bar';
type PenaltyAttempt = {
  result: PenaltyResult;
  targetCell: number;
};

export default function PenaltyShootoutOverlay({ side }: { side: 'left' | 'right' }) {
  const { addPenaltyLog, penaltyLineup, currentPenaltyIndex } = useMatch();
  
  const [selectedResult, setSelectedResult] = useState<PenaltyResult | null>(null);
  const [activeRound, setActiveRound] = useState(0);
  const [attempts, setAttempts] = useState<(PenaltyAttempt | null)[]>([null, null, null, null, null]);

  const shooters = side === 'left' ? penaltyLineup?.whiteShooters : penaltyLineup?.blueShooters;

  // Wipes out selected dots visually back to gray when sudden death continuation is executed
  useEffect(() => {
    if (currentPenaltyIndex === 0) {
      setAttempts([null, null, null, null, null]);
      setActiveRound(0);
      setSelectedResult(null);
    }
  }, [currentPenaltyIndex]);

  const isGoalArea = (index: number) => {
    const row = Math.floor(index / 5);
    const col = index % 5;
    return row > 0 && col > 0 && col < 4;
  };

  const getCellBackgroundColor = (index: number) => {

    // 1. If this round has a completed attempt, show the dark/light locked colors 
    const attempt = attempts[activeRound];
    if (attempt) {
      const selected = attempt.targetCell === index;
      if (attempt.result === 'goal' && isGoalArea(index)) return selected ? '#4ebd77' : '#BBF7D0';
      return selected ? '#f05353' : '#FECACA';
    }

    // 2. If a button is clicked but no cell selected yet, show "preview" colors
    if (selectedResult === 'goal') {
      return isGoalArea(index) ? '#BBF7D0' : '#FECACA';
    }
    
    if (selectedResult === 'save' || selectedResult === 'bar') {
      return '#FECACA';
    }

    return '#D1D5DB'; 
  };

  const getCellBorderStyle = (index: number) => {
    const row = Math.floor(index / 5);
    const col = index % 5;
    return {
      borderTopWidth: row === 1 && col >= 1 && col <= 3 ? 8 : 0.5,
      borderLeftWidth: row >= 1 && col === 1 ? 8 : 0.5,
      borderRightWidth: row >= 1 && col === 3 ? 8 : 0.5,
    };
  };

  const handlePenaltyResult = (result: PenaltyResult) => {
    setSelectedResult(result);
  };

  const handleCellPress = (cellIndex: number) => {
    if (activeRound >= 5) {
      Alert.alert('Penalty Complete', 'All 5 attempts for this side are recorded.');
      return;
    }

    if (!selectedResult) {
      Alert.alert('Penalty Shootout', 'Choose Goal, Save, or Bar first');
      return;
    }

    // Lock the result into local state array immediately to display dark colors
    const updatedAttempts = [...attempts];
    updatedAttempts[activeRound] = { result: selectedResult, targetCell: cellIndex };
    setAttempts(updatedAttempts);
    
    const shooterCap = shooters?.[activeRound] || (activeRound + 1).toString();
    addPenaltyLog?.(selectedResult, side, cellIndex, shooterCap);
    
    
    setSelectedResult(null);
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 90, paddingBottom: 10, alignItems: 'center', backgroundColor: '#8be0f5' }}>
      <View style={{
        width: '90%',
        aspectRatio: 5 / 3,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'center',
        borderWidth: 6,
        borderColor: '#1E293B',
        borderRadius: 6,
        overflow: 'hidden'
      }}>
        {[...Array(15)].map((_, i) => (
          <Pressable
            key={i}
            style={[
              { width: '20%', aspectRatio: 1, borderWidth: 0.5, borderColor: 'rgba(0, 0, 0, 0.4)' },
              getCellBorderStyle(i),
              { backgroundColor: getCellBackgroundColor(i) }
            ]}
            onPress={() => handleCellPress(i)}
          />
        ))}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20, marginVertical: 30 }}>
        {(['goal', 'save', 'bar'] as const).map((res) => (
          <Button
            key={res}
            title={res.charAt(0).toUpperCase() + res.slice(1)}
            onPress={() => handlePenaltyResult(res)}
            backgroundColor={selectedResult === res ? '#4F46E5' : '#6366F1'}
            textColor="#FFFFFF"
            borderColor="#FFFFFF"
          />
        ))}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 15, marginTop: 20 }}>
        {attempts.map((attempt, index) => {
          let bgColor = index === activeRound ? '#FFFFFF' : '#dbdcdf';
          if (attempt?.result === 'goal') bgColor = '#4CAF50';
          if (attempt?.result === 'save' || attempt?.result === 'bar') bgColor = '#F44336';

          return (
            <Pressable key={index} onPress={() => setActiveRound(index)}>
              <View style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#000', backgroundColor: bgColor, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold' }}>{shooters?.[index] || index + 1}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}