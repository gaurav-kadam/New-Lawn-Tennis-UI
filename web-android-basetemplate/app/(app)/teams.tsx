import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, View, useWindowDimensions } from 'react-native';
import FilterSearchBar, { FilterTab } from '@/components/ui/FilterSearchBar';

import TeamCardList from '@/components/Teams/TeamCardList';
import TeamHeader from '@/components/Teams/TeamHeader';
import TeamTable from '@/components/Teams/TeamTable';
import NotificationModal from '@/components/ui/NotificationModal';
import CreateTeamModal from '../../components/elements/AddTeam';

import { useTeams } from '../../hooks/useteams';
import teamService from '../../services/team/team.service';
import { useTheme } from '../../theme/themeContext';
import { tokens } from '../../theme/token';
import Pagination from '@/components/ui/Pagination';

const TABLET_BREAKPOINT = 768;

type NotifState = { visible: boolean; type: 'success' | 'error'; title: string; message: string };
type ConfirmState = { visible: boolean; onConfirm: () => void };

export default function TeamsScreen() {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const isMobile = screenWidth < TABLET_BREAKPOINT;

  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const isActive = filter === 'all' ? undefined : filter === 'active';
  const { teams, total, loading, reload } = useTeams({ isActive, search, page, rowsPerPage });
  const [openModal, setOpenModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [notif, setNotif] = useState<NotifState>({ visible: false, type: 'success', title: '', message: '' });
  const [confirm, setConfirm] = useState<ConfirmState>({ visible: false, onConfirm: () => {} });

  const showNotif = (type: 'success' | 'error', title: string, message: string) =>
    setNotif({ visible: true, type, title, message });

  const handleSave = async (data: any) => {
    try {
      if (editingTeam) {
        await teamService.updateTeam(editingTeam.id, data);
        showNotif('success', 'Success', 'Team updated successfully.');
      } else {
        await teamService.createTeam(data);
        showNotif('success', 'Success', 'Team registered successfully.');
      }
      await reload();
      closeModal();
    } catch {
      showNotif('error', 'Error', 'Failed to save team data and process player spreadsheet.');
    }
  };

  const handleDelete = (id: any) => {
    const performDelete = async () => {
      try {
        await teamService.deleteTeam(id);
        await reload();
        showNotif('success', 'Deleted', 'Team deleted successfully.');
      } catch {
        showNotif('error', 'Error', 'Failed to delete team.');
      }
    };
    setConfirm({ visible: true, onConfirm: performDelete });
  };

  const openCreateModal = () => {
    setEditingTeam(null);
    setOpenModal(true);
  };

  const openEditModal = (team: any) => {
    setEditingTeam({
      id: team.id,
      teamName: team.team_name,
      shortName: team.short_name,
      state: team.state,
      city: team.city,
      gender: team.gender,
      section: team.section,
      headCoach: team.head_coach,
      coach: team.coach,
      manager: team.manager,
    });
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingTeam(null);
  };

  const filteredTeams = (teams || []).filter((t: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.team_name?.toLowerCase().includes(q) ||
      t.city?.toLowerCase().includes(q) ||
      t.state?.toLowerCase().includes(q) ||
      t.section?.toLowerCase().includes(q)
    );
  });

  const topSection = (
    <>
      <TeamHeader onEdit={openCreateModal} />
      {loading && <ActivityIndicator size="large" color={theme.colors.primary || tokens.colors.primary} />}
      <FilterSearchBar
        filter={filter}
        onFilterChange={(f: FilterTab) => { setFilter(f); setPage(0); }}
        search={search}
        onSearchChange={(s: string) => { setSearch(s); setPage(0); }}
        searchPlaceholder="Search teams..."
      />
    </>
  );

  return (
    <View style={{ flex: 1, height: '100vh' as any, overflow: 'hidden' as any, backgroundColor: theme.colors.background || tokens.colors.background }}>
      {isMobile ? (
        
        /* MOBILE: outer ScrollView + card list — no inner ScrollView conflict.*/
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: tokens.spacing.md }}>
          {topSection}
          <TeamCardList teams={filteredTeams} onEdit={openEditModal} onDelete={handleDelete} />
        </ScrollView>
      ) : (
        <View style={{ flex: 1, padding: tokens.spacing.xl }}>
          <View style={{ flexShrink: 0 }}>
            {topSection}
          </View>
          <View style={{ height: 'calc(100vh - 360px)' as any, width: '100%' }}>
            <TeamTable
              tournaments={filteredTeams}
              onEdit={openEditModal}
              onDelete={handleDelete}
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
        <CreateTeamModal
          visible={openModal}
          onSave={handleSave}
          onClose={closeModal}
          initialData={editingTeam}
        />
      ) : null}

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
        title="Delete Team"
        message="Are you sure you want to delete this team?"
        confirmLabel="Delete"
        onClose={() => setConfirm(c => ({ ...c, visible: false }))}
        onConfirm={confirm.onConfirm}
      />
    </View>
  );
}
