// MobileRemote.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function MobileRemote() {
  const [isRunning, setIsRunning] = useState(false);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // ⚠️ CRITICAL: Replace '111.111.1.111' with your Laptop's actual local Wi-Fi IPv4 address
  // Inside MobileRemote.tsx
const LAPTOP_LAN_IP = '192.168.0.102';

  useEffect(() => {
    const connectRemoteHub = () => {
      const ws = new WebSocket(`ws://${LAPTOP_LAN_IP}:8080`);
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        setConnected(false);
        setTimeout(connectRemoteHub, 3000); // Auto reconnect loop
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'CLOCK_UPDATE' || data.type === 'SYNC_STATE') {
          setIsRunning(data.isRunning);
        }
      };
    };

    connectRemoteHub();
    return () => wsRef.current?.close();
  }, []);

  const handlePressToggle = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'TOGGLE_CLOCK', isRunning: !isRunning }));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ color: '#aaaaaa', fontSize: 14, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
        Waterpolo Clock Controller
      </Text>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 60, gap: 8 }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: connected ? '#4caf50' : '#f44336' }} />
        <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold' }}>
          {connected ? "CONNECTED TO LAPTOP" : "SEARCHING FOR LAPTOP HUB..."}
        </Text>
      </View>

      {!connected ? (
        <ActivityIndicator size="large" color="#2196f3" />
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePressToggle}
          style={{
            width: 240,
            height: 240,
            borderRadius: 120,
            backgroundColor: isRunning ? '#d32f2f' : '#388e3c',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
          }}
        >
          <Text style={{ color: '#ffffff', fontSize: 32, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 }}>
            {isRunning ? "PAUSE" : "PLAY"}
          </Text>
        </TouchableOpacity>
      )}
      
      <Text style={{ color: '#666666', fontSize: 11, textAlign: 'center', marginTop: 40, paddingHorizontal: 20 }}>
        Ensure this mobile phone is connected to the exact same Wi-Fi router network interface as the laptop scorer.
      </Text>
    </View>
  );
}