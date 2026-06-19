// ViewLogModal.tsx

import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, TextInput, TextStyle, Alert, Platform } from 'react-native';
import { useTheme } from '../../../theme/themeContext';
import { useMatch, LogItem } from '../layout/MatchContext'; 

import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface ViewLogModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function ViewLogModal({ isVisible, onClose }: ViewLogModalProps) {
  const theme = useTheme();
  const { logs, updateLog, deleteLog } = useMatch();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<LogItem>>({});

  const handleEditLog = (item: LogItem) => {
    setEditingId(item.id);
    setEditForm({
      period: item.period,
      time: item.time,
      team: item.team, 
      type: item.type,
      playerCap: item.playerCap,
      assist: item.assist,
      scoreAtEvent: item.scoreAtEvent,
    });
  };

  const handleSaveUpdate = (id: string) => {
    updateLog(id, {
      period: editForm.period,
      time: editForm.time,
      team: editForm.team as 'White' | 'Blue', 
      type: editForm.type,
      playerCap: Number(editForm.playerCap) || 0,
      assist: editForm.assist || '----------',
      scoreAtEvent: editForm.scoreAtEvent || '0-0',
    });
    setEditingId(null);
  };

  const handleExportExcel = async () => {
    if (!logs || logs.length === 0) {
      Alert.alert(
        "Export Blocked", 
        "Minimum one log record entry is required to generate an Excel spreadsheet document.",
        [{ text: "OK" }]
      );
      return;
    }

    const targetFilename = `Match_Timeline_Export_${Date.now()}.xlsx`;

    try {
      const sheetRows = logs.map((item) => ({
        "Period": item.period,
        "Time": item.time,
        "Team": item.team,
        "Event Type": item.type,
        "Player Cap #": item.playerCap,
        "Asst. Player": item.assist === '----------' ? 'None' : item.assist.replace('#', ''),
        "Score": item.scoreAtEvent || '0-0',
      }));

      const worksheet = XLSX.utils.json_to_sheet(sheetRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Game Match Log Timeline");

      if (Platform.OS === 'web') {
        const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
        const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        const downloadAnchor = document.createElement('a');
        downloadAnchor.href = window.URL.createObjectURL(dataBlob);
        downloadAnchor.download = targetFilename;
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
        return; 
      }

      const excelBase64 = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
      const baseDir = FileSystem.cacheDirectory || ""; 
      const documentStorageUri = `${baseDir}${targetFilename}`;

      await FileSystem.writeAsStringAsync(documentStorageUri, excelBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const sharingVerification = await Sharing.isAvailableAsync();
      if (sharingVerification) {
        await Sharing.shareAsync(documentStorageUri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Share Match Statistics Document Log Sheet',
          UTI: 'com.microsoft.excel.xlsx', 
        });
      } else {
        Alert.alert("Sharing Restricted", "Native document file sharing layout interactions are unavailable on this framework.");
      }
    } catch (exportSystemError) {
      console.error(exportSystemError);
      Alert.alert("Processing Error", "Failed to compile database logs into an Excel file structure properly.");
    }
  };

  // Explicit Layout View Matrix Definitions
  const colPeriod = { width: '11%', justifyContent: 'center', alignItems: 'center' } as const;
  const colTime   = { width: '11%', justifyContent: 'center', alignItems: 'center' } as const;
  const colTeam   = { width: '11%', justifyContent: 'center', alignItems: 'center' } as const;
  const colType   = { width: '16%', justifyContent: 'center', alignItems: 'center' } as const; 
  const colPlayer = { width: '11%', justifyContent: 'center', alignItems: 'center' } as const;
  const colAssist = { width: '11%', justifyContent: 'center', alignItems: 'center' } as const;
  const colScore  = { width: '9%', justifyContent: 'center', alignItems: 'center' } as const; 
  const colActions= { width: '20%', justifyContent: 'center', alignItems: 'center' } as const;

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

  const isExportDisabled = !logs || logs.length === 0;

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={{
        flex: theme.layout.flexFull,
        backgroundColor: theme.colors.overlay, 
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
      }}>
        <View style={{
          width: '95%',
          maxWidth: theme.layout.logModal.containerMaxWidth, 
          height: theme.layout.logModal.containerHeight, 
          backgroundColor: theme.colors.logheader,
          borderRadius: theme.radius.lg, 
          overflow: 'hidden',
          elevation: theme.shadow.medium.elevation * 4,
        }}>
          
          {/* HEADER SECTION */}
          <View style={{
            flexDirection: 'row',
            height: theme.layout.logModal.headerHeight,
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: theme.spacing.md, 
          }}>
            <TouchableOpacity onPress={onClose} activeOpacity={0.6} style={{ padding: theme.spacing.xs }}>
              <Text style={{
                fontSize: theme.typography.sizes.h1, 
                fontWeight: theme.typography.weights.heavy, 
                color: theme.colors.secondary,
              }}>←</Text>
            </TouchableOpacity>
            <Text style={{
              fontSize: theme.typography.sizes.h2, 
              fontWeight: theme.typography.weights.bold, 
              color: theme.colors.secondary,
            }}>Game Log</Text>
            <View style={{ width: theme.layout.playerBadge.containerWidth }} />
          </View>

          {/* TABLE INNER DATA CONTAINER */}
          <View style={{ flex: theme.layout.flexFull, backgroundColor: theme.colors.surface }}>
            
            {/* TABLE COLUMN HEADER ROW */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: theme.spacing.lg, 
              height: theme.layout.logModal.tableHeaderHeight,
              backgroundColor: theme.colors.matchScreen.headerColor,
            }}>
              <Text style={[{ fontSize: theme.typography.sizes.tableText, fontWeight: theme.typography.weights.medium, color: theme.colors.secondary, textAlign: 'center' }, colPeriod]}>Period</Text>
              <Text style={[{ fontSize: theme.typography.sizes.tableText, fontWeight: theme.typography.weights.medium, color: theme.colors.secondary, textAlign: 'center' }, colTime]}>Time</Text>
              <Text style={[{ fontSize: theme.typography.sizes.tableText, fontWeight: theme.typography.weights.medium, color: theme.colors.secondary, textAlign: 'center' }, colTeam]}>Team</Text>
              <Text style={[{ fontSize: theme.typography.sizes.tableText, fontWeight: theme.typography.weights.medium, color: theme.colors.secondary, textAlign: 'center' }, colType]}>Type</Text>
              <Text style={[{ fontSize: theme.typography.sizes.tableText, fontWeight: theme.typography.weights.medium, color: theme.colors.secondary, textAlign: 'center' }, colPlayer]}>Player</Text>
              <Text style={[{ fontSize: theme.typography.sizes.tableText, fontWeight: theme.typography.weights.medium, color: theme.colors.secondary, textAlign: 'center' }, colAssist]}>Assist</Text>
              <Text style={[{ fontSize: theme.typography.sizes.tableText, fontWeight: theme.typography.weights.medium, color: theme.colors.secondary, textAlign: 'center' }, colScore]}>Score</Text>
              <Text style={[{ fontSize: theme.typography.sizes.tableText, fontWeight: theme.typography.weights.medium, color: theme.colors.secondary, textAlign: 'center' }, colActions]}>Actions</Text>
            </View>

            {/* DATA ROW ITEM LIST */}
            <ScrollView showsVerticalScrollIndicator={true} style={{ flex: theme.layout.flexFull, paddingHorizontal: theme.spacing.lg }}>
              {(logs || []).map((log) => {
                const hasValidAssist = log.assist && typeof log.assist === 'string' && log.assist.includes('Cap');
                const isEditing = editingId === log.id;

                return (
                  <View key={log.id} style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: theme.layout.logModal.rowHeight,
                    borderBottomWidth: 1,
                    borderColor: theme.colors.border,
                  }}>
                    
                    {/* PERIOD */}
                    <View style={colPeriod}>
                      {isEditing ? (
                        <TextInput
                          style={inputStyle}
                          value={editForm.period}
                          onChangeText={(text) => setEditForm(prev => ({ ...prev, period: text }))}
                        />
                      ) : (
                        <Text style={{ fontSize: theme.typography.sizes.small, fontWeight: theme.typography.weights.medium, color: theme.colors.textPrimary, textAlign: 'center' }}>{log.period}</Text>
                      )}
                    </View>

                    {/* TIME */}
                    <View style={colTime}>
                      {isEditing ? (
                        <TextInput
                          style={inputStyle}
                          value={editForm.time}
                          onChangeText={(text) => setEditForm(prev => ({ ...prev, time: text }))}
                        />
                      ) : (
                        <Text style={{ fontSize: theme.typography.sizes.small, fontWeight: theme.typography.weights.medium, color: theme.colors.textPrimary, textAlign: 'center' }}>{log.time}</Text>
                      )}
                    </View>
                    
                    {/* TEAM */}
                    <View style={colTeam}>
                      {isEditing ? (
                        <TouchableOpacity 
                          activeOpacity={0.7}
                          onPress={() => setEditForm(prev => ({ 
                            ...prev, 
                            team: prev.team === 'White' ? 'Blue' : 'White' 
                          }))}
                          style={{
                            height: theme.layout.logModal.inputHeight,
                            borderColor: theme.colors.primary,
                            borderWidth: 1,
                            borderRadius: theme.radius.sm,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: theme.colors.surface,
                            width: '90%',
                          }}
                        >
                          <Text style={{ fontSize: theme.typography.sizes.small, fontWeight: theme.typography.weights.bold, color: theme.colors.primary }}>
                            {editForm.team}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={{ fontSize: theme.typography.sizes.small, fontWeight: theme.typography.weights.medium, color: theme.colors.textPrimary, textAlign: 'center' }}>
                          {log.team}
                        </Text>
                      )}
                    </View>
                    
                    {/* TYPE */}
                    <View style={colType}>
                      {isEditing ? (
                        <TextInput
                          style={inputStyle}
                          value={editForm.type}
                          onChangeText={(text) => setEditForm(prev => ({ ...prev, type: text }))}
                        />
                      ) : (
                        <Text style={{ fontSize: theme.typography.sizes.small, fontWeight: theme.typography.weights.medium, color: theme.colors.textPrimary, textAlign: 'center' }}>{log.type}</Text>
                      )}
                    </View>

                    {/* PLAYER */}
                    <View style={colPlayer}>
                      {isEditing ? (
                        <TextInput
                          style={inputStyle}
                          keyboardType="numeric"
                          value={editForm.playerCap?.toString()}
                          onChangeText={(text) => setEditForm(prev => ({ ...prev, playerCap: parseInt(text, 10) || 0 }))}
                        />
                      ) : (
                        <Text style={{ fontSize: theme.typography.sizes.small, fontWeight: theme.typography.weights.medium, color: theme.colors.textPrimary, textAlign: 'center' }}>Cap {log.playerCap}</Text>
                      )}
                    </View>
                    
                    {/* ASSIST */}
                    <View style={colAssist}>
                      {isEditing ? (
                        <TextInput
                          style={inputStyle}
                          value={editForm.assist}
                          onChangeText={(text) => setEditForm(prev => ({ ...prev, assist: text }))}
                        />
                      ) : (
                        <Text style={{ 
                          fontSize: theme.typography.sizes.small, 
                          fontWeight: theme.typography.weights.medium, 
                          textAlign: 'center',
                          color: hasValidAssist ? theme.colors.textPrimary : theme.colors.textSecondary,
                        }}>
                          {log.assist ? log.assist.replace('#', '') : '----------'}
                        </Text>
                      )}
                    </View>

                    {/* SCORE */}
                    <View style={colScore}>
                      {isEditing ? (
                        <TextInput
                          style={inputStyle}
                          value={editForm.scoreAtEvent}
                          onChangeText={(text) => setEditForm(prev => ({ ...prev, scoreAtEvent: text }))}
                        />
                      ) : (
                        <Text style={{ fontSize: theme.typography.sizes.small, fontWeight: theme.typography.weights.bold, color: theme.colors.primary, textAlign: 'center' }}>
                          {log.scoreAtEvent || '0-0'}
                        </Text>
                      )}
                    </View>

                    {/* ACTIONS CONTROLS */}
                    <View style={[{ flexDirection: 'row', gap: theme.spacing.sm }, colActions]}>
                      {isEditing ? (
                        <>
                          <TouchableOpacity 
                            onPress={() => handleSaveUpdate(log.id)} 
                            activeOpacity={0.6} 
                            style={{
                              paddingHorizontal: theme.spacing.sm + 2,
                              paddingVertical: theme.radius.sm,
                              borderRadius: theme.radius.sm, 
                              backgroundColor: theme.colors.actions.saveBg, 
                              justifyContent: 'center',
                              alignItems: 'center',
                              minWidth: theme.layout.logModal.actionBtnMinWidth,
                            }}
                          >
                            <Text style={{ fontSize: theme.typography.sizes.inputMini, fontWeight: theme.typography.weights.bold, color: theme.colors.actions.saveText }}>SAVE</Text>
                          </TouchableOpacity>
                          
                          <TouchableOpacity 
                            onPress={() => setEditingId(null)} 
                            activeOpacity={0.6} 
                            style={{
                              paddingHorizontal: theme.spacing.sm + 2,
                              paddingVertical: theme.radius.sm,
                              borderRadius: theme.radius.sm, 
                              backgroundColor: theme.colors.border,
                              justifyContent: 'center',
                              alignItems: 'center',
                              minWidth: theme.layout.logModal.actionBtnMinWidth,
                            }}
                          >
                            <Text style={{ fontSize: theme.typography.sizes.inputMini, fontWeight: theme.typography.weights.bold, color: theme.colors.textSecondary }}>CANCEL</Text>
                          </TouchableOpacity>
                        </>
                      ) : (
                        <>
                          <TouchableOpacity 
                            onPress={() => handleEditLog(log)} 
                            activeOpacity={0.6} 
                            style={{
                              paddingHorizontal: theme.spacing.sm + 2,
                              paddingVertical: theme.radius.sm,
                              borderRadius: theme.radius.sm, 
                              backgroundColor: theme.colors.border,
                              justifyContent: 'center',
                              alignItems: 'center',
                              minWidth: theme.layout.logModal.actionBtnMinWidth,
                            }}
                          >
                            <Text style={{ fontSize: theme.typography.sizes.inputMini, fontWeight: theme.typography.weights.bold, color: theme.colors.matchScreen.headerColor }}>UPDATE</Text>
                          </TouchableOpacity>
                          
                          <TouchableOpacity 
                            onPress={() => deleteLog(log.id)} 
                            activeOpacity={0.6} 
                            style={{
                              paddingHorizontal: theme.spacing.sm + 2,
                              paddingVertical: theme.radius.sm,
                              borderRadius: theme.radius.sm, 
                              backgroundColor: theme.colors.actions.deleteBg,
                              justifyContent: 'center',
                              alignItems: 'center',
                              minWidth: theme.layout.logModal.actionBtnMinWidth,
                            }}
                          >
                            <Text style={{ fontSize: theme.typography.sizes.inputMini, fontWeight: theme.typography.weights.bold, color: theme.colors.error }}>DELETE</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>

                  </View>
                );
              })}
            </ScrollView>

            {/* EXPORT EXCEL FOOTER BUTTON */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.md,
              borderTopWidth: 1,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
            }}>
              <TouchableOpacity
                onPress={handleExportExcel}
                activeOpacity={isExportDisabled ? 1 : 0.7}
                style={{
                  backgroundColor: isExportDisabled ? theme.colors.actions.disabledBg : theme.colors.actions.exportBg, 
                  paddingHorizontal: theme.spacing.md + theme.layout.logModal.exportBtnPaddingOffset,
                  paddingVertical: theme.spacing.sm,
                  borderRadius: theme.radius.sm,
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: isExportDisabled ? 0.6 : 1, 
                  minWidth: theme.layout.logModal.exportBtnMinWidth,
                  elevation: isExportDisabled ? 0 : 2,
                }}
              >
                <Text style={{
                  color: theme.colors.textLight,
                  fontSize: theme.typography.sizes.badge,
                  fontWeight: theme.typography.weights.bold,
                  letterSpacing: 0.5,
                }}>EXPORT EXCEL</Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>
      </View>
    </Modal>
  );
}