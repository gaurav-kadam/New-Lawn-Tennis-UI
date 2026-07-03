import React, { useEffect, useState } from 'react';
import {
  DimensionValue,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import RadioGroup from '../ui/RadioGroup';
import Select from '../ui/Select';

import { useTheme } from '../../theme/themeContext';
import { tokens } from '../../theme/token';

const TABLET_BREAKPOINT = 768;
const MODAL_DESKTOP_WIDTH = 520;
const MODAL_MOBILE_WIDTH = '92%';
const SCROLL_MOBILE_HEIGHT = 320;
const SCROLL_DESKTOP_HEIGHT = 340;
const FIELD_ROW_GAP = 12;
const STEP_COUNT = 3;

export default function CreateTeamModal({
  visible,
  onClose,
  onSave,
  initialData,
}: any) {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const isMobile = screenWidth < TABLET_BREAKPOINT;
  const cardWidth: DimensionValue = isMobile ? MODAL_MOBILE_WIDTH : MODAL_DESKTOP_WIDTH;
  const scrollMaxHeight = isMobile ? SCROLL_MOBILE_HEIGHT : SCROLL_DESKTOP_HEIGHT;

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<any>({});

  const [formData, setFormData] = useState<any>({
    teamName: '',
    shortName: '',
    state: '',
    city: '',
    gender: '',
    section: '',
    headCoach: '',
    coach: '',
    manager: '',
    playerFile: null,
  });

  // Sync and reset internal state when modal visibility changes
  useEffect(() => {
    if (visible) {
      setCurrentStep(1);
      setErrors({});
      setFormData({
        teamName: initialData?.teamName || '',
        shortName: initialData?.shortName || '',
        state: initialData?.state || '',
        city: initialData?.city || '',
        gender: initialData?.gender || '',
        section: initialData?.section || '',
        headCoach: initialData?.headCoach || '',
        coach: initialData?.coach || '',
        manager: initialData?.manager || '',
        playerFile: null,
      });
    }
  }, [visible, initialData]);

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const update = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prevErrors: any) => ({ ...prevErrors, [field]: null }));
    }
  };

  const validateStep = () => {
    const stepErrors: any = {};

    if (currentStep === 1) {
      if (!formData.teamName.trim()) stepErrors.teamName = 'Team full name is required';
      if (!formData.shortName.trim()) stepErrors.shortName = 'Short name is required';
      if (!formData.gender) stepErrors.gender = 'Gender is required';
      if (!formData.state.trim()) stepErrors.state = 'State is required';
      if (!formData.city.trim()) stepErrors.city = 'City is required';
      if (!formData.section) stepErrors.section = 'Section is required';
    }

    if (currentStep === 2) {
      if (!formData.headCoach.trim()) stepErrors.headCoach = 'Head coach name is required';
      if (!formData.coach.trim()) stepErrors.coach = 'Assistant coach name is required';
      if (!formData.manager.trim()) stepErrors.manager = 'Team manager name is required';
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep() && currentStep < STEP_COUNT) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setErrors({});
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleFileUpload = () => {
    if (Platform.OS !== 'web') {
      alert('Excel upload currently supported on web only.');
      return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls';
    input.onchange = (event: any) => {
      const file = event.target.files?.[0];
      if (!file) return;
      update('playerFile', file);
    };
    input.click();
  };

  const handleDownloadTemplate = () => {
    if (Platform.OS !== 'web') return;
    const headers = ['jourcy no', 'player name', 'playing position', 'substitute player', 'dp', 'flex'];
    const sampleRows = [
      ['7', 'Rahul Patil', 'Pitcher', 'No', 'No', 'No'],
      ['12', 'Amit Shinde', 'Catcher', 'No', 'Yes', 'No'],
      ['21', 'Sagar Jadhav', 'First Base', 'Yes', 'No', 'Yes'],
    ];
    const csvContent = [headers.join(','), ...sampleRows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'players_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (currentStep === STEP_COUNT) {
      onSave(formData);
      return;
    }
    nextStep();
  };

  const errorTextStyle = {
    color: '#ef4444',
    fontSize: 11,
    marginTop: -4,
    marginLeft: 4,
    marginBottom: 4,
  };

  const attachedFileName = formData.playerFile?.name || formData.playerFile || '';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          padding: 20,
        }}
      >
        <View style={{ width: cardWidth, maxWidth: '100%' }}>
          <Card variant="elevated">
            <View
              style={{
                paddingHorizontal: isMobile ? 16 : 24,
                paddingVertical: 16,
              }}
            >
              {/* Header Block */}
              <View style={{ marginBottom: 6 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: isMobile ? 18 : 22, fontWeight: 'bold', color: theme.colors.textPrimary }}>
                    {initialData ? 'Update Team' : 'Register New Team'}
                  </Text>
                  <TouchableOpacity onPress={handleClose} style={{ padding: 4 }}>
                    <Text style={{ fontSize: 18, color: theme.colors.textSecondary }}>✕</Text>
                  </TouchableOpacity>
                </View>
                <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>
                  Step {currentStep} of {STEP_COUNT}
                </Text>
              </View>

              {/* Progress Bars */}
              <View style={{ flexDirection: 'row', marginBottom: 16, gap: 8 }}>
                {['Details', 'Staff', 'Players'].map((label, i) => (
                  <View
                    key={label}
                    style={{
                      flex: 1,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: currentStep >= i + 1 ? theme.colors.primary : '#e2e8f0',
                    }}
                  />
                ))}
              </View>

              {/* Scroll Form Content */}
              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: scrollMaxHeight }}>
                <View style={{ gap: FIELD_ROW_GAP, paddingBottom: 4 }}>

                  {/* STEP 1: TEAM DETAILS */}
                  {currentStep === 1 && (
                    <>
                      <View>
                        <Input
                          label="Team Full Name"
                          placeholder="e.g. Maharashtra Warriors"
                          value={formData.teamName}
                          onChangeText={(value: any) => update('teamName', value)}
                        />
                        {errors.teamName && <Text style={errorTextStyle}>{errors.teamName}</Text>}
                      </View>

                      <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
                        <View style={{ flex: 1 }}>
                          <Input
                            label="Short Name (Code)"
                            placeholder="e.g. MAH"
                            value={formData.shortName}
                            onChangeText={(value: any) => update('shortName', value)}
                          />
                          {errors.shortName && <Text style={errorTextStyle}>{errors.shortName}</Text>}
                        </View>
                        <View style={{ flex: 1 }}>
                          <RadioGroup
                            label="Gender"
                            value={formData.gender}
                            onChange={(value: any) => update('gender', value)}
                            options={[
                              { label: 'Men', value: 'Men' },
                              { label: 'Women', value: 'Women' },
                            ]}
                          />
                          {errors.gender && <Text style={{ ...errorTextStyle, marginTop: -4 }}>{errors.gender}</Text>}
                        </View>
                      </View>

                      <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
                        <View style={{ flex: 1 }}>
                          <Input
                            label="State"
                            placeholder="State"
                            value={formData.state}
                            onChangeText={(value: any) => update('state', value)}
                          />
                          {errors.state && <Text style={errorTextStyle}>{errors.state}</Text>}
                        </View>
                        <View style={{ flex: 1 }}>
                          <Input
                            label="City"
                            placeholder="City"
                            value={formData.city}
                            onChangeText={(value: any) => update('city', value)}
                          />
                          {errors.city && <Text style={errorTextStyle}>{errors.city}</Text>}
                        </View>
                      </View>

                      <View>
                        <Select
                          label="Section"
                          value={formData.section}
                          onChange={(value: any) => update('section', value)}
                          options={[
                            { label: 'Under-15', value: 'Under-15' },
                            { label: 'Under-19', value: 'U19' },
                            { label: 'Open', value: 'Open' },
                          ]}
                        />
                        {errors.section && <Text style={{ ...errorTextStyle, marginTop: -4 }}>{errors.section}</Text>}
                      </View>
                    </>
                  )}

                  {/* STEP 2: STAFF DETAILS */}
                  {currentStep === 2 && (
                    <>
                      <View>
                        <Input
                          label="Head Coach"
                          placeholder="Enter head coach name"
                          value={formData.headCoach}
                          onChangeText={(value: any) => update('headCoach', value)}
                        />
                        {errors.headCoach && <Text style={errorTextStyle}>{errors.headCoach}</Text>}
                      </View>
                      <View>
                        <Input
                          label="Assistant Coach"
                          placeholder="Enter coach name"
                          value={formData.coach}
                          onChangeText={(value: any) => update('coach', value)}
                        />
                        {errors.coach && <Text style={errorTextStyle}>{errors.coach}</Text>}
                      </View>
                      <View>
                        <Input
                          label="Team Manager"
                          placeholder="Enter manager name"
                          value={formData.manager}
                          onChangeText={(value: any) => update('manager', value)}
                        />
                        {errors.manager && <Text style={errorTextStyle}>{errors.manager}</Text>}
                      </View>
                    </>
                  )}

                  {/* STEP 3: PLAYER FILE */}
                  {currentStep === 3 && (
                    <View style={{ alignItems: 'center', paddingVertical: tokens.spacing.sm, gap: tokens.spacing.md }}>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.textPrimary, alignSelf: 'flex-start' }}>
                        Player Details
                      </Text>
                      <View
                        style={{
                          width: '100%',
                          padding: 25,
                          borderStyle: 'dashed',
                          borderWidth: 2,
                          borderColor: theme.colors.border || '#cbd5e1',
                          borderRadius: tokens.radius.md,
                          alignItems: 'center',
                          backgroundColor: theme.colors.background,
                        }}
                      >
                        <Text style={{ fontSize: 32, marginBottom: 10 }}>📊</Text>
                        <Text style={{ fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 5 }}>
                          Upload Player List
                        </Text>
                        <Text style={{ color: theme.colors.textSecondary, fontSize: 12, textAlign: 'center', marginBottom: 15 }}>
                          Upload an Excel file .xlsx or .xls with players.
                        </Text>
                        <TouchableOpacity
                          onPress={handleFileUpload}
                          style={{
                            backgroundColor: theme.colors.surface || '#fff',
                            borderWidth: tokens.layout.dividerHeight,
                            borderColor: theme.colors.border || '#e2e8f0',
                            paddingVertical: tokens.spacing.sm,
                            paddingHorizontal: tokens.spacing.md,
                            borderRadius: tokens.radius.sm,
                          }}
                        >
                          <Text style={{ fontWeight: '600', color: theme.colors.textSecondary }}>
                            Select Excel File
                          </Text>
                        </TouchableOpacity>
                        {attachedFileName ? (
                          <Text style={{ marginTop: 10, color: '#10b981', fontSize: 12 }}>
                            ✓ {attachedFileName} attached
                          </Text>
                        ) : null}
                      </View>
                      <TouchableOpacity onPress={handleDownloadTemplate}>
                        <Text style={{ color: theme.colors.primary, fontSize: 13, fontWeight: '600' }}>
                          Download Template
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                </View>
              </ScrollView>

              {/* Footer Buttons */}
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginTop: 16 }}>
                <View style={{ flex: isMobile ? 1 : 0, minWidth: isMobile ? 0 : 100 }}>
                  <Button
                    title={currentStep === 1 ? 'Cancel' : 'Back'}
                    variant="ghost"
                    onPress={currentStep === 1 ? handleClose : prevStep}
                  />
                </View>
                <View style={{ flex: isMobile ? 1.5 : 0, minWidth: isMobile ? 0 : 180 }}>
                  <Button
                    title={currentStep === STEP_COUNT ? (initialData ? 'Update Team' : 'Register Team') : 'Next Step'}
                    onPress={handleSave}
                  />
                </View>
              </View>

            </View>
          </Card>
        </View>
      </View>
    </Modal>
  );
}
