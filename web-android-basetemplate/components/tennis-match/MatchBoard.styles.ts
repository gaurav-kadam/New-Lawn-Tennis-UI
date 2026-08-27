import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 6,
    minHeight: 0,
    padding: 10,
  },

  upperMatchArea: {
    flex: 2.65,

    minHeight: 0,

    flexDirection: 'row',

    gap: 8,
  },

  matchMainColumn: {
    flex: 1,

    minWidth: 0,
    minHeight: 0,

    gap: 6,
  },
  
  courtRow: {
    flex: 1,

    minWidth: 0,
    minHeight: 0,

    flexDirection: 'row',
  },

  courtContainer: {
    flex: 1,

    minWidth: 0,
    minHeight: 0,
  },

  upperMatchAreaCompact: {
    flexDirection: 'column',
  },
});