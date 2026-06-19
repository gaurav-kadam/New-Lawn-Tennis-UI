import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as SvgLib from "react-native-svg";

import { useTheme } from "@/theme/themeContext";

const Svg = SvgLib.default;
const Circle = SvgLib.Circle;

type Props = {
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  onToggle: () => void;
};

export default function CircularTimer({
  timeLeft,
  totalTime,
  isRunning,
  onToggle,
}: Props) {
  const theme = useTheme();

  const size = 100;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const safeTotalTime = totalTime || 180;
  const progress = Math.max(0, Math.min(1, timeLeft / safeTotalTime));

  const strokeDashoffset = circumference - circumference * progress;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime =
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0");

  return (
    <Pressable onPress={onToggle} style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          stroke={theme.colors.border}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        <Circle
          stroke={theme.colors.primary}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>

      <View style={styles.content}>
        <Text style={[styles.time, { color: theme.colors.textPrimary }]}>
          {formattedTime}
        </Text>

        <Text style={[styles.status, { color: theme.colors.textSecondary }]}>
          {timeLeft === 0 ? "TIME UP" : isRunning ? "RUNNING" : "PAUSED"}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  time: {
    fontSize: 20,
    fontWeight: "700",
  },
  status: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "700",
  },
});