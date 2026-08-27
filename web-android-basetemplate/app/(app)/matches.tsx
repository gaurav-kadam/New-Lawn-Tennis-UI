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
import teamService from '../../services/team/team.service';
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
    
      let tournamentList: any[] = [];
    
      // Direct array response
      if (Array.isArray(response)) {
        tournamentList = response;
      }
    
      // response.data is array
      else if (Array.isArray(response?.data)) {
        tournamentList = response.data;
      }
    
      // response.data.data is array
      else if (Array.isArray(response?.data?.data)) {
        tournamentList = response.data.data;
      }
    
      // response.data.items is array
      else if (Array.isArray(response?.data?.items)) {
        tournamentList = response.data.items;
      }
    
      // response.items is array
      else if (Array.isArray(response?.items)) {
        tournamentList = response.items;
      }
      setTournaments(tournamentList);
    
    } catch (error) {
      console.error(
        'Failed to fetch tournaments:',
        error
      );
    
      setTournaments([]);
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

const handleStartMatch = async (match: any) => {
  try {
    // ============================================================
    // MATCH TYPE
    // ============================================================

    const matchType = String(
      match.match_type ??
      match.matchType ??
      'SINGLES'
    ).toUpperCase();

    // ============================================================
    // TEAM CODES
    // ============================================================

    const team1Code = String(
      match.team1_code ??
      match.team1 ??
      ''
    );

    const team2Code = String(
      match.team2_code ??
      match.team2 ??
      ''
    );

    // ============================================================
    // LOAD PLAYERS FROM BOTH TEAMS
    //
    // Existing NEW-UI API:
    // GET /teams/code/{teamCode}/players
    // ============================================================

    const [whiteResponse, blueResponse] =
      await Promise.all([
        team1Code
          ? teamService.getPlayersByTeamCode(
              team1Code
            )
          : Promise.resolve(null),

        team2Code
          ? teamService.getPlayersByTeamCode(
              team2Code
            )
          : Promise.resolve(null),
      ]);

    // ============================================================
    // NORMALIZE API RESPONSE
    // ============================================================

    const getPlayersFromResponse = (
      response: any
    ): any[] => {
      const data =
        response?.data?.data ??
        response?.data ??
        response;

      if (Array.isArray(data)) {
        return data;
      }

      if (Array.isArray(data?.players)) {
        return data.players;
      }

      if (Array.isArray(data?.items)) {
        return data.items;
      }

      return [];
    };

    const team1Players =
      getPlayersFromResponse(
        whiteResponse
      );

    const team2Players =
      getPlayersFromResponse(
        blueResponse
      );

    // ============================================================
    // PLAYER NAME RESOLVER
    // ============================================================

    const getPlayerName = (
      player: any
    ): string => {
      if (
        player === undefined ||
        player === null ||
        player === ''
      ) {
        return '';
      }

      if (typeof player === 'string') {
        return player;
      }

      if (
        typeof player === 'number'
      ) {
        return String(player);
      }

      const fullName =
        `${player?.first_name ?? ''} ${
          player?.last_name ?? ''
        }`.trim();

      return (
        player?.player_name ??
        player?.name ??
        player?.full_name ??
        fullName ??
        player?.player_code ??
        ''
      );
    };

    // ============================================================
    // EXPLICIT PLAYER DATA FROM MATCH
    //
    // If backend already sends individual players,
    // use them first.
    // ============================================================

    const explicitPlayer1 =
      match.player1_name ??
      match.player1Name ??
      match.red_player_name ??
      getPlayerName(
        match.player1 ??
        match.red_player
      );

    const explicitPlayer2 =
      match.player2_name ??
      match.player2Name ??
      match.blue_player_name ??
      getPlayerName(
        match.player2 ??
        match.blue_player
      );

    const explicitPlayer3 =
      match.player3_name ??
      match.player3Name ??
      getPlayerName(
        match.player3
      );

    const explicitPlayer4 =
      match.player4_name ??
      match.player4Name ??
      getPlayerName(
        match.player4
      );

    // ============================================================
    // DOUBLES
    //
    // Team 1:
    //   PLAYER1 + PLAYER2
    //
    // Team 2:
    //   PLAYER3 + PLAYER4
    // ============================================================

    let player1Name = explicitPlayer1;
    let player2Name = explicitPlayer2;
    let player3Name = explicitPlayer3;
    let player4Name = explicitPlayer4;

    if (matchType === 'DOUBLES') {
      player1Name =
        player1Name ||
        getPlayerName(
          team1Players[0]
        ) ||
        'Player 1';

      player2Name =
        player2Name ||
        getPlayerName(
          team1Players[1]
        ) ||
        'Player 2';

      player3Name =
        player3Name ||
        getPlayerName(
          team2Players[0]
        ) ||
        'Player 3';

      player4Name =
        player4Name ||
        getPlayerName(
          team2Players[1]
        ) ||
        'Player 4';
    } else {
      // ==========================================================
      // SINGLES
      // ==========================================================

      player1Name =
        player1Name ||
        getPlayerName(
          team1Players[0]
        ) ||
        'Player 1';

      player2Name =
        player2Name ||
        getPlayerName(
          team2Players[0]
        ) ||
        'Player 2';

      player3Name = '';
      player4Name = '';
    }
    // ============================================================
    // OPEN TENNIS MATCH SCREEN
    // ============================================================

    router.push({
      pathname: '/TennisMatchScreen',

      params: {
        // --------------------------------------------------------
        // MATCH IDENTIFICATION
        // --------------------------------------------------------

        matchId: String(
          match.id ?? ''
        ),

        // --------------------------------------------------------
        // ACTUAL PLAYER NAMES
        // --------------------------------------------------------

        player1Name: String(
          player1Name
        ),

        player2Name: String(
          player2Name
        ),

        player3Name: String(
          player3Name
        ),

        player4Name: String(
          player4Name
        ),

        // --------------------------------------------------------
        // MATCH TYPE
        // --------------------------------------------------------

        matchType: matchType,

        // --------------------------------------------------------
        // MATCH FORMAT
        // --------------------------------------------------------

        matchFormat: String(
          match.match_format ??
          match.matchFormat ??
          'BEST_OF_3'
        ).toUpperCase(),

        // --------------------------------------------------------
        // MATCH INFORMATION
        // --------------------------------------------------------

        matchNo: String(
          match.match_no ??
          ''
        ),

        courtNo: String(
          match.court_no ??
          '1'
        ),

        // --------------------------------------------------------
        // DOUBLES SERVICE ORDER
        // --------------------------------------------------------

        serviceOrder:
          JSON.stringify(
            match.service_order ??
            match.doublesServeOrder ??
            []
          ),
      },
    });
  } catch (error) {
    console.error(
      'Failed to load match players:',
      error
    );
  }
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
      team1: match.team1,
      team2: match.team2,
      team1_code: match.team1_code,
      team2_code: match.team2_code,
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