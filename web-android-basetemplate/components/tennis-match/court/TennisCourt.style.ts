import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    flex: 1,
    minHeight: 0,
    backgroundColor: '#0F172A',
    paddingHorizontal: '5%',
    paddingVertical: 10,
  },

  // stage: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   transform: [{ perspective: 900 }, { rotateX: '7deg' }],
  // },
  stage: {
  flex: 1,
  justifyContent: 'center',
  },

  // shadowPlane: {
  //   position: 'absolute',
  //   left: '4%',
  //   right: '2%',
  //   bottom: '3%',
  //   height: '14%',
  //   backgroundColor: 'rgba(15, 23, 42, 0.35)',
  //   transform: [{ skewX: '-18deg' }],
  // },

  // outerCourt: {
  //   flex: 1,
  //   maxHeight: '92%',
  //   alignSelf: 'stretch',
  //   backgroundColor: '#1F6B45',
  //   borderWidth: 0,
  //   shadowColor: '#000000',
  //   shadowOpacity: 0.25,
  //   shadowRadius: 12,
  //   shadowOffset: { width: 0, height: 8 },
  // },

  outerCourt: {
  flex: 1,
  maxHeight: '92%',
  alignSelf: 'stretch',
  backgroundColor: '#1F6B45',

  // Keep the dark/black outer frame visible
  borderWidth: 3,
  borderColor: '#0F172A',

  overflow: 'hidden',
  },
  
  grassStripeA: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '33.33%',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },

  grassStripeB: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '33.33%',
    height: '33.33%',
    backgroundColor: 'rgba(0,0,0,0.08)',
  },

  grassStripeC: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '33.33%',
    backgroundColor: 'rgba(255,255,255,0.035)',
  },

  baselineLeft: {
    position: 'absolute',
    left: '2%',
    top: '6%',
    bottom: '6%',
    width: 3,
    backgroundColor: '#FFFFFF',
  },

  baselineRight: {
    position: 'absolute',
    right: '2%',
    top: '6%',
    bottom: '6%',
    width: 3,
    backgroundColor: '#FFFFFF',
  },

  doublesTopLine: {
    position: 'absolute',
    left: '2%',
    right: '2%',
    top: '6%',
    height: 3,
    backgroundColor: '#FFFFFF',
  },

  doublesBottomLine: {
    position: 'absolute',
    left: '2%',
    right: '2%',
    bottom: '6%',
    height: 3,
    backgroundColor: '#FFFFFF',
  },

  singlesTopLine: {
    position: 'absolute',
    left: '2%',
    right: '2%',
    top: '22%',
    height: 2,
    backgroundColor: '#FFFFFF',
  },

  singlesBottomLine: {
    position: 'absolute',
    left: '2%',
    right: '2%',
    bottom: '22%',
    height: 2,
    backgroundColor: '#FFFFFF',
  },

  serviceLineLeft: {
    position: 'absolute',
    left: '31%',                       
    top: '22%',
    bottom: '22%',
    width: 2,
    backgroundColor: '#FFFFFF',
  },

  serviceLineRight: {
    position: 'absolute',
    right: '31%',
    top: '22%',
    bottom: '22%',
    width: 2,
    backgroundColor: '#FFFFFF',
  },

  centerServiceLine: {
    position: 'absolute',
    left: '31%',
    right: '31%',
    top: '50%',
    height: 2,
    backgroundColor: '#FFFFFF',
  },

  leftCenterMark: {
    position: 'absolute',
    left: '2%',
    top: '50%',
    width: 14,
    height: 2,
    marginTop: -1,
    backgroundColor: '#FFFFFF',
  },

  rightCenterMark: {
    position: 'absolute',
    right: '2%',
    top: '50%',
    width: 14,
    height: 2,
    marginTop: -1,
    backgroundColor: '#FFFFFF',
  },

  netLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 4,
    marginLeft: -2,
    backgroundColor: '#F5F5F5',
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 1, height: 0 },
  },
  overlayLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  trackingPoint: {
    position: 'absolute',
    width: 12,
    height: 12,
    marginLeft: -6,
    marginTop: -6,
    borderRadius: 999,
    backgroundColor: 'rgba(250, 204, 21, 0.85)',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
