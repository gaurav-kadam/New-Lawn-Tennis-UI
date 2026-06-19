

import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';

interface LogItem {
  id: string;
  period: string;
  time: string;
  team: 'Light' | 'Dark';
  type: string;
  playerCap: number; 
  assist: string;
}

interface ViewLogModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function ViewLogModal({ isVisible, onClose }: ViewLogModalProps) {
  const [logs, setLogs] = useState<LogItem[]>([
    { id: '1', period: 'Quarter 1', time: '01:14', team: 'Light', type: 'Goal', playerCap: 10, assist: 'Cap 21' },
    { id: '2', period: 'Quarter 1', time: '02:13', team: 'Dark', type: 'Foul', playerCap: 12, assist: '----------' },
    { id: '1', period: 'Quarter 1', time: '01:14', team: 'Light', type: 'Goal', playerCap: 10, assist: 'Cap 21' },
    { id: '1', period: 'Quarter 1', time: '01:14', team: 'Light', type: 'Goal', playerCap: 10, assist: 'Cap 21' },
    { id: '1', period: 'Quarter 1', time: '01:14', team: 'Light', type: 'Goal', playerCap: 10, assist: 'Cap 21' },
    { id: '1', period: 'Quarter 1', time: '01:14', team: 'Light', type: 'Goal', playerCap: 10, assist: 'Cap 21' },
    { id: '1', period: 'Quarter 1', time: '01:14', team: 'Light', type: 'Goal', playerCap: 10, assist: 'Cap 21' },
    { id: '1', period: 'Quarter 1', time: '01:14', team: 'Light', type: 'Goal', playerCap: 10, assist: 'Cap 21' },
    { id: '1', period: 'Quarter 1', time: '01:14', team: 'Light', type: 'Goal', playerCap: 10, assist: 'Cap 21' },
    { id: '1', period: 'Quarter 1', time: '01:14', team: 'Light', type: 'Goal', playerCap: 10, assist: 'Cap 21' },
  ]);

  const handleEditLog = (id: string, item: LogItem) => {
    Alert.prompt("Modify Entry", "Edit match timeline records:", [{ text: "Cancel" }, { text: "Update" }], "plain-text", `${item.type}`);
  };

  const handleDeleteLog = (id: string) => {
    Alert.alert("Delete Record", "Remove this event permanently?", [{ text: "Cancel" }, { text: "Delete", style: "destructive", onPress: () => setLogs(p => p.filter(x => x.id !== id)) }]);
  };

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.backdropContainer}>
        <View style={styles.mainModalCard}>
          
         
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={onClose} activeOpacity={0.6} style={styles.backButtonTouch}>
              <Text style={styles.backIconText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.mainTitleText}>Game Log</Text>
            <View style={styles.spacerHeaderAsset} />
          </View>

         
          <View style={styles.tableInnerFrame}>
            
            
            <View style={styles.tableHeaderRowDark}>
              <Text style={[styles.columnHeaderTextDark, styles.colPeriod]}>Period</Text>
              <Text style={[styles.columnHeaderTextDark, styles.colTime]}>Time</Text>
              <Text style={[styles.columnHeaderTextDark, styles.colTeam]}>Team ‹</Text>
              <Text style={[styles.columnHeaderTextDark, styles.colType]}>Type</Text>
              <Text style={[styles.columnHeaderTextDark, styles.colPlayer]}>Player ‹</Text>
              <Text style={[styles.columnHeaderTextDark, styles.colAssist]}>Assist ‹</Text>
              <Text style={[styles.columnHeaderTextDark, styles.colActions, { textAlign: 'center' }]}>Actions</Text>
            </View>

            
            <ScrollView showsVerticalScrollIndicator={true} style={styles.scrollListContainer}>
              {logs.map((log) => (
                <View key={log.id} style={styles.tableDataRowCell}>
                  
                  <Text style={[styles.dataCellText, styles.colPeriod]}>{log.period}</Text>
                  
                  <Text style={[styles.dataCellText, styles.colTime]}>{log.time}</Text>
                  
                 
                  <View style={[styles.colTeam, styles.teamRowBadgeBox]}>
                    <View 
                      style={[
                        styles.teamColorIndicatorBubble, 
                        { backgroundColor: log.team === 'Dark' ? '#0F172A' : '#FFFFFF' }
                      ]} 
                    />
                    <Text style={styles.dataCellText}>{log.team}</Text>
                  </View>
                  
                  <Text style={[styles.dataCellText, styles.colType, { fontWeight: '500' }]}>{log.type}</Text>
                  
                 
                  <Text style={[styles.dataCellText, styles.colPlayer]}>Cap {log.playerCap}</Text>

                  
                  <Text style={[
                    styles.dataCellText, 
                    styles.colAssist, 
                    !log.assist.includes('Cap') && { color: '#94A3B8' }
                  ]}>
                    {log.assist.replace('#', '')}
                  </Text>

                  
                  <View style={[styles.colActions, styles.actionsRowButtonGroup]}>
                    <TouchableOpacity 
                      onPress={() => handleEditLog(log.id, log)} 
                      activeOpacity={0.6} 
                      style={styles.actionInlineTouchCard}
                    >
                      <Text style={styles.updateButtonText}>UPDATE</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      onPress={() => handleDeleteLog(log.id)} 
                      activeOpacity={0.6} 
                      style={[styles.actionInlineTouchCard, styles.deleteButtonBackground]}
                    >
                      <Text style={styles.deleteButtonText}>DELETE</Text>
                    </TouchableOpacity>
                  </View>

                </View>
              ))}
            </ScrollView>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdropContainer: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  mainModalCard: {
    width: '95%',
    maxWidth: 920, 
    height: 480,
    backgroundColor: '#0F2547', 
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButtonTouch: { padding: 8 },
  backIconText: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  mainTitleText: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  spacerHeaderAsset: { width: 40 },
  
  tableInnerFrame: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tableHeaderRowDark: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 46,
    backgroundColor: '#0F2547', 
  },
  columnHeaderTextDark: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  
  scrollListContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  tableDataRowCell: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  dataCellText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  
 
  colPeriod: { width: '12%' },
  colTime:   { width: '10%' },
  colTeam:   { width: '12%' },
  colType:   { width: '12%' },
  colPlayer: { width: '14%' },
  colAssist: { width: '14%' },
  colActions:{ width: '26%' },

  teamRowBadgeBox: { flexDirection: 'row', alignItems: 'center' },
  teamColorIndicatorBubble: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  
  actionsRowButtonGroup: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    gap: 8 
  },
  actionInlineTouchCard: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  deleteButtonBackground: { 
    backgroundColor: '#FEF2F2' 
  },
  updateButtonText: { 
    fontSize: 11, 
    fontWeight: '700', 
    color: '#0F2547' 
  },
  deleteButtonText: { 
    fontSize: 11, 
    fontWeight: '700', 
    color: '#EF4444' 
  },
});
