import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  View,
  useWindowDimensions,
} from 'react-native';

import TeamCardList from '@/components/Teams/TeamCardList';
import TeamHeader from '@/components/Teams/TeamHeader';
import TeamTable from '@/components/Teams/TeamTable';
import CreateTeamModal from '../../components/elements/AddTeam';

import { useTeams } from '../../hooks/useteams';
import teamService from '../../services/team/team.service';
import { useTheme } from '../../theme/themeContext';
import { tokens } from '../../theme/token';

const TABLET_BREAKPOINT = 768;
const MODAL_Z_INDEX = 1000;

export default function TeamsScreen() {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const isMobile = screenWidth < TABLET_BREAKPOINT;

  const { teams, loading, reload } = useTeams();

  const [openModal, setOpenModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any>(null);

  const handleSave = async (data: any) => {
    try {
      if (editingTeam) {
        // Updating an existing team
        await teamService.updateTeam(editingTeam.id, data);
      } else {
        // Registering a new team (handles both text parameters and Excel player sheets via FormData)
        await teamService.createTeam(data);
      }

      await reload();
      closeModal();
    } catch (error) {
      console.error('Error handling save team registration operation:', error);
      if (Platform.OS === 'web') {
        window.alert('Failed to save team data and process player spreadsheet.');
      } else {
        Alert.alert('Error', 'Failed to save team data and process player spreadsheet.');
      }
    }
  };

  const handleDelete = (id: any) => {
    const performDelete = async () => {
      try {
        await teamService.deleteTeam(id);
        await reload();
      } catch {
        if (Platform.OS === 'web') {
          window.alert('Failed to delete team.');
        } else {
          Alert.alert('Error', 'Failed to delete team.');
        }
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure, want to delete Team Details?')) {
        performDelete();
      }
    } else {
      Alert.alert(
        'Delete Team',
        'Are you sure, want to delete Team Details?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: performDelete,
          },
        ]
      );
    }
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
    <View 
      style={{
        flex: tokens.layout.flexFull,
        backgroundColor: theme.colors.background || tokens.colors.background,
      }}
    >
      <ScrollView
        scrollEnabled={isMobile}
        contentContainerStyle={{
          flexGrow: tokens.layout.flexFull,
          padding: isMobile 
            ? tokens.spacing.md 
            : tokens.spacing.xl,
        }}
      >
        <TeamHeader onEdit={openCreateModal} />

        {loading && (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary || tokens.colors.primary}
          />
        )}

        <View 
          style={{
            flex: tokens.layout.flexFull,
            minHeight: isMobile ? undefined : 0,
          }}
        >
          {isMobile ? (
            <TeamCardList
              teams={teams}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ) : (
            <View style={{ flex: tokens.layout.flexFull, overflow: 'hidden' }}>
              <TeamTable
                tournaments={teams}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {openModal && (
        <View>
          <CreateTeamModal
          visible={openModal}
            onSave={handleSave}
            onClose={closeModal}
            initialData={editingTeam}
          />
        </View>
      )}
    </View>
  );
}