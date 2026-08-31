import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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

import { usePlayers } from '@/hooks/useplayers';

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

  const {
  players = [],
  loading: playersLoading,
  error: playersError,
} = usePlayers();

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

  // MATCH
  matchType: 'SINGLES',

  // PLAYERS
  player1: '',
  player2: '',
  player3: '',
  player4: '',

  team1Code: '',
  team1: '',
  team2Code: '',
  team2: '',

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

      const team1CodeValue =
        initialData?.team1_code ??
        initialData?.team1_id ??
        '';

      const team2CodeValue =
        initialData?.team2_code ??
        initialData?.team2_id ??
        '';

      const player1Value =
      initialData?.player1_name ??
      initialData?.player1Name ??
      initialData?.player1 ??
      '';

    const player2Value =
      initialData?.player2_name ??
      initialData?.player2Name ??
      initialData?.player2 ??
      '';

    const player3Value =
      initialData?.player3_name ??
      initialData?.player3Name ??
      initialData?.player3 ??
      '';

    const player4Value =
      initialData?.player4_name ??
      initialData?.player4Name ??
      initialData?.player4 ??
      '';

    const matchTypeValue = String(
      initialData?.match_type ??
      initialData?.matchType ??
      'SINGLES'
    ).toUpperCase();

      setFormData({
      // =========================
      // MATCH TYPE
      // =========================
      matchType: matchTypeValue,    

      // =========================
      // PLAYERS
      // =========================
      player1: player1Value ? String(player1Value) : '',
      player2: player2Value ? String(player2Value) : '',
      player3: player3Value ? String(player3Value) : '',
      player4: player4Value ? String(player4Value) : '',    

      // =========================
      // SCHEDULE DETAILS
      // =========================
      tournamentCode:
        initialData?.tournament_code ??
        initialData?.tournamentId ??
        initialData?.tournament_id
          ? String(
              initialData?.tournament_code ??
              initialData?.tournamentId ??
              initialData?.tournament_id
            )
          : '',   

      matchDate:
        initialData?.matchDate ??
        initialData?.match_date ??
        '',   

      matchTime:
        initialData?.matchTime ??
        initialData?.match_time ??
        '',   

      courtNo:
        initialData?.courtNo ??
        initialData?.court_no ??
        '',   

      matchNo:
        initialData?.matchNo ??
        initialData?.match_no ??
        '',   

      ageCategory:
        initialData?.ageCategory ??
        initialData?.age_category ??
        'OPEN',   

      gender:
        initialData?.gender ??
        'Men',    

      quarterDuration:
        initialData?.quarterDuration ??
        initialData?.quarter_duration
          ? String(
              initialData?.quarterDuration ??
              initialData?.quarter_duration
            )
          : '',   

       team1Code: team1CodeValue
        ? String(team1CodeValue)
        : '',   

      team1:
        initialData?.team1 ??
        findTeamNameByCode(team1CodeValue),   

      team2Code: team2CodeValue
        ? String(team2CodeValue)
        : '',   

      team2:
        initialData?.team2 ??
        findTeamNameByCode(team2CodeValue),   

      // =========================
      // OFFICIALS
      // =========================
      digitalScorerCode:
        initialData?.digital_scorer_code ??
        initialData?.digital_scorer_id ??
        initialData?.digitalScorer
          ? String(
              initialData?.digital_scorer_code ??
              initialData?.digital_scorer_id ??
              initialData?.digitalScorer
            )
          : '',   

      referee1Code:
        initialData?.referee_1_code ??
        initialData?.referee_1_id ??
        initialData?.referee1
          ? String(
              initialData?.referee_1_code ??
              initialData?.referee_1_id ??
              initialData?.referee1
            )
          : '',   

      referee2Code:
        initialData?.referee_2_code ??
        initialData?.referee_2_id ??
        initialData?.referee2
          ? String(
              initialData?.referee_2_code ??
              initialData?.referee_2_id ??
              initialData?.referee2
            )
          : '',   

      goaljudge1Code:
        initialData?.goaljudge_1_code ??
        initialData?.goaljudge_1_id ??
        initialData?.goaljudge1
          ? String(
              initialData?.goaljudge_1_code ??
              initialData?.goaljudge_1_id ??
              initialData?.goaljudge1
            )
          : '',   

      goaljudge2Code:
        initialData?.goaljudge_2_code ??
        initialData?.goaljudge_2_id ??
        initialData?.goaljudge2
          ? String(
              initialData?.goaljudge_2_code ??
              initialData?.goaljudge_2_id ??
              initialData?.goaljudge2
            )
          : '',   

      timekeeper1Code:  
        initialData?.timekeeper_1_code ??
        initialData?.timekeeper_1_id ??
        initialData?.timekeeper1
          ? String(
              initialData?.timekeeper_1_code ??
              initialData?.timekeeper_1_id ??
              initialData?.timekeeper1
            )
          : '',   

      timekeeper2Code:
        initialData?.timekeeper_2_code ??
        initialData?.timekeeper_2_id ??
        initialData?.timekeeper2
          ? String(
              initialData?.timekeeper_2_code ??
              initialData?.timekeeper_2_id ??
              initialData?.timekeeper2
            )
          : '',
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

    const playerOptions = players
  .filter((player: any) => {
    const code =
      player?.player_code ??
      player?.playerCode ??
      player?.id;

    return Boolean(code);
  })
  .map((player: any) => {
    const code = String(
      player.player_code ??
      player.playerCode ??
      player.id
    );

    const name =
      player.player_name ??
      player.playerName ??
      player.full_name ??
      player.fullName ??
      player.name ??
      `${player.first_name ?? ''} ${player.last_name ?? ''}`.trim() ??
      'Unnamed Player';

    return {
      label: name,
      value: code,
      teamCode: String(
        player?.team_code ??
        player?.teamCode ??
        ''
      ),
    };
  });

  const team1PlayerOptions =
  playerOptions.filter(
    (player) =>
      !formData.team1Code ||
      player.teamCode ===
        String(formData.team1Code)
  );

const team2PlayerOptions =
  playerOptions.filter(
    (player) =>
      !formData.team2Code ||
      player.teamCode ===
        String(formData.team2Code)
  );

  const whiteTeamOptionsFiltered = teamOptions.filter(o => o.value !== formData.team1Code);
  const blueTeamOptionsFiltered = teamOptions.filter(o => o.value !== formData.team2Code);

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

  const handleTeamChange = (
  teamType: 'team1' | 'team2',
  selectedCode: string
  ) => {
    const selectedOption = teamOptions.find(
      o => o.value === selectedCode
    );

    const teamNameValue = selectedOption
      ? selectedOption.teamName
      : '';

    setFormData(prev => ({
      ...prev,
      [`${teamType}Code`]: selectedCode,
      [teamType]: teamNameValue,
    }));

    const errorKey =
      teamType === 'team1'
        ? 'team1'
        : 'team2';

    if (errors[errorKey]) {
      setErrors((prev: any) => ({
        ...prev,
        [errorKey]: null,
      }));
    }
  };

  const handlePlayerChange = (
  playerField: 'player1' | 'player2' | 'player3' | 'player4',
  selectedValue: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [playerField]: selectedValue,
    }));

    if (errors[playerField]) {
      setErrors((prev: any) => ({
        ...prev,
        [playerField]: null,
      }));
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

   // --- STEP 2: PLAYER SELECTION ---
if (currentStep === 2) {
  if (!formData.player1) {
    stepErrors.player1 = 'Enter Player 1';
  }

  if (!formData.player2) {
    stepErrors.player2 = 'Enter Player 2';
  }

  if (
    formData.player1 &&
    formData.player2 &&
    String(formData.player1).trim() ===
      String(formData.player2).trim()
  ) {
    stepErrors.player2 =
      'Player 1 and Player 2 must be different';
  }

  if (formData.matchType === 'DOUBLES') {
    if (!formData.player3) {
      stepErrors.player3 = 'Enter Player 3';
    }

    if (!formData.player4) {
      stepErrors.player4 = 'Enter Player 4';
    }

    const selectedPlayers = [
      formData.player1,
      formData.player2,
      formData.player3,
      formData.player4,
    ]
      .filter(Boolean)
      .map((player) => String(player).trim());

    if (
      new Set(selectedPlayers).size !==
      selectedPlayers.length
    ) {
      stepErrors.player4 =
        'All four players must be different';
    }
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
                    
              court_no: Number(formData.courtNo),
              match_no: Number(formData.matchNo),
                    
              age_category: formData.ageCategory,
              gender: formData.gender,
              quarter_duration: Number(
                formData.quarterDuration
              ),
            
              match_type: formData.matchType,
            
              team1_code:
                formData.team1Code || null,
            
              team2_code:
                formData.team2Code || null,
            
              team1:
                formData.team1 || null,
            
              team2:
                formData.team2 || null,
            
              // =========================
              // PLAYERS
              // =========================
            
              player1:
                formData.player1 || null,
            
              player2:
                formData.player2 || null,
            
              player3:
                formData.matchType === 'DOUBLES'
                  ? formData.player3 || null
                  : null,
            
              player4:
                formData.matchType === 'DOUBLES'
                  ? formData.player4 || null
                  : null,
            
              // =========================
              // OFFICIALS
              // =========================
            
              digital_scorer_code:
                formData.digitalScorerCode || null,
            
              referee_1_code:
                formData.referee1Code || null,
            
              referee_2_code:
                formData.referee2Code || null,
            
              goaljudge_1_code:
                formData.goaljudge1Code || null,
            
              goaljudge_2_code:
                formData.goaljudge2Code || null,
            
              timekeeper_1_code:
                formData.timekeeper1Code || null,
            
              timekeeper_2_code:
                formData.timekeeper2Code || null,
            
              is_active:
                initialData
                  ? initialData.is_active
                  : true,
            
              is_complete:
                initialData
                  ? initialData.is_complete
                  : false,
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

                 
                     {/* STEP 2: PLAYERS */}
                    {currentStep === 2 && (
                      <>
                        {/* PLAYER LOADING */}
                    
                        {playersLoading && (
                          <View
                            style={{
                              paddingVertical: 12,
                              alignItems: 'center',
                            }}
                          >
                            <ActivityIndicator />
                          
                            <Text
                              style={{
                                marginTop: 6,
                                fontSize: 12,
                                color:
                                  theme.colors.textSecondary,
                              }}
                            >
                              Loading players...
                            </Text>
                          </View>
                        )}
                    
                        {/* PLAYER ERROR */}
                      
                        {playersError && (
                          <Text
                            style={{
                              color: '#ef4444',
                              fontSize: 12,
                              marginBottom: 8,
                            }}
                          >
                            {playersError}
                          </Text>
                        )}
                    
                        {/* =========================
                            TEAM 1
                        ========================= */}
                    
                        <View
                          style={{
                            padding: 12,
                            borderWidth: 1,
                            borderColor:
                              theme.colors.border,
                            borderRadius: 10,
                            backgroundColor:
                              theme.colors.surface,
                            gap: FIELD_ROW_GAP,
                          }}
                        >
                        
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: '700',
                              color:
                                theme.colors.textPrimary,
                            }}
                          >
                            Team 1
                          </Text>
                          
                          <Select
                            label="Team 1"
                            value={formData.team1Code}
                            onChange={(value: any) =>
                              update(
                                'team1Code',
                                value
                              )
                            }
                            options={teamOptions}
                          />
                    
                          <Select
                            label={
                              formData.matchType ===
                              'DOUBLES'
                                ? 'Player 1'
                                : 'Player'
                            }
                            value={formData.player1}
                            onChange={(value: any) =>
                              update(
                                'player1',
                                value
                              )
                            }
                            options={team1PlayerOptions}
                            placeholder={
                              playersLoading
                                ? 'Loading players...'
                                : 'Select Player'
                            }
                          />
                    
                          {formData.matchType ===
                            'DOUBLES' && (
                            <Select
                              label="Player 2"
                              value={formData.player2}
                              onChange={(value: any) =>
                                update(
                                  'player2',
                                  value
                                )
                              }
                              options={team1PlayerOptions.filter(
                                (player) =>
                                  player.value !==
                                  formData.player1
                              )}
                              placeholder="Select Player 2"
                            />
                          )}
                    
                        </View>
                        
                        {/* =========================
                            VS
                        ========================= */}
                    
                        <View
                          style={{
                            alignItems: 'center',
                            marginVertical:
                              tokens.spacing.xs,
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: '700',
                              color:
                                theme.colors.textSecondary,
                            }}
                          >
                            VS
                          </Text>
                        </View>
                          
                        {/* =========================
                            TEAM 2
                        ========================= */}
                    
                        <View
                          style={{
                            padding: 12,
                            borderWidth: 1,
                            borderColor:
                              theme.colors.border,
                            borderRadius: 10,
                            backgroundColor:
                              theme.colors.surface,
                            gap: FIELD_ROW_GAP,
                          }}
                        >
                        
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: '700',
                              color:
                                theme.colors.textPrimary,
                            }}
                          >
                            Team 2
                          </Text>
                          
                          <Select
                            label="Team 2"
                            value={formData.team2Code}
                            onChange={(value: any) =>
                              update(
                                'team2Code',
                                value
                              )
                            }
                            options={teamOptions.filter(
                              (team) =>
                                team.value !==
                                formData.team1Code
                            )}
                          />
                    
                          <Select
                            label={
                              formData.matchType ===
                              'DOUBLES'
                                ? 'Player 3'
                                : 'Player'
                            }
                            value={formData.player3}
                            onChange={(value: any) =>
                              update(
                                'player3',
                                value
                              )
                            }
                            options={team2PlayerOptions.filter(
                              (player) =>
                                player.value !==
                                  formData.player1 &&
                                player.value !==
                                  formData.player2
                            )}
                            placeholder="Select Player"
                          />
                    
                          {formData.matchType ===
                            'DOUBLES' && (
                            <Select
                              label="Player 4"
                              value={formData.player4}
                              onChange={(value: any) =>
                                update(
                                  'player4',
                                  value
                                )
                              }
                              options={team2PlayerOptions.filter(
                                (player) =>
                                  player.value !==
                                    formData.player1 &&
                                  player.value !==
                                    formData.player2 &&
                                  player.value !==
                                    formData.player3
                              )}
                              placeholder="Select Player 4"
                            />
                          )}
                    
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