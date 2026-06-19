// theme/theme.ts

import { tokens } from './token';

export const theme = {
  ...tokens,

  // derived values (powerful concept)
  button: {
    background: tokens.colors.primary,
    text: '#FFFFFF',
    radius: tokens.radius.md,
  },

  card: {
    background: tokens.colors.surface,
    padding: tokens.spacing.md,
    radius: tokens.radius.lg,
  },
};