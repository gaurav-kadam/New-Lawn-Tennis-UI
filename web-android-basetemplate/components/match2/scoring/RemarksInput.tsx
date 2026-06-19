import { TextInput, TextStyle, View } from 'react-native';

import Button from '@/components/ui/Button';
import { useTheme } from '@/theme/themeContext';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  canSave: boolean;
  onSave: () => void;
};

export default function RemarksInput({
  value,
  onChangeText,
  canSave,
  onSave,
}: Props) {
  const theme = useTheme();

  const inputStyle: TextStyle = {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.body,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.surface,
    fontFamily: theme.typography.fontFamily,
    flex: 1,
    minHeight: theme.spacing.xl * 2,
    textAlignVertical: 'top',
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: theme.spacing.sm,
        alignItems: 'stretch',
      }}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Write remark..."
        placeholderTextColor={theme.colors.textSecondary}
        multiline
        style={inputStyle}
      />

      <Button
        title="SAVE EVENT"
        variant="primary"
        disabled={!canSave}
        onPress={onSave}
      />
    </View>
  );
}