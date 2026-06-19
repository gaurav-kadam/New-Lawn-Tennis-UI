
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/themeContext';

export default function FieldArea({ side }: { side: 'left' | 'right' }) {
  const theme = useTheme();
  const isLeft = side === 'left';

  const fieldBackground = '#90b5fa'; 

  return (
    <View 
      style={[
        styles.container, 
        { 
          flexDirection: isLeft ? 'row' : 'row-reverse',
          backgroundColor: fieldBackground,
        }
      ]}
    >
      {/* OUTER SIDE PART (25%) */}
      <View style={[{ flex: 0.25 },{backgroundColor: theme.colors.region3}]} />

      {/* OUTER LINE */}
      <View style={[styles.verticalLine, { backgroundColor: theme.colors.border }]} />

      {/* MIDDLE PART (25%) */}
      <View style={[{ flex: 0.25 },{backgroundColor: theme.colors.region2}]} />

      {/* CENTER LINE */}
      <View style={[styles.verticalLine, { backgroundColor: theme.colors.region1 }]} />

      {/* INSIDE BIGGER PART (50%) */}
      <View style={[{ flex: 0.5 },{backgroundColor: theme.colors.region1}]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  verticalLine: {
    width: 1,
    height: '100%',
  },
});
