

import React, { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';

import TeamCardList from '@/components/Teams/TeamCardList';
import TeamHeader from '@/components/Teams/TeamHeader';
import TeamTable from '@/components/Teams/TeamTable';
import NotificationModal from '@/components/ui/NotificationModal';
import CreateTeamModal from '../../components/elements/AddTeam';

import { useTeams } from '../../hooks/useteams';
import teamService from '../../services/team/team.service';
import { useTheme } from '../../theme/themeContext';
import { tokens } from '../../theme/token';

const TABLET_BREAKPOINT = 768;

type NotifState = { visible: boolean; type: 'success' | 'error'; title: string; message: string };
type ConfirmState = { visible: boolean; onConfirm: () => void };

export default function TeamsScreen() {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const isMobile = screenWidth < TABLET_BREAKPOINT;

  // ✅ Cleaned up: Removed 'error' from destructuring
  const { teams,reload } = useTeams({});
  
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

  return (
    <View style={{ flex: 1, height: '100vh' as any, overflow: 'hidden' as any, backgroundColor: theme.colors.background || tokens.colors.background }}>
      <View style={{ paddingHorizontal: isMobile ? tokens.spacing.md : tokens.spacing.xl, paddingTop: 15, flexShrink: 0 }}>
        <TeamHeader onEdit={openCreateModal} />
        
      </View>

      {isMobile ? (
        <TeamCardList 
          teams={teams || []} 
          onEdit={openEditModal} 
          onDelete={handleDelete} 
        />
      ) : (
        <TeamTable
          teams={teams || []}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
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