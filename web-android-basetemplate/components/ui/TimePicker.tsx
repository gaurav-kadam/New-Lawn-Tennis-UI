import DateTimePicker from '@react-native-community/datetimepicker';
import { useRef, useState } from 'react';

import {
    Platform,
    Pressable,
    Text,
    View,
} from 'react-native';

import { useTheme } from '../../theme/themeContext';

interface Props {
  label?: string;
  value?: string;
  onChange: (time: string) => void;
  placeholder?: string;
  error?: string;
}

export default function TimePicker({
  label,
  value,
  onChange,
  placeholder = 'Select Time',
  error,
}: Props) {
  const theme = useTheme();
  const [show, setShow] = useState(false);
  const webInputRef = useRef<HTMLInputElement | null>(null);

  const getPickerDate = () => {
    const date = new Date();

    if (value) {
      const [hours, minutes] = value.split(':');
      date.setHours(Number(hours));
      date.setMinutes(Number(minutes));
      date.setSeconds(0);
    }

    return date;
  };

  return (
    <View style={{ marginBottom: theme.spacing.md, width: '100%' }}>
      {label && (
        <Text style={{ marginBottom: 6, color: theme.colors.textPrimary }}>
          {label}
        </Text>
      )}

      {Platform.OS === 'web' ? (
        <View style={{ position: 'relative' }}>
          {/* @ts-ignore web only */}
          <input
            ref={webInputRef}
            type="time"
            value={value || ''}
            onChange={(e: any) => onChange(e.target.value)}
            style={{
              position: 'absolute',
              opacity: 0,
              width: 1,
              height: 1,
              pointerEvents: 'none',
            }}
          />

          <Pressable
            onPress={() => {
              webInputRef.current?.showPicker?.();
              webInputRef.current?.click();
            }}
            style={{
              minHeight: 48,
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: error
                ? theme.colors.error
                : theme.colors.border,
              borderRadius: theme.radius.md,
              paddingHorizontal: theme.spacing.md,
              backgroundColor: theme.colors.surface,
            }}
          >
            <Text
              style={{
                color: value
                  ? theme.colors.textPrimary
                  : theme.colors.textSecondary,
              }}
            >
              {value || placeholder}
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          <Pressable
            onPress={() => setShow(true)}
            style={{
              minHeight: 48,
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: error ? theme.colors.error : theme.colors.border,
              borderRadius: theme.radius.md,
              paddingHorizontal: theme.spacing.md,
              backgroundColor: theme.colors.surface,
            }}
          >
            <Text
              style={{
                color: value
                  ? theme.colors.textPrimary
                  : theme.colors.textSecondary,
              }}
            >
              {value || placeholder}
            </Text>
          </Pressable>

          {show && (
            <DateTimePicker
              value={getPickerDate()}
              mode="time"
              display="default"
              onChange={(_, selectedTime) => {
                setShow(false);

                if (!selectedTime) return;

                const hours = String(selectedTime.getHours()).padStart(2, '0');
                const minutes = String(selectedTime.getMinutes()).padStart(
                  2,
                  '0'
                );

                onChange(`${hours}:${minutes}`);
              }}
            />
          )}
        </>
      )}

      {error && (
        <Text style={{ marginTop: 4, color: theme.colors.error, fontSize: 12 }}>
          {error}
        </Text>
      )}
    </View>
  );
}