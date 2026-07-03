import React from 'react';
import { TextInput, TouchableOpacity, View, Text } from 'react-native';
import { Search } from 'lucide-react-native';
import { useTheme } from '../../theme/themeContext';

export type FilterTab = 'all' | 'active' | 'inactive';

const DEFAULT_TABS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

interface Props {
  filter: string;
  onFilterChange: (f: any) => void;
  search: string;
  onSearchChange: (s: string) => void;
  searchPlaceholder?: string;
  tabs?: { label: string; value: string }[];
}

export default function FilterSearchBar({
  filter,
  onFilterChange,
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  tabs = DEFAULT_TABS,
}: Props) {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(15,23,42,0.06)',
        backgroundColor: 'transparent',
        gap: 12,
      }}
    >
      {/* Filter Tabs */}
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {tabs.map((tab) => {
          const active = filter === tab.value;
          return (
            <TouchableOpacity
              key={tab.value}
              onPress={() => onFilterChange(tab.value)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 7,
                borderRadius: 8,
                backgroundColor: active ? theme.colors.primary || '#4F46E5' : 'transparent',
                borderWidth: active ? 0 : 1,
                borderColor: 'rgba(15,23,42,0.12)',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: active ? '#FFFFFF' : '#64748B',
                  fontFamily: theme.typography?.fontFamily,
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Search Input */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F8FAFC',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: 'rgba(15,23,42,0.10)',
          paddingHorizontal: 10,
          paddingVertical: 6,
          minWidth: 200,
          maxWidth: 260,
          gap: 6,
        }}
      >
        <Search size={14} color="#94A3B8" strokeWidth={2} />
        <TextInput
          value={search}
          onChangeText={onSearchChange}
          placeholder={searchPlaceholder}
          placeholderTextColor="#94A3B8"
          style={{
            flex: 1,
            fontSize: 13,
            color: '#0F172A',
            fontFamily: theme.typography?.fontFamily,
            outlineStyle: 'none',
          } as any}
        />
      </View>
    </View>
  );
}
