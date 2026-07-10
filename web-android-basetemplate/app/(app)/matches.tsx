import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';
import CreateMatchModal from '../../components/elements/CreateMatchModal';
import MatchCardList from '@/components/Matches listing/MatchCardList';
import MatchesHeader from '@/components/Matches listing/MatchesHeader';
import MatchTable from '@/components/Matches listing/MatchTable';
import NotificationModal from '@/components/ui/NotificationModal';
import FilterSearchBar from '@/components/ui/FilterSearchBar';

import { useOfficials } from '@/hooks/useofficials';
import { useMatches } from '../../hooks/usematches';
import { useTeams } from '../../hooks/useteams';

import matchService from '../../services/match/match.service';
import tournamentService from '../../services/tournament/tournamment.service';
import { useTheme } from '../../theme/themeContext';
import { tokens } from '../../theme/token';
import Pagination from '@/components/ui/Pagination';

const TABLET_BREAKPOINT = 768;

type NotifState = { visible: boolean; type: 'success' | 'error'; title: string; message: string };
type ConfirmState = { visible: boolean; onConfirm: () => void };

export default function MatchesScreen() {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const isMobile = screenWidth < TABLET_BREAKPOINT;

  const { tournament_code } = useLocalSearchParams<{ tournament_code?: string }>();

  type MatchFilter = 'all' | 'incomplete' | 'completed';
  const [filter, setFilter] = useState<MatchFilter>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const isComplete = filter === 'all' ? undefined : filter === 'completed';
  const { matches = [], total, loading, error, reload } = useMatches(isComplete, search, page, rowsPerPage);
  const { teams = [], reload: fetchTeams } = useTeams({ lazy: true });
  const { officials = [], reload: fetchOfficials } = useOfficials({ rowsPerPage: 500 });

  const [openModal, setOpenModal] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [notif, setNotif] = useState<NotifState>({ visible: false, type: 'success', title: '', message: '' });
  const [confirm, setConfirm] = useState<ConfirmState>({ visible: false, onConfirm: () => {} });

  const showNotif = (type: 'success' | 'error', title: string, message: string) =>
    setNotif({ visible: true, type, title, message });

  useEffect(() => {}, []);

  const fetchTournaments = async () => {
    try {
      const response = await tournamentService.getTournaments();
      setTournaments(response?.data?.data || response?.data || []);
    } catch {
      console.log('Failed to fetch tournaments');
    }
  };

  const getSelectedTournamentName = () => {
    if (!tournament_code || tournaments.length === 0) return '';
    const found = tournaments.find((t: any) => String(t.tournament_code) === String(tournament_code));
    return found ? (found.name || found.tournament_name) : tournament_code;
  };

  // const handleClearFilter = () => {
  //   router.replace('/matches');
  // };

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

  const filteredMatches = (matches || []).filter((m: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.match_date?.toLowerCase().includes(q) ||
      m.age_category?.toLowerCase().includes(q) ||
      m.gender?.toLowerCase().includes(q) ||
      String(m.match_no || '').toLowerCase().includes(q) ||
      String(m.court_no || '').toLowerCase().includes(q)
    );
  });

  const topSection = (
    <>
      <MatchesHeader onEdit={openCreateModal} />

      {tournament_code ? (
        <View
          style={{
            // flexDirection: 'row',
            // justifyContent: 'space-between',
            // alignItems: 'center',
            // backgroundColor: theme.colors.secondary || '#e0f2fe',
            // padding: tokens.spacing.md,
            // borderRadius: tokens.radius.md,
            // marginBottom: tokens.spacing.md,
          }}
        >
          {/* <Text style={{ fontFamily: theme.typography.fontFamily, color: theme.colors.textPrimary, fontWeight: '600' }}>
            Matches of Tournament: {getSelectedTournamentName()}
          </Text>
          <TouchableOpacity onPress={handleClearFilter}>
            <Text style={{ color: theme.colors.primary || '#0284c7', fontWeight: '700', textDecorationLine: 'underline' }}>
              Clear Filter
            </Text>
          </TouchableOpacity> */}
        </View>
      ) : null}

      {loading ? <ActivityIndicator size="large" color={theme.colors.primary || tokens.colors.primary} /> : null}

      {error ? (
        <Text style={{ color: theme.colors.error || tokens.colors.error, fontFamily: theme.typography.fontFamily || tokens.typography.fontFamily, marginBottom: tokens.spacing.sm }}>
          {error}
        </Text>
      ) : null}

      <FilterSearchBar
        filter={filter}
        onFilterChange={(f: MatchFilter) => { setFilter(f); setPage(0); }}
        search={search}
        onSearchChange={(s: string) => { setSearch(s); setPage(0); }}
        searchPlaceholder="Search matches..."
        tabs={[
          { label: 'All', value: 'all' },
          { label: 'Incomplete', value: 'incomplete' },
          { label: 'Completed', value: 'completed' },
        ]}
      />
    </>
  );

  return (
    <View style={{ flex: 1, height: '100vh' as any, overflow: 'hidden' as any, backgroundColor: theme.colors.background || tokens.colors.background }}>
      {isMobile ? (
        /*
         * MOBILE: outer ScrollView is correct here — MatchCardList renders
         * cards with natural (auto) height so a single outer scroll handles
         * the page. No inner ScrollView conflict.
         */
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: tokens.spacing.md }}>
          {topSection}
          <MatchCardList
            matches={filteredMatches}
            teams={teams}
            officials={officials}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onStartMatch={handleStartMatch}
          />
        </ScrollView>
      ) : (
        <View style={{ flex: 1, padding: tokens.spacing.xl }}>
          <View style={{ flexShrink: 0 }}>
            {topSection}
          </View>
          <View style={{ height: 'calc(100vh - 360px)' as any, width: '100%' }}>
            <MatchTable
              matches={filteredMatches}
              teams={teams}
              officials={officials}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onStartMatch={handleStartMatch}
            />
          </View>
          <Pagination
            total={total ?? 0}
            page={page ?? 0}
            rowsPerPage={rowsPerPage ?? 10}
            onPageChange={setPage}
            onRowsPerPageChange={(rpp: number) => { setRowsPerPage(rpp); setPage(0); }}
          />
        </View>
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
