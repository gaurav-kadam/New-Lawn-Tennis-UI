import React, { useState } from 'react';
import {
  DimensionValue,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

import { useTheme } from '../../theme/themeContext';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import RadioGroup from '../ui/RadioGroup';
import Select from '../ui/Select';

const TABLET_BREAKPOINT = 768;
const MODAL_DESKTOP_WIDTH = 520; 
const MODAL_MOBILE_WIDTH = '92%';
const SCROLL_MOBILE_HEIGHT = 320; 
const SCROLL_DESKTOP_HEIGHT = 340; 
const FIELD_ROW_GAP = 12;
const STEP_COUNT = 3;
const MODAL_Z_INDEX = 1000;

export default function CreateTeamModal({
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

  const [formData, setFormData] = useState({
    teamName: initialData?.teamName || '',
    shortName: initialData?.shortName || '',
    state: initialData?.state || '',
    city: initialData?.city || '',
    gender: initialData?.gender || 'Men',
    section: initialData?.section || '',
    headCoach: initialData?.headCoach || '',
    coach: initialData?.coach || '',
    manager: initialData?.manager || '',
    playerFile: null as any,
  });

  const update = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prevErrors: any) => ({ ...prevErrors, [field]: null }));
    }
  };

  const validateStep = () => {
    const stepErrors: any = {};

    if (currentStep === 1) {
      if (!formData.teamName.trim()) stepErrors.teamName = 'Team full name is required';
      if (!formData.shortName.trim()) stepErrors.shortName = 'Short name (code) is required';
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

    if (currentStep === STEP_COUNT && !initialData) {
      if (!formData.playerFile) {
        stepErrors.playerFile = 'Please choose an Excel player spreadsheet to proceed.';
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep() && currentStep < STEP_COUNT) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // ✅ FIX: Clean, predictable decrement computation mapping
  const prevStep = () => {
    setErrors({});
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel'
        ],
        copyToCacheDirectory: true
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedFile = result.assets[0];
        update('playerFile', pickedFile);
      }
    } catch (err) {
      console.log('Error selecting excel asset file picker:', err);
    }
  };

  const handleSave = () => {
    if (currentStep === STEP_COUNT) {
      if (validateStep()) {
        const payload = {
          teamName: formData.teamName.trim(),
          shortName: formData.shortName.trim(),
          state: formData.state.trim(),
          city: formData.city.trim(),
          gender: formData.gender,
          section: formData.section,
          headCoach: formData.headCoach.trim(),
          coach: formData.coach.trim(),
          manager: formData.manager.trim(),
          playerFile: formData.playerFile,
        };
        onSave(payload);
      }
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

  return (
    <View 
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: MODAL_Z_INDEX,
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
                <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
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
                        onChangeText={(v: any) => update('teamName', v)}
                      />
                      {errors.teamName && <Text style={errorTextStyle}>{errors.teamName}</Text>}
                    </View>

                    <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
                      <View style={{ flex: 1 }}>
                        <Input
                          label="Short Name (Code)"
                          placeholder="e.g. MAH"
                          value={formData.shortName}
                          onChangeText={(v: any) => update('shortName', v)}
                        />
                        {errors.shortName && <Text style={errorTextStyle}>{errors.shortName}</Text>}
                      </View>

                      <View style={{ flex: 1 }}>
                        <RadioGroup
                          label="Gender"
                          value={formData.gender}
                          onChange={(v: any) => update('gender', v)}
                          options={[
                            { label: 'Men', value: 'Men' },
                            { label: 'Women', value: 'Women' },
                          ]}
                        />
                        {errors.gender && <Text style={errorTextStyle}>{errors.gender}</Text>}
                      </View>
                    </View>

                    <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
                      <View style={{ flex: 1 }}>
                        <Input
                          label="State"
                          placeholder="State"
                          value={formData.state}
                          onChangeText={(v: any) => update('state', v)}
                        />
                        {errors.state && <Text style={errorTextStyle}>{errors.state}</Text>}
                      </View>

                      <View style={{ flex: 1 }}>
                        <Input
                          label="City"
                          placeholder="City"
                          value={formData.city}
                          onChangeText={(v: any) => update('city', v)}
                        />
                        {errors.city && <Text style={errorTextStyle}>{errors.city}</Text>}
                      </View>
                    </View>

                    <Select
                      label="Section"
                      value={formData.section}
                      onChange={(v: any) => update('section', v)}
                      options={[
                        { label: 'Under-15', value: 'Under-15' },
                        { label: 'Under-19', value: 'U19' },
                        { label: 'Open', value: 'Open' },
                      ]}
                    />
                    {errors.section && <Text style={errorTextStyle}>{errors.section}</Text>}
                  </>
                )}

                {/* STEP 2: STAFF ASSIGNMENT */}
                {currentStep === 2 && (
                  <>
                    <View>
                      <Input
                        label="Head Coach"
                        placeholder="Enter head coach name"
                        value={formData.headCoach}
                        onChangeText={(v: any) => update('headCoach', v)}
                      />
                      {errors.headCoach && <Text style={errorTextStyle}>{errors.headCoach}</Text>}
                    </View>
                    <View>
                      <Input
                        label="Assistant Coach"
                        placeholder="Enter coach name"
                        value={formData.coach}
                        onChangeText={(v: any) => update('coach', v)}
                      />
                      {errors.coach && <Text style={errorTextStyle}>{errors.coach}</Text>}
                    </View>
                    <View>
                      <Input
                        label="Team Manager"
                        placeholder="Enter manager name"
                        value={formData.manager}
                        onChangeText={(v: any) => update('manager', v)}
                      />
                      {errors.manager && <Text style={errorTextStyle}>{errors.manager}</Text>}
                    </View>
                  </>
                )}

                {/* STEP 3: PLAYERS LIST EXCEL */}
                {currentStep === 3 && (
                  <View style={{ alignItems: 'center', paddingVertical: 6, gap: 12 }}>
                    <View
                      style={{
                        width: '100%',
                        padding: 20,
                        borderStyle: 'dashed',
                        borderWidth: 2,
                        borderColor: errors.playerFile ? '#ef4444' : '#cbd5e1',
                        borderRadius: 8,
                        alignItems: 'center',
                        backgroundColor: theme.colors.background,
                      }}
                    >
                      <Text style={{ fontSize: 28, marginBottom: 6 }}>📊</Text>
                      <Text style={{ fontWeight: 'bold', color: theme.colors.textPrimary, marginBottom: 4 }}>
                        Upload Player List
                      </Text>
                      <Text style={{ color: theme.colors.textSecondary, fontSize: 11, textAlign: 'center', marginBottom: 12 }}>
                        Upload an Excel file (.xlsx) with player names.
                      </Text>

                      <TouchableOpacity
                        onPress={handleFileUpload}
                        style={{
                          backgroundColor: '#fff',
                          borderWidth: 1,
                          borderColor: '#e2e8f0',
                          paddingVertical: 6,
                          paddingHorizontal: 14,
                          borderRadius: 6,
                        }}
                      >
                        <Text style={{ fontWeight: '600', color: theme.colors.textSecondary, fontSize: 13 }}>
                          Select Excel File
                        </Text>
                      </TouchableOpacity>

                      {formData.playerFile && (
                        <Text style={{ marginTop: 8, color: '#10b981', fontSize: 12, fontWeight: '500' }}>
                          ✓ {formData.playerFile.name} attached
                        </Text>
                      )}
                    </View>

                    {errors.playerFile && (
                      <Text style={[errorTextStyle, { marginTop: 2 }]}>{errors.playerFile}</Text>
                    )}

                    <TouchableOpacity style={{ padding: 4 }}>
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
                  onPress={currentStep === 1 ? onClose : prevStep}
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
  );
}