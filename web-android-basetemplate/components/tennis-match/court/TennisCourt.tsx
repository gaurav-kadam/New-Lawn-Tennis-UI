import React from 'react';
import { View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import { styles } from './TennisCourt.style';
type CourtPoint = {
  id: string;
  x: number;
  y: number;
};

type Props = {
  points?: CourtPoint[];
  onCourtPress?: (position: { x: number; y: number }) => void;
};

export default function TennisCourt({ points = [], onCourtPress }: Props) {
  return (
    <TouchableRipple
      rippleColor="transparent"
      underlayColor="transparent"
      style={styles.container}
      onPress={(event) => {
        if (!onCourtPress) return;
        const { locationX, locationY } = event.nativeEvent;
        onCourtPress({ x: locationX, y: locationY });
      }}
    >
      <View style={styles.stage}>
        {/* <View style={styles.shadowPlane} /> */}
        <View style={styles.outerCourt}>

          <View style={styles.grassStripeA} />
          <View style={styles.grassStripeB} />
          <View style={styles.grassStripeC} />

          <View style={styles.baselineLeft} />
          <View style={styles.baselineRight} />
          <View style={styles.doublesTopLine} />
          <View style={styles.doublesBottomLine} />
          <View style={styles.singlesTopLine} />
          <View style={styles.singlesBottomLine} />
          <View style={styles.serviceLineLeft} />
          <View style={styles.serviceLineRight} />
          <View style={styles.centerServiceLine} />

          <View style={styles.leftCenterMark} />
          <View style={styles.rightCenterMark} />

          <View style={styles.netLine} />

          <View pointerEvents="none" style={styles.overlayLayer}>
            {points.map((point) => (
              <View
                key={point.id}
                style={[
                  styles.trackingPoint,
                  {
                    left: `${point.x}%`,
                    top: `${point.y}%`,
                  },
                ]}
              />
            ))}
          </View>

        </View>
      </View>
    </TouchableRipple>
  );
}

