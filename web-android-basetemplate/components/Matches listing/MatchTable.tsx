// MatchesTable.tsx
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/theme/themeContext';
import { tokens } from '@/theme/token';
const ACTION_WIDTH = 110; // Tightened to fit standard screen layouts nicely

const HoverView = View as any;

export default function MatchesTable({
  matches,
  teams = [],
  officials = [],
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
  onStartMatch,
}: any) {
  const theme = useTheme();
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const formatDateToDisplay = (rawDate: string) => {
    if (!rawDate) return '—';
    if (/^\d{4}-\d{2}-\d{2}/.test(rawDate)) {
      const [year, month, day] = rawDate.split('T')[0].split('-');
      return `${day}/${month}/${year}`;
    }
    return rawDate;
  };

  const getTeamName = (teamIdOrField: any) => {
    if (!teamIdOrField) return '—';
    const foundTeam = teams.find(
      (item: any) => String(item.id) === String(teamIdOrField)
    );
    if (foundTeam) {
      return foundTeam.team_name || foundTeam.teamName || foundTeam.name || '—';
    }
    return teamIdOrField;
  };

  const getOfficialName = (officialId: any) => {
    if (!officialId) return '—';
    const official = officials.find(
      (item: any) =>
        String(item.id) === String(officialId) ||
        String(item.official_code) === String(officialId)
    );
    if (!official) return '—';
    const fullName = `${official.first_name || ''} ${official.last_name || ''}`.trim();
    return official.name || fullName || official.official_name || official.official_code || '—';
  };

  const paginated = matches || [];

  const hdrStyle = {
    fontSize: tokens.typography.sizes.cooldownTimer,
    fontWeight: tokens.typography.weights.bold as any,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.2,
    color: theme.colors.textSecondary || tokens.colors.textSecondary,
    fontFamily: theme.typography.fontFamily || tokens.typography.fontFamily,
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Table Container Box */}
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
        {/* 1. STABLE FIXED HEADER (Stays perfectly stationary at the top) */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: tokens.spacing.md,
            paddingHorizontal: tokens.spacing.lg,
            backgroundColor: theme.colors.secondary || tokens.colors.secondary,
            borderBottomWidth: tokens.layout.dividerHeight,
            borderBottomColor: theme.colors.border || tokens.colors.border,
          }}
        >
          <Text numberOfLines={1} style={[hdrStyle, { flex: 1.1 }]}>Date</Text>
          <Text numberOfLines={1} style={[hdrStyle, { flex: 1.5 }]}>White Team</Text>
          <Text numberOfLines={1} style={[hdrStyle, { flex: 1.5 }]}>Blue Team</Text>
          <Text numberOfLines={1} style={[hdrStyle, { flex: 1.1 }]}>Category</Text>
          <Text numberOfLines={1} style={[hdrStyle, { flex: 1.0 }]}>Gender</Text>
          <Text numberOfLines={1} style={[hdrStyle, { flex: 1.4 }]}>Scorer</Text>
          <Text numberOfLines={1} style={[hdrStyle, { width: ACTION_WIDTH }]}>Actions</Text>
        </View>

        {/* 2. SCROLLABLE BODY ONLY */}
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={true}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: tokens.spacing.xl }}
        >
          {paginated.length > 0 ? (
            paginated.map((m: any, index: number) => {
              const isHovered = hoveredRow === m.id;
              const cellText = {
                fontSize: tokens.typography.sizes.tableText,
                color: theme.colors.textPrimary || tokens.colors.textPrimary,
                fontFamily: theme.typography.fontFamily || tokens.typography.fontFamily,
              };

              return (
                <HoverView
                  key={m.id}
                  onMouseEnter={() => setHoveredRow(m.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: tokens.spacing.sm + tokens.spacing.xs / 2,
                    paddingHorizontal: tokens.spacing.lg,
                    borderBottomWidth: index !== paginated.length - 1 ? tokens.layout.dividerHeight : 0,
                    borderBottomColor: theme.colors.border || tokens.colors.border,
                    backgroundColor: isHovered
                      ? (theme.colors.background || tokens.colors.background)
                      : (theme.colors.surface || tokens.colors.surface),
                  }}
                >
                  {/* DATE */}
                  <Text style={[cellText, { flex: 1.1, fontWeight: tokens.typography.weights.medium as any }]}>
                    {formatDateToDisplay(m.match_date || '—')}
                  </Text>

                  {/* WHITE TEAM */}
                  <Text numberOfLines={1} style={[cellText, { flex: 1.5, fontWeight: tokens.typography.weights.bold as any }]}>
                    {getTeamName( m.white_team || '—')}
                  </Text>

                  {/* BLUE TEAM */}
                  <Text numberOfLines={1} style={[cellText, { flex: 1.5, fontWeight: tokens.typography.weights.bold as any }]}>
                    {getTeamName(m.blue_team || '—' )}
                  </Text>

                  {/* CATEGORY */}
                  <Text numberOfLines={1} style={[cellText, { flex: 1.1, fontWeight: tokens.typography.weights.medium as any }]}>
                    {m.age_category || '—'}
                  </Text>

                  {/* GENDER */}
                  <View style={{ flex: 1 }}>
                    <View style={{ alignSelf: 'flex-start', paddingHorizontal: tokens.spacing.xs, paddingVertical: tokens.spacing.xs, borderRadius: tokens.radius.round, backgroundColor: theme.colors.secondary || tokens.colors.secondary }}>
                      <Text numberOfLines={1} style={{ fontSize: tokens.typography.sizes.badge - 1, fontWeight: tokens.typography.weights.medium as any, color: theme.colors.primary || tokens.colors.primary, fontFamily: theme.typography.fontFamily || tokens.typography.fontFamily }}>
                        {m.gender || '—'}
                      </Text>
                    </View>
                  </View>

                  {/* DIGITAL SCORER */}
                  <Text numberOfLines={1} style={[cellText, { flex: 1.4, fontWeight: tokens.typography.weights.medium as any }]}>
                    {getOfficialName(m.digital_scorer_code) || '—'}
                  </Text>

                  {/* ACTIONS */}
                  <View style={{ width: ACTION_WIDTH, flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.sm }}>
                    {m.is_complete ? (
                      <View style={{ backgroundColor: theme.colors.success || '#22c55e', paddingHorizontal: tokens.spacing.xs, paddingVertical: 4, borderRadius: tokens.radius.sm }}>
                        <Text style={{ color: '#fff', fontSize: tokens.typography.sizes.badge - 1, fontWeight: '700' }}>
                          Done
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => onStartMatch(m)}
                        style={{ backgroundColor: theme.colors.primary || tokens.colors.primary, paddingHorizontal: tokens.spacing.xs, paddingVertical: 4, borderRadius: tokens.radius.sm }}
                      >
                        <Text style={{ color: theme.colors.textLight || tokens.colors.textLight, fontSize: tokens.typography.sizes.badge - 1, fontWeight: '700' }}>
                          Start
                        </Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => onEdit(m)}>
                      <Pencil size={14} color={theme.colors.primary || tokens.colors.primary} strokeWidth={2.3} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDelete(m.id)}>
                      <Trash2 size={14} color={theme.colors.error || tokens.colors.error} strokeWidth={2.3} />
                    </TouchableOpacity>
                  </View>
                </HoverView>
              );
            })
          ) : (
            <View style={{ paddingVertical: tokens.spacing.xl * 2, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: tokens.typography.sizes.small, color: theme.colors.textSecondary || tokens.colors.textSecondary, fontFamily: theme.typography.fontFamily || tokens.typography.fontFamily }}>
                No matches found
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

    </View>
  );
}