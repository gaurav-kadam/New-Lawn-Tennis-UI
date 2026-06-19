import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';

import {
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';

import ReactDatePicker from 'react-datepicker';

import { useTheme } from '../../theme/themeContext';

interface Props {
  label?: string;
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  error?: string;
}

export default function DatePicker({
  label,
  value,
  onChange,
  placeholder = 'Select Date',
  error,
}: Props) {

  const theme = useTheme();

  const [show, setShow] = useState(false);

  return (
    <View style={{ marginBottom: theme.spacing.md }}>

      {/* LABEL */}
      {label && (
        <Text
          style={{
            marginBottom: 6,
            color: theme.colors.textPrimary,
          }}
        >
          {label}
        </Text>
      )}

      {/* ================= WEB ================= */}
      {Platform.OS === 'web' ? (

        <ReactDatePicker
          selected={value}
          onChange={(date: Date | null) => {
            if (date) {
              onChange(date);
            }
          }}
          placeholderText={placeholder}
          dateFormat="dd/MM/yyyy"
          customInput={
            <Pressable
              style={{
                borderWidth: 1,
                borderColor: error
                  ? theme.colors.error
                  : theme.colors.border,
                borderRadius: theme.radius.md,
                padding: theme.spacing.md,
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
                {value
                  ? value.toLocaleDateString()
                  : placeholder}
              </Text>
            </Pressable>
          }
        />

      ) : (

        <>
          {/* ================= MOBILE ================= */}
          <Pressable
            onPress={() => setShow(true)}
            style={{
              borderWidth: 1,
              borderColor: error
                ? theme.colors.error
                : theme.colors.border,
              borderRadius: theme.radius.md,
              padding: theme.spacing.md,
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
              {value
                ? value.toLocaleDateString()
                : placeholder}
            </Text>
          </Pressable>

          {show && (
            <DateTimePicker
              value={value || new Date()}
              mode="date"
              display="default"
              onChange={(_, selectedDate) => {

                setShow(false);

                if (selectedDate) {
                  onChange(selectedDate);
                }
              }}
            />
          )}
        </>
      )}

      {/* ERROR */}
      {error && (
        <Text
          style={{
            marginTop: 4,
            color: theme.colors.error,
            fontSize: 12,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}