import { type PropsWithChildren, useMemo } from 'react';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';

import { useTheme } from '@/theme/themeContext';

export default function TennisPaperProvider({ children }: PropsWithChildren) {
  const theme = useTheme();
  const paperTheme = useMemo(() => ({
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      surface: theme.colors.surface,
      onSurface: theme.colors.textPrimary,
      onSurfaceVariant: theme.colors.textSecondary,
      outline: theme.colors.border,
      error: theme.colors.error,
    },
  }), [theme]);

  return <PaperProvider theme={paperTheme}>{children}</PaperProvider>;
}
