import React, { useEffect, useState } from 'react';
import {
  DimensionValue,
  Modal,
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
const SCROLL_MOBILE_HEIGHT = 500;
const SCROLL_DESKTOP_HEIGHT = 520;
const FIELD_ROW_GAP = 12;

type TeamFormData = {
  teamName: string;
  shortName: string;
  state: string;
  city: string;
  gender: string;
  section: string;
  headCoach: string;
  coach: string;
  manager: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (data: TeamFormData) => void;
  initialData?: Partial<TeamFormData> | null;
};

const EMPTY_FORM: TeamFormData = {
  teamName: '',
  shortName: '',
  state: '',
  city: '',
  gender: '',
  section: '',
  headCoach: '',
  coach: '',
  manager: '',
};

export default function CreateTeamModal({
  visible,
  onClose,
  onSave,
  initialData,
}: Props) {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const isMobile = width < TABLET_BREAKPOINT;

  const cardWidth: DimensionValue = isMobile
    ? MODAL_MOBILE_WIDTH
    : MODAL_DESKTOP_WIDTH;

  const scrollMaxHeight = isMobile
    ? SCROLL_MOBILE_HEIGHT
    : SCROLL_DESKTOP_HEIGHT;

  const [formData, setFormData] =
    useState<TeamFormData>(EMPTY_FORM);

  const [errors, setErrors] =
    useState<Record<string, string>>({});

  /* ---------------------------------------------------------
     LOAD / RESET FORM
  --------------------------------------------------------- */

  useEffect(() => {
    if (!visible) return;

    setErrors({});

    if (initialData) {
      setFormData({
        teamName: initialData.teamName ?? '',
        shortName: initialData.shortName ?? '',
        state: initialData.state ?? '',
        city: initialData.city ?? '',
        gender: initialData.gender ?? '',
        section: initialData.section ?? '',
        headCoach: initialData.headCoach ?? '',
        coach: initialData.coach ?? '',
        manager: initialData.manager ?? '',
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [visible, initialData]);

  /* ---------------------------------------------------------
     CLOSE
  --------------------------------------------------------- */

  const handleClose = () => {
    setErrors({});
    setFormData(EMPTY_FORM);
    onClose();
  };

  /* ---------------------------------------------------------
     UPDATE FIELD
  --------------------------------------------------------- */

  const update = (
    field: keyof TeamFormData,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  /* ---------------------------------------------------------
     VALIDATION
  --------------------------------------------------------- */

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    const alphaSpaceRegex = /^[a-zA-Z\s]+$/;
    const pureAlphaRegex = /^[a-zA-Z]+$/;

    const validateName = (
      field: keyof TeamFormData,
      label: string
    ) => {
      const value = formData[field].trim();

      if (!value) {
        nextErrors[field] = `${label} is required`;
      } else if (!alphaSpaceRegex.test(value)) {
        nextErrors[field] =
          'Letters and spaces only';
      }
    };

    /* Team information */

    validateName(
      'teamName',
      'Team full name'
    );

    if (!formData.shortName.trim()) {
      nextErrors.shortName =
        'Short name is required';
    } else if (
      !pureAlphaRegex.test(
        formData.shortName.trim()
      )
    ) {
      nextErrors.shortName =
        'Letters only (no spaces or symbols)';
    }

    if (!formData.gender) {
      nextErrors.gender =
        'Gender is required';
    }

    validateName('state', 'State');
    validateName('city', 'City');

    if (!formData.section) {
      nextErrors.section =
        'Section is required';
    }

    /* Staff */

    validateName(
      'headCoach',
      'Head coach name'
    );

    validateName(
      'coach',
      'Assistant coach name'
    );

    validateName(
      'manager',
      'Team manager name'
    );

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  /* ---------------------------------------------------------
     SAVE TEAM
  --------------------------------------------------------- */

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    onSave({
      teamName: formData.teamName.trim(),
      shortName: formData.shortName.trim(),
      state: formData.state.trim(),
      city: formData.city.trim(),
      gender: formData.gender,
      section: formData.section,
      headCoach: formData.headCoach.trim(),
      coach: formData.coach.trim(),
      manager: formData.manager.trim(),
    });
  };

  /* ---------------------------------------------------------
     RENDER
  --------------------------------------------------------- */

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
          backgroundColor: 'rgba(0,0,0,0.45)',
          padding: 20,
        }}
      >
        <View
          style={{
            width: cardWidth,
            maxWidth: '100%',
          }}
        >
          <Card variant="elevated">
            <View
              style={{
                paddingHorizontal: isMobile
                  ? 16
                  : 24,
                paddingVertical: 16,
              }}
            >
              {/* HEADER */}

              <View
                style={{
                  marginBottom: 16,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent:
                      'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: isMobile
                        ? 18
                        : 22,
                      fontWeight: 'bold',
                      color:
                        theme.colors
                          .textPrimary,
                    }}
                  >
                    {initialData
                      ? 'Update Team'
                      : 'Register New Team'}
                  </Text>

                  <TouchableOpacity
                    onPress={handleClose}
                    style={{
                      padding: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        color:
                          theme.colors
                            .textSecondary,
                      }}
                    >
                      ✕
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text
                  style={{
                    marginTop: 4,
                    color:
                      theme.colors
                        .textSecondary,
                    fontSize: 12,
                  }}
                >
                  Enter team details and staff information.
                </Text>
              </View>

              {/* FORM */}

              <ScrollView
                showsVerticalScrollIndicator={
                  false
                }
                style={{
                  maxHeight:
                    scrollMaxHeight,
                }}
              >
                <View
                  style={{
                    gap: FIELD_ROW_GAP,
                    paddingBottom: 4,
                  }}
                >
                  {/* TEAM NAME */}

                  <Input
                    label="Team Full Name"
                    placeholder="e.g. Maharashtra Warriors"
                    value={
                      formData.teamName
                    }
                   onChangeText={(value: string) =>
                    update(
                      'teamName',
                      value
                    )
                  }
                    error={
                      errors.teamName
                    }
                  />

                  {/* SHORT NAME + GENDER */}

                  <View
                    style={{
                      flexDirection:
                        isMobile
                          ? 'column'
                          : 'row',
                      gap: FIELD_ROW_GAP,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <Input
                        label="Short Name (Code)"
                        placeholder="e.g. MAH"
                        value={
                          formData.shortName
                        }
                        onChangeText={(value: string) =>
                          update(
                            'shortName',
                            value
                          )
                        }
                        error={
                          errors.shortName
                        }
                      />
                    </View>

                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <RadioGroup
                        label="Gender"
                        value={
                          formData.gender
                        }
                        onChange={(value: string) =>
                          update(
                            'gender',
                            value
                          )
                        }
                        options={[
                          {
                            label: 'Men',
                            value: 'Men',
                          },
                          {
                            label: 'Women',
                            value: 'Women',
                          },
                        ]}
                        error={
                          errors.gender
                        }
                      />
                    </View>
                  </View>

                  {/* STATE + CITY */}

                  <View
                    style={{
                      flexDirection:
                        isMobile
                          ? 'column'
                          : 'row',
                      gap: FIELD_ROW_GAP,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <Input
                        label="State"
                        placeholder="State"
                        value={
                          formData.state
                        }
                        onChangeText={(value: string) =>
                          update(
                            'state',
                            value
                          )
                        }
                        error={
                          errors.state
                        }
                      />
                    </View>

                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <Input
                        label="City"
                        placeholder="City"
                        value={
                          formData.city
                        }
                        onChangeText={(value: string) =>
                          update(
                            'city',
                            value
                          )
                        }
                        error={
                          errors.city
                        }
                      />
                    </View>
                  </View>

                  {/* SECTION */}

                  <Select
                    label="Section"
                    value={
                      formData.section
                    }
                    onChange={(value: string) =>
                      update(
                        'section',
                        value
                      )
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
                    error={
                      errors.section
                    }
                  />

                  {/* STAFF */}

                  <Text
                    style={{
                      marginTop: 8,
                      marginBottom: 2,
                      fontSize: 14,
                      fontWeight: '700',
                      color:
                        theme.colors
                          .textPrimary,
                    }}
                  >
                    Staff Information
                  </Text>

                  <Input
                    label="Head Coach"
                    placeholder="Enter head coach name"
                    value={
                      formData.headCoach
                    }
                    onChangeText={(value: string) =>
                      update(
                        'headCoach',
                        value
                      )
                    }
                    error={
                      errors.headCoach
                    }
                  />

                  <Input
                    label="Assistant Coach"
                    placeholder="Enter assistant coach name"
                    value={
                      formData.coach
                    }
                   onChangeText={(value: string) =>
                      update(
                        'coach',
                        value
                      )
                    }
                    error={
                      errors.coach
                    }
                  />

                  <Input
                    label="Team Manager"
                    placeholder="Enter manager name"
                    value={
                      formData.manager
                    }
                    onChangeText={(value: string) =>
                      update(
                        'manager',
                        value
                      )
                    }
                    error={
                      errors.manager
                    }
                  />
                </View>
              </ScrollView>

              {/* FOOTER */}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent:
                    'flex-end',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 16,
                }}
              >
                <Button
                  title="Cancel"
                  variant="danger"
                  onPress={handleClose}
                />

                <Button
                  title={
                    initialData
                      ? 'Update'
                      : 'Create'
                  }
                  onPress={handleSave}
                />
              </View>
            </View>
          </Card>
        </View>
      </View>
    </Modal>
  );
}