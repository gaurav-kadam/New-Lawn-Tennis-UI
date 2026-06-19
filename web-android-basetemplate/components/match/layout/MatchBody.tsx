import React from 'react';
import { View, Text } from 'react-native';
import MatchSidePanel from '../side-panel/MatchSidePanel';
import PlayerNo from '../side-panel/playerno'; 
import MatchField from '../field/MatchField';
import { useTheme } from '@/theme/themeContext';
import Button from '@/components/ui/Button';

export default function MatchBody() {
  const scoreButtonsA = ['1', '2', '3', '4','5','6','7','8'];
  const scoreButtonsB = ['1', '2', '3', '4','5', '6', '7', '8'];
  
  const theme = useTheme();
  return (
    <View style={{
      flexDirection: 'row',
      flex: 1,
      width: '100%',
    }}>

      {/* ================================================================= */}
      {/* LEFT COLUMN SYSTEM (TEAM A) */}
      {/* ================================================================= */}
      <View style={{
        flex: 1,
        flexDirection: 'column', 
      }}>
        {/* Lower Row Controls */}
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {/* Outer edge */}
          <PlayerNo side="left" />

          {/* Middle edge */}
          <MatchSidePanel side="left" />

          {/* Inner edge */}
          <MatchField side="left" />
        </View>
      </View>

      {/* ================================================================= */}
      {/* CENTER GRID SECTION */}
      {/* ================================================================= */}
      {/* <View style={{
        width: 150,
        backgroundColor: theme.colors.surface,
      }} >
        <View
          style={{
            flex: 4,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            paddingHorizontal: 12,
            backgroundColor: theme.colors.matchScreen.headerColor,
          }}
        > */}
          {/* LEFT COLUMN */}
          {/* <View style={{ gap: 12 }}>
            {scoreButtonsA.map((item) => (
              <View key={`left-${item}`} style={{ borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  title={item}
                  size="sm"
                  variant="outline"
                  textColor="#FFFFFF"
                  borderColor="#FFFFFF"
                  style={{ width: '100%' }}
                />
              </View>
            ))}
          </View> */}

          {/* SEPARATOR */}
          <View style={{ width: 1, alignSelf: 'stretch', backgroundColor: '#FFFFFF30', marginHorizontal: 0 }} />
          

          {/* RIGHT COLUMN */}
          {/* <View style={{ gap: 12 }}>
            {scoreButtonsB.map((item) => (
              <View key={`right-${item}`} style={{ borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  title={item}
                  variant="outline"
                  textColor="#FFFFFF"
                  borderColor="#FFFFFF"
                  size="sm"
                  style={{ width: '100%' }}
                />
              </View>
            ))}
          </View>
        </View>
      </View> */}

      {/* ================================================================= */}
      {/* RIGHT COLUMN SYSTEM (TEAM B) */}
      {/* ================================================================= */}
      <View style={{
        flex: 1,
        flexDirection: 'column', 
      }}>
        {/* Lower Row Controls */}
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {/* Inner edge */}
          <MatchField side="right" />

          {/* Middle edge */}
          <MatchSidePanel side="right" />

          {/* Outer edge */}
          <PlayerNo side="right" />
        </View>
      </View>


    </View>
  );
}