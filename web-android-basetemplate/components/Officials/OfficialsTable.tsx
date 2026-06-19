import React, { useState } from 'react';
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Pencil, Trash2 } from 'lucide-react-native';

import { useTheme } from '@/theme/themeContext';
import { tokens } from '@/theme/token';

const TABLE_MIN_WIDTH = 1050;
const TABLE_MAX_HEIGHT = 500;
const ACTION_WIDTH = 100;

export default function OfficialsTable({
  tournaments,
  officials,
  onEdit,
  onDelete,
}: any) {
  const theme = useTheme();

  const data = officials || tournaments || [];

  const [hoveredRow, setHoveredRow] =
    useState<number | null>(null);

  const getFullName = (item: any) =>
    `${item.first_name || ''} ${item.last_name || ''}`.trim() || '—';

  return (
    <View style={styles.wrapper}>
      <View style={styles.card(theme)}>
        <View style={styles.headerRow(theme)}>
          <Text style={[styles.headerText(theme), styles.nameColumn]}>
            Name
          </Text>

          <Text style={[styles.headerText(theme), styles.emailColumn]}>
            Email
          </Text>

          <Text style={[styles.headerText(theme), styles.phoneColumn]}>
            Phone Number
          </Text>

          <Text style={[styles.headerText(theme), styles.stateColumn]}>
            State
          </Text>

          <View style={styles.badgeColumn}>
          <Text style={styles.headerText(theme)}>
            Gender
          </Text>
          </View>

        <View style={styles.badgeColumn}>
        <Text style={styles.headerText(theme)}>
            Is Active
        </Text>
        </View>

        <View style={styles.actionColumn}>
        <Text style={styles.headerText(theme)}>
            Actions
        </Text>
        </View>
        </View>

        <View style={styles.scrollArea}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {data.length > 0 ? (
              data.map((item: any, index: number) => {
                const isHovered = hoveredRow === item.id;

                return (
                  <View
                    key={item.id}
                    // @ts-ignore web hover only
                    onMouseEnter={() => setHoveredRow(item.id)}
                    // @ts-ignore web hover only
                    onMouseLeave={() => setHoveredRow(null)}
                    style={styles.row(theme, isHovered, index, data.length)}
                  >
                    <Text
                      numberOfLines={1}
                      style={[styles.nameText(theme), styles.nameColumn]}
                    >
                      {getFullName(item)}
                    </Text>

                    <Text
                      numberOfLines={1}
                      style={[styles.cellText(theme), styles.emailColumn]}
                    >
                      {item.email || '—'}
                    </Text>

                    <Text
                      numberOfLines={1}
                      style={[styles.cellText(theme), styles.phoneColumn]}
                    >
                      {item.phone_no || '—'}
                    </Text>

                    <Text
                      numberOfLines={1}
                      style={[styles.cellText(theme), styles.stateColumn]}
                    >
                      {item.state || '—'}
                    </Text>

                    <View style={styles.badgeColumn}>
                      <View style={styles.genderBadge(theme)}>
                        <Text style={styles.genderText(theme)}>
                          {item.gender || '—'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.badgeColumn}>
                      <View style={styles.statusBadge(item.is_active)}>
                        <Text style={styles.statusText(item.is_active)}>
                          {item.is_active === true
                            ? 'Active'
                            : item.is_active === false
                              ? 'Inactive'
                              : '—'}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.actions}>
                      <TouchableOpacity onPress={() => onEdit(item)}>
                        <Pencil
                          size={tokens.typography.sizes.body}
                          color={theme.colors.primary}
                          strokeWidth={tokens.layout.elevationMultiplier}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => onDelete(item.id)}>
                        <Trash2
                          size={tokens.typography.sizes.body}
                          color={theme.colors.error}
                          strokeWidth={tokens.layout.elevationMultiplier}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyWrapper}>
                <Text style={styles.emptyText(theme)}>
                  No officials found
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = {
  wrapper: {
    width: '100%' as const,
    alignSelf: 'center' as const,
  },

  card: (theme: any) => ({
    flex: tokens.layout.flexFull,
    minWidth: TABLE_MIN_WIDTH,
    backgroundColor: theme.colors.surface,
    borderRadius: tokens.radius.lg,
    overflow: 'hidden' as const,
    borderWidth: tokens.layout.dividerHeight,
    borderColor: theme.colors.border,
    ...tokens.shadow.light,
  }),

  headerRow: (theme: any) => ({
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
    backgroundColor: theme.colors.secondary,
    borderBottomWidth: tokens.layout.dividerHeight,
    borderBottomColor: theme.colors.border,
  }),

  row: (
    theme: any,
    isHovered: boolean,
    index: number,
    total: number
  ) => ({
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: tokens.spacing.sm + tokens.spacing.xs,
    paddingHorizontal: tokens.spacing.lg,
    borderBottomWidth:
      index !== total - 1 ? tokens.layout.dividerHeight : 0,
    borderBottomColor: theme.colors.border,
    backgroundColor: isHovered
      ? theme.colors.background
      : theme.colors.surface,
  }),

  scrollArea: {
    maxHeight: TABLE_MAX_HEIGHT,
  },

  nameColumn: {
    flex: 1.6,
    textAlign: 'left' as const,
  },

  emailColumn: {
    flex: 2,
    textAlign: 'center' as const,
  },

  phoneColumn: {
    flex: 1.3,
    textAlign: 'center' as const,
  },

  stateColumn: {
    flex: 1.2,
    textAlign: 'center' as const,
  },

  badgeColumn: {
  flex: 1,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
    },

    actionColumn: {
  width: ACTION_WIDTH,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
    },

  actions: {
    width: ACTION_WIDTH,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: tokens.spacing.md,
  },

  headerText: (theme: any) => ({
    fontSize: tokens.typography.sizes.cooldownTimer,
    fontWeight: tokens.typography.weights.bold as any,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.2,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily,
  }),

  nameText: (theme: any) => ({
    fontSize: tokens.typography.sizes.small,
    fontWeight: tokens.typography.weights.bold as any,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
  }),

  cellText: (theme: any) => ({
    fontSize: tokens.typography.sizes.tableText,
    fontWeight: tokens.typography.weights.medium as any,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
  }),

  genderBadge: (theme: any) => ({
    paddingHorizontal: tokens.spacing.sm + tokens.spacing.xs / 2,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.round,
    backgroundColor: theme.colors.secondary,
  }),

  genderText: (theme: any) => ({
    fontSize: tokens.typography.sizes.badge,
    fontWeight: tokens.typography.weights.medium as any,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily,
  }),

  statusBadge: (isActive: boolean) => ({
    paddingHorizontal: tokens.spacing.sm + tokens.spacing.xs / 2,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.round,
    backgroundColor: isActive
      ? tokens.colors.actions.saveBg
      : tokens.colors.actions.deleteBg,
  }),

  statusText: (isActive: boolean) => ({
    fontSize: tokens.typography.sizes.badge,
    fontWeight: tokens.typography.weights.medium as any,
    color: isActive ? tokens.colors.success : tokens.colors.error,
    fontFamily: tokens.typography.fontFamily,
  }),

  emptyWrapper: {
    paddingVertical: tokens.spacing.xl * 2,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  emptyText: (theme: any) => ({
    fontSize: tokens.typography.sizes.small,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily,
 }),
};