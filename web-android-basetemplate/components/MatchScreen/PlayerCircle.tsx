
import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../theme/themeContext';

interface PlayerCircleProps {
  number: number;
  bgColor?: string;      
  borderColor?: string;  
  textColor?: string; 
}

export default function PlayerCircle({ number, bgColor, borderColor, textColor }: PlayerCircleProps) {
  const theme = useTheme();

 
  const [countdown, setCountdown] = useState<number>(0);
  const lastTap = useRef<number | null>(null);

 
  useEffect(() => {
    let intervalId: any; 
    
    if (countdown > 0) {
      
      intervalId = setInterval(() => {
        setCountdown((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [countdown]);

 
  const handlePlayerPress = () => {
    if (countdown > 0) return; 

    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; 

    if (lastTap.current && now - lastTap.current < DOUBLE_TAP_DELAY) {
     
      setCountdown(20);
    } else {
      lastTap.current = now;
    }
  };

  const finalBgColor = bgColor || theme.colors.surface;
  const finalBorderColor = borderColor || theme.colors.border;
  

  const finalTextColor = textColor || (
    finalBgColor !== 'white' && finalBgColor !== '#FFFFFF' && finalBgColor !== theme.colors.surface
      ? '#FFFFFF' 
      : theme.colors.textPrimary
  );

  const isTimerRunning = countdown > 0;

  return (
    <TouchableOpacity
      activeOpacity={isTimerRunning ? 0.5 : 0.7}
      disabled={isTimerRunning} 
      onPress={handlePlayerPress}
      style={{
        width: 70,
        height: 70,
        borderRadius: 35, 
        borderWidth: 2,   
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: finalBgColor,   
        borderColor: finalBorderColor,   
        opacity: isTimerRunning ? 0.4 : 1.0,
      }}
    >
      <Text 
        style={{ 
          fontSize: isTimerRunning ? 18 : 22, 
          fontWeight: '600', 
          color: finalTextColor,
          fontFamily: theme.typography.fontFamily,
          lineHeight: isTimerRunning ? 20 : undefined,
        }}
      >
        {number}
      </Text>

     
      {isTimerRunning && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: 'bold',
            color: finalTextColor,
            fontFamily: theme.typography.fontFamily,
            marginTop: -2,
          }}
        >
          {countdown}s
        </Text>
      )}
    </TouchableOpacity>
  );
}
