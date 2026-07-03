import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/theme/themeContext';
import { tokens } from '@/theme/token';
const ACTION_WIDTH = 80;

// Cast to any so TypeScript skips prop-checking on web-only onMouseEnter/onMouseLeave
const HoverView = View as any;

export default function OfficialsTable({
  tournaments,
  officials,
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
}: any) {
  const theme = useTheme();
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const getFullName = (item: any) =>
    `${item.first_name || ''} ${item.last_name || ''}`.trim() || '—';

  const paginated = officials || tournaments || [];

  const hdrStyle = {
    fontSize: tokens.typography.sizes.cooldownTimer,
    fontWeight: tokens.typography.weights.bold as any,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.2,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily,
  };

  const cellStyle = {
    fontSize: tokens.typography.sizes.tableText,
    fontWeight: tokens.typography.weights.medium as any,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Card fills all height above pagination */}
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.surface,
          borderRadius: tokens.radius.lg,
          overflow: 'hidden',
          borderWidth: tokens.layout.dividerHeight,
          borderColor: theme.colors.border,
          ...tokens.shadow.light,
        }}
      >
        {/* STICKY HEADER — outside the ScrollView, always visible */}
        <View
          style={{
            paddingLeft:50,
            
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: tokens.spacing.md,
            paddingHorizontal: tokens.spacing.lg,
            backgroundColor: theme.colors.secondary,
            borderBottomWidth: tokens.layout.dividerHeight,
            borderBottomColor: theme.colors.border,
          }}
        >
          <Text numberOfLines={1} style={[hdrStyle, { flex: 2 }]}>Name</Text>
          <Text numberOfLines={1} style={[hdrStyle, { flex: 1.9 }]}>Email</Text>
          <Text numberOfLines={1} style={[hdrStyle, { flex: 1.5 }]}>Phone</Text>
          <Text numberOfLines={1} style={[hdrStyle, { flex: 1.2 }]}>State</Text>
          <Text numberOfLines={1} style={[hdrStyle, { flex: 1.1 }]}>Gender</Text>
          <Text numberOfLines={1} style={[hdrStyle, { flex: 1.1 }]}>Active</Text>
          <Text numberOfLines={1} style={[hdrStyle, { width: ACTION_WIDTH }]}>Actions</Text>
        </View>

        {/* DATA ROWS — vertically scrollable */}
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: tokens.spacing.xl }}
        >
          {paginated.length > 0 ? (
            paginated.map((item: any, index: number) => {
              const isHovered = hoveredRow === item.id;

              return (
                <HoverView
                  key={item.id}
                  onMouseEnter={() => setHoveredRow(item.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: tokens.spacing.sm + tokens.spacing.xs / 2,
                    paddingHorizontal: tokens.spacing.lg,
                    borderBottomWidth: index !== paginated.length - 1 ? tokens.layout.dividerHeight : 0,
                    borderBottomColor: theme.colors.border,
                    backgroundColor: isHovered ? theme.colors.background : theme.colors.surface,
                  }}
                >
                  {/* NAME */}
                  <Text numberOfLines={1} style={[cellStyle, { flex: 1.8, fontWeight: tokens.typography.weights.bold as any }]}>
                    {getFullName(item)}
                  </Text>

                  {/* EMAIL */}
                  <Text numberOfLines={1} style={[cellStyle, { flex: 2.2 }]}>
                    {item.email || '—'}
                  </Text>

                  {/* PHONE */}
                  <Text numberOfLines={1} style={[cellStyle, { flex: 1.5 }]}>
                    {item.phone_no || '—'}
                  </Text>

                  {/* STATE */}
                  <Text numberOfLines={1} style={[cellStyle, { flex: 1.3 }]}>
                    {item.state || '—'}
                  </Text>

                  {/* GENDER */}
                  <View style={{ flex: 1.1 }}>
                    <View style={{ alignSelf: 'flex-start', paddingHorizontal: tokens.spacing.xs, paddingVertical: tokens.spacing.xs, borderRadius: tokens.radius.round, backgroundColor: theme.colors.secondary }}>
                      <Text numberOfLines={1} style={{ fontSize: tokens.typography.sizes.tableText, fontWeight: tokens.typography.weights.medium as any, color: theme.colors.primary, fontFamily: theme.typography.fontFamily }}>
                        {item.gender || '—'}
                      </Text>
                    </View>
                  </View>

                  {/* IS ACTIVE */}
                  <View style={{ flex: 1 }}>
                    <View style={{ alignSelf: 'flex-start', paddingHorizontal: tokens.spacing.xs, paddingVertical: tokens.spacing.xs, borderRadius: tokens.radius.round, backgroundColor: item.is_active ? tokens.colors.actions.saveBg : tokens.colors.actions.deleteBg }}>
                      <Text numberOfLines={1} style={{ fontSize: tokens.typography.sizes.tableText, fontWeight: tokens.typography.weights.medium as any, color: item.is_active ? tokens.colors.success : tokens.colors.error, fontFamily: theme.typography.fontFamily }}>
                        {item.is_active === true ? 'Active' : item.is_active === false ? 'Inactive' : '—'}
                      </Text>
                    </View>
                  </View>

                  {/* ACTIONS */}
                  <View style={{ width: ACTION_WIDTH, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: tokens.spacing.sm }}>
                    <TouchableOpacity onPress={() => onEdit(item)}>
                      <Pencil size={14} color={theme.colors.primary} strokeWidth={tokens.layout.elevationMultiplier} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDelete(item.id)}>
                      <Trash2 size={14} color={theme.colors.error} strokeWidth={tokens.layout.elevationMultiplier} />
                    </TouchableOpacity>
                  </View>
                </HoverView>
              );
            })
          ) : (
            <View style={{ paddingVertical: tokens.spacing.xl * 2, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: tokens.typography.sizes.small, color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily }}>
                No officials found
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

    </View>
  );
}
