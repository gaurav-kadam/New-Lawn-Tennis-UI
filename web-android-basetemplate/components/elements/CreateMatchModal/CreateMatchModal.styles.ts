import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    backgroundColor: 'rgba(0,0,0,0.45)',

    padding: 20,
  },

  container: {
    paddingHorizontal: 16,

    paddingVertical: 16,
  },

  header: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'flex-start',

    marginBottom: 10,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 22,

    fontWeight: '700',
  },

  subtitle: {
    marginTop: 3,

    fontSize: 12,
  },

  closeButton: {
    padding: 4,
  },

  closeText: {
    fontSize: 20,
  },

  progressRow: {
    flexDirection: 'row',

    gap: 8,

    marginBottom: 16,
  },

  progressItem: {
    flex: 1,
  },

  progressBar: {
    height: 4,

    borderRadius: 2,
  },

  progressLabel: {
    marginTop: 4,

    fontSize: 9,

    textAlign: 'center',
  },

  scroll: {
    maxHeight: 430,
  },

  scrollContent: {
    paddingBottom: 4,

    gap: 12,
  },

  row: {
    flexDirection: 'row',

    gap: 12,
  },

  column: {
    flexDirection: 'column',
  },

  flex: {
    flex: 1,
  },

  optionBox: {
    padding: 12,

    borderWidth: 1,

    borderColor: '#dbe3ef',

    borderRadius: 10,
  },

  teamBox: {
    padding: 12,

    borderWidth: 1,

    borderColor: '#dbe3ef',

    borderRadius: 10,

    gap: 4,
  },

  teamTitle: {
    fontSize: 15,

    fontWeight: '700',

    marginBottom: 4,
  },

  vs: {
    alignItems: 'center',

    paddingVertical: 2,
  },

  vsText: {
    fontSize: 15,

    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 15,

    fontWeight: '700',

    marginBottom: 2,
  },

  sectionDescription: {
    fontSize: 12,

    marginBottom: 4,
  },

  serverSelection: {
    marginTop: 8,

    padding: 12,

    borderWidth: 1,

    borderColor: '#dbe3ef',

    borderRadius: 10,
  },

  footer: {
    flexDirection: 'row',

    justifyContent: 'flex-end',

    alignItems: 'center',

    gap: 8,

    marginTop: 16,
  },
});

