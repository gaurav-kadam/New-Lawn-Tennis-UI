// MatchesTable.tsx
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

const ACTION_WIDTH = 150;
const TABLE_MAX_HEIGHT = 500;

export default function MatchesTable({
  matches,
  teams = [],       // 🌟 Accept teams injection array prop
  officials = [],
  onEdit,
  onDelete,
  onStartMatch,
}: any) {
  const theme = useTheme();
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  
  // 🌟 Transform standard database YYYY-MM-DD to display-friendly DD/MM/YYYY
  const formatDateToDisplay = (rawDate: string) => {
    if (!rawDate) return '—';
    // Match string with simple regex to see if it's in standard YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}/.test(rawDate)) {
      const [year, month, day] = rawDate.split('T')[0].split('-');
      return `${day}/${month}/${year}`;
    }
    return rawDate;
  };

  // 🌟 Robust Helper to resolve full visible team names from the database context
  const getTeamName = (teamIdOrField: any) => {
    if (!teamIdOrField) return '—';
    
    const foundTeam = teams.find(
      (item: any) => String(item.id) === String(teamIdOrField)
    );
    
    // Return database entry name matching possible keys or fallback gracefully to the original value
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

    // Prioritize standard name values over alphanumeric administrative system codes
    const fullName = `${official.first_name || ''} ${official.last_name || ''}`.trim();
    return official.name || fullName || official.official_name || official.official_code || '—';
  };

  return (
    <View style={{ width: '100%', alignSelf: 'center' }}>
      <View 
        style={{
          width: '100%',
          backgroundColor: theme.colors.surface || tokens.colors.surface,
          borderRadius: tokens.radius.lg,
          overflow: 'hidden',
          borderWidth: tokens.layout.dividerHeight,
          borderColor: theme.colors.border || tokens.colors.border,
          ...tokens.shadow?.light,
        }}
      >
        {/* Table Header Row */}
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
          <Text style={[{ fontSize: tokens.typography.sizes.cooldownTimer, fontWeight: tokens.typography.weights.bold as any, textTransform: 'uppercase', letterSpacing: 1.2, color: theme.colors.textSecondary || tokens.colors.textSecondary, fontFamily: theme.typography.fontFamily || tokens.typography.fontFamily, flex: 1.2 }]}>Date</Text>
          <Text style={[{ fontSize: tokens.typography.sizes.cooldownTimer, fontWeight: tokens.typography.weights.bold as any, textTransform: 'uppercase', letterSpacing: 1.2, color: theme.colors.textSecondary || tokens.colors.textSecondary, fontFamily: theme.typography.fontFamily || tokens.typography.fontFamily, flex: 1.6 }]}>White Team</Text>
          <Text style={[{ fontSize: tokens.typography.sizes.cooldownTimer, fontWeight: tokens.typography.weights.bold as any, textTransform: 'uppercase', letterSpacing: 1.2, color: theme.colors.textSecondary || tokens.colors.textSecondary, fontFamily: theme.typography.fontFamily || tokens.typography.fontFamily, flex: 1.6 }]}>Blue Team</Text>
          <Text style={[{ fontSize: tokens.typography.sizes.cooldownTimer, fontWeight: tokens.typography.weights.bold as any, textTransform: 'uppercase', letterSpacing: 1.2, color: theme.colors.textSecondary || tokens.colors.textSecondary, fontFamily: theme.typography.fontFamily || tokens.typography.fontFamily, flex: 1.0 }]}>Gender</Text>
          <Text style={[{ fontSize: tokens.typography.sizes.cooldownTimer, fontWeight: tokens.typography.weights.bold as any, textTransform: 'uppercase', letterSpacing: 1.2, color: theme.colors.textSecondary || tokens.colors.textSecondary, fontFamily: theme.typography.fontFamily || tokens.typography.fontFamily, flex: 1.2 }]}>Category</Text>
          <Text style={[{ fontSize: tokens.typography.sizes.cooldownTimer, fontWeight: tokens.typography.weights.bold as any, textTransform: 'uppercase', letterSpacing: 1.2, color: theme.colors.textSecondary || tokens.colors.textSecondary, fontFamily: theme.typography.fontFamily || tokens.typography.fontFamily, flex: 1.6 }]}>Digital Scorer</Text>
          <Text style={[{ fontSize: tokens.typography.sizes.cooldownTimer, fontWeight: tokens.typography.weights.bold as any, textTransform: 'uppercase', letterSpacing: 1.2, color: theme.colors.textSecondary || tokens.colors.textSecondary, fontFamily: theme.typography.fontFamily || tokens.typography.fontFamily, width: ACTION_WIDTH }]}>Actions</Text>
        </View>

        {/* Table Body */}
        <View style={{ maxHeight: TABLE_MAX_HEIGHT }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {matches?.length > 0 ? (
              matches.map((m: any, index: number) => {
                const isHovered = hoveredRow === m.id;

                return (
                  <View
                    key={m.id}
                    // @ts-ignore web hover only
                    onMouseEnter={() => setHoveredRow(m.id)}
                    // @ts-ignore web hover only
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: tokens.spacing.sm + tokens.spacing.xs / 2,
                      paddingHorizontal: tokens.spacing.lg,
                      borderBottomWidth: index !== matches.length - 1 ? tokens.layout.dividerHeight : 0,
                      borderBottomColor: theme.colors.border || tokens.colors.border,
                      backgroundColor: isHovered 
                        ? (theme.colors.background || tokens.colors.background) 
                        : (theme.colors.surface || tokens.colors.surface),
                    }}
                  >
                    {/* Date Styled Column (Auto Transformed) */}
                    <Text style={[{ fontSize: tokens.typography.sizes.tableText, color: theme.colors.textPrimary || tokens.colors.textPrimary, fontWeight: tokens.typography.weights.medium as any, fontFamily: theme.typography.fontFamily || tokens.typography.fontFamily, flex: 1.2 }]}>
                      {formatDateToDisplay(m.match_date || m.matchDate)}
                    </Text>

                    {/* Team A Layout Column */}
                    <Text
                      numberOfLines={1}
                      style={[
                        { fontSize: tokens.typography.sizes.tableText, color: theme.colors.textPrimary || tokens.colors.textPrimary, fontFamily: theme.typography.fontFamily || tokens.typography.fontFamily },
                        { flex: 1.6, fontWeight: tokens.typography.weights.bold as any },
                      ]}
                    >
                      {getTeamName(m.white_team_id || m.whiteTeamId || m.white_team || m.whiteTeam || m.red_player)}
                    </Text>

                    {/* Team B Layout Column */}
                    <Text
                      numberOfLines={1}
                      style={[
                        { fontSize: tokens.typography.sizes.tableText, color: theme.colors.textPrimary || tokens.colors.textPrimary, fontFamily: theme.typography.fontFamily || tokens.typography.fontFamily },
                        { flex: 1.6, fontWeight: tokens.typography.weights.bold as any },
                      ]}
                    >
                      {getTeamName(m.blue_team_id || m.blueTeamId || m.blue_team || m.blueTeam || m.blue_player)}
                    </Text>

                    {/* Gender Column */}
                    <View style={{ flex: 1 }}>
                      <View 
                        style={{
                          alignSelf: 'flex-start',
                          paddingHorizontal: tokens.spacing.sm,
                          paddingVertical: tokens.spacing.xs,
                          borderRadius: tokens.radius.round,
                          backgroundColor: theme.colors.secondary || tokens.colors.secondary,
                        }}
                      >
                        <Text 
                          style={{
                            fontSize: tokens.typography.sizes.badge,
                            fontWeight: tokens.typography.weights.medium as any,
                            color: theme.colors.primary || tokens.colors.primary,
                            fontFamily: theme.typography.fontFamily || tokens.typography.fontFamily,
                          }}
                        >
                          {m.gender || '—'}
                        </Text>
                      </View>
                    </View>

                    {/* Age Category Column */}
                    <Text style={[{ fontSize: tokens.typography.sizes.tableText, color: theme.colors.textPrimary || tokens.colors.textPrimary, fontWeight: tokens.typography.weights.medium as any, fontFamily: theme.typography.fontFamily || tokens.typography.fontFamily, flex: 1.2 }]}>
                      {m.category || m.age_category || m.ageCategory || '—'}
                    </Text>

                    {/* Digital Scorer Column */}
                    <Text
                      numberOfLines={1}
                      style={[{ fontSize: tokens.typography.sizes.tableText, color: theme.colors.textPrimary || tokens.colors.textPrimary, fontWeight: tokens.typography.weights.medium as any, fontFamily: theme.typography.fontFamily || tokens.typography.fontFamily, flex: 1.6 }]}
                    >
                      {m.digital_scorer_code 
                        ? (getOfficialName(m.digital_scorer_code) !== '—' 
                            ? getOfficialName(m.digital_scorer_code) 
                            : m.digital_scorer_code) 
                        : '—'}
                    </Text>

                    {/* Action Group Block */}
                    <View 
                      style={{
                        width: ACTION_WIDTH,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: tokens.spacing.md,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => onStartMatch(m)}
                        style={{
                          backgroundColor: theme.colors.primary || tokens.colors.primary,
                          paddingHorizontal: tokens.spacing.sm,
                          paddingVertical: tokens.spacing.xs,
                          borderRadius: tokens.radius.sm,
                        }}
                      >
                        <Text 
                          style={{
                            color: theme.colors.textLight || tokens.colors.textLight,
                            fontSize: tokens.typography.sizes.badge,
                            fontWeight: tokens.typography.weights.bold as any,
                            fontFamily: theme.typography.fontFamily || theme.typography.fontFamily,
                          }}
                        >
                          Start Match
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => onEdit(m)}>
                        <Pencil
                          size={tokens.typography.sizes.body}
                          color={theme.colors.primary || tokens.colors.primary}
                          strokeWidth={2.3}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => onDelete(m.id)}>
                        <Trash2
                          size={tokens.typography.sizes.body}
                          color={theme.colors.error || tokens.colors.error}
                          strokeWidth={2.3}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
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
                    color: theme.colors.textSecondary || tokens.colors.textSecondary,
                    fontFamily: theme.typography.fontFamily || tokens.typography.fontFamily,
                  }}
                >
                  No matches found
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}