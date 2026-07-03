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
// Import the DatePicker component
import DatePicker from '../ui/DatePicker'; 

const TABLET_BREAKPOINT = 768;
const MODAL_DESKTOP_WIDTH = 520; 
const MODAL_MOBILE_WIDTH = '92%';
const SCROLL_MOBILE_HEIGHT = 320; 
const SCROLL_DESKTOP_HEIGHT = 340; 
const FIELD_ROW_GAP = 12;

export default function AddTournamentModal({ visible, onClose, onSave, initialData }: any) {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const isMobile = screenWidth < TABLET_BREAKPOINT;
  const cardWidth: DimensionValue = isMobile ? MODAL_MOBILE_WIDTH : MODAL_DESKTOP_WIDTH;
  const scrollMaxHeight = isMobile ? SCROLL_MOBILE_HEIGHT : SCROLL_DESKTOP_HEIGHT;

  const [errors, setErrors] = useState<any>({});
  
  // Parse ISO YYYY-MM-DD to Date (local time, avoids UTC off-by-one)
  const toDateObj = (dateStr: string) => {
    if (!dateStr) return undefined;
    return new Date(dateStr + 'T00:00:00');
  };

  // Convert Date to ISO YYYY-MM-DD (what the backend expects)
  const toDateStr = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const [formData, setFormData] = useState({
    tournament_name: '',
    start_date: '', // Keeps format DD/MM/YYYY
    end_date: '',   // Keeps format DD/MM/YYYY
    section: '',
    gender: 'Men',
    state: '',
    city: '',
    venue: ''
  });

  useEffect(() => {
    if (visible) {
      setErrors({});
      setFormData({
        tournament_name: initialData?.tournament_name || '',
        start_date: initialData?.start_date || '', 
        end_date: initialData?.end_date || '',
        section: initialData?.section || '',
        gender: initialData?.gender || 'Men',
        state: initialData?.state || '',
        city: initialData?.city || '',
        venue: initialData?.venue || ''
      });
    }
  }, [visible, initialData]);

  const update = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev: any) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    let newErrors: any = {};
    if (!formData.tournament_name.trim()) newErrors.tournament_name = "Required";
    if (!formData.start_date) newErrors.start_date = "Required";
    if (!formData.end_date) newErrors.end_date = "Required";
    
    if (formData.start_date && formData.end_date) {
      if (formData.end_date < formData.start_date) newErrors.end_date = "End date cannot be earlier than start";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (validate()) onSave(formData);
  };

  const errorTextStyle = { color: '#ef4444', fontSize: 11, marginTop: -4, marginLeft: 4, marginBottom: 4 };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.45)', padding: 20 }}>
        <View style={{ width: cardWidth, maxWidth: '100%' }}>
          <Card variant="elevated">
            <View style={{ paddingHorizontal: isMobile ? 16 : 24, paddingVertical: 16 }}>
              
              {/* Header */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text style={{ fontSize: isMobile ? 18 : 22, fontWeight: 'bold', color: theme.colors.textPrimary }}>
                  {initialData ? "Update Tournament" : "Create New Tournament"}
                </Text>
                <TouchableOpacity onPress={onClose}><Text>✕</Text></TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: scrollMaxHeight }}>
                <View style={{ gap: FIELD_ROW_GAP }}>
  
  <Input 
    label="Tournament Name" 
    placeholder="e.g. Summer Cup 2026"
    value={formData.tournament_name} 
    onChangeText={(v: string) => update('tournament_name', v)} 
  />
  
  {/* Row: DatePickers */}
  <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
    <View style={{ flex: 1 }}>
      <DatePicker 
        label="Start Date" 
        placeholder="DD/MM/YYYY"
        value={toDateObj(formData.start_date)} 
        onChange={(d) => update('start_date', toDateStr(d))}
        error={errors.start_date}
      />
    </View>
    <View style={{ flex: 1 }}>
      <DatePicker 
        label="End Date" 
        placeholder="DD/MM/YYYY"
        value={toDateObj(formData.end_date)} 
        onChange={(d) => update('end_date', toDateStr(d))}
        error={errors.end_date}
      />
    </View>
  </View>

  {/* Row: Age Category & Gender */}
  <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
    <View style={{ flex: 1 }}>
      <Select 
        label="Age Category" 
        placeholder="Select Category"
        value={formData.section} 
        onChange={(v: any) => update('section', v)} 
        options={[{label: 'Under-15', value: 'Under-15'}, {label: 'Under-19', value: 'U19'}, {label: 'Open', value: 'Open'}]} 
      />
    </View>
    <View style={{ flex: 1 }}>
      <RadioGroup 
        label="Gender" 
        value={formData.gender} 
        onChange={(v: any) => update('gender', v)} 
        options={[{ label: 'Men', value: 'Men' }, { label: 'Women', value: 'Women' }]} 
      />
    </View>
  </View>

  {/* Row: State & City */}
  <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
    <View style={{ flex: 1 }}>
      <Input label="State" placeholder="e.g. Maharashtra" value={formData.state} onChangeText={(v: string) => update('state', v)} />
    </View>
    <View style={{ flex: 1 }}>
      <Input label="City" placeholder="e.g. Pune" value={formData.city} onChangeText={(v: string) => update('city', v)} />
    </View>
  </View>

  <Input label="Venue" placeholder="e.g. City Sports Complex" value={formData.venue} onChangeText={(v: string) => update('venue', v)} />
  
</View>
              </ScrollView>

              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 8 }}>
                <Button title="Cancel" variant="ghost" onPress={onClose} />
                <Button title={initialData ? "Update" : "Create"} onPress={handleCreate} />
              </View>
            </View>
          </Card>
        </View>
      </View>
    </Modal>
  );
}