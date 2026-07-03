import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../theme/themeContext';

const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

interface PaginationProps {
  total: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (p: number) => void;
  onRowsPerPageChange: (rpp: number) => void;
}

export default function Pagination({
  total,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: PaginationProps) {
  const theme = useTheme();
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const from = total === 0 ? 0 : page * rowsPerPage + 1;
  const to = Math.min((page + 1) * rowsPerPage, total);

  const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

  const selectStyle: any = {
    fontSize: 13,
    border: '1px solid #E2E8F0',
    borderRadius: 6,
    padding: '4px 8px',
    color: '#0F172A',
    background: '#F8FAFC',
    cursor: 'pointer',
    outline: 'none',
    fontFamily: theme.typography?.fontFamily,
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(15,23,42,0.06)',
        backgroundColor: '#FAFBFC',
      }}
    >
      {/* Showing X–Y of Z */}
      <Text
        style={{
          fontSize: 13,
          color: '#64748B',
          fontFamily: theme.typography?.fontFamily,
        }}
      >
        Showing {from}–{to} of {total}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
        {/* Rows per page */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 13, color: '#64748B', fontFamily: theme.typography?.fontFamily }}>
            Rows per page:
          </Text>
          {Platform.OS === 'web' ? (
            <select
              value={rowsPerPage}
              onChange={(e: any) => {
                onRowsPerPageChange(Number(e.target.value));
                onPageChange(0);
              }}
              style={selectStyle}
            >
              {PAGE_SIZE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : null}
        </View>

        {/* Page selector */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 13, color: '#64748B', fontFamily: theme.typography?.fontFamily }}>
            Page:
          </Text>
          {Platform.OS === 'web' ? (
            <select
              value={page + 1}
              onChange={(e: any) => onPageChange(Number(e.target.value) - 1)}
              style={selectStyle}
            >
              {pageOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : null}
          <Text style={{ fontSize: 13, color: '#64748B', fontFamily: theme.typography?.fontFamily }}>
            of {totalPages}
          </Text>
        </View>

        {/* Prev / Next */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <TouchableOpacity
            onPress={() => onPageChange(Math.max(0, page - 1))}
            disabled={page === 0}
            style={{
              padding: 4,
              borderRadius: 6,
              opacity: page === 0 ? 0.35 : 1,
            }}
          >
            <ChevronLeft size={18} color="#64748B" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onPageChange(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            style={{
              padding: 4,
              borderRadius: 6,
              opacity: page >= totalPages - 1 ? 0.35 : 1,
            }}
          >
            <ChevronRight size={18} color="#64748B" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
