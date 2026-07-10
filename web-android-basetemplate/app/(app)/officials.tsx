import OfficialsCardList from '@/components/Officials/OfficialsCardList';
import OfficialsHeader from '@/components/Officials/OfficialsHeader';
import OfficialsTable from '@/components/Officials/OfficialsTable';
import NotificationModal from '@/components/ui/NotificationModal';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, View, useWindowDimensions } from 'react-native';
import FilterSearchBar, { FilterTab } from '@/components/ui/FilterSearchBar';
import AddOfficialModal from '../../components/elements/AddOfficial';
import { useOfficials } from '../../hooks/useofficials';
import officialService from '../../services/official/official.service';
import { useTheme } from '../../theme/themeContext';
import Pagination from '@/components/ui/Pagination';

type NotifState = { visible: boolean; type: 'success' | 'error'; title: string; message: string };
type ConfirmState = { visible: boolean; onConfirm: () => void };

export default function OfficialsScreen() {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const isMobile = screenWidth < 768;

  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const isActive = filter === 'all' ? undefined : filter === 'active';
  const { officials, total, loading, reload } = useOfficials({ isActive, search, page, rowsPerPage });
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

  const filteredOfficials = (officials || []).filter((o: any) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const fullName = `${o.first_name || ''} ${o.last_name || ''}`.toLowerCase();
    return (
      fullName.includes(q) ||
      o.email?.toLowerCase().includes(q) ||
      o.phone_no?.toLowerCase().includes(q) ||
      o.state?.toLowerCase().includes(q)
    );
  });

  const topSection = (
    <>
      <OfficialsHeader onEdit={setOpenModal} />
      {loading && <ActivityIndicator size="large" color={theme.colors.primary} />}
      <FilterSearchBar
        filter={filter}
        onFilterChange={(f: FilterTab) => { setFilter(f); setPage(0); }}
        search={search}
        onSearchChange={(s: string) => { setSearch(s); setPage(0); }}
        searchPlaceholder="Search officials..."
      />
    </>
  );

  return (
    <View style={{ flex: 1, height: '100vh' as any, overflow: 'hidden' as any, backgroundColor: theme.colors.background }}>
      {isMobile ? (
       
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: theme.spacing.md || 15 }}>
          {topSection}
          <OfficialsCardList officials={filteredOfficials} onEdit={openEditModal} onDelete={handleDelete} />
        </ScrollView>
      ) : (
        <View style={{ flex: 1, padding: theme.spacing.xl || 25 }}>
          <View style={{ flexShrink: 0 }}>
            {topSection}
          </View>
          <View style={{ height: 'calc(100vh - 360px)' as any, width: '100%' }}>
            <OfficialsTable
              officials={filteredOfficials}
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

      {openModal && (
        <View>
          <AddOfficialModal onSave={handleSave} onClose={closeModal} initialData={editingOfficial} />
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
