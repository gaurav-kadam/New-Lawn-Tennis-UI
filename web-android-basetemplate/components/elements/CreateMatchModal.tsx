import React, { useState } from 'react';
import {
  DimensionValue,
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

// 🌟 MATCHED ACCURATELY WITH AddTeam.tsx FOR PERFECT COHESION
const TABLET_BREAKPOINT = 768;
const MODAL_DESKTOP_WIDTH = 520; 
const MODAL_MOBILE_WIDTH = '92%';
const SCROLL_MOBILE_HEIGHT = 320; 
const SCROLL_DESKTOP_HEIGHT = 340; 
const FIELD_ROW_GAP = 12;
const STEP_COUNT = 3;
const MODAL_Z_INDEX = 1000;

export default function CreateMatchModal({
  onClose,
  onSave,
  initialData,
  teams = [],
  officials = [],
  tournaments = [],
}: any) {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const isMobile = screenWidth < TABLET_BREAKPOINT;
  const cardWidth: DimensionValue = isMobile ? MODAL_MOBILE_WIDTH : MODAL_DESKTOP_WIDTH;
  const scrollMaxHeight = isMobile ? SCROLL_MOBILE_HEIGHT : SCROLL_DESKTOP_HEIGHT;

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<any>({});

  // 🌟 Helper to resolve team name if server passes empty strings
  const findTeamNameById = (id: string | number | undefined) => {
    if (!id) return '';
    const found = teams.find((t: any) => String(t.id) === String(id));
    return found ? (found.team_name || found.teamName || '') : '';
  };

  const [formData, setFormData] = useState({
    tournamentId: initialData?.tournament_id || initialData?.tournament_code || initialData?.tournamentId 
      ? String(initialData.tournament_id || initialData.tournament_code || initialData.tournamentId) 
      : '',
    matchDate: initialData?.matchDate || initialData?.match_date || '',
    matchTime: initialData?.matchTime || initialData?.match_time || '',
    courtNo: initialData?.courtNo || initialData?.court_no || '',
    matchNo: initialData?.matchNo || initialData?.match_no || '',
    ageCategory: initialData?.ageCategory || initialData?.age_category || 'OPEN',
    gender: initialData?.gender || 'Men',
    
    whiteTeamId: initialData?.white_team_id || initialData?.whiteTeamId ? String(initialData.white_team_id || initialData.whiteTeamId) : '',
    whiteTeam: initialData?.white_team || initialData?.whiteTeam || findTeamNameById(initialData?.white_team_id), 
    
    blueTeamId: initialData?.blue_team_id || initialData?.blueTeamId ? String(initialData.blue_team_id || initialData.blueTeamId) : '',
    blueTeam: initialData?.blue_team || initialData?.blueTeam || findTeamNameById(initialData?.blue_team_id), 
    
    digitalScorer: initialData?.digital_scorer_id || initialData?.digitalScorer ? String(initialData.digital_scorer_id || initialData.digitalScorer) : '',
    referee1: initialData?.referee_1_id || initialData?.referee1 ? String(initialData.referee_1_id || initialData.referee1) : '',
    referee2: initialData?.referee_2_id || initialData?.referee2 ? String(initialData.referee_2_id || initialData.referee2) : '',
    
    goaljudge1: initialData?.goaljudge_1_id || initialData?.goaljudge1 ? String(initialData.goaljudge_1_id || initialData.goaljudge1) : '',
    goaljudge2: initialData?.goaljudge_2_id || initialData?.goaljudge2 ? String(initialData.goaljudge_2_id || initialData.goaljudge2) : '',
    timekeeper1: initialData?.timekeeper_1_id || initialData?.timekeeper1 ? String(initialData.timekeeper_1_id || initialData.timekeeper1) : '',
    timekeeper2: initialData?.timekeeper_2_id || initialData?.timekeeper2 ? String(initialData.timekeeper_2_id || initialData.timekeeper2) : '',
  });

  const getPersonName = (item: any) => {
    const fullName = `${item?.first_name || ''} ${item?.last_name || ''}`.trim();
    return item?.name || fullName || item?.official_name || item?.full_name || item?.username || '';
  };

  const getPersonRole = (item: any) => item?.role || item?.official_role || item?.designation || 'Official';

  const teamOptions = teams
    .filter((team: any) => team?.id && (team?.team_name || team?.teamName))
    .map((team: any) => {
      const name = team.team_name || team.teamName;
      const displayLabel = team.short_name || team.shortName 
        ? `${name} (${team.short_name || team.shortName})`
        : name;
      return {
        label: displayLabel,
        value: String(team.id),
        teamName: name,
      };
    });

  const whiteTeamOptionsFiltered = teamOptions.filter(o => o.value !== formData.blueTeamId);
  const blueTeamOptionsFiltered = teamOptions.filter(o => o.value !== formData.whiteTeamId);

  const officialOptions = officials
    .filter((official: any) => official?.id)
    .map((official: any) => ({
      label: `${getPersonName(official)} (${getPersonRole(official) || 'Official'})`,
      value: String(official.id),
    }));

  const refereeOptions = officials
    .filter((official: any) => getPersonRole(official).toLowerCase().includes('referee'))
    .filter((official: any) => official?.id && getPersonName(official))
    .map((official: any) => ({
      label: `${getPersonName(official)} (${getPersonRole(official) || 'Referee'})`,
      value: String(official.id),
    }));

  const scorerOptions = officials
    .filter((official: any) => getPersonRole(official).toLowerCase().includes('scorer'))
    .filter((official: any) => official?.id && getPersonName(official))
    .map((official: any) => ({
      label: `${getPersonName(official)} (${getPersonRole(official) || 'Scorer'})`,
      value: String(official.id),
    }));

  const judgeOptions = officials
    .filter((official: any) => getPersonRole(official).toLowerCase().includes('judge'))
    .map((official: any) => ({
      label: `${getPersonName(official)} (${getPersonRole(official) || 'Goal Judge'})`,
      value: String(official.id),
    }));

  const timekeeperOptions = officials
    .filter((official: any) => getPersonRole(official).toLowerCase().includes('time'))
    .map((official: any) => ({
      label: `${getPersonName(official)} (${getPersonRole(official) || 'Timekeeper'})`,
      value: String(official.id),
    }));

  const tournamentOptions = tournaments
    .filter((tournament: any) => tournament?.tournament_code)
    .map((tournament: any) => ({
      label: tournament.name || tournament.tournament_name || tournament.title || `Tournament ${tournament.tournament_code}`,
      value: String(tournament.tournament_code),
    }));

  const update = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }));
    }
  };

  const handleTeamChange = (teamType: 'white' | 'blue', selectedId: string) => {
    const selectedOption = teamOptions.find(o => o.value === selectedId);
    const teamNameValue = selectedOption ? selectedOption.teamName : '';

    setFormData((prev) => ({
      ...prev,
      [`${teamType}TeamId`]: selectedId,
      [`${teamType}Team`]: teamNameValue,
    }));

    const errorKey = teamType === 'white' ? 'whiteTeam' : 'blueTeam';
    if (errors[errorKey]) {
      setErrors((prev: any) => ({ ...prev, [errorKey]: null }));
    }
  };

  const validateStep = () => {
    const stepErrors: any = {};
    if (currentStep === 1) {
      if (!formData.tournamentId) stepErrors.tournamentId = 'Select Tournament';
      if (!formData.matchDate) stepErrors.matchDate = 'Required';
      if (!formData.matchTime) stepErrors.matchTime = 'Required';
      if (!formData.courtNo) stepErrors.courtNo = 'Required';
      if (!formData.matchNo) stepErrors.matchNo = 'Required';
      if (!formData.ageCategory) stepErrors.ageCategory = 'Select Age Category';
    }
    if (currentStep === 2) {
      if (!formData.whiteTeamId) stepErrors.whiteTeam = 'Select White Team';
      if (!formData.blueTeamId) stepErrors.blueTeam = 'Select Blue Team';
      if (formData.whiteTeamId && formData.blueTeamId && formData.whiteTeamId === formData.blueTeamId) {
        stepErrors.blueTeam = 'Teams must be different';
      }
    }
    if (currentStep === 3) {
      if (!formData.digitalScorer) stepErrors.digitalScorer = 'Required';
      if (!formData.referee1) stepErrors.referee1 = 'Required';
      if (!formData.referee2) stepErrors.referee2 = 'Required';
      if (formData.referee1 && formData.referee2 && formData.referee1 === formData.referee2) {
        stepErrors.referee2 = 'Referees must be different';
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

  const handleFinalSave = () => {
    if (validateStep()) {
      const payload = {
        tournament_code: formData.tournamentId,
        match_date: formData.matchDate,
        match_time: formData.matchTime,
        court_no: String(formData.courtNo),
        match_no: String(formData.matchNo),
        age_category: formData.ageCategory,
        gender: formData.gender,
        white_team: formData.whiteTeam, 
        blue_team: formData.blueTeam,
        white_team_id: Number(formData.whiteTeamId),
        blue_team_id: Number(formData.blueTeamId),
        digital_scorer_id: Number(formData.digitalScorer),
        referee_1_id: Number(formData.referee1),
        referee_2_id: Number(formData.referee2),
        goaljudge_1_id: formData.goaljudge1 ? Number(formData.goaljudge1) : null,
        goaljudge_2_id: formData.goaljudge2 ? Number(formData.goaljudge2) : null,
        timekeeper_1_id: formData.timekeeper1 ? Number(formData.timekeeper1) : null,
        timekeeper_2_id: formData.timekeeper2 ? Number(formData.timekeeper2) : null,
      };
      onSave(payload);
    }
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

  // 🌟 Match team file error visual alignments exactly
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
              paddingHorizontal: isMobile ? 16 : 24, // 🌟 Matched with AddTeam
              paddingVertical: 16,                    // 🌟 Matched with AddTeam
            }}
          >
            {/* Header Block */}
            <View style={{ marginBottom: 6 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text 
                  style={{
                    fontSize: isMobile ? 18 : 22, // 🌟 Matched with AddTeam
                    fontWeight: 'bold',
                    color: theme.colors.textPrimary,
                  }}
                >
                  {initialData ? 'Update Match' : 'Schedule Match'}
                </Text>

                <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
                  <Text style={{ fontSize: 18, color: theme.colors.textSecondary }}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>
                Step {currentStep} of {STEP_COUNT}
              </Text>
            </View>

            {/* Progress Indicators */}
            <View style={{ flexDirection: 'row', marginBottom: 16, gap: 8 }}>
              {['Schedule', 'Teams', 'Officials'].map((label, index) => (
                <View
                  key={label}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: currentStep >= index + 1 
                      ? theme.colors.primary 
                      : '#e2e8f0', // 🌟 Matched color string exactly
                  }}
                />
              ))}
            </View>

            {/* Form Fields Content Wrapper */}
            <ScrollView 
              showsVerticalScrollIndicator={false} // 🌟 Matched with AddTeam
              style={{ maxHeight: scrollMaxHeight }}
            >
              <View style={{ gap: FIELD_ROW_GAP, paddingBottom: 4 }}>
                {currentStep === 1 && (
                  <>
                    <View>
                      <Select
                        label="Tournament"
                        value={formData.tournamentId}
                        onChange={(value: any) => update('tournamentId', value)}
                        options={tournamentOptions}
                      />
                      {errors.tournamentId && <Text style={errorTextStyle}>{errors.tournamentId}</Text>}
                    </View>

                    <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ marginBottom: tokens.spacing.xs, color: theme.colors.textPrimary, fontSize: tokens.typography.sizes.small }}>Date</Text>
                        {Platform.OS === 'web' ? (
                          <input type="date" value={formData.matchDate} onChange={(e: any) => update('matchDate', e.target.value)} style={webInputStyle} />
                        ) : (
                          <Input placeholder="DD/MM/YYYY" value={formData.matchDate} onChangeText={(value: any) => update('matchDate', value)} />
                        )}
                        {errors.matchDate && <Text style={errorTextStyle}>{errors.matchDate}</Text>}
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={{ marginBottom: tokens.spacing.xs, color: theme.colors.textPrimary, fontSize: tokens.typography.sizes.small }}>Time</Text>
                        {Platform.OS === 'web' ? (
                          <input type="time" value={formData.matchTime} onChange={(e: any) => update('matchTime', e.target.value)} style={webInputStyle} />
                        ) : (
                          <Input placeholder="HH:MM" value={formData.matchTime} onChangeText={(value: any) => update('matchTime', value)} />
                        )}
                        {errors.matchTime && <Text style={errorTextStyle}>{errors.matchTime}</Text>}
                      </View>
                    </View>

                    <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
                      <View style={{ flex: 1 }}>
                        <Input label="Court No." placeholder="e.g. 1" value={formData.courtNo} onChangeText={(value: any) => update('courtNo', value)} />
                        {errors.courtNo && <Text style={errorTextStyle}>{errors.courtNo}</Text>}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Input label="Match No." placeholder="e.g. M01" value={formData.matchNo} onChangeText={(value: any) => update('matchNo', value)} />
                        {errors.matchNo && <Text style={errorTextStyle}>{errors.matchNo}</Text>}
                      </View>
                    </View>

                    <View>
                      <Select
                        label="Age Category"
                        value={formData.ageCategory}
                        onChange={(value: any) => update('ageCategory', value)}
                        options={[
                          { label: 'Under 15', value: 'UNDER_15' },
                          { label: 'Under 19', value: 'UNDER_19' },
                          { label: 'Open', value: 'OPEN' },
                        ]}
                      />
                      {errors.ageCategory && <Text style={errorTextStyle}>{errors.ageCategory}</Text>}
                    </View>

                    <RadioGroup
                      label="Gender"
                      value={formData.gender}
                      onChange={(value: any) => update('gender', value)}
                      options={[
                        { label: 'Men', value: 'Men' },
                        { label: 'Women', value: 'Women' },
                      ]}
                    />
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <View>
                      <Select label="White Team" value={formData.whiteTeamId} onChange={(value: any) => handleTeamChange('white', value)} options={whiteTeamOptionsFiltered} />
                      {errors.whiteTeam && <Text style={errorTextStyle}>{errors.whiteTeam}</Text>}
                    </View>

                    <View style={{ alignItems: 'center', marginVertical: tokens.spacing.xs }}>
                      <Text style={{ fontWeight: 'bold', color: theme.colors.textSecondary }}>WHITE VS BLUE</Text>
                    </View>

                    <View>
                      <Select label="Blue Team" value={formData.blueTeamId} onChange={(value: any) => handleTeamChange('blue', value)} options={blueTeamOptionsFiltered} />
                      {errors.blueTeam && <Text style={errorTextStyle}>{errors.blueTeam}</Text>}
                    </View>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <View>
                      <Select label="Digital Scorer" value={formData.digitalScorer} onChange={(value: any) => update('digitalScorer', value)} options={scorerOptions.length > 0 ? scorerOptions : officialOptions} />
                      {errors.digitalScorer && <Text style={errorTextStyle}>{errors.digitalScorer}</Text>}
                    </View>

                    <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
                      <View style={{ flex: 1 }}>
                        <Select label="Referee 1" value={formData.referee1} onChange={(value: any) => update('referee1', value)} options={refereeOptions.length > 0 ? refereeOptions : officialOptions} />
                        {errors.referee1 && <Text style={errorTextStyle}>{errors.referee1}</Text>}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Select label="Referee 2" value={formData.referee2} onChange={(value: any) => update('referee2', value)} options={refereeOptions.length > 0 ? refereeOptions : officialOptions} />
                        {errors.referee2 && <Text style={errorTextStyle}>{errors.referee2}</Text>}
                      </View>
                    </View>

                    <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
                      <View style={{ flex: 1 }}>
                        <Select label="Goal Judge 1" value={formData.goaljudge1} onChange={(value: any) => update('goaljudge1', value)} options={judgeOptions.length > 0 ? judgeOptions : officialOptions} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Select label="Goal Judge 2" value={formData.goaljudge2} onChange={(value: any) => update('goaljudge2', value)} options={judgeOptions.length > 0 ? judgeOptions : officialOptions} />
                      </View>
                    </View>

                    <View style={{ flexDirection: isMobile ? 'column' : 'row', gap: FIELD_ROW_GAP }}>
                      <View style={{ flex: 1 }}>
                        <Select label="Timekeeper 1" value={formData.timekeeper1} onChange={(value: any) => update('timekeeper1', value)} options={timekeeperOptions.length > 0 ? timekeeperOptions : officialOptions} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Select label="Timekeeper 2" value={formData.timekeeper2} onChange={(value: any) => update('timekeeper2', value)} options={timekeeperOptions.length > 0 ? timekeeperOptions : officialOptions} />
                      </View>
                    </View>
                  </>
                )}
              </View>
            </ScrollView>

            {/* Footer Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginTop: 16 }}>
              <View style={{ flex: isMobile ? 1 : 0, minWidth: isMobile ? 0 : 100 }}>
                <Button title={currentStep === 1 ? 'Cancel' : 'Back'} variant="ghost" onPress={currentStep === 1 ? onClose : prevStep} />
              </View>

              <View style={{ flex: isMobile ? 1.5 : 0, minWidth: isMobile ? 0 : 180 }}>
                <Button
                  title={currentStep === STEP_COUNT ? (initialData ? 'Update Match' : 'Schedule Match') : 'Next Step'}
                  onPress={currentStep === STEP_COUNT ? handleFinalSave : nextStep}
                />
              </View>
            </View>
          </View>
        </Card>
      </View>
    </View>
  );
}