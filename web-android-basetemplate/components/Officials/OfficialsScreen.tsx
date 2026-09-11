

import React, { useState } from 'react';
import { ActivityIndicator, View, useWindowDimensions } from 'react-native';
import OfficialsCardList from '@/components/Officials/OfficialsCardList';
import OfficialsHeader from '@/components/Officials/OfficialsHeader';
import OfficialsTable from '@/components/Officials/OfficialsTable';
import NotificationModal from '@/components/ui/NotificationModal';
import AddOfficialModal from '../../components/elements/AddOfficial';
import { useOfficials } from '../../hooks/useofficials';
import officialService from '../../services/official/official.service';
import { useTheme } from '../../theme/themeContext';

type NotifState = { visible: boolean; type: 'success' | 'error'; title: string; message: string };
type ConfirmState = { visible: boolean; onConfirm: () => void };

export default function OfficialsScreen() {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const isMobile = screenWidth < 768;

  const { officials, loading, reload } = useOfficials({});
  const [openModal, setOpenModal] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<any>(null);
  const [notif, setNotif] = useState<NotifState>({ visible: false, type: 'success', title: '', message: '' });
  const [confirm, setConfirm] = useState<ConfirmState>({ visible: false, onConfirm: () => {} });

  const showNotif = (type: 'success' | 'error', title: string, message: string) =>
    setNotif({ visible: true, type, title, message });

  const handleSave = async (data: any) => {
    try {
      if (editingOfficial) {
        await officialService.updateOfficial(editingOfficial.id, data);
        showNotif('success', 'Success', 'Official updated successfully.');
      } else {
        await officialService.createOfficial(data);
        showNotif('success', 'Success', 'Official created successfully.');
      }
      reload();
      closeModal();
    } catch {
      showNotif('error', 'Error', 'Save failed. Please try again.');
    }
  };

  const handleDelete = (id: any) => {
    const performDelete = async () => {
      try {
        await officialService.deleteOfficial(id);
        reload();
        showNotif('success', 'Deleted', 'Official deleted successfully.');
      } catch {
        showNotif('error', 'Error', 'Failed to delete official.');
      }
    };
    setConfirm({ visible: true, onConfirm: performDelete });
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
      dob: official.dob || '',
    });
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingOfficial(null);
  };

  return (
    <View style={{ flex: 1, height: '100vh' as any, overflow: 'hidden' as any, backgroundColor: theme.colors.background }}>
      <View style={{ paddingHorizontal: isMobile ? 15 : 25, paddingTop: 15, flexShrink: 0 }}>
        <OfficialsHeader onEdit={setOpenModal} />
      </View>

      {isMobile ? (
        <OfficialsCardList 
          officials={officials || []} 
          onEdit={openEditModal} 
          onDelete={handleDelete} 
        />
      ) : (
        <OfficialsTable
          officials={officials || []}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      )}

      {openModal && (
        <View>
          <AddOfficialModal 
          onSave={handleSave} 
          onClose={closeModal} 
          initialData={editingOfficial} 
          />
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
        title="Delete Official"
        message="Are you sure you want to delete this official?"
        confirmLabel="Delete"
        onClose={() => setConfirm(c => ({ ...c, visible: false }))}
        onConfirm={confirm.onConfirm}
      />
    </View>
  );
}