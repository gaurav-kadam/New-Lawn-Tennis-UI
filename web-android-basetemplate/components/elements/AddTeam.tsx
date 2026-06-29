import React, { useState } from 'react';
import {
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

export default function CreateTeamModal({
  onClose,
  onSave,
  initialData,
}: any) {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const isMobile = screenWidth < 768;
  const cardWidth = isMobile ? '92%' : 600;
  const scrollMaxHeight = isMobile ? 380 : 420;

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<any>({});

  const [formData, setFormData] = useState<any>({
    teamName: initialData?.teamName || '',
    shortName: initialData?.shortName || '',
    state: initialData?.state || '',
    city: initialData?.city || '',
    gender: initialData?.gender || '',
    section: initialData?.section || '',
    headCoach: initialData?.headCoach || '',
    coach: initialData?.coach || '',
    manager: initialData?.manager || '',
    playerFile: initialData?.playerFile || null,
  });

  const update = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        [field]: null,
      }));
    }
  };

  const validateStep = () => {
    const stepErrors: any = {};

    if (currentStep === 1) {
      if (!formData.teamName.trim()) {
        stepErrors.teamName = 'Team full name is required';
      }

      if (!formData.shortName.trim()) {
        stepErrors.shortName = 'Short name is required';
      }

      if (!formData.gender) {
        stepErrors.gender = 'Gender is required';
      }

      if (!formData.state.trim()) {
        stepErrors.state = 'State is required';
      }

      if (!formData.city.trim()) {
        stepErrors.city = 'City is required';
      }

      if (!formData.section) {
        stepErrors.section = 'Section is required';
      }
    }

    if (currentStep === 2) {
      if (!formData.headCoach.trim()) {
        stepErrors.headCoach = 'Head coach name is required';
      }

      if (!formData.coach.trim()) {
        stepErrors.coach = 'Assistant coach name is required';
      }

      if (!formData.manager.trim()) {
        stepErrors.manager = 'Team manager name is required';
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep() && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
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

    const headers = [
      'jourcy no',
      'player name',
      'playing position',
      'substitute player',
      'dp',
      'flex',
    ];

    const sampleRows = [
      ['7', 'Rahul Patil', 'Pitcher', 'No', 'No', 'No'],
      ['12', 'Amit Shinde', 'Catcher', 'No', 'Yes', 'No'],
      ['21', 'Sagar Jadhav', 'First Base', 'Yes', 'No', 'Yes'],
    ];

    const csvContent = [
      headers.join(','),
      ...sampleRows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

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
    if (currentStep === 3) {
      onSave(formData);
      return;
    }

    if (validateStep()) {
      nextStep();
    }
  };

  const errorTextStyle = {
    color: '#ef4444',
    fontSize: 11,
    marginTop: -12,
    marginLeft: 4,
    marginBottom: 8,
  };

  const attachedFileName =
    formData.playerFile?.name || formData.playerFile || '';

  return (
    <View style={{ width: cardWidth, alignSelf: 'center' }}>
      <Card variant="elevated">
        <View
          style={{
            paddingHorizontal: isMobile ? 15 : 25,
            paddingVertical: isMobile ? 15 : 20,
          }}
        >
          <View style={{ marginBottom: 10 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: isMobile ? 18 : 22,
                  fontWeight: 'bold',
                  color: theme.colors.textPrimary,
                }}
              >
                {initialData ? 'Update Team' : 'Register New Team'}
              </Text>

              <TouchableOpacity onPress={onClose}>
                <Text
                  style={{
                    fontSize: 18,
                    color: theme.colors.textSecondary,
                  }}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={{
                color: theme.colors.textSecondary,
                fontSize: 12,
                marginTop: 2,
              }}
            >
              Step {currentStep} of 3
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginBottom: 20,
              gap: 10,
            }}
          >
            {['Details', 'Staff', 'Players'].map((label, index) => (
              <View
                key={label}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor:
                    currentStep >= index + 1
                      ? theme.colors.primary
                      : '#e2e8f0',
                }}
              />
            ))}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: scrollMaxHeight }}
          >
            <View style={{ gap: isMobile ? 8 : 12 }}>
              {currentStep === 1 && (
                <View style={{ gap: isMobile ? 8 : 12 }}>
                  <View>
                    <Input
                      label="Team Full Name"
                      placeholder="e.g. Maharashtra Warriors"
                      value={formData.teamName}
                      onChangeText={(value: any) =>
                        update('teamName', value)
                      }
                    />
                    {errors.teamName && (
                      <Text style={errorTextStyle}>
                        {errors.teamName}
                      </Text>
                    )}
                  </View>

                  <View
                    style={{
                      flexDirection: isMobile ? 'column' : 'row',
                      gap: isMobile ? 8 : 12,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Input
                        label="Short Name (Code)"
                        placeholder="e.g. MAH"
                        value={formData.shortName}
                        onChangeText={(value: any) =>
                          update('shortName', value)
                        }
                      />
                      {errors.shortName && (
                        <Text style={errorTextStyle}>
                          {errors.shortName}
                        </Text>
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <RadioGroup
                        label="Gender"
                        value={formData.gender}
                        onChange={(value: any) =>
                          update('gender', value)
                        }
                        options={[
                          { label: 'Men', value: 'Men' },
                          { label: 'Women', value: 'Women' },
                        ]}
                      />
                      {errors.gender && (
                        <Text
                          style={{
                            ...errorTextStyle,
                            marginTop: -4,
                          }}
                        >
                          {errors.gender}
                        </Text>
                      )}
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: isMobile ? 'column' : 'row',
                      gap: isMobile ? 8 : 12,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Input
                        label="State"
                        placeholder="State"
                        value={formData.state}
                        onChangeText={(value: any) =>
                          update('state', value)
                        }
                      />
                      {errors.state && (
                        <Text style={errorTextStyle}>
                          {errors.state}
                        </Text>
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Input
                        label="City"
                        placeholder="City"
                        value={formData.city}
                        onChangeText={(value: any) =>
                          update('city', value)
                        }
                      />
                      {errors.city && (
                        <Text style={errorTextStyle}>
                          {errors.city}
                        </Text>
                      )}
                    </View>
                  </View>

                  <View>
                    <Select
                      label="Section"
                      value={formData.section}
                      onChange={(value: any) =>
                        update('section', value)
                      }
                      options={[
                        {
                          label: 'Under-15',
                          value: 'Under-15',
                        },
                        {
                          label: 'Under-19',
                          value: 'U19',
                        },
                        {
                          label: 'Open',
                          value: 'Open',
                        },
                      ]}
                    />
                    {errors.section && (
                      <Text
                        style={{
                          ...errorTextStyle,
                          marginTop: -4,
                        }}
                      >
                        {errors.section}
                      </Text>
                    )}
                  </View>
                </View>
              )}

              {currentStep === 2 && (
                <View style={{ gap: isMobile ? 8 : 12 }}>
                  <View>
                    <Input
                      label="Head Coach"
                      placeholder="Enter head coach name"
                      value={formData.headCoach}
                      onChangeText={(value: any) =>
                        update('headCoach', value)
                      }
                    />
                    {errors.headCoach && (
                      <Text style={errorTextStyle}>
                        {errors.headCoach}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Input
                      label="Assistant Coach"
                      placeholder="Enter coach name"
                      value={formData.coach}
                      onChangeText={(value: any) =>
                        update('coach', value)
                      }
                    />
                    {errors.coach && (
                      <Text style={errorTextStyle}>
                        {errors.coach}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Input
                      label="Team Manager"
                      placeholder="Enter manager name"
                      value={formData.manager}
                      onChangeText={(value: any) =>
                        update('manager', value)
                      }
                    />
                    {errors.manager && (
                      <Text style={errorTextStyle}>
                        {errors.manager}
                      </Text>
                    )}
                  </View>
                </View>
              )}

              {currentStep === 3 && (
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 10,
                    gap: 15,
                  }}
                >
                  <View
                    style={{
                      width: '100%',
                      padding: 25,
                      borderStyle: 'dashed',
                      borderWidth: 2,
                      borderColor: '#cbd5e1',
                      borderRadius: 12,
                      alignItems: 'center',
                      backgroundColor: theme.colors.background,
                    }}
                  >
                    <Text style={{ fontSize: 32, marginBottom: 10 }}>
                      📊
                    </Text>

                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: theme.colors.textPrimary,
                        marginBottom: 5,
                      }}
                    >
                      Upload Player List
                    </Text>

                    <Text
                      style={{
                        color: theme.colors.textSecondary,
                        fontSize: 12,
                        textAlign: 'center',
                        marginBottom: 15,
                      }}
                    >
                      Upload an Excel file .xlsx or .xls with players.
                    </Text>

                    <TouchableOpacity
                      onPress={handleFileUpload}
                      style={{
                        backgroundColor: '#fff',
                        borderWidth: 1,
                        borderColor: '#e2e8f0',
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: '600',
                          color: theme.colors.textSecondary,
                        }}
                      >
                        Select Excel File
                      </Text>
                    </TouchableOpacity>

                    {attachedFileName ? (
                      <Text
                        style={{
                          marginTop: 10,
                          color: '#10b981',
                          fontSize: 12,
                        }}
                      >
                        ✓ {attachedFileName} attached
                      </Text>
                    ) : null}
                  </View>

                  <TouchableOpacity onPress={handleDownloadTemplate}>
                    <Text
                      style={{
                        color: theme.colors.primary,
                        fontSize: 13,
                        fontWeight: '600',
                      }}
                    >
                      Download Template
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 10,
              marginTop: 20,
            }}
          >
            <View
              style={{
                flex: isMobile ? 1 : 0,
                minWidth: isMobile ? 0 : 100,
              }}
            >
              <Button
                title={currentStep === 1 ? 'Cancel' : 'Back'}
                variant="ghost"
                onPress={currentStep === 1 ? onClose : prevStep}
              />
            </View>

            <View
              style={{
                flex: isMobile ? 2 : 0,
                minWidth: isMobile ? 0 : 200,
              }}
            >
              <Button
                title={
                  currentStep === 3
                    ? initialData
                      ? 'Update Team'
                      : 'Register Team'
                    : 'Next Step'
                }
                onPress={handleSave}
              />
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
}