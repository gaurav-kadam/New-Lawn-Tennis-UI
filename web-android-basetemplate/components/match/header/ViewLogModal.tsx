import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, TextInput, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../../theme/themeContext';
import { useMatch, LogItem } from '../layout/MatchContext'; 
import Button from '../../ui/Button';

interface ViewLogModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function ViewLogModal({ isVisible, onClose }: ViewLogModalProps) {
  const theme = useTheme();
  const { logs, updateLog, deleteLog, saveAllLogs } = useMatch();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<LogItem>>({});

  const handleEditLog = (item: LogItem) => {
    setEditingId(item.id);
    setEditForm({
      quarter: item.quarter,
      time: item.time,
      team: item.team, 
      type: item.type,
      player: item.player,
      assist: item.assist,
      score: item.score,
    });
  };

  const handleSaveUpdate = async (id: string) => {
    await updateLog(id, {
      quarter: editForm.quarter,
      time: editForm.time,
      team: editForm.team as 'White' | 'Blue', 
      type: editForm.type,
      player: editForm.player || '0',
      assist: editForm.assist || '----',
      score: editForm.score || '0-0',
    });
    setEditingId(null);
  };
  
  const handleDelete = async (id: string) => {
    await deleteLog(id);
  };

  // Layout column definitions
  const colPeriod = { width: '11%', justifyContent: 'center', alignItems: 'center' } as ViewStyle;
  const colTime = { width: '11%', justifyContent: 'center', alignItems: 'center' } as ViewStyle;
  const colTeam = { width: '11%', justifyContent: 'center', alignItems: 'center' } as ViewStyle;
  const colType = { width: '16%', justifyContent: 'center', alignItems: 'center' } as ViewStyle;
  const colPlayer = { width: '11%', justifyContent: 'center', alignItems: 'center' } as ViewStyle;
  const colAssist = { width: '11%', justifyContent: 'center', alignItems: 'center' } as ViewStyle;
  const colScore = { width: '9%', justifyContent: 'center', alignItems: 'center' } as ViewStyle;
  const colActions = { width: '20%', justifyContent: 'center', alignItems: 'center' } as ViewStyle;

  // Header text style object
  const headerTextStyle: TextStyle = { 
    fontSize: theme.typography.sizes.tableText, 
    fontWeight: theme.typography.weights.medium, 
    color: theme.colors.secondary, 
    textAlign: 'center' 
  };

  const inputStyle: TextStyle = {
    height: theme.layout.logModal.inputHeight,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.xs,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.surface,
    fontSize: theme.typography.sizes.inputMini,
    width: '90%',
    textAlign: 'center',
  };

  const displayedLogs = logs ? [...logs].reverse() : [];

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={{ flex: theme.layout.flexFull, backgroundColor: theme.colors.overlay, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.lg } as ViewStyle}>
        <View style={{ width: '95%', maxWidth: theme.layout.logModal.containerMaxWidth, height: theme.layout.logModal.containerHeight, backgroundColor: theme.colors.accent, borderRadius: theme.radius.lg, overflow: 'hidden', elevation: theme.shadow.medium.elevation * 4 } as ViewStyle}>
          
