import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';

import { router, useLocalSearchParams } from 'expo-router'; 
import CreateMatchModal from '../../components/elements/CreateMatchModal';
import MatchCardList from '@/components/Matches listing/MatchCardList';
import MatchesHeader from '@/components/Matches listing/MatchesHeader';
import MatchTable from '@/components/Matches listing/MatchTable';

import { useOfficials } from '@/hooks/useofficials';
import { useMatches } from '../../hooks/usematches';
import { useTeams } from '../../hooks/useteams'; 

import matchService from '../../services/match/match.service';
import tournamentService from '../../services/tournament/tournamment.service';
import { useTheme } from '../../theme/themeContext';
import { tokens } from '../../theme/token';

const TABLET_BREAKPOINT = 768;

export default function MatchesScreen() {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const isMobile = screenWidth < TABLET_BREAKPOINT;

  const { tournament_code } = useLocalSearchParams<{ tournament_code?: string }>();

  // 1. Matches hook runs automatically to populate the main view layout
  const { matches = [], loading, error, reload } = useMatches();
  
  // 2. Destructure reload/fetch controls from lookups to prevent auto-fetching on mount
  const { teams = [], reload: fetchTeams } = useTeams({ lazy: true }); 
  const { officials = [], reload: fetchOfficials } = useOfficials({ lazy: true });

  const [openModal, setOpenModal] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [tournaments, setTournaments] = useState<any[]>([]);

  // 3. Keep the initial layout load clean—only fetching match dependencies if needed
  useEffect(() => {
    // Lookups are no longer fetched here automatically
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await tournamentService.getTournaments();
      setTournaments(response?.data?.data || response?.data || []);
    } catch (error) {
      console.log('Failed to fetch tournaments:', error);
    }
  };

  const getSelectedTournamentName = () => {
    if (!tournament_code || tournaments.length === 0) return '';
    const foundTournament = tournaments.find(
      (t: any) => String(t.tournament_code) === String(tournament_code)
    );
    return foundTournament ? (foundTournament.name || foundTournament.tournament_name) : tournament_code;
  };

  const handleClearFilter = () => {
    router.replace('/matches');
  };

  const handleSave = async (formData: any) => {
    try {
      if (editingData) {
        await matchService.updateMatch(editingData.id, formData);
      } else {
        await matchService.createMatch(formData);
      }
      await reload();
      closeModal();
    } catch (err: any) {
      Alert.alert('Error', 'Failed to save match data.');
    }
  };

  const handleStartMatch = (match: any) => {
    router.push({
      pathname: '/MatchScreen',
      params: {
        matchId: String(match.id),
        whiteTeamCode: String(match.white_team_code || match.white_team), 
        blueTeamCode: String(match.blue_team_code || match.blue_team),   
        whiteTeamName: match.white_team_name || match.white_team || match.red_player,
        blueTeamName: match.blue_team_name || match.blue_team || match.blue_player,
        ageCategory: match.age_category,
        gender: match.gender,
        matchNo: match.match_no,
        courtNo: match.court_no,
      },
    });
  };

  const handleDelete = (id: any) => {
    const performDelete = async () => {
      try {
        await matchService.deleteMatch(id);
        await reload();
      } catch (err) {
        if (Platform.OS === 'web') {
          window.alert('Failed to delete match.');
        } else {
          Alert.alert('Error', 'Failed to delete match.');
        }
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete Match Details?')) {
        performDelete();
      }
    } else {
      Alert.alert('Delete Match', 'Are you sure you want to delete Match Details?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: performDelete },
      ]);
    }
  };

  // 🌟 FIX: Only hit secondary metadata lookup APIs when opening the modal configuration setup
  const openCreateModal = async () => {
    setEditingData(null);
    setOpenModal(true);
    
    // Trigger parallel lazy fetching for dropdown assets
    await Promise.all([
      fetchTournaments(),
      fetchTeams(),
      fetchOfficials()
    ]);
  };

  // 🌟 FIX: Do the same for your edit modal trigger layout
  const openEditModal = async (match: any) => {
    const formattedData = {
      id: match.id,
      tournament_code: match.tournament_code,
      match_date: match.match_date,
      match_time: match.match_time,
      court_no: match.court_no,
      match_no: match.match_no,
      age_category: match.age_category,
      gender: match.gender,
      white_team: match.white_team,
      blue_team: match.blue_team,
      white_team_code: match.white_team_code, 
      blue_team_code: match.blue_team_code,   
      digital_scorer_code: match.digital_scorer_code,
      referee_1_code: match.referee_1_code,
      referee_2_code: match.referee_2_code,
      goaljudge_1_code: match.goaljudge_1_code,
      goaljudge_2_code: match.goaljudge_2_code,
      timekeeper_1_code: match.timekeeper_1_code,
      timekeeper_2_code: match.timekeeper_2_code,
    };
    setEditingData(formattedData);
    setOpenModal(true);

    // Fetch drop-down dependencies dynamically in background
    await Promise.all([
      fetchTournaments(),
      fetchTeams(),
      fetchOfficials()
    ]);
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingData(null);
  };

  return (
    <View style={{ flex: tokens.layout.flexFull, backgroundColor: theme.colors.background || tokens.colors.background }}>
      <ScrollView
        scrollEnabled={isMobile}
        contentContainerStyle={{
          flexGrow: tokens.layout.flexFull,
          padding: isMobile ? tokens.spacing.md : tokens.spacing.xl,
        }}
      >
        <MatchesHeader onEdit={openCreateModal} />

        {tournament_code && (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme.colors.secondary || '#e0f2fe',
            padding: tokens.spacing.md,
            borderRadius: tokens.radius.md,
            marginBottom: tokens.spacing.md
          }}>
            <Text style={{ fontFamily: theme.typography.fontFamily, color: theme.colors.textPrimary, fontWeight: '600' }}>
              Matches of Tournament: {getSelectedTournamentName()}
            </Text>
            <TouchableOpacity onPress={handleClearFilter}>
              <Text style={{ color: theme.colors.primary || '#0284c7', fontWeight: '700', textDecorationLine: 'underline' }}>
                Clear Filter
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {loading && <ActivityIndicator size="large" color={theme.colors.primary || tokens.colors.primary} />}

        {error ? (
          <Text style={{ color: theme.colors.error || tokens.colors.error, fontFamily: theme.typography.fontFamily || tokens.typography.fontFamily, marginBottom: tokens.spacing.sm }}>
            {error}
          </Text>
        ) : null}

        <View style={{ flex: tokens.layout.flexFull, minHeight: isMobile ? 'auto' : 0 }}>
          {isMobile ? (
            <MatchCardList
              matches={matches}
              teams={teams} 
              officials={officials} 
              onEdit={openEditModal}
              onDelete={handleDelete}
              onStartMatch={handleStartMatch}
            />
          ) : (
            <View style={{ flex: tokens.layout.flexFull, overflow: 'hidden' }}>
              <MatchTable
                matches={matches}
                teams={teams} 
                officials={officials}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onStartMatch={handleStartMatch}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {openModal && (
        <CreateMatchModal
          onSave={handleSave}
          onClose={closeModal}
          initialData={editingData}
          teams={teams} 
          officials={officials}
          tournaments={tournaments}
        />
      )}
    </View>
  );
}