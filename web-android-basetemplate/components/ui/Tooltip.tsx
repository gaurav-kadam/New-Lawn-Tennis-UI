import React, { useState, useRef } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useTheme } from '@/theme/themeContext';


type Props = {
  label: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom';
};

export default function Tooltip({ label, children, placement = 'bottom' }: Props) {
  const theme = useTheme();
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const wrapperRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (Platform.OS === 'web') {
    const ReactDOM = require('react-dom');

    const handleMouseEnter = () => {
      timerRef.current = setTimeout(() => {
        if (wrapperRef.current) {
          const rect = wrapperRef.current.getBoundingClientRect();
          setPos({
            top: placement === 'bottom' ? rect.bottom + 6 : rect.top - 30,
            left: rect.left + rect.width / 2,
          });
        }
      }, 1000);
    };

    const handleMouseLeave = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPos(null);
    };

    const tooltipEl = pos
      ? ReactDOM.createPortal(
          <div
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left,
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(22, 21, 21, 0.9)',
              color: '#fff',
              borderRadius: 5,
              padding: '4px 10px',
              fontSize: 10,
              fontWeight: 500,
              whiteSpace: 'nowrap',
              zIndex: 999999,
              pointerEvents: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            }}
          >
            {label}
          </div>,
          document.body
        )
      : null;

    return (
      <>
        <div
          ref={wrapperRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ display: 'inline-flex' }}
        >
          {children}
        </div>
        {tooltipEl}
      </>
    );
  }

  // Native fallback — long-press to show
  const [nativeVisible, setNativeVisible] = useState(false);
  return (
    <Pressable
      onLongPress={() => setNativeVisible(true)}
      onPressOut={() => setNativeVisible(false)}
      style={{ position: 'relative' }}
    >
      {children}
      {nativeVisible && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: '110%',
            left: 0,
            backgroundColor: 'rgba(30,30,30,0.9)',
            borderRadius: 5,
            paddingHorizontal: 8,
            paddingVertical: 4,
            zIndex: 9999,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600', fontFamily: theme.typography.fontFamily }}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
