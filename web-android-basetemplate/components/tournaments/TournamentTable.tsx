// import React, { useState } from 'react';
// import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
// import { Eye, Link, Pencil, Trash2 } from 'lucide-react-native';
// import { useTheme } from '@/theme/themeContext';
// import { tokens } from '@/theme/token';
// const ACTION_WIDTH = 130;

// // Cast to any so TypeScript skips prop-checking on web-only onMouseEnter/onMouseLeave
// const HoverView = View as any;

// const formatDateToDDMMYYYY = (dateString: string) => {
//     if (!dateString) return '—';
//     const parts = dateString.replace(/-/g, '/').split('/');
//     if (parts.length === 3 && parts[0].length === 4) {
//         const [year, month, day] = parts;
//         return `${day}/${month}/${year}`;
//     }
//     return dateString;
// };

// export default function TournamentTable({
//     tournaments,
//     total,
//     page,
//     rowsPerPage,
//     onPageChange,
//     onRowsPerPageChange,
//     onEdit,
//     onDelete,
//     onView,
//     onAttach,
// }: any) {
//     const theme = useTheme();
//     const [hoveredRow, setHoveredRow] = useState<number | null>(null);
//     const paginated = tournaments || [];

//     const hdrStyle = {
//         fontSize: tokens.typography.sizes.cooldownTimer,
//         fontWeight: tokens.typography.weights.bold as any,
//         textTransform: 'uppercase' as const,
//         letterSpacing: 1.2,
//         color: theme.colors.textSecondary || '#64748B',
//         fontFamily: theme.typography.fontFamily,
//     };

//     const cellStyle = {
//         fontSize: tokens.typography.sizes.tableText,
//         color: theme.colors.textPrimary || '#0F172A',
//         fontWeight: tokens.typography.weights.medium as any,
//         fontFamily: theme.typography.fontFamily,
//     };

//     return (
//         <View style={{ flex: 1 }}>
//             {/* Card fills all height above pagination */}
//             <View
//                 style={{
//                     flex: 1,
//                     backgroundColor: theme.colors.surface || '#FFFFFF',
//                     borderRadius: tokens.radius.lg,
//                     overflow: 'hidden',
//                     borderWidth: tokens.layout.dividerHeight,
//                     borderColor: theme.colors.border || 'rgba(15,23,42,0.06)',
//                     ...tokens.shadow?.light,
//                 }}
//             >
//                 {/* STICKY HEADER — outside the ScrollView, always visible */}
//                 <View
//                     style={{
//                         paddingLeft:50,
//                         flexDirection: 'row',
//                         alignItems: 'center',
//                         paddingVertical: tokens.spacing.md,
//                         paddingHorizontal: tokens.spacing.lg,
//                         backgroundColor: theme.colors.secondary || '#FAFBFC',
//                         borderBottomWidth: tokens.layout.dividerHeight,
//                         borderBottomColor: theme.colors.border || 'rgba(15,23,42,0.06)',
//                     }}
//                 >
//                     <Text numberOfLines={1} style={[hdrStyle, { flex: 2.4 }]}>Tournament</Text>
//                     <Text numberOfLines={1} style={[hdrStyle, { flex: 1 }]}>Start</Text>
//                     <Text numberOfLines={1} style={[hdrStyle, { flex: 1 }]}>End</Text>
//                     <Text numberOfLines={1} style={[hdrStyle, { flex: 1 }]}>Section</Text>
//                     <Text numberOfLines={1} style={[hdrStyle, { flex: 1 }]}>State</Text>
//                     <Text numberOfLines={1} style={[hdrStyle, { flex: 1 }]}>City</Text>
//                     <Text numberOfLines={1} style={[hdrStyle, { flex: 1 }]}>Gender</Text>
//                     <Text numberOfLines={1} style={[hdrStyle, { flex: 1 }]}>Active</Text>
//                     <Text numberOfLines={1} style={[hdrStyle, { width: ACTION_WIDTH }]}>Actions</Text>
//                 </View>

//                 {/* DATA ROWS — vertically scrollable */}
//                 <ScrollView
//                     nestedScrollEnabled
//                     showsVerticalScrollIndicator
//                     style={{ flex: 1 }}
//                     contentContainerStyle={{ paddingBottom: tokens.spacing.xl }}
//                 >
//                     {paginated.length > 0 ? (
//                         paginated.map((t: any, index: number) => {
//                             const isHovered = hoveredRow === t.id;

