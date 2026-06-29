import React from 'react';
import { View, Text, Modal } from 'react-native';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

interface PenaltyRequestModalProps {
  isVisible: boolean;
  onConfirm: () => void; // Starts new penalty round
  onClose: () => void;   // Closes
  whiteTeamName: string;
  blueTeamName: string;
}

export default function PenaltyRequestModal({ isVisible, onConfirm, onClose, whiteTeamName, blueTeamName }: PenaltyRequestModalProps) {
  return (
    <Modal transparent visible={isVisible} animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        {/* Keep the same width/style as your QuarterConfirmationModal */}
        <Card variant="elevated" style={{ width: '100%', maxWidth: 400, padding: 20 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 }}>Shootout Tied</Text>
          <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 20 }}>
            The score is still tied. Would you like to continue to the next round of penalties?
          </Text>
          <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
            <Button title="No" variant="outline" onPress={onClose} />
            <Button title="Yes, Continue" variant="primary" onPress={onConfirm} />
          </View>
        </Card>
      </View>
    </Modal>
  );
}