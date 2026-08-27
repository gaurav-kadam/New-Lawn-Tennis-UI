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

import { useTheme } from '@/theme/themeContext';
import { tokens } from '@/theme/token';

import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import RadioGroup from '../ui/RadioGroup';
import Select from '../ui/Select';

import DatePicker from '../ui/DatePicker';
import TimePicker from '../ui/TimePicker';

const TABLET_BREAKPOINT = 768;
const MODAL_DESKTOP_WIDTH = 520; 
const MODAL_MOBILE_WIDTH = '92%';
const SCROLL_MOBILE_HEIGHT = 320; 
const SCROLL_DESKTOP_HEIGHT = 340; 
const FIELD_ROW_GAP = 12;
const STEP_COUNT = 3;

interface CreateMatchModalProps {
  visible: boolean; // 🌟 Standardized modal visibility control matching team modal
  onClose: () => void;
  onSave: (payload: any) => void;
  initialData: any;
  teams?: any[];
  officials?: any[];
  tournaments?: any[];
}

export default function CreateMatchModal({
  visible,
  onClose,
  onSave,
  initialData,
  teams = [],
  officials = [],
  tournaments = [],
}: CreateMatchModalProps) {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const isMobile = screenWidth < TABLET_BREAKPOINT;
  const cardWidth: DimensionValue = isMobile ? MODAL_MOBILE_WIDTH : MODAL_DESKTOP_WIDTH;
  const scrollMaxHeight = isMobile ? SCROLL_MOBILE_HEIGHT : SCROLL_DESKTOP_HEIGHT;

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<any>({});

  const toDateObj = (dateStr: string) => {
  if (!dateStr || !dateStr.includes('/')) return undefined;
  const [d, m, y] = dateStr.split('/');
  return new Date(Number(y), Number(m) - 1, Number(d));
};

const toDateStr = (date: Date) => date.toLocaleDateString('en-GB');

  // Helper to resolve team name using code
  const findTeamNameByCode = (code: string | number | undefined) => {
    if (!code) return '';
    const found = teams.find((t: any) => String(t.team_code ?? t.id) === String(code));
    return found ? (found.team_name || found.teamName || '') : '';
  };

  const [formData, setFormData] = useState({
    tournamentCode: '',
    matchDate: '',
    matchTime: '',
    courtNo: '',
    matchNo: '',
    ageCategory: '',
    gender: '',
    quarterDuration: '',
    whiteTeamCode: '',
    whiteTeam: '',
    blueTeamCode: '',
    blueTeam: '',
    digitalScorerCode: '',
    referee1Code: '',
    referee2Code: '',
    goaljudge1Code: '',
    goaljudge2Code: '',
    timekeeper1Code: '',
    timekeeper2Code: '',
  });

  // 🌟 Sync and reset internal states securely when modal visibility changes (Matching Team Modal)
  useEffect(() => {
    if (visible) {
      setCurrentStep(1);
      setErrors({});

      const whiteCode = initialData?.team1_code ?? initialData?.team1_id ?? initialData?.whiteTeamId ?? '';
      const blueCode = initialData?.team2_code ?? initialData?.team2_id ?? initialData?.blueTeamId ?? '';

      setFormData({
        tournamentCode: initialData?.tournament_code || initialData?.tournamentId || initialData?.tournament_id
          ? String(initialData.tournament_code || initialData.tournamentId || initialData.tournament_id) 
          : '',
        matchDate: initialData?.matchDate || initialData?.match_date || '',
        matchTime: initialData?.matchTime || initialData?.match_time || '',
        courtNo: initialData?.courtNo || initialData?.court_no || '',
        matchNo: initialData?.matchNo || initialData?.match_no || '',
        ageCategory: initialData?.ageCategory || initialData?.age_category || 'OPEN',
        gender: initialData?.gender || 'Men',
        quarterDuration: initialData?.quarterDuration || initialData?.quarter_duration
          ? String(initialData.quarterDuration || initialData.quarter_duration)
          : '',

        whiteTeamCode: whiteCode ? String(whiteCode) : '',
        whiteTeam: initialData?.team1 || initialData?.whiteTeam || findTeamNameByCode(whiteCode), 
        
        blueTeamCode: blueCode ? String(blueCode) : '',
        blueTeam: initialData?.team2 || initialData?.blueTeam || findTeamNameByCode(blueCode), 
        
        digitalScorerCode: initialData?.digital_scorer_code ?? initialData?.digital_scorer_id ?? initialData?.digitalScorer ? String(initialData.digital_scorer_code ?? initialData.digital_scorer_id ?? initialData.digitalScorer) : '',
        referee1Code: initialData?.referee_1_code ?? initialData?.referee_1_id ?? initialData?.referee1 ? String(initialData.referee_1_code ?? initialData.referee_1_id ?? initialData.referee1) : '',
        referee2Code: initialData?.referee_2_code ?? initialData?.referee_2_id ?? initialData?.referee2 ? String(initialData.referee_2_code ?? initialData.referee_2_id ?? initialData.referee2) : '',
        
        goaljudge1Code: initialData?.goaljudge_1_code ?? initialData?.goaljudge_1_id ?? initialData?.goaljudge1 ? String(initialData.goaljudge_1_code ?? initialData.goaljudge_1_id ?? initialData.goaljudge1) : '',
        goaljudge2Code: initialData?.goaljudge_2_code ?? initialData?.goaljudge_2_id ?? initialData?.goaljudge2 ? String(initialData.goaljudge_2_code ?? initialData.goaljudge_2_id ?? initialData.goaljudge2) : '',
        timekeeper1Code: initialData?.timekeeper_1_code ?? initialData?.timekeeper_1_id ?? initialData?.timekeeper1 ? String(initialData.timekeeper_1_code ?? initialData.timekeeper_1_id ?? initialData.timekeeper1) : '',
        timekeeper2Code: initialData?.timekeeper_2_code ?? initialData?.timekeeper_2_id ?? initialData?.timekeeper2 ? String(initialData.timekeeper_2_code ?? initialData.timekeeper_2_id ?? initialData.timekeeper2) : '',
      });
    }
  }, [visible, initialData]);

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const getPersonName = (item: any) => {
    const fullName = `${item?.first_name || ''} ${item?.last_name || ''}`.trim();
    return item?.name || fullName || item?.official_name || item?.full_name || item?.username || '';
  };

  const getPersonRole = (item: any) => item?.role || item?.official_role || item?.designation || 'Official';

  const teamOptions = teams
    .filter((team: any) => (team?.team_code || team?.id) && (team?.team_name || team?.teamName))
    .map((team: any) => {
      const name = team.team_name || team.teamName;
      const displayLabel = team.short_name || team.shortName 
        ? `${name} (${team.short_name || team.shortName})`
        : name;
      return {
        label: displayLabel,
        value: String(team.team_code ?? team.id),
        teamName: name,
      };
    });

  const whiteTeamOptionsFiltered = teamOptions.filter(o => o.value !== formData.blueTeamCode);
  const blueTeamOptionsFiltered = teamOptions.filter(o => o.value !== formData.whiteTeamCode);

  const officialOptions = officials
    .filter((official: any) => official?.official_code || official?.id)
    .map((official: any) => ({
      label: `${getPersonName(official)} (${getPersonRole(official) || 'Official'})`,
      value: String(official.official_code ?? official.id),
    }));

  const refereeOptions = officials
    .filter((official: any) => getPersonRole(official).toLowerCase().includes('referee'))
    .filter((official: any) => (official?.official_code || official?.id) && getPersonName(official))
    .map((official: any) => ({
      label: `${getPersonName(official)} (${getPersonRole(official) || 'Referee'})`,
      value: String(official.official_code ?? official.id),
    }));

  const scorerOptions = officials
    .filter((official: any) => getPersonRole(official).toLowerCase().includes('scorer'))
    .filter((official: any) => (official?.official_code || official?.id) && getPersonName(official))
    .map((official: any) => ({
      label: `${getPersonName(official)} (${getPersonRole(official) || 'Scorer'})`,
      value: String(official.official_code ?? official.id),
    }));

  const judgeOptions = officials
    .filter((official: any) => getPersonRole(official).toLowerCase().includes('judge'))
    .map((official: any) => ({
      label: `${getPersonName(official)} (${getPersonRole(official) || 'Goal Judge'})`,
      value: String(official.official_code ?? official.id),
    }));

  const timekeeperOptions = officials
    .filter((official: any) => getPersonRole(official).toLowerCase().includes('time'))
    .map((official: any) => ({
      label: `${getPersonName(official)} (${getPersonRole(official) || 'Timekeeper'})`,
      value: String(official.official_code ?? official.id),
    }));

  const tournamentOptions = tournaments
    .filter((tournament: any) => tournament?.tournament_code)
    .map((tournament: any) => ({
      label: tournament.name || tournament.tournament_name || tournament.title || `Tournament ${tournament.tournament_code}`,
      value: String(tournament.tournament_code),
    }));

  // Build the set of all currently assigned official codes across every role
  const selectedOfficialCodes = new Set(
    [
      formData.digitalScorerCode,
      formData.referee1Code,
      formData.referee2Code,
      formData.goaljudge1Code,
      formData.goaljudge2Code,
      formData.timekeeper1Code,
      formData.timekeeper2Code,
    ].filter(Boolean)
  );

  // For a given role's dropdown: keep options that are not taken by another role,
  // but always keep the option that is currently selected in THIS role so it stays visible.
  const availableFor = (currentCode: string, baseOptions: any[]) =>
    baseOptions.filter(o => !selectedOfficialCodes.has(o.value) || o.value === currentCode);

  const update = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prevErrors: any) => ({ ...prevErrors, [field]: null }));
    }
  };

  const handleTeamChange = (teamType: 'white' | 'blue', selectedCode: string) => {
    const selectedOption = teamOptions.find(o => o.value === selectedCode);
    const teamNameValue = selectedOption ? selectedOption.teamName : '';

    setFormData((prev) => ({
      ...prev,
      [`${teamType}TeamCode`]: selectedCode,
      [`${teamType}Team`]: teamNameValue,
    }));

    const errorKey = teamType === 'white' ? 'whiteTeam' : 'blueTeam';
    if (errors[errorKey]) {
      setErrors((prev: any) => ({ ...prev, [errorKey]: null }));
    }
  };

  const validateStep = () => {
    const stepErrors: any = {};
    
    // --- STEP 1: SCHEDULE DETAILS ---
    if (currentStep === 1) {
      if (!formData.tournamentCode) stepErrors.tournamentCode = 'Select Tournament';
      if (!formData.matchDate) stepErrors.matchDate = 'Required';
      if (!formData.matchTime) stepErrors.matchTime = 'Required';
      
      if (!formData.courtNo) {
        stepErrors.courtNo = 'Required';
      } else if (!/^\d+$/.test(String(formData.courtNo)) || Number(formData.courtNo) <= 0) {
        stepErrors.courtNo = 'Enter a valid court number';
      }

      if (!formData.matchNo) {
        stepErrors.matchNo = 'Required';
      } else if (!/^\d+$/.test(String(formData.matchNo)) || Number(formData.matchNo) <= 0) {
        stepErrors.matchNo = 'Enter a valid match number';
      }

      if (!formData.ageCategory) stepErrors.ageCategory = 'Select Age Category';
      
      if (!formData.quarterDuration) {
        stepErrors.quarterDuration = 'Required';
      } else if (
        !/^\d+$/.test(String(formData.quarterDuration)) ||
        Number(formData.quarterDuration) < 1 ||
        Number(formData.quarterDuration) > 15
      ) {
        stepErrors.quarterDuration = 'Enter a whole number between 1 and 15';
      }
    }

    // --- STEP 2: TEAM SELECTION ---
    if (currentStep === 2) {
      if (!formData.whiteTeamCode) stepErrors.whiteTeam = 'Select White Team';
      if (!formData.blueTeamCode) stepErrors.blueTeam = 'Select Blue Team';
      
      if (formData.whiteTeamCode && formData.blueTeamCode && formData.whiteTeamCode === formData.blueTeamCode) {
        stepErrors.blueTeam = 'White Team and Blue Team must be different';
      }
    }

    // --- STEP 3: OFFICIALS SELECTION ---
    if (currentStep === 3) {
      if (!formData.digitalScorerCode) stepErrors.digitalScorerCode = 'Required';
      if (!formData.referee1Code) stepErrors.referee1Code = 'Required';
      if (!formData.referee2Code) stepErrors.referee2Code = 'Required';
      
      if (formData.referee1Code && formData.referee2Code && formData.referee1Code === formData.referee2Code) {
        stepErrors.referee2Code = 'Referee 1 and Referee 2 must be different';
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

  const prevStep = () => {
    setErrors({});
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSave = () => {
    if (currentStep === STEP_COUNT) {
      if (validateStep()) {
        const payload = {
          tournament_code: formData.tournamentCode,
          match_date: formData.matchDate,
          match_time: formData.matchTime,
          court_no: Number(formData.courtNo), // Enforced as int matching Pydantic schema
          match_no: Number(formData.matchNo),   // Enforced as int matching Pydantic schema
          age_category: formData.ageCategory,
          gender: formData.gender,
          quarter_duration: Number(formData.quarterDuration),
          team1: formData.whiteTeam,
          team2: formData.blueTeam,
          team1_code: formData.whiteTeamCode || null,
          team2_code: formData.blueTeamCode || null,
          digital_scorer_code: formData.digitalScorerCode || null,
          referee_1_code: formData.referee1Code || null,
          referee_2_code: formData.referee2Code || null,
          goaljudge_1_code: formData.goaljudge1Code || null,
          goaljudge_2_code: formData.goaljudge2Code || null,
          timekeeper_1_code: formData.timekeeper1Code || null,
          timekeeper_2_code: formData.timekeeper2Code || null,
          is_active: initialData ? initialData.is_active : true,
          is_complete: initialData ? initialData.is_complete : false,
        };
        onSave(payload);
      }
      return;
    }
    nextStep();
  };

  const webInputStyle = {
    width: '100%',
    boxSizing: 'border-box' as const,
    paddingTop: tokens.spacing.sm,
    paddingBottom: tokens.spacing.sm,
    paddingLeft: tokens.spacing.sm,
    paddingRight: tokens.spacing.md + tokens.spacing.xs,
    borderRadius: tokens.radius.sm,
    borderWidth: tokens.layout.dividerHeight,
    borderStyle: 'solid' as const,
    borderColor: theme.colors.border || tokens.colors.border,
    fontSize: tokens.typography.sizes.small,
  };

  const errorTextStyle = {
    color: '#ef4444',
    fontSize: 11,
    marginTop: -4,
    marginLeft: 4,
    marginBottom: 4,
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
          backgroundColor: 'rgba(0, 0, 0, 0.45)', // 🌟 Synced translucent overlay mask from team modal
          padding: 20,
        }}
      >
        <View style={{ width: cardWidth, maxWidth: '100%' }}>
          <Card variant="elevated">
            <View
              style={{
                paddingHorizontal: isMobile ? 16 : 24, // 🌟 Synced padding bounds
                paddingVertical: 16,
              }}
            >
              {/* Header Block */}
              <View style={{ marginBottom: 6 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: isMobile ? 18 : 22, fontWeight: 'bold', color: theme.colors.textPrimary }}>
                    {initialData ? 'Update Match' : 'Schedule Match'}
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
                {['Schedule', 'Teams', 'Officials'].map((label, i) => (
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
                  
                  {/* STEP 1: SCHEDULE DETAILS */}
                  {currentStep === 1 && (
                    <>
                      <View>
                        <Select
                          label="Tournament"
                          value={formData.tournamentCode}
                          onChange={(value: any) => update('tournamentCode', value)}
                          options={tournamentOptions}
                          error={errors.tournamentCode}
                        />
                      
                      </View>

                      <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
                        <View style={{ flex: 1 }}>
                          <DatePicker
                            label="Date"
                            value={toDateObj(formData.matchDate)}
                            onChange={(d) => update('matchDate', toDateStr(d))}
                            error={errors.matchDate}
                          />
                        </View>

                        <View style={{ flex: 1 }}>
                          <TimePicker
                            label="Time"
                            value={formData.matchTime}
                            onChange={(t) => update('matchTime', t)}
                            error={errors.matchTime}
                          />
                        </View>
                      </View>

                      <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
                        <View style={{ flex: 1 }}>
                          <Input label="Court No." 
                          placeholder="e.g. 1" 
                          value={formData.courtNo} 
                          onChangeText={(value: any) => update('courtNo', value)}
                          error={errors.courtNo} />
                          
                        </View>
                        <View style={{ flex: 1 }}>
                          <Input label="Match No." 
                          placeholder="e.g. M01" 
                          value={formData.matchNo} 
                          onChangeText={(value: any) => update('matchNo', value)}
                          error={errors.matchNo} />
                          
                        </View>
                      </View>

                      <View>
                        <Input
                          label="Quarter Duration (mins)"
                          placeholder="e.g. 8"
                          type="number"
                          value={formData.quarterDuration}
                          onChangeText={(value: any) => update('quarterDuration', value.replace(/[^0-9]/g, ''))}
                          error={errors.quarterDuration}
                        />
                        
                      </View>

                      <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
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
                        
                      </View>

                      <View style={{ flex: 1 }}>
                      <Select
                          label="Age Category"
                          value={formData.ageCategory}
                          placeholder="e.g open"
                          onChange={(value: any) => update('ageCategory', value)}
                          options={[
                            { label: 'Under 15', value: 'UNDER_15' },
                            { label: 'Under 19', value: 'UNDER_19' },
                            { label: 'Open', value: 'OPEN' },
                            
                          ]}
                          error={errors.ageCategory}
                        />
                       
                      </View>
                      </View>
                    </>
                  )}

                  {/* STEP 2: TEAM SELECTION */}
                  {currentStep === 2 && (
                    <>
                      <View>
                        <Select label="White Team" value={formData.whiteTeamCode} onChange={(value: any) => handleTeamChange('white', value)} options={whiteTeamOptionsFiltered} />
                        {errors.whiteTeam && <Text style={errorTextStyle}>{errors.whiteTeam}</Text>}
                      </View>

                      <View style={{ alignItems: 'center', marginVertical: tokens.spacing.xs }}>
                        <Text style={{ fontWeight: 'bold', color: theme.colors.textSecondary }}>WHITE VS BLUE</Text>
                      </View>

                      <View>
                        <Select label="Blue Team" value={formData.blueTeamCode} onChange={(value: any) => handleTeamChange('blue', value)} options={blueTeamOptionsFiltered} />
                        {errors.blueTeam && <Text style={errorTextStyle}>{errors.blueTeam}</Text>}
                      </View>
                    </>
                  )}

                  {/* STEP 3: OFFICIALS SELECTION */}
                  {currentStep === 3 && (
                    <>
                      <View>
                        <Select
                          label="Digital Scorer"
                          value={formData.digitalScorerCode}
                          onChange={(value: any) => update('digitalScorerCode', value)}
                          options={availableFor(formData.digitalScorerCode, scorerOptions.length > 0 ? scorerOptions : officialOptions)}
                        />
                        {errors.digitalScorerCode && <Text style={errorTextStyle}>{errors.digitalScorerCode}</Text>}
                      </View>

                      <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
                        <View style={{ flex: 1 }}>
                          <Select
                            label="Referee 1"
                            value={formData.referee1Code}
                            onChange={(value: any) => update('referee1Code', value)}
                            options={availableFor(formData.referee1Code, refereeOptions.length > 0 ? refereeOptions : officialOptions)}
                          />
                          {errors.referee1Code && <Text style={errorTextStyle}>{errors.referee1Code}</Text>}
                        </View>
                        <View style={{ flex: 1 }}>
                          <Select
                            label="Referee 2"
                            value={formData.referee2Code}
                            onChange={(value: any) => update('referee2Code', value)}
                            options={availableFor(formData.referee2Code, refereeOptions.length > 0 ? refereeOptions : officialOptions)}
                          />
                          {errors.referee2Code && <Text style={errorTextStyle}>{errors.referee2Code}</Text>}
                        </View>
                      </View>

                      <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
                        <View style={{ flex: 1 }}>
                          <Select
                            label="Goal Judge 1"
                            value={formData.goaljudge1Code}
                            onChange={(value: any) => update('goaljudge1Code', value)}
                            options={availableFor(formData.goaljudge1Code, judgeOptions.length > 0 ? judgeOptions : officialOptions)}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Select
                            label="Goal Judge 2"
                            value={formData.goaljudge2Code}
                            onChange={(value: any) => update('goaljudge2Code', value)}
                            options={availableFor(formData.goaljudge2Code, judgeOptions.length > 0 ? judgeOptions : officialOptions)}
                          />
                        </View>
                      </View>

                      <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
                        <View style={{ flex: 1 }}>
                          <Select
                            label="Timekeeper 1"
                            value={formData.timekeeper1Code}
                            onChange={(value: any) => update('timekeeper1Code', value)}
                            options={availableFor(formData.timekeeper1Code, timekeeperOptions.length > 0 ? timekeeperOptions : officialOptions)}
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Select
                            label="Timekeeper 2"
                            value={formData.timekeeper2Code}
                            onChange={(value: any) => update('timekeeper2Code', value)}
                            options={availableFor(formData.timekeeper2Code, timekeeperOptions.length > 0 ? timekeeperOptions : officialOptions)}
                          />
                        </View>
                      </View>
                    </>
                  )}
                </View>
              </ScrollView>

              {/* Footer Buttons */}
               <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginTop: 16 }}>
                {/* <View style={{ flex: isMobile ? 1 : 0, minWidth: isMobile ? 0 : 100 }}>  */}
                  <Button title={currentStep === 1 ? 'Cancel' : 'Back'} variant="danger" onPress={currentStep === 1 ? handleClose : prevStep} />
                {/* </View> */}

                {/* <View style={{ flex: isMobile ? 1.5 : 0, minWidth: isMobile ? 0 : 180 }}> */}
                  <Button
                    title={currentStep === STEP_COUNT ? (initialData ? 'Update' : 'Create') : 'Next Step'}
                    onPress={handleSave}
                  />
                {/* </View> */}
              </View>
            </View>
          </Card>
        </View>
      </View>
    </Modal>
  );
}