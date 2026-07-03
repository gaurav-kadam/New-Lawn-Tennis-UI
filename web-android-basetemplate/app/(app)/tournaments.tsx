import React, { useState } from 'react';
import { ScrollView, View, useWindowDimensions, ActivityIndicator, Text } from 'react-native';
import { router } from 'expo-router';
import AddTournamentModal from '../../components/elements/AddTournament';
import ViewTournamentModal from '../../components/elements/ViewTournamentModal';
import { useTournaments } from '../../hooks/usetournaments';
import tournamentService from '../../services/tournament/tournamment.service';
import { useTheme } from '../../theme/themeContext';
import TournamentCardList from '@/components/tournaments/TournamentCardList';
import TournamentTable from '@/components/tournaments/TournamentTable';
import TournamentHeader from '@/components/tournaments/TournamentHeader';
import NotificationModal from '@/components/ui/NotificationModal';
import FilterSearchBar, { FilterTab } from '@/components/ui/FilterSearchBar';
import Pagination from '@/components/ui/Pagination';

type NotifState = { visible: boolean; type: 'success' | 'error'; title: string; message: string };
type ConfirmState = { visible: boolean; onConfirm: () => void };

export default function TournamentsScreen() {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const isMobile = screenWidth < 768;

  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const isActive = filter === 'all' ? undefined : filter === 'active';
  const { tournaments, total, loading, error, reload } = useTournaments(isActive, search, page, rowsPerPage);
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [viewingData, setViewingData] = useState<any>(null);
  const [notif, setNotif] = useState<NotifState>({ visible: false, type: 'success', title: '', message: '' });
  const [confirm, setConfirm] = useState<ConfirmState>({ visible: false, onConfirm: () => {} });

  const showNotif = (type: 'success' | 'error', title: string, message: string) =>
    setNotif({ visible: true, type, title, message });

  const handleSave = async (data: any) => {
    try {
      if (editingData) {
        await tournamentService.updateTournament(editingData.id, data);
        showNotif('success', 'Success', 'Tournament updated successfully.');
      } else {
        await tournamentService.createTournament(data);
        showNotif('success', 'Success', 'Tournament created successfully.');
      }
      reload();
      closeModal();
    } catch {
      showNotif('error', 'Error', 'Failed to save tournament data.');
    }
  };

  const handleDelete = (id: any) => {
    const performDelete = async () => {
      try {
        await tournamentService.deleteTournament(id);
        reload();
        showNotif('success', 'Deleted', 'Tournament deleted successfully.');
      } catch {
        showNotif('error', 'Error', 'Failed to delete tournament.');
      }
    };
    setConfirm({ visible: true, onConfirm: performDelete });
  };

  const openEditModal = (item: any) => {
    setEditingData(item);
    setOpenModal(true);
  };

  const handleOpenViewModal = (item: any) => {
    setViewingData(item);
    setOpenViewModal(true);
  };

  const handleAttachTournament = (tournament: any) => {
    const codeToMatch = tournament.tournament_code;
    if (!codeToMatch) {
      showNotif('error', 'Missing Code', 'This tournament does not have a tournament code.');
      return;
    }
    router.push({ pathname: '/matches', params: { tournament_code: codeToMatch } });
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingData(null);
  };

  const closeViewModal = () => {
    setOpenViewModal(false);
    setViewingData(null);
  };

  const filteredTournaments = (tournaments || []).filter((t: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.tournament_name?.toLowerCase().includes(q) ||
      t.city?.toLowerCase().includes(q) ||
      t.state?.toLowerCase().includes(q) ||
      t.section?.toLowerCase().includes(q) ||
      t.gender?.toLowerCase().includes(q)
    );
  });

  const topSection = (
    <>
      <TournamentHeader onEdit={setOpenModal} />
      {loading && <ActivityIndicator size="large" color={theme.colors.primary} />}
      {error ? (
        <Text style={{ color: theme.colors.error, fontFamily: theme.typography.fontFamily, marginTop: 0 }}>
          {error}
        </Text>
      ) : null}
      <FilterSearchBar
        filter={filter}
        onFilterChange={(f: FilterTab) => { setFilter(f); setPage(0); }}
        search={search}
        onSearchChange={(s: string) => { setSearch(s); setPage(0); }}
        searchPlaceholder="Search tournaments..."
      />
    </>
  );

  return (
    <View style={{ flex: 1, height: '100vh' as any, overflow: 'hidden' as any, backgroundColor: theme.colors.background }}>
      {isMobile ? (
        /*
         * MOBILE: outer ScrollView is correct — TournamentCardList has natural
         * height so a single outer scroll handles the whole page.
         */
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: theme.spacing.md || 15 }}>
          {topSection}
          <TournamentCardList
            tournaments={filteredTournaments}
            onView={handleOpenViewModal}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onAttach={handleAttachTournament}
          />
        </ScrollView>
      ) : (
        <View style={{ flex: 1, padding: theme.spacing.xl || 25 }}>
          <View style={{ flexShrink: 0 }}>
            {topSection}
          </View>
          <View style={{ height: 'calc(100vh - 360px)' as any, width: '100%' }}>
            <TournamentTable
              tournaments={filteredTournaments}
              onView={handleOpenViewModal}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onAttach={handleAttachTournament}
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

      {openModal && (
        <View>
          <AddTournamentModal onSave={handleSave} onClose={closeModal} initialData={editingData} />
        </View>
      )}

      {openViewModal && (
        <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <ViewTournamentModal tournament={viewingData} onClose={closeViewModal} />
        </View>
      )}

      <NotificationModal
        visible={notif.visible}
        type={notif.type}
        title={notif.title}
        message={notif.message}
        onClose={() => setNotif(n => ({ ...n, visible: false }))}
      />

      <NotificationModal
        visible={confirm.visible}
        type="confirm"
        title="Delete Tournament"
        message="Are you sure you want to delete this tournament?"
        confirmLabel="Delete"
        onClose={() => setConfirm(c => ({ ...c, visible: false }))}
        onConfirm={confirm.onConfirm}
      />
    </View>
  );
}
