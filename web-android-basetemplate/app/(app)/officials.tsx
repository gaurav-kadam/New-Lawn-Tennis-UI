import OfficialsCardList from '@/components/Officials/OfficialsCardList';
import OfficialsHeader from '@/components/Officials/OfficialsHeader';
import OfficialsTable from '@/components/Officials/OfficialsTable';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, View, useWindowDimensions } from 'react-native';
import AddOfficialModal from '../../components/elements/AddOfficial';
import { useOfficials } from '../../hooks/useofficials';
import officialService from '../../services/official/official.service';
import { useTheme } from '../../theme/themeContext';

export default function OfficialsScreen() {
  const theme = useTheme(); 
  const { width: screenWidth } = useWindowDimensions();
  const isMobile = screenWidth < 768;
  
  const { officials, loading, reload } = useOfficials();
  const [openModal, setOpenModal] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<any>(null);

  const handleSave = async (data: any) => {
    try {
      if (editingOfficial) {
        await officialService.updateOfficial(editingOfficial.id, data);
      } else {
        await officialService.createOfficial(data);
      }
      reload();
      closeModal();
    } catch (error) {
      Alert.alert("Error", "Save failed. Please try again.");
    }
  };

  const handleDelete = (id: any) => {
    const performDelete = async () => {
      try {
        await officialService.deleteOfficial(id);
        reload(); 
      } catch (err) {
        if (Platform.OS === 'web') {
          alert("Failed to delete official.");
        } else {
          Alert.alert("Error", "Failed to delete official.");
        }
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure, want to delete Official Details?")) {
        performDelete();
      }
    } else {
      Alert.alert("Delete Official", "Are you sure, want to delete Official Details?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: performDelete }
      ]);
    }
  };

  const openEditModal = (official: any) => {
    setEditingOfficial({
      id: official.id,
      firstName: official.first_name,
      lastName: official.last_name,
      email: official.email,
      phoneNo: official.phone_no,
      gender: official.gender,
      state: official.state,
      city: official.city,
       dob: official.dob || ''
    });
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingOfficial(null);
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
              <OfficialsHeader
                onEdit={setOpenModal}
      
              />
      
      
              {loading && (
                <ActivityIndicator
                  size="large"
                  color={theme.colors.primary}
                />
              )}
      
              {/* {error ? (
                <Text
                  style={{
                    color: theme.colors.error,
                    fontFamily: theme.typography.fontFamily,
                    marginBottom: 12,
                  }}
                >
                  {error}
                  
                </Text>
              ) : null} */}
      
              <View
                style={{
                  flex: 1,
      
                  minHeight: isMobile ? 'auto' : 0,
                }}
              >
                {
                  isMobile ? (
                    <OfficialsCardList
                      officials={officials}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                    />
                  ) : (
                    <View
                      style={{
                        flex: 1,
      
                        overflow: 'hidden',
                      }}
                    >
                      <OfficialsTable
                        officials={officials}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                      />
                    </View>
                  )
                }
              </View>
      
            </ScrollView>

      {openModal && (
        <View style={{ 
          position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, 
          backgroundColor: 'theme.colors.textPrimary', 
          justifyContent: 'center', 
          zIndex: 1000 
        }}>
            <AddOfficialModal 
              onSave={handleSave} 
              onClose={closeModal} 
              initialData={editingOfficial} 
            />
        </View>
      )}
    </View>
  );
}