//                             return (
//                                 <HoverView
//                                     key={t.id}
//                                     onMouseEnter={() => setHoveredRow(t.id)}
//                                     onMouseLeave={() => setHoveredRow(null)}
//                                     style={{
//                                         flexDirection: 'row',
//                                         alignItems: 'center',
//                                         paddingVertical: tokens.spacing.sm + tokens.spacing.xs / 2,
//                                         paddingHorizontal: tokens.spacing.lg,
//                                         borderBottomWidth: index !== paginated.length - 1 ? tokens.layout.dividerHeight : 0,
//                                         borderBottomColor: theme.colors.border || 'rgba(15,23,42,0.05)',
//                                         backgroundColor: isHovered
//                                             ? (theme.colors.background || '#F8FAFC')
//                                             : (theme.colors.surface || '#FFFFFF'),
//                                     }}
//                                 >
//                                     {/* TOURNAMENT NAME */}
//                                     <View style={{ flex: 2.5, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//                                         <View style={{ width: 7, height: 7, borderRadius: 999, backgroundColor: '#22C55E', flexShrink: 0 }} />
//                                         <Text numberOfLines={1} style={[cellStyle, { fontWeight: tokens.typography.weights.bold as any }]}>
//                                             {t.tournament_name}
//                                         </Text>
//                                     </View>

//                                     {/* START DATE */}
//                                     <Text numberOfLines={1} style={[cellStyle, { flex: 1 }]}>
//                                         {formatDateToDDMMYYYY(t.start_date)}
//                                     </Text>

//                                     {/* END DATE */}
//                                     <Text numberOfLines={1} style={[cellStyle, { flex: 1 }]}>
//                                         {formatDateToDDMMYYYY(t.end_date)}
//                                     </Text>

//                                     {/* SECTION */}
//                                     <View style={{ flex: 1 }}>
//                                         <View style={{ alignSelf: 'flex-start', paddingHorizontal: tokens.spacing.sm, paddingVertical: tokens.spacing.xs, borderRadius: tokens.radius.round, backgroundColor: theme.colors.secondary || '#F1F5F9' }}>
//                                             <Text numberOfLines={1} style={{ fontSize: tokens.typography.sizes.tableText, fontWeight: '600', color: theme.colors.textPrimary || '#334155', fontFamily: theme.typography.fontFamily }}>
//                                                 {t.section || '—'}
//                                             </Text>
//                                         </View>
//                                     </View>

//                                     {/* STATE */}
//                                     <Text numberOfLines={1} style={[cellStyle, { flex: 1 }]}>
//                                         {t.state || '—'}
//                                     </Text>

//                                     {/* CITY */}
//                                     <Text numberOfLines={1} style={[cellStyle, { flex: 1 }]}>
//                                         {t.city || '—'}
//                                     </Text>

//                                     {/* GENDER */}
//                                     <View style={{ flex: 1 }}>
//                                         <View style={{ alignSelf: 'flex-start', paddingHorizontal: tokens.spacing.xs, paddingVertical: tokens.spacing.xs, borderRadius: tokens.radius.round, backgroundColor: '#EEF2FF' }}>
//                                             <Text numberOfLines={1} style={{ fontSize: tokens.typography.sizes.tableText, fontWeight: '600', color: '#4F46E5', fontFamily: theme.typography.fontFamily }}>
//                                                 {t.gender || '—'}
//                                             </Text>
//                                         </View>
//                                     </View>

//                                     {/* IS ACTIVE */}
//                                     <View style={{ flex: 1 }}>
//                                         <View style={{ alignSelf: 'flex-start', paddingHorizontal: tokens.spacing.xs, paddingVertical: tokens.spacing.xs, borderRadius: tokens.radius.round, backgroundColor: t.is_active ? '#ECFDF3' : '#FEF2F2' }}>
//                                             <Text numberOfLines={1} style={{ fontSize: tokens.typography.sizes.tableText, fontWeight: '600', color: t.is_active ? '#16A34A' : '#DC2626', fontFamily: theme.typography.fontFamily }}>
//                                                 {t.is_active === true ? 'Active' : t.is_active === false ? 'Inactive' : '—'}
//                                             </Text>
//                                         </View>
//                                     </View>

//                                     {/* ACTIONS */}
//                                     <View style={{ width: ACTION_WIDTH, flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.sm }}>
//                                         <TouchableOpacity onPress={() => onView(t)}>
//                                             <Eye size={14} color={theme.colors.textSecondary || '#64748B'} strokeWidth={2.3} />
//                                         </TouchableOpacity>
//                                         <TouchableOpacity onPress={() => onAttach(t)}>
//                                             <Link size={14} color="#0284C7" strokeWidth={2.3} />
//                                         </TouchableOpacity>
//                                         <TouchableOpacity onPress={() => onEdit(t)}>
//                                             <Pencil size={14} color={theme.colors.primary || '#4F46E5'} strokeWidth={2.3} />
//                                         </TouchableOpacity>
//                                         <TouchableOpacity onPress={() => onDelete(t.id)}>
//                                             <Trash2 size={14} color={theme.colors.error || '#EF4444'} strokeWidth={2.3} />
//                                         </TouchableOpacity>
//                                     </View>
//                                 </HoverView>
//                             );
//                         })
//                     ) : (
//                         <View style={{ paddingVertical: tokens.spacing.xl * 2, alignItems: 'center', justifyContent: 'center' }}>
//                             <Text style={{ fontSize: tokens.typography.sizes.small, color: theme.colors.textSecondary || '#64748B', fontFamily: theme.typography.fontFamily }}>
//                                 No tournaments found
//                             </Text>
//                         </View>
//                     )}
//                 </ScrollView>
//             </View>

