import { useState, useEffect } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

import { useTheme } from '../../theme/themeContext';

import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import RadioGroup from '../ui/RadioGroup';
import Select from '../ui/Select';

export default function CreatePlayerModal({
  visible = true,
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

  // ============================================================
  // FORM DATA
  // ============================================================

  const [formData, setFormData] = useState({
    name:
      initialData?.player_name ||
      initialData?.name ||
      '',

    age: initialData?.age
      ? String(initialData.age)
      : '',

    gender:
      initialData?.gender ||
      '',

    state:
      initialData?.state ||
      '',

    city:
      initialData?.city ||
      '',

    mobile:
      initialData?.mobile
        ? String(initialData.mobile)
        : '',

    weight: initialData?.weight
      ? String(initialData.weight)
      : '',

    category:
      initialData?.category ||
      '',
  });

  // ============================================================
  // RESET WHEN MODAL OPENS
  // ============================================================

  useEffect(() => {
    if (visible) {
      setCurrentStep(1);
      setErrors({});

      setFormData({
        name:
          initialData?.player_name ||
          initialData?.name ||
          '',

        age: initialData?.age
          ? String(initialData.age)
          : '',

        gender:
          initialData?.gender ||
          '',

        state:
          initialData?.state ||
          '',

        city:
          initialData?.city ||
          '',

        mobile:
          initialData?.mobile
            ? String(initialData.mobile)
            : '',

        weight: initialData?.weight
          ? String(initialData.weight)
          : '',

        category:
          initialData?.category ||
          '',
      });
    }
  }, [visible, initialData]);

  // ============================================================
  // UPDATE FIELD
  // ============================================================

  const update = (
    field: string,
    value: any
  ) => {
    let finalValue = value;

    // ----------------------------------------------------------
    // Mobile number
    // Only allow digits and maximum 10 digits.
    // ----------------------------------------------------------

    if (field === 'mobile') {
      finalValue = String(value)
        .replace(/\D/g, '')
        .slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: finalValue,
    }));

    if (errors[field]) {
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        [field]: null,
      }));
    }
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validateStep = () => {
    const stepErrors: any = {};

    // ==========================================================
    // STEP 1
    // ==========================================================

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        stepErrors.name =
          'Player name is required';
      }

      if (!formData.age.trim()) {
        stepErrors.age =
          'Age is required';
      } else if (
        Number.isNaN(
          Number(formData.age)
        )
      ) {
        stepErrors.age =
          'Age must be a number';
      }

      if (!formData.gender) {
        stepErrors.gender =
          'Gender is required';
      }

      if (!formData.weight.trim()) {
        stepErrors.weight =
          'Weight is required';
      } else if (
        Number.isNaN(
          Number(formData.weight)
        )
      ) {
        stepErrors.weight =
          'Weight must be a number';
      }

      if (!formData.category) {
        stepErrors.category =
          'Category is required';
      }
    }

    // ==========================================================
    // STEP 2
    // ==========================================================

    if (currentStep === 2) {
      if (!formData.state.trim()) {
        stepErrors.state =
          'State is required';
      }

      if (!formData.city.trim()) {
        stepErrors.city =
          'City is required';
      }

      if (!formData.mobile.trim()) {
        stepErrors.mobile =
          'Mobile number is required';
      } else if (
        !/^[0-9]{10}$/.test(
          formData.mobile
        )
      ) {
        stepErrors.mobile =
          'Mobile number must be exactly 10 digits';
      }
    }

    setErrors(stepErrors);

    return (
      Object.keys(stepErrors).length === 0
    );
  };

  // ============================================================
  // NEXT STEP
  // ============================================================

  const nextStep = () => {
    const valid = validateStep();

    if (!valid) {
      return;
    }

    if (currentStep < 2) {
      setCurrentStep(
        (prev) => prev + 1
      );
    }
  };

  // ============================================================
  // PREVIOUS STEP
  // ============================================================

  const prevStep = () => {
    setErrors({});

    if (currentStep > 1) {
      setCurrentStep(
        (prev) => prev - 1
      );
    }
  };

  // ============================================================
  // SAVE PLAYER
  // ============================================================

  const handleSave = () => {
    console.log(
      '================================'
    );

    console.log(
      'PLAYER BUTTON CLICKED'
    );

    console.log(
      'CURRENT STEP:',
      currentStep
    );

    console.log(
      'FORM DATA:',
      formData
    );

    // ----------------------------------------------------------
    // Only save on Step 2
    // ----------------------------------------------------------

    if (currentStep !== 2) {
      nextStep();
      return;
    }

    // ----------------------------------------------------------
    // Validate
    // ----------------------------------------------------------

    const valid = validateStep();

    console.log(
      'VALID:',
      valid
    );

    if (!valid) {
      console.log(
        'PLAYER VALIDATION FAILED'
      );

      return;
    }

    // ----------------------------------------------------------
    // IMPORTANT
    //
    // Backend expects:
    //
    // player_name
    // mobile
    //
    // NOT:
    //
    // name
    // ----------------------------------------------------------

    const payload = {
      player_name:
        formData.name.trim(),

      age:
        Number(formData.age),

      gender:
        formData.gender,

      state:
        formData.state.trim(),

      city:
        formData.city.trim(),

      mobile:
        formData.mobile.trim(),

      weight:
        Number(formData.weight),

      category:
        formData.category,
    };

    console.log(
      'PLAYER PAYLOAD:',
      payload
    );

    console.log(
      'PLAYER NAME:',
      payload.player_name
    );

    console.log(
      'MOBILE:',
      payload.mobile
    );

    console.log(
      '================================'
    );

    onSave(payload);
  };

  // ============================================================
  // ERROR STYLE
  // ============================================================

  const errorTextStyle = {
    color: '#ef4444',
    fontSize: 11,
    marginTop: -8,
    marginLeft: 4,
    marginBottom: 8,
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor:
            'rgba(0,0,0,0.45)',
          padding: 20,
        }}
      >
        <View
          style={{
            width: cardWidth,
            alignSelf: 'center',
          }}
        >
          <Card variant="elevated">
            <View
              style={{
                paddingHorizontal:
                  isMobile ? 15 : 25,
                paddingVertical:
                  isMobile ? 15 : 20,
              }}
            >
              {/* ================================================= */}
              {/* HEADER */}
              {/* ================================================= */}

              <View
                style={{
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent:
                      'space-between',
                    alignItems:
                      'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize:
                        isMobile
                          ? 18
                          : 22,
                      fontWeight:
                        'bold',
                      color:
                        theme.colors
                          .textPrimary,
                    }}
                  >
                    {initialData
                      ? 'Update Player'
                      : 'Register New Player'}
                  </Text>

                  <TouchableOpacity
                    onPress={onClose}
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
                    color:
                      theme.colors
                        .textSecondary,
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  Step {currentStep} of 2
                </Text>
              </View>

              {/* ================================================= */}
              {/* STEPPER */}
              {/* ================================================= */}

              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 20,
                  gap: 10,
                }}
              >
                {[
                  'Player Details',
                  'Contact',
                ].map(
                  (label, i) => (
                    <View
                      key={label}
                      style={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor:
                          currentStep >=
                          i + 1
                            ? theme
                                .colors
                                .primary
                            : '#e2e8f0',
                      }}
                    />
                  )
                )}
              </View>

              {/* ================================================= */}
              {/* FORM */}
              {/* ================================================= */}

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
                    gap:
                      isMobile
                        ? 8
                        : 12,
                  }}
                >
                  {/* ================================================= */}
                  {/* STEP 1 */}
                  {/* ================================================= */}

                  {currentStep ===
                    1 && (
                    <View
                      style={{
                        gap:
                          isMobile
                            ? 8
                            : 12,
                      }}
                    >
                      {/* PLAYER NAME */}

                      <View>
                        <Input
                          label="Player Name"
                          placeholder="Enter player name"
                          value={
                            formData.name
                          }
                          onChangeText={(
                            v: any
                          ) =>
                            update(
                              'name',
                              v
                            )
                          }
                        />

                        {errors.name && (
                          <Text
                            style={
                              errorTextStyle
                            }
                          >
                            {
                              errors.name
                            }
                          </Text>
                        )}
                      </View>

                      {/* AGE + WEIGHT */}

                      <View
                        style={{
                          flexDirection:
                            isMobile
                              ? 'column'
                              : 'row',
                          gap:
                            isMobile
                              ? 8
                              : 12,
                        }}
                      >
                        {/* AGE */}

                        <View
                          style={{
                            flex: 1,
                          }}
                        >
                          <Input
                            label="Age"
                            placeholder="Enter age"
                            value={
                              formData.age
                            }
                            onChangeText={(
                              v: any
                            ) =>
                              update(
                                'age',
                                v
                              )
                            }
                          />

                          {errors.age && (
                            <Text
                              style={
                                errorTextStyle
                              }
                            >
                              {
                                errors.age
                              }
                            </Text>
                          )}
                        </View>

                        {/* WEIGHT */}

                        <View
                          style={{
                            flex: 1,
                          }}
                        >
                          <Input
                            label="Weight"
                            placeholder="Enter weight"
                            value={
                              formData.weight
                            }
                            onChangeText={(
                              v: any
                            ) =>
                              update(
                                'weight',
                                v
                              )
                            }
                          />

                          {errors.weight && (
                            <Text
                              style={
                                errorTextStyle
                              }
                            >
                              {
                                errors.weight
                              }
                            </Text>
                          )}
                        </View>
                      </View>

                      {/* GENDER */}

                      <RadioGroup
                        label="Gender"
                        value={
                          formData.gender
                        }
                        onChange={(
                          v: any
                        ) =>
                          update(
                            'gender',
                            v
                          )
                        }
                        options={[
                          {
                            label:
                              'Male',
                            value:
                              'male',
                          },
                          {
                            label:
                              'Female',
                            value:
                              'female',
                          },
                        ]}
                      />

                      {errors.gender && (
                        <Text
                          style={
                            errorTextStyle
                          }
                        >
                          {
                            errors.gender
                          }
                        </Text>
                      )}

                      {/* CATEGORY */}

                      <Select
                        label="Category"
                        value={
                          formData.category
                        }
                        onChange={(
                          v: any
                        ) =>
                          update(
                            'category',
                            v
                          )
                        }
                        options={[
                          {
                            label:
                              'Under-15',
                            value:
                              'Under-15',
                          },
                          {
                            label:
                              'Under-19',
                            value:
                              'Under-19',
                          },
                          {
                            label:
                              'Open',
                            value:
                              'Open',
                          },
                        ]}
                      />

                      {errors.category && (
                        <Text
                          style={
                            errorTextStyle
                          }
                        >
                          {
                            errors.category
                          }
                        </Text>
                      )}
                    </View>
                  )}

                  {/* ================================================= */}
                  {/* STEP 2 */}
                  {/* ================================================= */}

                  {currentStep ===
                    2 && (
                    <View
                      style={{
                        gap:
                          isMobile
                            ? 8
                            : 12,
                      }}
                    >
                      {/* STATE */}

                      <Input
                        label="State"
                        placeholder="Enter state"
                        value={
                          formData.state
                        }
                        onChangeText={(
                          v: any
                        ) =>
                          update(
                            'state',
                            v
                          )
                        }
                      />

                      {errors.state && (
                        <Text
                          style={
                            errorTextStyle
                          }
                        >
                          {
                            errors.state
                          }
                        </Text>
                      )}

                      {/* CITY */}

                      <Input
                        label="City"
                        placeholder="Enter city"
                        value={
                          formData.city
                        }
                        onChangeText={(
                          v: any
                        ) =>
                          update(
                            'city',
                            v
                          )
                        }
                      />

                      {errors.city && (
                        <Text
                          style={
                            errorTextStyle
                          }
                        >
                          {
                            errors.city
                          }
                        </Text>
                      )}

                      {/* MOBILE */}

                      <Input
                        label="Mobile"
                        placeholder="Enter 10 digit mobile number"
                        value={
                          formData.mobile
                        }
                        onChangeText={(
                          v: any
                        ) =>
                          update(
                            'mobile',
                            v
                          )
                        }
                      />

                      {errors.mobile && (
                        <Text
                          style={
                            errorTextStyle
                          }
                        >
                          {
                            errors.mobile
                          }
                        </Text>
                      )}

                      {!errors.mobile &&
                        formData.mobile.length >
                          0 &&
                        formData.mobile.length <
                          10 && (
                          <Text
                            style={
                              errorTextStyle
                            }
                          >
                            Mobile number must contain
                            10 digits
                          </Text>
                        )}
                    </View>
                  )}
                </View>
              </ScrollView>

              {/* ================================================= */}
              {/* FOOTER */}
              {/* ================================================= */}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent:
                    'flex-end',
                  alignItems:
                    'center',
                  gap: 10,
                  marginTop: 20,
                }}
              >
                {/* BACK / CANCEL */}

                <View
                  style={{
                    flex:
                      isMobile
                        ? 1
                        : 0,
                    minWidth:
                      isMobile
                        ? 0
                        : 100,
                  }}
                >
                  <Button
                    title={
                      currentStep ===
                      1
                        ? 'Cancel'
                        : 'Back'
                    }
                    variant="ghost"
                    onPress={
                      currentStep ===
                      1
                        ? onClose
                        : prevStep
                    }
                  />
                </View>

                {/* NEXT / REGISTER */}

                <View
                  style={{
                    flex:
                      isMobile
                        ? 2
                        : 0,
                    minWidth:
                      isMobile
                        ? 0
                        : 200,
                  }}
                >
                  <Button
                    title={
                      currentStep ===
                      2
                        ? initialData
                          ? 'Update Player'
                          : 'Register Player'
                        : 'Next Step'
                    }
                    onPress={
                      handleSave
                    }
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