          <View style={{ flexDirection: 'row', height: theme.layout.logModal.headerHeight, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.spacing.md } as ViewStyle}>
            <TouchableOpacity onPress={onClose} activeOpacity={0.6} style={{ padding: theme.spacing.xs } as ViewStyle}>
              <Text style={{ fontSize: theme.typography.sizes.h1, fontWeight: theme.typography.weights.heavy, color: theme.colors.secondary } as TextStyle}>←</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: theme.typography.sizes.h2, fontWeight: theme.typography.weights.bold, color: theme.colors.secondary } as TextStyle}>Game Log</Text>
            <View style={{ width: theme.layout.playerBadge.containerWidth } as ViewStyle} />
          </View>

          <View style={{ flex: theme.layout.flexFull, backgroundColor: theme.colors.surface } as ViewStyle}>
            {/* Table Header Section */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: theme.spacing.lg, height: theme.layout.logModal.tableHeaderHeight, backgroundColor: theme.colors.matchScreen.headerColor } as ViewStyle}>
              <Text style={[headerTextStyle, colPeriod]}>Period</Text>
              <Text style={[headerTextStyle, colTime]}>Time</Text>
              <Text style={[headerTextStyle, colTeam]}>Team</Text>
              <Text style={[headerTextStyle, colType]}>Type</Text>
              <Text style={[headerTextStyle, colPlayer]}>Player</Text>
              <Text style={[headerTextStyle, colAssist]}>Assist</Text>
              <Text style={[headerTextStyle, colScore]}>Score</Text>
              <Text style={[headerTextStyle, colActions]}>Actions</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={true} style={{ flex: theme.layout.flexFull, paddingHorizontal: theme.spacing.lg } as ViewStyle}>
              {displayedLogs.map((log) => {
                const hasValidAssist = log.assist && typeof log.assist === 'string' && log.assist.includes('Cap');
                const isEditing = editingId === log.id;
                return (
                  <View key={log.id} style={{ flexDirection: 'row', alignItems: 'center', height: theme.layout.logModal.rowHeight, borderBottomWidth: 1, borderColor: theme.colors.border } as ViewStyle}>
                    <View style={colPeriod}>{isEditing ? (<TextInput style={inputStyle} keyboardType="numeric" value={editForm.quarter?.toString()} onChangeText={(text) => setEditForm(prev => ({ ...prev, quarter: parseInt(text, 10) || 1 }))} /> ) : (<Text style={{ fontSize: theme.typography.sizes.small,fontWeight: theme.typography.weights.medium, color: theme.colors.textPrimary, textAlign: 'center' }}>{log.quarter === 5 ? 'Penalty' : `Quarter ${log.quarter}`}</Text>)}</View>
                    <View style={colTime}>{isEditing ? <TextInput style={inputStyle} value={editForm.time} onChangeText={(text) => setEditForm(prev => ({ ...prev, time: text }))} /> : <Text style={{ fontSize: theme.typography.sizes.small, fontWeight: theme.typography.weights.medium, color: theme.colors.textPrimary, textAlign: 'center' }}>{log.time}</Text>}</View>
                    <View style={colTeam}>{isEditing ? <TouchableOpacity activeOpacity={0.7} onPress={() => setEditForm(prev => ({ ...prev, team: prev.team === 'White' ? 'Blue' : 'White' }))} style={{ height: theme.layout.logModal.inputHeight, borderColor: theme.colors.primary, borderWidth: 1, borderRadius: theme.radius.sm, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.surface, width: '90%' } as ViewStyle}><Text style={{ fontSize: theme.typography.sizes.small, fontWeight: theme.typography.weights.bold, color: theme.colors.primary }}>{editForm.team}</Text></TouchableOpacity> : <Text style={{ fontSize: theme.typography.sizes.small, fontWeight: theme.typography.weights.medium, color: theme.colors.textPrimary, textAlign: 'center' }}>{log.team}</Text>}</View>
                    <View style={colType}>{isEditing ? <TextInput style={inputStyle} value={editForm.type} onChangeText={(text) => setEditForm(prev => ({ ...prev, type: text }))} /> : <Text style={{ fontSize: theme.typography.sizes.small, fontWeight: theme.typography.weights.medium, color: theme.colors.textPrimary, textAlign: 'center' }}>{log.type}</Text>}</View>
                    <View style={colPlayer}>{isEditing ? <TextInput style={inputStyle} value={editForm.player} onChangeText={(text) => setEditForm(prev => ({ ...prev, player: text }))} /> : <Text style={{ fontSize: theme.typography.sizes.small, fontWeight: theme.typography.weights.medium, color: theme.colors.textPrimary, textAlign: 'center' }}>Cap {log.player}</Text>}</View>
                    <View style={colAssist}>{isEditing ? <TextInput style={inputStyle} value={editForm.assist} onChangeText={(text) => setEditForm(prev => ({ ...prev, assist: text }))} /> : <Text style={{ fontSize: theme.typography.sizes.small, fontWeight: theme.typography.weights.medium, textAlign: 'center', color: hasValidAssist ? theme.colors.textPrimary : theme.colors.textSecondary }}>{log.assist ? log.assist.replace('#', '') : '---'}</Text>}</View>
                    <View style={colScore}>{isEditing ? <TextInput style={inputStyle} value={editForm.score} onChangeText={(text) => setEditForm(prev => ({ ...prev, score: text }))} /> : <Text style={{ fontSize: theme.typography.sizes.small, fontWeight: theme.typography.weights.bold, color: theme.colors.primary, textAlign: 'center' }}>{log.score || '0-0'}</Text>}</View>
                    <View style={[{ flexDirection: 'row', gap: theme.spacing.sm }, colActions] as ViewStyle}>
                      {isEditing ? (
                        <>
                          <TouchableOpacity onPress={() => handleSaveUpdate(log.id)} activeOpacity={0.6} style={{ paddingHorizontal: theme.spacing.sm + 2, paddingVertical: theme.radius.sm, borderRadius: theme.radius.sm, backgroundColor: theme.colors.actions.saveBg, justifyContent: 'center', alignItems: 'center', minWidth: theme.layout.logModal.actionBtnMinWidth } as ViewStyle}><Text style={{ fontSize: theme.typography.sizes.inputMini, fontWeight: theme.typography.weights.bold, color: theme.colors.actions.saveText }}>SAVE</Text></TouchableOpacity>
                          <TouchableOpacity onPress={() => setEditingId(null)} activeOpacity={0.6} style={{ paddingHorizontal: theme.spacing.sm + 2, paddingVertical: theme.radius.sm, borderRadius: theme.radius.sm, backgroundColor: theme.colors.border, justifyContent: 'center', alignItems: 'center', minWidth: theme.layout.logModal.actionBtnMinWidth } as ViewStyle}><Text style={{ fontSize: theme.typography.sizes.inputMini, fontWeight: theme.typography.weights.bold, color: theme.colors.textSecondary }}>CANCEL</Text></TouchableOpacity>
                        </>
                      ) : (
                        <>
                          <TouchableOpacity onPress={() => handleEditLog(log)} activeOpacity={0.6} style={{ paddingHorizontal: theme.spacing.sm + 2, paddingVertical: theme.radius.sm, borderRadius: theme.radius.sm, backgroundColor: theme.colors.border, justifyContent: 'center', alignItems: 'center', minWidth: theme.layout.logModal.actionBtnMinWidth } as ViewStyle}><Text style={{ fontSize: theme.typography.sizes.inputMini, fontWeight: theme.typography.weights.bold, color: theme.colors.matchScreen.headerColor }}>UPDATE</Text></TouchableOpacity>
                          <TouchableOpacity onPress={() => handleDelete(log.id)} activeOpacity={0.6} style={{ paddingHorizontal: theme.spacing.sm + 2, paddingVertical: theme.radius.sm, borderRadius: theme.radius.sm, backgroundColor: theme.colors.actions.deleteBg, justifyContent: 'center', alignItems: 'center', minWidth: theme.layout.logModal.actionBtnMinWidth } as ViewStyle}><Text style={{ fontSize: theme.typography.sizes.inputMini, fontWeight: theme.typography.weights.bold, color: theme.colors.error }}>DELETE</Text></TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, borderTopWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface } as ViewStyle}>
              <Button 
                title="SAVE LOG"
                variant="primary"
                size="sm"
                onPress={saveAllLogs}
                style={{ borderRadius: theme.radius.sm }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}