import { Pencil, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import Tooltip from '@/components/ui/Tooltip';
import { useTheme } from '@/theme/themeContext';

type Props = {
  players: any[];
  onEdit?: (player: any) => void;
  onDelete?: (id: any) => void;
};

const firstValue = (
  player: any,
  keys: string[],
  fallback: any = '—'
) => {
  for (const key of keys) {
    const value = player?.[key];

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ''
    ) {
      return value;
    }
  }

  return fallback;
};

const getPlayerName = (player: any) => {
  return firstValue(player, [
    'name',
    'player_name',
    'playerName',
    'full_name',
    'fullName',
  ]);
};

const getAge = (player: any) => {
  return firstValue(player, [
    'age',
    'player_age',
  ]);
};

const getGender = (player: any) => {
  return firstValue(player, [
    'gender',
    'sex',
  ]);
};

const getWeight = (player: any) => {
  const value = firstValue(
    player,
    [
      'weight',
      'weight_kg',
      'weightKg',
      'player_weight',
      'playerWeight',
    ],
    null
  );

  if (value === null) {
    return '—';
  }

  return `${value} kg`;
};

const getCategory = (player: any) => {
  return firstValue(player, [
    'category',
    'player_category',
    'playerCategory',
    'age_category',
    'ageCategory',
  ]);
};

const getCity = (player: any) => {
  return firstValue(player, [
    'city',
    'city_name',
    'cityName',
  ]);
};

const getState = (player: any) => {
  return firstValue(player, [
    'state',
    'state_name',
    'stateName',
  ]);
};

export default function PlayerTable({
  players,
  onEdit,
  onDelete,
}: Props) {
  const theme = useTheme();

  const canShowActions = Boolean(onEdit || onDelete);

  return (
    <View style={styles.outerWrapper}>
      <View style={styles.tableContainer(theme)}>

        {/* ========================================================= */}
        {/* TABLE HEADER */}
        {/* ========================================================= */}

        <View style={styles.headerRow(theme)}>

          <Text
            style={[
              styles.headerText(theme),
              { flex: 2.3 },
            ]}
          >
            Player Name
          </Text>

          <Text
            style={[
              styles.headerText(theme),
              { flex: 1 },
            ]}
          >
            Age
          </Text>

          <Text
            style={[
              styles.headerText(theme),
              { flex: 1 },
            ]}
          >
            Gender
          </Text>

          <Text
            style={[
              styles.headerText(theme),
              { flex: 1 },
            ]}
          >
            Weight
          </Text>

          <Text
            style={[
              styles.headerText(theme),
              { flex: 1.2 },
            ]}
          >
            Category
          </Text>

          <Text
            style={[
              styles.headerText(theme),
              { flex: 1.2 },
            ]}
          >
            City
          </Text>

          {canShowActions && (
            <Text
              style={[
                styles.headerText(theme),
                { width: 100 },
              ]}
            >
              Actions
            </Text>
          )}
        </View>

        {/* ========================================================= */}
        {/* TABLE BODY */}
        {/* ========================================================= */}

        <View style={styles.bodyWrapper}>

          {players.length > 0 ? (

            players.map((player: any, index: number) => {

              const playerName = getPlayerName(player);
              const age = getAge(player);
              const gender = getGender(player);
              const weight = getWeight(player);
              const category = getCategory(player);
              const city = getCity(player);

              return (
                <View
                  key={
                    player?.id ??
                    player?.player_id ??
                    player?.playerId ??
                    index
                  }
                  style={styles.dataRow(
                    theme,
                    index,
                    players.length
                  )}
                >

                  {/* PLAYER NAME */}
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.playerName(theme)}
                  >
                    {playerName}
                  </Text>

                  {/* AGE */}
                  <Text
                    style={[
                      styles.cellText(theme),
                      { flex: 1 },
                    ]}
                  >
                    {age}
                  </Text>

                  {/* GENDER */}
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                    }}
                  >
                    <View style={styles.badge(theme)}>
                      <Text
                        style={styles.badgeText(theme)}
                      >
                        {gender}
                      </Text>
                    </View>
                  </View>

                  {/* WEIGHT */}
                  <Text
                    style={[
                      styles.cellText(theme),
                      { flex: 1 },
                    ]}
                  >
                    {weight}
                  </Text>

                  {/* CATEGORY */}
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.cellText(theme),
                      { flex: 1.2 },
                    ]}
                  >
                    {category}
                  </Text>

                  {/* CITY */}
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.cellText(theme),
                      { flex: 1.2 },
                    ]}
                  >
                    {city}
                  </Text>

                  {/* ACTIONS */}
                  {canShowActions && (
                    <View style={styles.actionWrapper}>

                      {onEdit && (
                        <Tooltip label="Edit player">
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() =>
                              onEdit(player)
                            }
                            style={
                              styles.actionButton
                            }
                          >
                            <Pencil
                              size={16}
                              color={
                                theme.colors.primary
                              }
                              strokeWidth={2.3}
                            />
                          </TouchableOpacity>
                        </Tooltip>
                      )}

                      {onDelete && (
                        <Tooltip label="Delete player">
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() =>
                              onDelete(
                                player?.id ??
                                player?.player_id ??
                                player?.playerId
                              )
                            }
                            style={
                              styles.actionButton
                            }
                          >
                            <Trash2
                              size={16}
                              color={
                                theme.colors.error
                              }
                              strokeWidth={2.3}
                            />
                          </TouchableOpacity>
                        </Tooltip>
                      )}

                    </View>
                  )}

                </View>
              );
            })

          ) : (

            <View style={styles.emptyWrapper}>
              <Text style={styles.emptyText(theme)}>
                No players found
              </Text>
            </View>

          )}

        </View>
      </View>
    </View>
  );
}

