import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

import PlayerCardList from '@/components/Players/PlayerCardList';
import PlayerHeader from '@/components/Players/PlayerHeader';
import PlayerTable from '@/components/Players/PlayerTable';
import CreatePlayerModal from '@/components/elements/AddPlayer';
import ConfirmActionModal from '@/components/ui/ConfirmActionModal';
import Pagination from '@/components/ui/Pagination';

import { useAuth } from '@/context/AuthContext';
import { usePlayers } from '@/hooks/useplayers';
import playerService from '@/services/player/player.service';
import { useTheme } from '@/theme/themeContext';
import { tokens } from '@/theme/token';

const BREAKPOINT = 768;

type Filter = 'all' | 'active' | 'inactive';

export default function PlayersScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const { width } = useWindowDimensions();

  const isMobile = width < BREAKPOINT;

  const role =
    user?.role?.role_name?.toLowerCase() || '';

  const canCrud =
    role === 'admin' ||
    role === 'supervisor';

  /* ----------------------------------------------------------
     STATE
  ---------------------------------------------------------- */

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const [modalVisible, setModalVisible] =
    useState(false);

  const [editingPlayer, setEditingPlayer] =
    useState<any>(null);

  const [deleteState, setDeleteState] = useState<{
    visible: boolean;
    id: number | null;
    loading: boolean;
  }>({
    visible: false,
    id: null,
    loading: false,
  });

  /* ----------------------------------------------------------
     DATA
  ---------------------------------------------------------- */

  const {
    players = [],
    total = 0,
    loading,
    error,
    reload,
  } = usePlayers({
    page,
    pageSize,
  });

  /* ----------------------------------------------------------
     SCORER ACCESS
  ---------------------------------------------------------- */

  useEffect(() => {
    if (role === 'scorer') {
      router.replace('/matches');
    }
  }, [role, router]);

  /* ----------------------------------------------------------
     FILTER + SEARCH
  ---------------------------------------------------------- */

  const filteredPlayers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return players.filter((player: any) => {
      const active =
        player?.is_active ??
        player?.active ??
        player?.isActive ??
        true;

      if (filter === 'active' && !active) {
        return false;
      }

      if (filter === 'inactive' && active) {
        return false;
      }

      if (!query) {
        return true;
      }

      const values = [
        player?.name,
        player?.player_name,
        player?.playerName,
        player?.player_code,
        player?.playerCode,
        player?.city,
        player?.state,
        player?.category,
        player?.player_category,
        player?.team_name,
        player?.team_code,
      ];

      return values.some(value =>
        String(value ?? '')
          .toLowerCase()
          .includes(query)
      );
    });
  }, [players, search, filter]);

  /* ----------------------------------------------------------
     MODAL
  ---------------------------------------------------------- */

  const openCreate = () => {
    if (!canCrud) return;

    setEditingPlayer(null);
    setModalVisible(true);
  };

  const openEdit = (player: any) => {
    if (!canCrud) return;

    setEditingPlayer(player);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingPlayer(null);
  };

  /* ----------------------------------------------------------
     CREATE / UPDATE
  ---------------------------------------------------------- */

  const savePlayer = async (data: any) => {
    try {
      if (editingPlayer?.id) {
        await playerService.updatePlayer(
          Number(editingPlayer.id),
          data
        );
      } else {
        await playerService.createPlayer(data);
      }

      closeModal();
      await reload();

      Alert.alert(
        'Success',
        editingPlayer
          ? 'Player updated successfully.'
          : 'Player registered successfully.'
      );
    } catch (err: any) {
      console.error(
        'Save player error:',
        err
      );

      Alert.alert(
        'Error',
        err?.message ||
          'Failed to save player.'
      );
    }
  };

  /* ----------------------------------------------------------
     DELETE
  ---------------------------------------------------------- */

  const requestDelete = (id: any) => {
    if (!canCrud || id == null) return;

    setDeleteState({
      visible: true,
      id: Number(id),
      loading: false,
    });
  };

  const cancelDelete = () => {
    if (deleteState.loading) return;

    setDeleteState({
      visible: false,
      id: null,
      loading: false,
    });
  };

  const performDelete = async () => {
    if (!deleteState.id) return;

    setDeleteState(prev => ({
      ...prev,
      loading: true,
    }));

    try {
      await playerService.deletePlayer(
        deleteState.id
      );

      await reload();

      setDeleteState({
        visible: false,
        id: null,
        loading: false,
      });

      Alert.alert(
        'Success',
        'Player deleted successfully.'
      );
    } catch (err: any) {
      console.error(
        'Delete player error:',
        err
      );

      setDeleteState(prev => ({
        ...prev,
        loading: false,
      }));

      Alert.alert(
        'Error',
        err?.message ||
          'Failed to delete player.'
      );
    }
  };

  /* ----------------------------------------------------------
     FILTER
  ---------------------------------------------------------- */

  const changeFilter = (value: Filter) => {
    setFilter(value);
    setPage(1);
  };

  /* ----------------------------------------------------------
     SCORER REDIRECT
  ---------------------------------------------------------- */

  if (role === 'scorer') {
    return null;
  }

  /* ----------------------------------------------------------
     RENDER
  ---------------------------------------------------------- */

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          theme.colors.background,
      }}
    >
      {/* HEADER */}

      <View
        style={{
          padding:
            isMobile
              ? tokens.spacing.md
              : tokens.spacing.xl,

          paddingBottom: 0,
        }}
      >
        <PlayerHeader
          onEdit={
            canCrud
              ? openCreate
              : undefined
          }
        />
      </View>

      {/* FILTER + SEARCH */}

      <View
        style={{
          paddingHorizontal:
            isMobile
              ? tokens.spacing.md
              : tokens.spacing.xl,

          marginTop:
            tokens.spacing.md,

          marginBottom:
            tokens.spacing.sm,

          flexDirection:
            isMobile
              ? 'column'
              : 'row',

          justifyContent:
            'space-between',

          alignItems:
            isMobile
              ? 'stretch'
              : 'center',

          gap: tokens.spacing.md,
        }}
      >
        {/* FILTERS */}

        <View
          style={{
            flexDirection: 'row',
            gap: 8,
          }}
        >
          {(
            [
              ['all', 'All'],
              ['active', 'Active'],
              ['inactive', 'Inactive'],
            ] as [Filter, string][]
          ).map(([value, label]) => {
            const selected =
              filter === value;

            return (
              <TouchableOpacity
                key={value}
                onPress={() =>
                  changeFilter(value)
                }
                style={{
                  height: 38,
                  paddingHorizontal: 18,
                  justifyContent:
                    'center',
                  alignItems:
                    'center',
                  borderRadius:
                    tokens.radius.sm,
                  borderWidth: 1,
                  borderColor:
                    selected
                      ? theme.colors.primary
                      : theme.colors.border,
                  backgroundColor:
                    selected
                      ? theme.colors.primary
                      : theme.colors.surface,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight:
                      selected
                        ? '600'
                        : '400',
                    color: selected
                      ? '#fff'
                      : theme.colors.textSecondary,
                  }}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* SEARCH */}

        <TextInput
          value={search}
          onChangeText={value => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search players..."
          placeholderTextColor={
            theme.colors.textSecondary
          }
          style={{
            width: isMobile
              ? '100%'
              : 225,
            height: 38,
            borderWidth: 1,
            borderColor:
              theme.colors.border,
            borderRadius:
              tokens.radius.sm,
            backgroundColor:
              theme.colors.surface,
            paddingHorizontal: 14,
            color:
              theme.colors.textPrimary,
            fontSize: 14,
          }}
        />
      </View>

      {/* CONTENT */}

      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          paddingHorizontal:
            isMobile
              ? tokens.spacing.md
              : tokens.spacing.xl,

          paddingBottom:
            tokens.spacing.xl,
        }}
      >
        {loading ? (
          <View
            style={{
              paddingVertical: 50,
              alignItems: 'center',
            }}
          >
            <ActivityIndicator
              size="large"
              color={
                theme.colors.primary
              }
            />

            <Text
              style={{
                marginTop: 10,
                color:
                  theme.colors.textSecondary,
              }}
            >
              Loading players...
            </Text>
          </View>
        ) : error ? (
          <View
            style={{
              paddingVertical: 50,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: '#ef4444',
                marginBottom: 12,
              }}
            >
              {error}
            </Text>

            <TouchableOpacity
              onPress={reload}
            >
              <Text
                style={{
                  color:
                    theme.colors.primary,
                  fontWeight: '600',
                }}
              >
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        ) : filteredPlayers.length === 0 ? (
          <View
            style={{
              paddingVertical: 50,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color:
                  theme.colors.textSecondary,
              }}
            >
              {search
                ? 'No players found.'
                : filter === 'active'
                  ? 'No active players found.'
                  : filter === 'inactive'
                    ? 'No inactive players found.'
                    : 'No players available.'}
            </Text>
          </View>
        ) : isMobile ? (
          <PlayerCardList
            players={filteredPlayers}
            onEdit={
              canCrud
                ? openEdit
                : undefined
            }
            onDelete={
              canCrud
                ? requestDelete
                : undefined
            }
          />
        ) : (
          <PlayerTable
            players={filteredPlayers}
            onEdit={
              canCrud
                ? openEdit
                : undefined
            }
            onDelete={
              canCrud
                ? requestDelete
                : undefined
            }
          />
        )}

        {/* PAGINATION */}

        {!loading && !error && total > 0 && (
          <Pagination
            total={total}
            page={page}
            rowsPerPage={pageSize}
            onPageChange={setPage}
            onRowsPerPageChange={(value: number) => {
              setPageSize(value);
              setPage(1);
            }}
          />
        )}
      </ScrollView>

      {/* CREATE / EDIT */}

      <CreatePlayerModal
        visible={modalVisible}
        onClose={closeModal}
        onSave={savePlayer}
        initialData={editingPlayer}
      />

      {/* DELETE */}

      <ConfirmActionModal
        visible={deleteState.visible}
        title="Delete Player"
        message="Are you sure you want to delete this player? This action cannot be undone."
        actionType="DELETE"
        loading={deleteState.loading}
        onConfirm={performDelete}
        onCancel={cancelDelete}
      />
    </View>
  );
}