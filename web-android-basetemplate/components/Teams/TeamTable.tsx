

import React, { useState, useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/theme/themeContext';
import { tokens } from '@/theme/token';
import FilterSearchBar, { FilterTab } from '@/components/ui/FilterSearchBar';
import Pagination from '@/components/ui/Pagination';

const ACTION_WIDTH = 80;
const HoverView = View as any;

export default function TeamTable({
    teams = [],
    onEdit,
    onDelete,
}: any) {
    const theme = useTheme();
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    const [filter, setFilter] = useState<FilterTab>('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const filteredTeams = useMemo(() => {
        return teams.filter((t: any) => {
            if (filter === 'active' && t.is_active !== true) return false;
            if (filter === 'inactive' && t.is_active !== false) return false;

            if (!search) return true;
            const q = search.toLowerCase();
            return (
                t.team_name?.toLowerCase().includes(q) ||
                t.city?.toLowerCase().includes(q) ||
                t.state?.toLowerCase().includes(q) ||
                t.section?.toLowerCase().includes(q)
            );
        });
    }, [teams, filter, search]);

    const paginatedRows = useMemo(() => {
        const start = page * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredTeams.slice(start, end);
    }, [filteredTeams, page, rowsPerPage]);

    const hdrStyle = {
        fontSize: tokens.typography.sizes.cooldownTimer,
        fontWeight: tokens.typography.weights.bold as any,
        textTransform: 'uppercase' as const,
        letterSpacing: 1.2,
        color: theme.colors.textSecondary || '#64748B',
        fontFamily: theme.typography.fontFamily,
    };

    const cellStyle = {
        fontSize: tokens.typography.sizes.tableText,
        color: theme.colors.textPrimary || '#0F172A',
        fontWeight: tokens.typography.weights.medium as any,
        fontFamily: theme.typography.fontFamily,
    };

    return (
        <View style={{ flex: 1, paddingHorizontal: tokens.spacing.xl }}>
            <View style={{ flexShrink: 0 }}>
                <FilterSearchBar
                    filter={filter}
                    onFilterChange={(f: FilterTab) => { setFilter(f); setPage(0); }}
                    search={search}
                    onSearchChange={(s: string) => { setSearch(s); setPage(0); }}
                    searchPlaceholder="Search teams..."
                />
            </View>

            <View style={{ flex: 1, width: '100%'   }}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: theme.colors.surface || '#FFFFFF',
                        borderRadius: tokens.radius.lg,
                        overflow: 'hidden',
                        borderWidth: tokens.layout.dividerHeight,
                        borderColor: theme.colors.border || 'rgba(15,23,42,0.06)',
                        ...tokens.shadow?.light,
                    }}
                >
                    {/* STICKY HEADER */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingVertical: tokens.spacing.md,
                            paddingHorizontal: tokens.spacing.lg,
                            backgroundColor: theme.colors.secondary || '#FAFBFC',
                            borderBottomWidth: tokens.layout.dividerHeight,
                            borderBottomColor: theme.colors.border || 'rgba(15,23,42,0.06)',
                        }}
                    >
                        <Text numberOfLines={1} style={[hdrStyle, { flex: 1.5 }]}>Team Name</Text>
                        <Text numberOfLines={1} style={[hdrStyle, { flex: 1.3 }]}>Head Coach</Text>
                        <Text numberOfLines={1} style={[hdrStyle, { flex: 1.2 }]}>Coach</Text>
                        <Text numberOfLines={1} style={[hdrStyle, { flex: 1.2 }]}>Manager</Text>
                        <Text numberOfLines={1} style={[hdrStyle, { flex: 1.1 }]}>Section</Text>
                        <Text numberOfLines={1} style={[hdrStyle, { flex: 1 }]}>State</Text>
                        <Text numberOfLines={1} style={[hdrStyle, { flex: 1 }]}>City</Text>
                        <Text numberOfLines={1} style={[hdrStyle, { flex: 1 }]}>Gender</Text>
                        <Text numberOfLines={1} style={[hdrStyle, { flex: 1 }]}>Active</Text>
                        <Text numberOfLines={1} style={[hdrStyle, { width: ACTION_WIDTH }]}>Actions</Text>
                    </View>

                    {/* DATA ROWS */}
                    <ScrollView
                        nestedScrollEnabled
                        showsVerticalScrollIndicator={false}
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: tokens.spacing.xl }}
                    >
                        {paginatedRows.length > 0 ? (
                            paginatedRows.map((t: any, index: number) => {
                                const isHovered = hoveredRow === t.id;

                                return (
                                    <HoverView
                                        key={t.id}
                                        onMouseEnter={() => setHoveredRow(t.id)}
                                        onMouseLeave={() => setHoveredRow(null)}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingVertical: tokens.spacing.sm + tokens.spacing.xs / 2,
                                            paddingHorizontal: tokens.spacing.lg,
                                            borderBottomWidth: index !== paginatedRows.length - 1 ? tokens.layout.dividerHeight : 0,
                                            borderBottomColor: theme.colors.border || 'rgba(15,23,42,0.05)',
                                            backgroundColor: isHovered
                                                ? (theme.colors.background || '#F8FAFC')
                                                : (theme.colors.surface || '#FFFFFF'),
                                        }}
                                    >
                                        <Text numberOfLines={1} style={[cellStyle, { flex: 1.5, fontWeight: tokens.typography.weights.bold as any }]}>
                                            {t.team_name || '—'}
                                        </Text>

                                        <Text numberOfLines={1} style={[cellStyle, { flex: 1.3 }]}>
                                            {t.head_coach || '—'}
                                        </Text>

                                        <Text numberOfLines={1} style={[cellStyle, { flex: 1.2 }]}>
                                            {t.coach || '—'}
                                        </Text>

                                        <Text numberOfLines={1} style={[cellStyle, { flex: 1.2 }]}>
                                            {t.manager || '—'}
                                        </Text>

                                        <View style={{ flex: 1.1 }}>
                                            <View style={{ alignSelf: 'flex-start', paddingHorizontal: tokens.spacing.sm, paddingVertical: tokens.spacing.xs, borderRadius: tokens.radius.round, backgroundColor: theme.colors.secondary || '#F1F5F9' }}>
                                                <Text numberOfLines={1} style={{ fontSize: tokens.typography.sizes.tableText, fontWeight: '600', color: theme.colors.textPrimary || '#334155', fontFamily: theme.typography.fontFamily }}>
                                                    {t.section || '—'}
                                                </Text>
                                            </View>
                                        </View>

                                        <Text numberOfLines={1} style={[cellStyle, { flex: 1 }]}>
                                            {t.state || '—'}
                                        </Text>

                                        <Text numberOfLines={1} style={[cellStyle, { flex: 1 }]}>
                                            {t.city || '—'}
                                        </Text>

                                        <View style={{ flex: 1 }}>
                                            <View style={{ alignSelf: 'flex-start', paddingHorizontal: tokens.spacing.xs, paddingVertical: tokens.spacing.xs, borderRadius: tokens.radius.round, backgroundColor: '#EEF2FF' }}>
                                                <Text numberOfLines={1} style={{ fontSize: tokens.typography.sizes.tableText, fontWeight: '600', color: '#4F46E5', fontFamily: theme.typography.fontFamily }}>
                                                    {t.gender || '—'}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={{ flex: 1 }}>
                                            <View style={{ alignSelf: 'flex-start', paddingHorizontal: tokens.spacing.xs, paddingVertical: tokens.spacing.xs, borderRadius: tokens.radius.round, backgroundColor: t.is_active ? '#ECFDF3' : '#FEF2F2' }}>
                                                <Text numberOfLines={1} style={{ fontSize: tokens.typography.sizes.tableText, fontWeight: '600', color: t.is_active ? '#16A34A' : '#DC2626', fontFamily: theme.typography.fontFamily }}>
                                                    {t.is_active === true ? 'Active' : t.is_active === false ? 'Inactive' : '—'}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={{ width: ACTION_WIDTH, flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.sm }}>
                                            <TouchableOpacity onPress={() => onEdit(t)}>
                                                <Pencil size={14} color={theme.colors.primary || '#4F46E5'} strokeWidth={2.3} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => onDelete(t.id)}>
                                                <Trash2 size={14} color={theme.colors.error || '#EF4444'} strokeWidth={2.3} />
                                            </TouchableOpacity>
                                        </View>
                                    </HoverView>
                                );
                            })
                        ) : (
                            <View style={{ paddingVertical: tokens.spacing.xl * 2, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: tokens.typography.sizes.small, color: theme.colors.textSecondary || '#64748B', fontFamily: theme.typography.fontFamily }}>
                                    No teams found
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>

            <Pagination
                total={filteredTeams.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={setPage}
                onRowsPerPageChange={(rpp: number) => { setRowsPerPage(rpp); setPage(0); }}
            />
        </View>
    );
}