import { Animated, ScrollView } from 'react-native';

export default function Content({ children, marginLeft, theme }: any) {
  return (
    <Animated.View
      style={{
        flex: 1,
        marginLeft,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing.md,
          backgroundColor: theme.colors.background,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </Animated.View>
  );
}