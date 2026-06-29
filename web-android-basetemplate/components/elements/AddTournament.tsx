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
import Select from '../ui/Select';

// Sizing layouts uniform with team and official models
const TABLET_BREAKPOINT = 768;
const MODAL_DESKTOP_WIDTH = 520; 
const MODAL_MOBILE_WIDTH = '92%';
const SCROLL_MOBILE_HEIGHT = 320; 
const SCROLL_DESKTOP_HEIGHT = 340; 
const FIELD_ROW_GAP = 12;

export default function AddTournamentModal({ 
  visible, // 🌟 Standardized visibility control prop
  onClose, 
  onSave, 
  initialData 
}: any) {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const isMobile = screenWidth < TABLET_BREAKPOINT;
  const cardWidth: DimensionValue = isMobile ? MODAL_MOBILE_WIDTH : MODAL_DESKTOP_WIDTH;
  const scrollMaxHeight = isMobile ? SCROLL_MOBILE_HEIGHT : SCROLL_DESKTOP_HEIGHT;

  const [errors, setErrors] = useState<any>({});

  const toDisplayDate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('-')) return dateStr;
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const toBackendDate = (dateStr: string) => {
    if (!dateStr || !dateStr.includes('/')) return dateStr;
    const [d, m, y] = dateStr.split('/');
    return `${y}-${m}-${d}`;
  };

  const [formData, setFormData] = useState({
    tournament_name: '',
    start_date: '',
    end_date: '',
    section: '',
    gender: 'Men',
    state: '',
    city: '',
    venue: ''
  });

  // 🌟 Clear side effects and properly lifecycle form states when visibility triggers
  useEffect(() => {
    if (visible) {
      setErrors({});
      setFormData({
        tournament_name: initialData?.tournament_name || '',
        start_date: toDisplayDate(initialData?.start_date) || '',
        end_date: toDisplayDate(initialData?.end_date) || '',
        section: initialData?.section || '',
        gender: initialData?.gender || 'Men',
        state: initialData?.state || '',
        city: initialData?.city || '',
        venue: initialData?.venue || ''
      });
    }
  }, [visible, initialData]);

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const update = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prevErrors: any) => ({ ...prevErrors, [field]: null }));
    }
  };

  const validate = () => {
    let newErrors: any = {};

    if (!formData.tournament_name.trim()) newErrors.tournament_name = "Tournament name is required";
    if (!formData.start_date) newErrors.start_date = "Start date is required";
    if (!formData.end_date) newErrors.end_date = "End date is required";
    if (!formData.section) newErrors.section = "Section is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.venue.trim()) newErrors.venue = "Venue is required";

    if (formData.start_date && formData.end_date) {
      const start = new Date(toBackendDate(formData.start_date));
      const end = new Date(toBackendDate(formData.end_date));
      if (end < start) {
        newErrors.end_date = "End date cannot be earlier than start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (validate()) {
      const payload = {
        ...formData,
        start_date: toBackendDate(formData.start_date),
        end_date: toBackendDate(formData.end_date)
      };
      onSave(payload);
    }
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
          backgroundColor: 'rgba(0, 0, 0, 0.45)', // Uniform translucent backdrop mask
          padding: 20,
        }}
      >
        <View style={{ width: cardWidth, maxWidth: '100%' }}>
          <Card variant="elevated">
            <View style={{ paddingHorizontal: isMobile ? 16 : 24, paddingVertical: 16 }}>
              
              {/* Header Block */}
              <View style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: isMobile ? 18 : 22, fontWeight: 'bold', color: theme.colors.textPrimary }}>
                    {initialData ? "Update Tournament" : "Create New Tournament"}
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
                  
                  <View>
                    <Input 
                      label="Tournament Name" 
                      placeholder="e.g. National Championship"
                      value={formData.tournament_name} 
                      onChangeText={(v: string) => update('tournament_name', v)} 
                    />
                    {errors.tournament_name && <Text style={errorTextStyle}>{errors.tournament_name}</Text>}
                  </View>

                  {/* Manual Date Input Row */}
                  <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
                    <View style={{ flex: 1 }}>
                      <Input 
                        label="Start Date" 
                        placeholder="DD/MM/YYYY" 
                        value={formData.start_date} 
                        onChangeText={(v: string) => update('start_date', v)}
                      />
                      {errors.start_date && <Text style={errorTextStyle}>{errors.start_date}</Text>}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Input 
                        label="End Date" 
                        placeholder="DD/MM/YYYY" 
                        value={formData.end_date} 
                        onChangeText={(v: string) => update('end_date', v)}
                      />
                      {errors.end_date && <Text style={errorTextStyle}>{errors.end_date}</Text>}
                    </View>
                  </View>

                  <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
                    <View style={{ flex: 1 }}>
                      <Select 
                        label="Age Category" 
                        value={formData.section} 
                        onChange={(v: any) => update('section', v)} 
                        options={[{label: 'Under-15', value: 'Under-15'}, {label: 'Under-19', value: 'U19'}, {label: 'Open', value: 'Open'}]} 
                      />
                      {errors.section && <Text style={errorTextStyle}>{errors.section}</Text>}
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

                  <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
                    <View style={{ flex: 1 }}>
                      <Input label="State" placeholder="State" value={formData.state} onChangeText={(v: string) => update('state', v)} />
                      {errors.state && <Text style={errorTextStyle}>{errors.state}</Text>}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Input label="City" placeholder="City" value={formData.city} onChangeText={(v: string) => update('city', v)} />
                      {errors.city && <Text style={errorTextStyle}>{errors.city}</Text>}
                    </View>
                  </View>

                  <View>
                    <Input label="Venue" placeholder="Location" value={formData.venue} onChangeText={(v: string) => update('venue', v)} />
                    {errors.venue && <Text style={errorTextStyle}>{errors.venue}</Text>}
                  </View>

                </View>
              </ScrollView>

              {/* Footer Navigation Buttons */}
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginTop: 16 }}>
                <View style={{ flex: isMobile ? 1 : 0, minWidth: isMobile ? 0 : 100 }}>
                  <Button title="Cancel" variant="ghost" onPress={handleClose} />
                </View>
                <View style={{ flex: isMobile ? 1.5 : 0, minWidth: isMobile ? 0 : 180 }}>
                  <Button 
                    title={initialData ? "Update Tournament" : "Create Tournament"} 
                    onPress={handleCreate} 
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