import React, { useState } from 'react';
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Pencil, Trash2 } from 'lucide-react-native';

import { useTheme } from '@/theme/themeContext';

export default function UserManagementTable({
    tournaments,
    onEdit,
    onDelete,
}: any) {
    const theme = useTheme();
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    return (
        <View style={{ width: '100%', alignSelf: 'center' }}>
            <View
                style={{
                    flex: 1,
                    minWidth: 1050,
                    backgroundColor: '#FFFFFF',
                    borderRadius: 18,
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor: 'rgba(15,23,42,0.06)',
                    shadowColor: '#0F172A',
                    shadowOpacity: 0.04,
                    shadowRadius: 16,
                    shadowOffset: {
                        width: 0,
                        height: 4,
                    },
                    elevation: 2,
                }}
            >
                {/* FIXED HEADER */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 16,
                        paddingHorizontal: 22,
                        backgroundColor: '#FAFBFC',
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(15,23,42,0.06)',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 11,
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: 1.2,
                            color: '#64748B',
                            fontFamily: theme.typography.fontFamily,
                            flex: 2.3,
                        }}
                    >
                        Name
                    </Text>

                    <Text
                        style={{
                            fontSize: 11,
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: 1.2,
                            color: '#64748B',
                            fontFamily: theme.typography.fontFamily,
                            flex: 1.2,
                        }}
                    >
                        Email
                    </Text>

                    <Text
                        style={{
                            fontSize: 11,
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: 1.2,
                            color: '#64748B',
                            fontFamily: theme.typography.fontFamily,
                            flex: 1.2,
                        }}
                    >
                        Role
                    </Text>

                    <Text
                        style={{
                            fontSize: 11,
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: 1.2,
                            color: '#64748B',
                            fontFamily: theme.typography.fontFamily,
                            flex: 1,
                        }}
                    >
                        Is Active
                    </Text>

                    <Text
                        style={{
                            fontSize: 11,
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: 1.2,
                            color: '#64748B',
                            fontFamily: theme.typography.fontFamily,
                            width: 100,
                        }}
                    >
                        Actions
                    </Text>
                </View>

                {/* SCROLLABLE BODY */}
                <View style={{ maxHeight: 500 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {tournaments.length > 0 ? (
                            tournaments.map((t: any, index: number) => {
                                const isHovered = hoveredRow === t.id;

                                return (
                                    <View
                                        key={t.id}
                                        // @ts-ignore web hover only
                                        onMouseEnter={() => setHoveredRow(t.id)}
                                        // @ts-ignore web hover only
                                        onMouseLeave={() => setHoveredRow(null)}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingVertical: 14,
                                            paddingHorizontal: 22,
                                            borderBottomWidth: index !== tournaments.length - 1 ? 1 : 0,
                                            borderBottomColor: 'rgba(15,23,42,0.05)',
                                            backgroundColor: isHovered ? '#F8FAFC' : '#FFFFFF',
                                        }}
                                    >
                                        {/* Name */}
                                        <View
                                            style={{
                                                flex: 2.3,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 10,
                                            }}
                                        >
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: '700',
                                                    color: '#0F172A',
                                                    fontFamily: theme.typography.fontFamily,
                                                }}
                                            >
                                                {t.name}
                                            </Text>
                                        </View>

                                        {/* Email */}
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                color: '#0F172A',
                                                fontWeight: '500',
                                                fontFamily: theme.typography.fontFamily,
                                                flex: 1.2,
                                            }}
                                        >
                                            {t.email || '—'}
                                        </Text>

                                        {/* Role */}
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                color: '#0F172A',
                                                fontWeight: '500',
                                                fontFamily: theme.typography.fontFamily,
                                                flex: 1.2,
                                            }}
                                        >
                                            {t.role?.role_name || '—'}
                                        </Text>

                                        {/* IsActive Badge */}
                                        <View style={{ flex: 1 }}>
                                            <View
                                                style={{
                                                    alignSelf: 'flex-start',
                                                    paddingHorizontal: 10,
                                                    paddingVertical: 5,
                                                    borderRadius: 999,
                                                    backgroundColor: t.role?.is_active ? '#ECFDF3' : '#FEF2F2',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 12,
                                                        fontWeight: '600',
                                                        color: t.role?.is_active ? '#16A34A' : '#DC2626',
                                                        fontFamily: theme.typography.fontFamily,
                                                    }}
                                                >
                                                    {t.role?.is_active === true
                                                        ? 'Active'
                                                        : t.role?.is_active === false
                                                        ? 'Inactive'
                                                        : '—'}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* ACTIONS */}
                                        <View
                                            style={{
                                                width: 100,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 14,
                                            }}
                                        >
                                            {/* UPDATE */}
                                            <TouchableOpacity onPress={() => onEdit(t)}>
                                                <Pencil
                                                    size={16}
                                                    color="#4F46E5"
                                                    strokeWidth={2.3}
                                                />
                                            </TouchableOpacity>

                                            {/* DELETE */}
                                            <TouchableOpacity onPress={() => onDelete(t)}>
                                                <Trash2
                                                    size={16}
                                                    color="#EF4444"
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
                                    paddingVertical: 70,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: '#64748B',
                                        fontFamily: theme.typography.fontFamily,
                                    }}
                                >
                                    No tournaments found
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}