//         </View>
//     );
// }


import React, { useState, useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Eye, Link, Pencil, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/theme/themeContext';
import { tokens } from '@/theme/token';
import FilterSearchBar, { FilterTab } from '@/components/ui/FilterSearchBar';
import Pagination from '@/components/ui/Pagination';

const ACTION_WIDTH = 130;
const HoverView = View as any;

const formatDateToDDMMYYYY = (dateString: string) => {
    if (!dateString) return '—';
    const parts = dateString.replace(/-/g, '/').split('/');
    if (parts.length === 3 && parts[0].length === 4) {
        const [year, month, day] = parts;
        return `${day}/${month}/${year}`;
    }
    return dateString;
};

export default function TournamentTable({
    tournaments = [],
    onEdit,
    onDelete,
    onView,
    onAttach,
}: any) {
    const theme = useTheme();
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    // Internalized filtering states
    const [filter, setFilter] = useState<FilterTab>('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Filter logic computed locally
    const filteredTournaments = useMemo(() => {
        return tournaments.filter((t: any) => {
            // 1. Status Filter
            if (filter === 'active' && t.is_active !== true) return false;
            if (filter === 'inactive' && t.is_active !== false) return false;

            // 2. Search Box Filter
            if (!search) return true;
            const q = search.toLowerCase();
            return (
                t.tournament_name?.toLowerCase().includes(q) ||
                t.city?.toLowerCase().includes(q) ||
                t.state?.toLowerCase().includes(q) ||
                t.section?.toLowerCase().includes(q) ||
                t.gender?.toLowerCase().includes(q)
            );
        });
    }, [tournaments, filter, search]);

    // Local pagination slicing calculation
    const paginatedRows = useMemo(() => {
        const start = page * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredTournaments.slice(start, end);
    }, [filteredTournaments, page, rowsPerPage]);

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
        <View style={{ flex: 1, paddingHorizontal: tokens.spacing.xl  }}>
            <View style={{ flexShrink: 0 }}>
                <FilterSearchBar
                    filter={filter}
                    onFilterChange={(f: FilterTab) => { setFilter(f); setPage(0); }}
                    search={search}
                    onSearchChange={(s: string) => { setSearch(s); setPage(0); }}
                    searchPlaceholder="Search tournaments..."
                />
            </View>

            <View style={{ flex: 1, width: '100%'}}>
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
                            paddingLeft: 50,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingVertical: tokens.spacing.md,
                            paddingHorizontal: tokens.spacing.lg,
                            backgroundColor: theme.colors.secondary || '#FAFBFC',
                            borderBottomWidth: tokens.layout.dividerHeight,
                            borderBottomColor: theme.colors.border || 'rgba(15,23,42,0.06)',
                        }}
                    >
                        <Text numberOfLines={1} style={[hdrStyle, { flex: 2.4 }]}>Tournament</Text>
                        <Text numberOfLines={1} style={[hdrStyle, { flex: 1 }]}>Start</Text>
                        <Text numberOfLines={1} style={[hdrStyle, { flex: 1 }]}>End</Text>
                        <Text numberOfLines={1} style={[hdrStyle, { flex: 1 }]}>Section</Text>
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
                                        <View style={{ flex: 2.5, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                            <View style={{ width: 7, height: 7, borderRadius: 999, backgroundColor: t.is_active ? '#22C55E' : '#DC2626', flexShrink: 0 }} />
                                            <Text numberOfLines={1} style={[cellStyle, { fontWeight: tokens.typography.weights.bold as any }]}>
                                                {t.tournament_name}
                                            </Text>
                                        </View>

                                        <Text numberOfLines={1} style={[cellStyle, { flex: 1 }]}>
                                            {formatDateToDDMMYYYY(t.start_date)}
                                        </Text>

                                        <Text numberOfLines={1} style={[cellStyle, { flex: 1 }]}>
                                            {formatDateToDDMMYYYY(t.end_date)}
                                        </Text>

                                        <View style={{ flex: 1 }}>
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
                                            <TouchableOpacity onPress={() => onView(t)}>
                                                <Eye size={14} color={theme.colors.textSecondary || '#64748B'} strokeWidth={2.3} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => onAttach(t)}>
                                                <Link size={14} color="#0284C7" strokeWidth={2.3} />
                                            </TouchableOpacity>
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
                                    No tournaments found
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>

            <Pagination
                total={filteredTournaments.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={setPage}
                onRowsPerPageChange={(rpp: number) => { setRowsPerPage(rpp); setPage(0); }}
            />
        </View>
    );
}