const styles = {

  outerWrapper: {
    width: '100%' as const,
    alignSelf: 'center' as const,
  },

  tableContainer: (theme: any) => ({
    flex: 1,
    minWidth: 1050,

    backgroundColor:
      theme.colors.surface,

    borderRadius: 18,

    borderWidth: 1,

    borderColor:
      theme.colors.border,

    shadowColor:
      theme.colors.textPrimary,

    shadowOpacity: 0.04,

    shadowRadius: 16,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  }),

  headerRow: (theme: any) => ({
    flexDirection: 'row' as const,

    alignItems: 'center' as const,

    paddingVertical: 16,

    paddingHorizontal: 22,

    backgroundColor:
      theme.colors.background,

    borderBottomWidth: 1,

    borderBottomColor:
      theme.colors.border,

    borderTopLeftRadius: 18,

    borderTopRightRadius: 18,

    position: 'sticky' as any,

    top: 0,

    zIndex: 10,
  }),

  bodyWrapper: {
    flex: 1,
  },

  dataRow: (
    theme: any,
    index: number,
    total: number
  ) => ({
    flexDirection: 'row' as const,

    alignItems: 'center' as const,

    paddingVertical: 14,

    paddingHorizontal: 22,

    minHeight: 58,

    borderBottomWidth:
      index !== total - 1 ? 1 : 0,

    borderBottomColor:
      theme.colors.border,
  }),

  headerText: (theme: any) => ({
    fontSize: 11,

    fontWeight: '700' as const,

    textTransform: 'uppercase' as const,

    letterSpacing: 1.2,

    color:
      theme.colors.textSecondary,

    fontFamily:
      theme.typography.fontFamily,
  }),

  playerName: (theme: any) => ({
    flex: 2.3,

    fontSize: 14,

    fontWeight: '700' as const,

    color:
      theme.colors.textPrimary,

    fontFamily:
      theme.typography.fontFamily,

    paddingRight: 12,
  }),

  cellText: (theme: any) => ({
    fontSize: 13,

    color:
      theme.colors.textPrimary,

    fontWeight: '500' as const,

    fontFamily:
      theme.typography.fontFamily,

    paddingRight: 10,
  }),

  badge: (theme: any) => ({
    alignSelf: 'flex-start' as const,

    paddingHorizontal: 10,

    paddingVertical: 5,

    borderRadius: 999,

    backgroundColor:
      theme.colors.background,
  }),

  badgeText: (theme: any) => ({
    fontSize: 12,

    fontWeight: '600' as const,

    color:
      theme.colors.primary,

    fontFamily:
      theme.typography.fontFamily,
  }),

  actionWrapper: {
    width: 100,

    flexDirection: 'row' as const,

    alignItems: 'center' as const,

    gap: 14,
  },

  actionButton: {
    padding: 4,
  },

  emptyWrapper: {
    paddingVertical: 70,

    alignItems: 'center' as const,

    justifyContent: 'center' as const,
  },

  emptyText: (theme: any) => ({
    fontSize: 14,

    color:
      theme.colors.textSecondary,

    fontFamily:
      theme.typography.fontFamily,
  }),
};