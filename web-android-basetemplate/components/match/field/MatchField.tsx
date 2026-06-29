import React, { useState } from 'react';
import { View, Pressable, Platform } from 'react-native';
import { useTheme } from '../../../theme/themeContext';
import { tokens } from '../../../theme/token'; 

export default function MatchField({ side }: { side?: 'left' | 'right' }) {
  const theme = useTheme();

  // Store multiple tracking dots
  const [dots, setDots] = useState<{ x: number; y: number }[]>([]);

  const DOT_SIZE = tokens.typography.sizes.inputMini; 
  const GOAL_HEIGHT = 120; // Structural sport dimensions kept separate from design tokens
  const GOAL_WIDTH = 38;   

  const regions =
    side === 'right'
      ? [
          { color: theme.colors.matchScreen.courtColor.region1, flex: 3 },
          { color: theme.colors.matchScreen.courtColor.region2, flex: 2 },
          { color: theme.colors.matchScreen.courtColor.region3, flex: 1 },
        ]
      : [
          { color: theme.colors.matchScreen.courtColor.region3, flex: 1 },
          { color: theme.colors.matchScreen.courtColor.region2, flex: 2 },
          { color: theme.colors.matchScreen.courtColor.region1, flex: 3 },
        ];

  const handleTouch = (event: any) => {
    let localX = 0;
    let localY = 0;

    if (Platform.OS === 'web') {
      const nativeEvent = event.nativeEvent;
      if (nativeEvent.offsetX !== undefined && nativeEvent.offsetY !== undefined) {
        localX = nativeEvent.offsetX;
        localY = nativeEvent.offsetY;
      }
    } else {
      const { locationX, locationY } = event.nativeEvent;
      localX = locationX;
      localY = locationY;
    }

    setDots((prevDots) => [...prevDots, { x: localX, y: localY }]);
  };

  return (
    <Pressable 
      {...(Platform.OS === 'web' ? { onPointerDown: handleTouch } : { onPressIn: handleTouch })}
      style={{ flex: tokens.layout.flexFull + 3, flexDirection: 'row', position: 'relative' }}
    >
      {/* Background Court Regions */}
      {regions.map((r, i) => (
        <View
          key={i}
          pointerEvents="none" 
          style={{
            backgroundColor: r.color,
            flex: r.flex,
          }}
        />
      ))}

      {/* ========================================================= */}
      {/* 3D EDGE GOALPOSTS                                         */}
      {/* ========================================================= */}
      
      {/* LEFT HALF OUTER 3D GOALPOST */}
      {side !== 'right' && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            marginTop: -(GOAL_HEIGHT / 2),
            width: GOAL_WIDTH,
            height: GOAL_HEIGHT,
            backgroundColor: 'transparent',
          }}
        >
          <View style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, height: 4,
            backgroundColor: tokens.colors.textLight,
            transform: [{ skewY: '12deg' }],
          }} />
          
          <View style={{
            position: 'absolute',
            top: 0, bottom: 0, right: 0, width: 4,
            backgroundColor: tokens.colors.textLight,
            borderRadius: tokens.radius.xs / 2,
          }} />

          <View style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0, height: 4,
            backgroundColor: tokens.colors.textLight,
            transform: [{ skewY: '-12deg' }],
          }} />

          <View style={{
            position: 'absolute',
            top: 3, bottom: 3, left: 0, right: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRightWidth: tokens.layout.dividerHeight,
            borderRightColor: 'rgba(255,255,255,0.4)',
            borderStyle: 'dashed',
          }} />
        </View>
      )}

      {/* RIGHT HALF OUTER 3D GOALPOST */}
      {side === 'right' && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            marginTop: -(GOAL_HEIGHT / 2),
            width: GOAL_WIDTH,
            height: GOAL_HEIGHT,
            backgroundColor: 'transparent',
          }}
        >
          <View style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, height: 4,
            backgroundColor: tokens.colors.textLight,
            transform: [{ skewY: '-12deg' }],
          }} />
          
          <View style={{
            position: 'absolute',
            top: 0, bottom: 0, left: 0, width: 4,
            backgroundColor: tokens.colors.textLight,
            borderRadius: tokens.radius.xs / 2,
          }} />

          <View style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0, height: 4,
            backgroundColor: tokens.colors.textLight,
            transform: [{ skewY: '12deg' }],
          }} />

          <View style={{
            position: 'absolute',
            top: 3, bottom: 3, left: 3, right: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderLeftWidth: tokens.layout.dividerHeight,
            borderLeftColor: 'rgba(255,255,255,0.4)',
            borderStyle: 'dashed',
          }} />
        </View>
      )}

      {/* ========================================================= */}

      {/* Render heat map tracking dots */}
      {dots.map((dot, index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            left: dot.x - DOT_SIZE / 2, 
            top: dot.y - DOT_SIZE / 2,  
            width: DOT_SIZE,
            height: DOT_SIZE,
            borderRadius: tokens.radius.round,
            backgroundColor: tokens.colors.overlay,       
            borderWidth: 2,
            borderColor: tokens.colors.textLight,          
            ...tokens.shadow.medium,
          }}
        />
      ))}
    </Pressable>
  );
}