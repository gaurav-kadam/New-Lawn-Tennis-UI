import React, { useState, useEffect } from 'react';
import {
  DimensionValue,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { useTheme } from '../../theme/themeContext';

import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import RadioGroup from '../ui/RadioGroup';

// Sizing layouts uniform with team and match models
const TABLET_BREAKPOINT = 768;
const MODAL_DESKTOP_WIDTH = 520; 
const MODAL_MOBILE_WIDTH = '92%';
const SCROLL_MOBILE_HEIGHT = 320; 
const SCROLL_DESKTOP_HEIGHT = 340; 
const FIELD_ROW_GAP = 12;

export default function AddOfficialModal({ visible, onClose, onSave, initialData }: any) {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const isMobile = screenWidth < TABLET_BREAKPOINT;
  const cardWidth: DimensionValue = isMobile ? MODAL_MOBILE_WIDTH : MODAL_DESKTOP_WIDTH;
  const scrollMaxHeight = isMobile ? SCROLL_MOBILE_HEIGHT : SCROLL_DESKTOP_HEIGHT;

  // 🌟 HELPER: Convert YYYY-MM-DD (backend) -> DD/MM/YYYY (frontend display)
  const formatDbDateToUi = (rawDate: string) => {
    if (!rawDate) return '';
    if (/^\d{4}-\d{2}-\d{2}/.test(rawDate)) {
      const [year, month, day] = rawDate.split('T')[0].split('-');
      return `${day}/${month}/${year}`;
    }
    return rawDate;
  };

  // 🌟 HELPER: Convert DD/MM/YYYY (user input) -> YYYY-MM-DD (backend database)
  const formatUiDateToDb = (uiDate: string) => {
    if (!uiDate) return '';
    const parts = uiDate.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month}-${day}`;
    }
    return uiDate;
  };

  const [errors, setErrors] = useState<any>({});

  const [formData, setFormData] = useState({
    firstName: '', 
    lastName: '', 
    email: '',
    phoneNo: '', 
    gender: 'Men', 
    state: '', 
    city: '',
    dob: '' 
  });

  // Prefill hook handling clean lifecycle mounts matching UserModal structure
  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phoneNo: initialData.phoneNo || '',
        gender: initialData.gender || 'Men',
        state: initialData.state || '',
        city: initialData.city || '',
        dob: formatDbDateToUi(initialData.dob || '')
      });
    } else {
      resetForm();
    }
  }, [initialData, visible]);

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNo: '',
      gender: 'Men',
      state: '',
      city: '',
      dob: ''
    });
    setErrors({});
  };

  const update = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    let newErrors: any = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.phoneNo.trim()) newErrors.phoneNo = "Phone number is required";
    else if (formData.phoneNo.length < 10) newErrors.phoneNo = "Enter a valid phone number";
    
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    
    if (!formData.dob.trim()) {
      newErrors.dob = "Date of birth is required";
    } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formData.dob)) {
      newErrors.dob = "Use valid DD/MM/YYYY format";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      const submittableData = {
        ...formData,
        dob: formatUiDateToDb(formData.dob)
      };
      onSave(submittableData);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const errorTextStyle = {
    color: '#ef4444',
    fontSize: 11,
    marginTop: -4, 
    marginLeft: 4,
    marginBottom: 4
  };

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
          backgroundColor: 'rgba(0,0,0,0.45)', // 🌟 Darks the background identically to UserModal
          padding: 20,
        }}
      >
        <View style={{ width: cardWidth, maxWidth: '100%' }}>
          <Card variant="elevated">
            <View style={{ paddingHorizontal: isMobile ? 16 : 24, paddingVertical: 16 }}>
              
              {/* Header Block */}
              <View style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ 
                    fontSize: isMobile ? 18 : 22, 
                    fontWeight: 'bold', 
                    color: theme.colors.textPrimary 
                  }}>
                    {initialData ? 'Update Official' : 'Add New Official'}
                  </Text>
                  <TouchableOpacity onPress={handleClose} style={{ padding: 4 }}>
                    <Text style={{ fontSize: 18, color: theme.colors.textSecondary }}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Content Field Form Scrollable Box */}
              <ScrollView 
                showsVerticalScrollIndicator={false} 
                style={{ maxHeight: scrollMaxHeight }}
                contentContainerStyle={{ paddingHorizontal: 2 }}
              >
                <View style={{ gap: FIELD_ROW_GAP, paddingBottom: 4 }}>
                  
                  {/* Names Row */}
                  <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
                    <View style={{ flex: 1 }}>
                      <Input 
                        label="First Name" 
                        placeholder="Enter First Name"
                        value={formData.firstName} 
                        onChangeText={(v: string) => update('firstName', v)} 
                      />
                      {errors.firstName && <Text style={errorTextStyle}>{errors.firstName}</Text>}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Input 
                        label="Last Name" 
                        placeholder="Enter Last Name"
                        value={formData.lastName} 
                        onChangeText={(v: string) => update('lastName', v)} 
                      />
                      {errors.lastName && <Text style={errorTextStyle}>{errors.lastName}</Text>}
                    </View>
                  </View>

                  <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
                    <View style={{ flex: 1 }}>
                      <Input 
                        label="Phone No" 
                        placeholder="Contact No"
                        value={formData.phoneNo} 
                        keyboardType="numeric" 
                        onChangeText={(v: string) => update('phoneNo', v)} 
                      />
                      {errors.phoneNo && <Text style={errorTextStyle}>{errors.phoneNo}</Text>}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Input
                        label="Date of Birth"
                        value={formData.dob}
                        placeholder="DD/MM/YYYY" 
                        keyboardType="numeric"
                        maxLength={10}
                        onChangeText={(v: string) => {
                          const cleaned = v.replace(/\D/g, '');
                          let formatted = cleaned;

                          if (cleaned.length > 2 && cleaned.length <= 4) {
                            formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
                          } else if (cleaned.length > 4) {
                            formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
                          }

                          update('dob', formatted);
                        }}
                      />
                      {errors.dob && <Text style={errorTextStyle}>{errors.dob}</Text>}
                    </View>
                  </View>
                  
                   

              


                  

                  <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
                    <View style={{ flex: 1 }}>
                      <Input 
                        label="State" 
                        placeholder="State" 
                        value={formData.state} 
                        onChangeText={(v: string) => update('state', v)} 
                      />
                      {errors.state && <Text style={errorTextStyle}>{errors.state}</Text>}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Input 
                        label="City" 
                        placeholder="City"
                        value={formData.city} 
                        onChangeText={(v: string) => update('city', v)} 
                      />
                      {errors.city && <Text style={errorTextStyle}>{errors.city}</Text>}
                    </View>
                  </View>
                  <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
                  <View style={{ flex: 1.7 }}>
                    <Input 
                      label="Email Address" 
                      placeholder="Enter Email ID"
                      value={formData.email} 
                      onChangeText={(v: string) => update('email', v)} 
                    />
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <RadioGroup 
                      label="Gender" 
                      value={formData.gender} 
                      onChange={(v: any) => update('gender', v)} 
                      options={[
                        { label: 'Men', value: 'Men' }, 
                        { label: 'Women', value: 'Women' }
                      ]}
                    />
                    {errors.gender && <Text style={errorTextStyle}>{errors.gender}</Text>}
                  </View>

              


                  </View>
                  
                </View>
              </ScrollView>

              {/* Footer Navigation Buttons */}
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'flex-end', 
                alignItems: 'center',
                gap: 8, 
                marginTop: 16 
              }}>
                <View style={{ flex: isMobile ? 1 : 0, minWidth: isMobile ? 0 : 100 }}>
                  <Button title="Cancel" variant="ghost" onPress={handleClose} />
                </View>
                <View style={{ flex: isMobile ? 1.5 : 0, minWidth: isMobile ? 0 : 180 }}>
                  <Button 
                    title={initialData ? "Update Official" : "Save Official"} 
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