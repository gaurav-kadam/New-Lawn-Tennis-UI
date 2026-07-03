// import DateTimePicker from '@react-native-community/datetimepicker';
// import { useState } from 'react';

// import {
//   Platform,
//   Pressable,
//   Text,
//   View,
// } from 'react-native';

// import ReactDatePicker from 'react-datepicker';

// import { useTheme } from '../../theme/themeContext';

// interface Props {
//   label?: string;
//   value?: Date;
//   onChange: (date: Date) => void;
//   placeholder?: string;
//   error?: string;
// }

// export default function DatePicker({
//   label,
//   value,
//   onChange,
//   placeholder = 'Select Date',
//   error,
// }: Props) {

//   const theme = useTheme();

//   const [show, setShow] = useState(false);

//   return (
//     <View style={{ marginBottom: theme.spacing.md }}>

//       {/* LABEL */}
//       {label && (
//         <Text
//           style={{
//             marginBottom: 6,
//             color: theme.colors.textPrimary,
//           }}
//         >
//           {label}
//         </Text>
//       )}

//       {/* ================= WEB ================= */}
//       {Platform.OS === 'web' ? (

//         <ReactDatePicker
//           selected={value}
//           onChange={(date: Date | null) => {
//             if (date) {
//               onChange(date);
//             }
//           }}
//           placeholderText={placeholder}
//           dateFormat="dd/MM/yyyy"
//           customInput={
//             <Pressable
//               style={{
//                 borderWidth: 1,
//                 borderColor: error
//                   ? theme.colors.error
//                   : theme.colors.border,
//                 borderRadius: theme.radius.md,
//                 padding: theme.spacing.md,
//                 backgroundColor: theme.colors.surface,
//               }}
//             >
//               <Text
//                 style={{
//                   color: value
//                     ? theme.colors.textPrimary
//                     : theme.colors.textSecondary,
//                 }}
//               >
//                 {value
//                   ? value.toLocaleDateString()
//                   : placeholder}
//               </Text>
//             </Pressable>
//           }
//         />

//       ) : (

//         <>
//           {/* ================= MOBILE ================= */}
//           <Pressable
//             onPress={() => setShow(true)}
//             style={{
//               borderWidth: 1,
//               borderColor: error
//                 ? theme.colors.error
//                 : theme.colors.border,
//               borderRadius: theme.radius.md,
//               padding: theme.spacing.md,
//               backgroundColor: theme.colors.surface,
//             }}
//           >
//             <Text
//               style={{
//                 color: value
//                   ? theme.colors.textPrimary
//                   : theme.colors.textSecondary,
//               }}
//             >
//               {value
//                 ? value.toLocaleDateString()
//                 : placeholder}
//             </Text>
//           </Pressable>

//           {show && (
//             <DateTimePicker
//               value={value || new Date()}
//               mode="date"
//               display="default"
//               onChange={(_, selectedDate) => {

//                 setShow(false);

//                 if (selectedDate) {
//                   onChange(selectedDate);
//                 }
//               }}
//             />
//           )}
//         </>
//       )}

//       {/* ERROR */}
//       {error && (
//         <Text
//           style={{
//             marginTop: 4,
//             color: theme.colors.error,
//             fontSize: 12,
//           }}
//         >
//           {error}
//         </Text>
//       )}
//     </View>
//   );
// }

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
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  error?: string;
}

const toInputValue = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const toDisplayValue = (d: Date): string =>
  d.toLocaleDateString('en-GB'); // DD/MM/YYYY

export default function DatePicker({
  label,
  value,
  onChange,
  placeholder = 'Select Date',
  error,
}: Props) {
  const theme = useTheme();
  const [show, setShow] = useState(false);
  const webInputRef = useRef<HTMLInputElement | null>(null);

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
            type="date"
            value={value ? toInputValue(value) : ''}
            onChange={(e: any) => {
              const val = e.target.value;
              if (val) {
                const [y, mo, d] = val.split('-').map(Number);
                onChange(new Date(y, mo - 1, d));
              }
            }}
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
              {value ? toDisplayValue(value) : placeholder}
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
              {value ? toDisplayValue(value) : placeholder}
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

      {error && (
        <Text style={{ marginTop: 4, color: theme.colors.error, fontSize: 12 }}>
          {error}
        </Text>
      )}
    </View>
  );
}