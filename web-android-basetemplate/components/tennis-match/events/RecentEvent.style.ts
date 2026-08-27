import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: 285,
    minWidth: 260,
    maxWidth: 320,
    height: '100%',
    minHeight: 0,
    backgroundColor: '#111827',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },

  containerCompact: {
    width: '100%',
    maxWidth: undefined,
    height: 210,
    minHeight: 210,
  },

  header: {
    height: 42,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  headerCount: {
    color: '#A7A0FF',
    fontSize: 10,
    fontWeight: '800',
  },

  list: {
    flex: 1,
  },

  listContent: {
    paddingVertical: 2,
  },

  eventRow: {
    minHeight: 57,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#202B3B',
  },

  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  eventContent: {
    flex: 1,
    minWidth: 0,
  },

  eventTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  eventPlayer: {
    color: '#8D98AA',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3,
  },

  eventTime: {
    color: '#7F8A9D',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 7,
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    gap: 5,
  },

  emptyTitle: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '800',
  },

  emptyText: {
    color: '#64748B',
    fontSize: 11,
    lineHeight: 13,
    textAlign: 'center',
  },
});
