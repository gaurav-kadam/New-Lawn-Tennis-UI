import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
  vertical?: boolean;
  horizontal?: boolean;
}

export default function MatchDivider({
  vertical,
  horizontal,
}: Props) {

  if (horizontal) {
    return <View style={styles.horizontal} />;
  }

  return <View style={styles.vertical} />;
}

const styles = StyleSheet.create({

  vertical: {
    width: 4,
    backgroundColor: '#E2E8F0',
  },

  horizontal: {
    height: 4,
    backgroundColor: '#E2E8F0',
  },

});