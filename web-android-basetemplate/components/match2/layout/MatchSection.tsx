import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
  children: React.ReactNode;
  center?: boolean;
}

export default function MatchSection({
  children,
  center = false,
}: Props) {

  return (
    <View
      style={[
        styles.container,

        center && styles.centerContainer,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
  },

  centerContainer: {
    flex: 0,
  },

});