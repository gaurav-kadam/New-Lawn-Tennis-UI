


import React, { useState } from 'react';
import { ActivityIndicator, Text, View, useWindowDimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import CreateMatchModal from '../../components/elements/CreateMatchModal';
import MatchCardList from '@/components/Matches listing/MatchCardList';
import MatchesHeader from '@/components/Matches listing/MatchesHeader';
import MatchTable from '@/components/Matches listing/MatchTable';
import NotificationModal from '@/components/ui/NotificationModal';

import { useOfficials } from '@/hooks/useofficials';
import { useMatches } from '../../hooks/usematches';
import { useTeams } from '../../hooks/useteams';

import matchService from '../../services/match/match.service';
import tournamentService from '../../services/tournament/tournamment.service';
import { useTheme } from '../../theme/themeContext';
import { tokens } from '../../theme/token';

const TABLET_BREAKPOINT = 768;

type NotifState = { visible: boolean; type: 'success' | 'error'; title: string; message: string };
type ConfirmState = { visible: boolean; onConfirm: () => void };

export default function MatchesScreen() {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const isMobile = screenWidth < TABLET_BREAKPOINT;

  const { tournament_code } = useLocalSearchParams<{ tournament_code?: string }>();

  // Fetch complete datasets to enable high-performance client-side operations
  const { matches = [], loading, error, reload } = useMatches();
  const { teams = [], reload: fetchTeams } = useTeams({ lazy: true });
  const { officials = [], reload: fetchOfficials } = useOfficials({ rowsPerPage: 500 });

  const [openModal, setOpenModal] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [notif, setNotif] = useState<NotifState>({ visible: false, type: 'success', title: '', message: '' });
  const [confirm, setConfirm] = useState<ConfirmState>({ visible: false, onConfirm: () => {} });

  const showNotif = (type: 'success' | 'error', title: string, message: string) =>
    setNotif({ visible: true, type, title, message });

  const fetchTournaments = async () => {
    try {
      const response = await tournamentService.getTournaments();
      setTournaments(response?.data?.data || response?.data || []);
    } catch {
      console.log('Failed to fetch tournaments');
    }
  };

  const handleSave = async (formData: any) => {
    try {
      if (editingData) {
        await matchService.updateMatch(editingData.id, formData);
        showNotif('success', 'Success', 'Match updated successfully.');
      } else {
        await matchService.createMatch(formData);
        showNotif('success', 'Success', 'Match created successfully.');
      }
      await reload();
      closeModal();
    } catch {
      showNotif('error', 'Error', 'Failed to save match data.');
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
        matchDate: match.match_date || '',
        tournamentCode: match.tournament_code || '',
        quarterDuration: String(match.quarter_duration || ''),
        digitalScorerCode: match.digital_scorer_code || '',
        referee1Code: match.referee_1_code || '',
        referee2Code: match.referee_2_code || '',
        timekeeper1Code: match.timekeeper_1_code || '',
        timekeeper2Code: match.timekeeper_2_code || '',
        goalJudge1Code: match.goaljudge_1_code || '',
        goalJudge2Code: match.goaljudge_2_code || '',
        autoFullscreen: 'true',
      },
    });
  };

  const handleDelete = (id: any) => {
    const performDelete = async () => {
      try {
        await matchService.deleteMatch(id);
        await reload();
        showNotif('success', 'Deleted', 'Match deleted successfully.');
      } catch {
        showNotif('error', 'Error', 'Failed to delete match.');
      }
    };
    setConfirm({ visible: true, onConfirm: performDelete });
  };

  const openCreateModal = async () => {
    setEditingData(null);
    setOpenModal(true);
    await Promise.all([fetchTournaments(), fetchTeams(), fetchOfficials()]);
  };

  const openEditModal = async (match: any) => {
    setEditingData({
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
    });
    setOpenModal(true);
    await Promise.all([fetchTournaments(), fetchTeams(), fetchOfficials()]);
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingData(null);
  };

  return (
    <View style={{ flex: 1, height: '100vh' as any, overflow: 'hidden' as any, backgroundColor: theme.colors.background }}>
      <View style={{ paddingHorizontal: isMobile ? tokens.spacing.md : tokens.spacing.xl, paddingTop: 15, flexShrink: 0 }}>
        <MatchesHeader onEdit={openCreateModal} />
        
        
          
      
      </View>

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
        <MatchTable
          matches={matches}
          teams={teams}
          officials={officials}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onStartMatch={handleStartMatch}
        />
      )}

      {openModal ? (
        <CreateMatchModal
          visible={openModal}
          onSave={handleSave}
          onClose={closeModal}
          initialData={editingData}
          teams={teams}
          officials={officials}
          tournaments={tournaments}
        />
      ) : null}

      <NotificationModal
        visible={notif.visible}
        type={notif.type}
        title={notif.title}
        message={notif.message}
        onClose={() => setNotif((n) => ({ ...n, visible: false }))}
      />

      <NotificationModal
        visible={confirm.visible}
        type="confirm"
        title="Delete Match"
        message="Are you sure you want to delete this match?"
        confirmLabel="Delete"
        onClose={() => setConfirm((c) => ({ ...c, visible: false }))}
        onConfirm={confirm.onConfirm}
      />
    </View>
  );
}