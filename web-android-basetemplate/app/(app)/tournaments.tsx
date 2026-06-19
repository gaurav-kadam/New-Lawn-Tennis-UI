import React, { useState } from 'react';
import { ScrollView, Text, View, useWindowDimensions, TouchableOpacity, ActivityIndicator, Platform, Alert } from 'react-native';
import { router } from 'expo-router'; // ⬅️ IMPORT ROUTER
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import AddTournamentModal from '../../components/elements/AddTournament';
import ViewTournamentModal from '../../components/elements/ViewTournamentModal'; 
import { useTournaments } from '../../hooks/usetournaments';
import tournamentService from '../../services/tournament/tournamment.service';
import { useTheme } from '../../theme/themeContext';
import TournamentCardList from '@/components/tournaments/TournamentCardList';
import TournamentTable from '@/components/tournaments/TournamentTable';
import TournamentHeader from '@/components/tournaments/TournamentHeader';

export default function TournamentsScreen() {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const isMobile = screenWidth < 768;

  const { tournaments, loading, error, reload } = useTournaments();
  const [openModal, setOpenModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false); 
  const [editingData, setEditingData] = useState<any>(null);
  const [viewingData, setViewingData] = useState<any>(null); 

  const handleSave = async (data: any) => {
    try {
      if (editingData) {
        await tournamentService.updateTournament(editingData.id, data);
      } else {
        await tournamentService.createTournament(data);
      }
      reload();
      closeModal();
    } catch (err) {
      Alert.alert("Error", "Failed to save tournament data.");
    }
  };

  const handleDelete = (id: any) => {
    const performDelete = async () => {
      try {
        await tournamentService.deleteTournament(id);
        reload();
      } catch (err) {
        if (Platform.OS === 'web') {
          alert("Failed to delete tournament.");
        } else {
          Alert.alert("Error", "Failed to delete tournament.");
        }
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure, want to delete Tournament Details?")) {
        performDelete();
      }
    } else {
      Alert.alert("Delete Tournament", "Are you sure, want to delete Tournament Details?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: performDelete }
      ]);
    }
  };

  const openEditModal = (item: any) => {
    setEditingData(item);
    setOpenModal(true);
  };

  const handleOpenViewModal = (item: any) => {
    setViewingData(item);
    setOpenViewModal(true);
  };

  // 🌟 UPDATED: Redirects to matches screen with filtering param
  const handleAttachTournament = (tournament: any) => {
    const codeToMatch = tournament.tournament_code;
    
    if (!codeToMatch) {
      if (Platform.OS === 'web') {
        alert("This tournament does not have a tournament code!");
      } else {
        Alert.alert("Missing Code", "This tournament does not have a tournament code.");
      }
      return;
    }

    console.log(`Redirecting to matches filtered by code: ${codeToMatch}`);
    
    router.push({
      pathname: '/matches', // ⬅️ Points to your matches route path directory name
      params: { tournament_code: codeToMatch },
    });
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingData(null);
  };

  const closeViewModal = () => {
    setOpenViewModal(false);
    setViewingData(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        scrollEnabled={isMobile}
        contentContainerStyle={{
          flexGrow: 1,
          padding: isMobile
            ? theme.spacing.md || 15
            : theme.spacing.xl || 25,
        }}
      >
        <TournamentHeader onEdit={setOpenModal} />

        {loading && <ActivityIndicator size="large" color={theme.colors.primary} />}

        {error ? (
          <Text style={{ color: theme.colors.error, fontFamily: theme.typography.fontFamily, marginBottom: 12 }}>
            {error}
          </Text>
        ) : null}

        <View style={{ flex: 1, minHeight: isMobile ? 'auto' : 0 }}>
          {isMobile ? (
            <TournamentCardList
              tournaments={tournaments}
              onView={handleOpenViewModal} 
              onEdit={openEditModal}
              onDelete={handleDelete}
              onAttach={handleAttachTournament} 
            />
          ) : (
            <View style={{ flex: 1, overflow: 'hidden' }}>
              <TournamentTable
                tournaments={tournaments}
                onView={handleOpenViewModal} 
                onEdit={openEditModal}
                onDelete={handleDelete}
                onAttach={handleAttachTournament} 
              />
            </View>
          )}
        </View>
      </ScrollView>

      {openModal && (
        <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', zIndex: 1000 }}>
          <AddTournamentModal onSave={handleSave} onClose={closeModal} initialData={editingData} />
        </View>
      )}

      {openViewModal && (
        <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <ViewTournamentModal tournament={viewingData} onClose={closeViewModal} />
        </View>
      )}
    </View>
  );
}