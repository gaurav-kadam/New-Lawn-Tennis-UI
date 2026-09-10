import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Pencil, Trash2 } from 'lucide-react-native';

import { useTheme } from '@/theme/themeContext';
import { tokens } from '@/theme/token';
import FilterSearchBar from '@/components/ui/FilterSearchBar';
import Pagination from '@/components/ui/Pagination';

const ACTION_WIDTH = 110;

type MatchFilter = 'all' | 'incomplete' | 'completed';

const HoverView = View as any;

export default function MatchesTable({
  matches = [],
  teams = [],
  officials = [],
  onEdit,
  onDelete,
  onStartMatch,
}: any) {
  const theme = useTheme();

  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const [filter, setFilter] = useState<MatchFilter>('all');

  const [search, setSearch] = useState('');

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ============================================================
  // DATE
  // ============================================================

  const formatDateToDisplay = (rawDate: any) => {
    if (!rawDate) {
      return '—';
    }

    const value = String(rawDate);

    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      const datePart = value.split('T')[0];

      const [year, month, day] = datePart.split('-');

      return `${day}/${month}/${year}`;
    }

    return value;
  };

  // ============================================================
  // PLAYER NAME
  // ============================================================

  const getPlayerName = (playerCode: any) => {
    if (playerCode === undefined || playerCode === null || playerCode === '') {
      return '—';
    }

    const player = Array.isArray(teams)
      ? teams.find((item: any) => {
          const ids = [
            item?.player_code,
            item?.player_id,
            item?.id,
            item?.code,
          ];

          return ids.some((id) => String(id) === String(playerCode));
        })
      : undefined;

    if (!player) {
      return String(playerCode);
    }

    return (
      player?.player_name ||
      player?.name ||
      `${player?.first_name || ''} ${player?.last_name || ''}`.trim() ||
      String(playerCode)
    );
  };

  // ============================================================
  // TEAM NAME FALLBACK
  // ============================================================

  const getTeamName = (value: any) => {
    if (value === undefined || value === null || value === '') {
      return '—';
    }

    const team = Array.isArray(teams)
      ? teams.find((item: any) => {
          const ids = [item?.id, item?.team_id, item?.team_code, item?.code];

          return ids.some((id) => String(id) === String(value));
        })
      : undefined;

    if (!team) {
      return String(value);
    }

    return (
      team?.team_name ||
      team?.teamName ||
      team?.name ||
      team?.team_code ||
      String(value)
    );
  };

  // ============================================================
  // SIDE / PLAYER 1
  // ============================================================

  const getSideA = (match: any) => {
    const matchType = String(
      match?.match_type || match?.matchType || 'SINGLES'
    ).toUpperCase();

    // Tennis API — current backend
    const player1 =
      match?.player1_name ||
      match?.player1Name ||
      match?.red_player_name ||
      getPlayerName(match?.player1 || match?.red_player);

    if (matchType !== 'DOUBLES') {
      return player1 || '—';
    }

    const player3 =
      match?.player2_name ||
      match?.player2Name ||
      getPlayerName(match?.player2);

    return `${player1 || '—'} / ${player3 || '—'}`;
  };

  // ============================================================
  // SIDE / PLAYER 2
  // ============================================================

  const getSideB = (match: any) => {
    const matchType = String(
      match?.match_type || match?.matchType || 'SINGLES'
    ).toUpperCase();

    const player2 =
      match?.player2_name ||
      match?.player2Name ||
      match?.blue_player_name ||
      getPlayerName(match?.player2 || match?.blue_player);

    if (matchType !== 'DOUBLES') {
      return player2 || '—';
    }

    const player3 =
      match?.player3_name ||
      match?.player3Name ||
      getPlayerName(match?.player3);

    const player4 =
      match?.player4_name ||
      match?.player4Name ||
      getPlayerName(match?.player4);

    return `${player3 || '—'} / ${player4 || '—'}`;
  };

  // ============================================================
  // OFFICIAL / SCORER
  // ============================================================

  const getOfficialName = (officialId: any) => {
    if (officialId === undefined || officialId === null || officialId === '') {
      return '—';
    }

    const official = Array.isArray(officials)
      ? officials.find(
          (item: any) =>
            String(item?.id) === String(officialId) ||
            String(item?.official_code) === String(officialId)
        )
      : undefined;

    if (!official) {
      return '—';
    }

    return (
      official?.official_name ||
      official?.name ||
      `${official?.first_name || ''} ${official?.last_name || ''}`.trim() ||
      official?.official_code ||
      '—'
    );
  };

  // ============================================================
  // COMPLETION CHECK
  // ============================================================

  const isMatchCompleted = (match: any) => {
    return (
      match?.status === 'COMPLETED' ||
      match?.is_completed === true ||
      match?.is_completed === 1 ||
      match?.is_completed === '1' ||
      match?.is_complete === true ||
      match?.is_complete === 1 ||
      Boolean(match?.winner || match?.match_winner)
    );
  };

  // ============================================================
  // MATCH FORMAT
  // ============================================================

  const getMatchFormat = (match: any) => {
    const format = String(
      match?.match_format || match?.matchFormat || ''
    ).toUpperCase();

    if (format === 'BEST_OF_5') {
      return 'Best of 5';
    }

    if (format === 'BEST_OF_3') {
      return 'Best of 3';
    }

    return '—';
  };
  // ============================================================
  // MATCH TYPE
  // ============================================================

  const getMatchType = (match: any) => {
    const type = String(
      match?.match_type || match?.matchType || ''
    ).toUpperCase();

    if (type === 'DOUBLES' || type === 'DOUBLE') {
      return 'Double';
    }

    if (type === 'SINGLES' || type === 'SINGLE') {
      return 'Single';
    }

    return '—';
  };
  // ============================================================
  // FILTER + SEARCH
  // ============================================================

  const filteredMatches = useMemo(() => {
    return matches.filter((match: any) => {
      const completed = isMatchCompleted(match);

      if (filter === 'completed' && !completed) {
        return false;
      }

      if (filter === 'incomplete' && completed) {
        return false;
      }

      if (!search.trim()) {
        return true;
      }

      const query = search.trim().toLowerCase();

      const values = [
        match?.match_date,
        match?.match_time,
        match?.match_no,
        match?.tournament_code,
        match?.player1_name,
        match?.player2_name,
        match?.player3_name,
        match?.player4_name,
        match?.age_category,
        match?.gender,
        match?.match_type,
        match?.match_format,
      ];

      return values.some((value) =>
        String(value ?? '')
          .toLowerCase()
          .includes(query)
      );
    });
  }, [matches, filter, search]);

  // ============================================================
  // PAGINATION
  // ============================================================

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;

    const end = start + rowsPerPage;

    return filteredMatches.slice(start, end);
  }, [filteredMatches, page, rowsPerPage]);

  // ============================================================
  // HEADER STYLE
  // ============================================================

  const headerStyle = {
    fontSize: tokens.typography.sizes.cooldownTimer,

    fontWeight: tokens.typography.weights.bold as any,

    textTransform: 'uppercase' as const,

    letterSpacing: 1.2,

    color: theme.colors.textSecondary || tokens.colors.textSecondary,

    fontFamily: theme.typography.fontFamily || tokens.typography.fontFamily,
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: tokens.spacing.xl,
      }}
    >
      {/* FILTER BAR */}

      <View
        style={{
          flexShrink: 0,
        }}
      >
        <FilterSearchBar
          filter={filter}
          onFilterChange={(value: MatchFilter) => {
            setFilter(value);
            setPage(0);
          }}
          search={search}
          onSearchChange={(value: string) => {
            setSearch(value);
            setPage(0);
          }}
          searchPlaceholder="Search matches..."
          tabs={[
            {
              label: 'All',
              value: 'all',
            },
            {
              label: 'Incomplete',
              value: 'incomplete',
            },
            {
              label: 'Completed',
              value: 'completed',
            },
          ]}
        />
      </View>

      {/* TABLE */}

      <View
        style={{
          flex: 1,
          width: '100%',
        }}
      >
        <View
          style={{
            flex: 1,

            backgroundColor: theme.colors.surface || tokens.colors.surface,

            borderRadius: tokens.radius.lg,

            overflow: 'hidden',

            borderWidth: tokens.layout.dividerHeight,

            borderColor: theme.colors.border || tokens.colors.border,

            ...tokens.shadow?.light,
          }}
        >
          {/* HEADER */}

          <View
            style={{
              flexDirection: 'row',

              alignItems: 'center',

              paddingVertical: tokens.spacing.md,

              paddingHorizontal: tokens.spacing.lg,

              backgroundColor:
                theme.colors.secondary || tokens.colors.secondary,

              borderBottomWidth: tokens.layout.dividerHeight,

              borderBottomColor: theme.colors.border || tokens.colors.border,
            }}
          >
            <Text numberOfLines={1} style={[headerStyle, { flex: 1.1 }]}>
              Date
            </Text>

            <Text numberOfLines={1} style={[headerStyle, { flex: 1.5 }]}>
              Team 1
            </Text>

            <Text numberOfLines={1} style={[headerStyle, { flex: 1.5 }]}>
              Team 2
            </Text>

            <Text numberOfLines={1} style={[headerStyle, { flex: 1.1 }]}>
              Category
            </Text>

            <Text numberOfLines={1} style={[headerStyle, { flex: 1.0 }]}>
              Match Type
            </Text>

            <Text numberOfLines={1} style={[headerStyle, { flex: 1.0 }]}>
              Gender
            </Text>

            <Text numberOfLines={1} style={[headerStyle, { flex: 1.4 }]}>
              Scorer
            </Text>

            <Text
              numberOfLines={1}
              style={[
                headerStyle,
                {
                  width: ACTION_WIDTH,
                },
              ]}
            >
              Actions
            </Text>
          </View>

          {/* BODY */}

          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
            }}
            contentContainerStyle={{
              paddingBottom: tokens.spacing.xl,
            }}
          >
            {paginatedRows.length > 0 ? (
              paginatedRows.map((match: any, index: number) => {
                const completed = isMatchCompleted(match);

                const isHovered = hoveredRow === match.id;

                const cellText = {
                  fontSize: tokens.typography.sizes.tableText,

                  color: theme.colors.textPrimary || tokens.colors.textPrimary,

                  fontFamily:
                    theme.typography.fontFamily || tokens.typography.fontFamily,
                };

                return (
                  <HoverView
                    key={match.id ?? index}
                    onMouseEnter={() => setHoveredRow(match.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      flexDirection: 'row',

                      alignItems: 'center',

                      paddingVertical: tokens.spacing.sm,

                      paddingHorizontal: tokens.spacing.lg,

                      borderBottomWidth:
                        index !== paginatedRows.length - 1
                          ? tokens.layout.dividerHeight
                          : 0,

                      borderBottomColor: theme.colors.border,

                      backgroundColor: isHovered
                        ? theme.colors.background
                        : theme.colors.surface,
                    }}
                  >
                    {/* DATE */}

                    <Text
                      style={[
                        cellText,
                        {
                          flex: 1.1,
                          fontWeight: tokens.typography.weights.medium as any,
                        },
                      ]}
                    >
                      {formatDateToDisplay(match?.match_date)}
                    </Text>

                    {/* PLAYER / TEAM A */}

                    <Text
                      numberOfLines={1}
                      style={[
                        cellText,
                        {
                          flex: 1.5,
                          fontWeight: tokens.typography.weights.bold as any,
                        },
                      ]}
                    >
                      {getSideA(match)}
                    </Text>

                    {/* PLAYER / TEAM B */}

                    <Text
                      numberOfLines={1}
                      style={[
                        cellText,
                        {
                          flex: 1.5,
                          fontWeight: tokens.typography.weights.bold as any,
                        },
                      ]}
                    >
                      {getSideB(match)}
                    </Text>

                    {/* CATEGORY */}

                    <Text
                      numberOfLines={1}
                      style={[
                        cellText,
                        {
                          flex: 1.1,
                          fontWeight: tokens.typography.weights.medium as any,
                        },
                      ]}
                    >
                      {match?.age_category || match?.match_category || '—'}
                    </Text>

                    {/* MATCH TYPE */}

                    <Text
                      numberOfLines={1}
                      style={[
                        cellText,
                        {
                          flex: 1.0,
                          fontWeight: tokens.typography.weights.medium as any,
                        },
                      ]}
                    >
                      {getMatchType(match)}
                    </Text>

                    {/* GENDER */}

                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <View
                        style={{
                          alignSelf: 'flex-start',

                          paddingHorizontal: tokens.spacing.xs,

                          paddingVertical: tokens.spacing.xs,

                          borderRadius: tokens.radius.round,

                          backgroundColor:
                            theme.colors.secondary || tokens.colors.secondary,
                        }}
                      >
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: tokens.typography.sizes.badge - 1,

                            fontWeight: tokens.typography.weights.medium as any,

                            color:
                              theme.colors.primary || tokens.colors.primary,

                            fontFamily:
                              theme.typography.fontFamily ||
                              tokens.typography.fontFamily,
                          }}
                        >
                          {match?.gender || '—'}
                        </Text>
                      </View>
                    </View>

                    {/* SCORER */}

                    <Text
                      numberOfLines={1}
                      style={[
                        cellText,
                        {
                          flex: 1.4,
                          fontWeight: tokens.typography.weights.medium as any,
                        },
                      ]}
                    >
                      {getOfficialName(
                        match?.digital_scorer_id ?? match?.digital_scorer_code
                      )}
                    </Text>

                    {/* ACTIONS */}

                    <View
                      style={{
                        width: ACTION_WIDTH,

                        flexDirection: 'row',

                        alignItems: 'center',

                        gap: tokens.spacing.sm,
                      }}
                    >
                      {/* START / VIEW */}

                      <TouchableOpacity
                        onPress={() => {
                          if (
                            typeof document !== 'undefined' &&
                            document.fullscreenEnabled &&
                            !document.fullscreenElement
                          ) {
                            document.documentElement
                              .requestFullscreen()
                              .catch(() => undefined);
                          }

                          onStartMatch(match, completed);
                        }}
                        style={{
                          backgroundColor: completed
                            ? theme.colors.success || '#22c55e'
                            : theme.colors.primary || tokens.colors.primary,

                          paddingHorizontal: tokens.spacing.xs,

                          paddingVertical: 4,

                          borderRadius: tokens.radius.sm,
                        }}
                      >
                        <Text
                          style={{
                            color: '#fff',

                            fontSize: tokens.typography.sizes.badge - 1,

                            fontWeight: '700',
                          }}
                        >
                          {completed ? 'View' : 'Start'}
                        </Text>
                      </TouchableOpacity>

                      {/* EDIT */}

                      <TouchableOpacity onPress={() => onEdit(match)}>
                        <Pencil
                          size={14}
                          color={theme.colors.primary || tokens.colors.primary}
                          strokeWidth={2.3}
                        />
                      </TouchableOpacity>

                      {/* DELETE */}

                      <TouchableOpacity onPress={() => onDelete(match.id)}>
                        <Trash2
                          size={14}
                          color={theme.colors.error || tokens.colors.error}
                          strokeWidth={2.3}
                        />
                      </TouchableOpacity>
                    </View>
                  </HoverView>
                );
              })
            ) : (
              <View
                style={{
                  paddingVertical: tokens.spacing.xl * 2,

                  alignItems: 'center',

                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: tokens.typography.sizes.small,

                    color: theme.colors.textSecondary,

                    fontFamily: theme.typography.fontFamily,
                  }}
                >
                  No matches found
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      {/* PAGINATION */}

      <Pagination
        total={filteredMatches.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsPerPageChange={(value: number) => {
          setRowsPerPage(value);
          setPage(0);
        }}
      />
    </View>
  );
}
