import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '../../theme/themeContext';

export type NotifType = 'success' | 'error' | 'confirm';

interface NotificationModalProps {
  visible: boolean;
  type: NotifType;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function NotificationModal({
  visible,
  type,
  title,
  message,
  onClose,
  onConfirm,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
}: NotificationModalProps) {
  const theme = useTheme();

  const SUCCESS_COLOR = '#22c55e';
  const ERROR_COLOR   = theme.colors.error || '#ef4444';
  const WARN_COLOR    = '#f59e0b';

  const iconSize = 64;

  const Icon = () => {
    if (type === 'success') return <CheckCircle size={iconSize} color={SUCCESS_COLOR} strokeWidth={1.8} />;
    if (type === 'error')   return <XCircle     size={iconSize} color={ERROR_COLOR}   strokeWidth={1.8} />;
    return                         <AlertTriangle size={iconSize} color={WARN_COLOR}  strokeWidth={1.8} />;
  };

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}>
        <View style={{
          backgroundColor: theme.colors.surface || '#ffffff',
          borderRadius: 16,
          paddingVertical: 36,
          paddingHorizontal: 28,
          width: '100%',
          maxWidth: 380,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
        }}>
          {/* Icon */}
          <View style={{ marginBottom: 20 }}>
            <Icon />
          </View>

          {/* Title */}
          <Text style={{
            fontSize: 20,
            fontWeight: '700',
            color: theme.colors.textPrimary || '#111827',
            marginBottom: 8,
            textAlign: 'center',
            fontFamily: theme.typography?.fontFamily,
          }}>
            {title}
          </Text>

          {/* Message */}
          <Text style={{
            fontSize: 14,
            color: theme.colors.textSecondary || '#6b7280',
            textAlign: 'center',
            marginBottom: 28,
            lineHeight: 21,
            fontFamily: theme.typography?.fontFamily,
          }}>
            {message}
          </Text>

          {/* Buttons */}
          {type === 'confirm' ? (
            <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  flex: 1,
                  paddingVertical: 13,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: theme.colors.border || '#d1d5db',
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  color: theme.colors.textPrimary || '#374151',
                  fontWeight: '600',
                  fontSize: 15,
                  fontFamily: theme.typography?.fontFamily,
                }}>
                  {cancelLabel}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirm}
                style={{
                  flex: 1,
                  paddingVertical: 13,
                  borderRadius: 8,
                  backgroundColor: ERROR_COLOR,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: 15,
                  fontFamily: theme.typography?.fontFamily,
                }}>
                  {confirmLabel}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: '100%',
                paddingVertical: 14,
                borderRadius: 8,
                backgroundColor: theme.colors.primary || '#4f46e5',
                alignItems: 'center',
              }}
            >
              <Text style={{
                color: '#ffffff',
                fontWeight: '700',
                fontSize: 15,
                fontFamily: theme.typography?.fontFamily,
              }}>
                OK
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}
