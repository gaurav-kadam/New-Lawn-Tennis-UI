import React, { useState } from 'react';

import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import {
    Pencil,
    Trash2,
} from 'lucide-react-native';

import { useTheme } from '@/theme/themeContext';

export default function TeamTable({
    tournaments,
    onEdit,
    onDelete,
}: any) {
    const theme = useTheme();

    const [hoveredRow, setHoveredRow] =
        useState<number | null>(null);

    return (
        <View
            style={{
                width: '100%',
                alignSelf: 'center',
            }}
        >
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
                        borderBottomColor:
                            'rgba(15,23,42,0.06)',
                    }}
                >
                    <Text
                        style={[
                            styles.headerText(theme),
                            { flex: 1.3 },
                        ]}
                    >
                        Team Name
                    </Text>

                    <Text
                        style={[
                            styles.headerText(theme),
                            { flex: 1.4 },
                        ]}
                    >
                        HeadCoach 
                    </Text>

                    <Text
                        style={[
                            styles.headerText(theme),
                            { flex: 1.2 },
                        ]}
                    >
                        Coach
                    </Text>

                    <Text
                        style={[
                            styles.headerText(theme),
                            { flex: 1.2 },
                        ]}
                    >
                         Manager
                    </Text>

                    
                    <Text
                        style={[
                            styles.headerText(theme),
                            { flex: 1.2 },
                        ]}
                    >
                        Section
                    </Text>

                    <Text
                        style={[
                            styles.headerText(theme),
                            { flex: 1 },
                        ]}
                    >
                        State
                    </Text>

                    <Text
                        style={[
                            styles.headerText(theme),
                            { flex: 1 },
                        ]}
                    >
                        City
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
                        Is Active
                    </Text>

                    <Text
                        style={[
                            styles.headerText(theme),
                            { width: 100 },
                        ]}
                    >
                        Actions
                    </Text>
                </View>

                {/* SCROLLABLE BODY */}
                <View
                    style={{
                        maxHeight: 500,
                    }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {tournaments.length > 0 ? (
                            tournaments.map(
                                (
                                    t: any,
                                    index: number
                                ) => {
                                    const isHovered =
                                        hoveredRow === t.id;

                                    return (
                                        <View
                                            key={t.id}
                                            onMouseEnter={() =>
                                                setHoveredRow(t.id)
                                            }
                                            onMouseLeave={() =>
                                                setHoveredRow(null)
                                            }
                                            style={{
                                                flexDirection: 'row',

                                                alignItems: 'center',

                                                paddingVertical: 14,
                                                paddingHorizontal: 22,

                                                borderBottomWidth:
                                                    index !==
                                                        tournaments.length -
                                                        1
                                                        ? 1
                                                        : 0,

                                                borderBottomColor:
                                                    'rgba(15,23,42,0.05)',

                                                backgroundColor:
                                                    isHovered
                                                        ? '#F8FAFC'
                                                        : '#FFFFFF',

                                                transitionDuration:
                                                    '120ms',
                                            }}
                                        >
                                            {/* Team name  */}
                                            <View
                                                style={{
                                                    flex: 1.3,

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

                                                        color:
                                                            '#0F172A',

                                                        fontFamily:
                                                            theme.typography
                                                                .fontFamily,
                                                    }}
                                                >
                                                    {t.team_name}
                                                </Text>
                                            </View>

                                            {/* Manager Name */}
                                            <Text
                                                style={[
                                                    styles.cellText(
                                                        theme
                                                    ),
                                                    { flex: 1.2 },
                                                ]}
                                            >
                                                {t.head_coach || '—'}
                                            </Text>

                                            {/* Head Coach */}
                                            <Text
                                                style={[
                                                    styles.cellText(
                                                        theme
                                                    ),
                                                    { flex: 1.2 },
                                                ]}
                                            >
                                                {t.coach || '—'}
                                            </Text>

                                            {/* Coach */}
                                            <Text
                                                style={[
                                                    styles.cellText(
                                                        theme
                                                    ),
                                                    { flex: 1.2 },
                                                ]}
                                            >
                                                {t.manager || '—'}
                                            </Text>

                                            {/* SECTION */}
                                            <View
                                                style={{
                                                    flex: 1,
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        alignSelf:
                                                            'flex-start',

                                                        paddingHorizontal: 10,
                                                        paddingVertical: 5,

                                                        borderRadius: 999,

                                                        backgroundColor:
                                                            '#F1F5F9',
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 12,

                                                            fontWeight:
                                                                '600',

                                                            color:
                                                                '#334155',

                                                            fontFamily:
                                                                theme
                                                                    .typography
                                                                    .fontFamily,
                                                        }}
                                                    >
                                                        {t.section ||
                                                            '—'}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* State */}
                                            <View
                                                style={{
                                                    flex: 1,
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        alignSelf:
                                                            'flex-start',

                                                        paddingHorizontal: 10,
                                                        paddingVertical: 5,


                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 12,

                                                            fontWeight:
                                                                '600',

                                                            color:
                                                                '#334155',

                                                            fontFamily:
                                                                theme
                                                                    .typography
                                                                    .fontFamily,
                                                        }}
                                                    >
                                                        {t.state ||
                                                            '—'}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* City */}
                                            <View
                                                style={{
                                                    flex: 1,
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        alignSelf:
                                                            'flex-start',

                                                        paddingHorizontal: 10,
                                                        paddingVertical: 5,
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 12,

                                                            fontWeight:
                                                                '600',

                                                            color:
                                                                '#334155',

                                                            fontFamily:
                                                                theme
                                                                    .typography
                                                                    .fontFamily,
                                                        }}
                                                    >
                                                        {t.city ||
                                                            '—'}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* GENDER */}
                                            <View
                                                style={{
                                                    flex: 1,
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        alignSelf:
                                                            'flex-start',

                                                        paddingHorizontal: 10,
                                                        paddingVertical: 5,

                                                        borderRadius: 999,

                                                        backgroundColor:
                                                            '#EEF2FF',
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 12,

                                                            fontWeight:
                                                                '600',

                                                            color:
                                                                '#4F46E5',

                                                            fontFamily:
                                                                theme
                                                                    .typography
                                                                    .fontFamily,
                                                        }}
                                                    >
                                                        {t.gender ||
                                                            '—'}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* IsActive */}
                                            <View
                                                style={{
                                                    flex: 1,
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        alignSelf: 'flex-start',

                                                        paddingHorizontal: 10,
                                                        paddingVertical: 5,

                                                        borderRadius: 999,

                                                        backgroundColor: t.is_active
                                                            ? '#ECFDF3'
                                                            : '#FEF2F2',
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 12,

                                                            fontWeight: '600',

                                                            color: t.is_active
                                                                ? '#16A34A'
                                                                : '#DC2626',

                                                            fontFamily:
                                                                theme.typography.fontFamily,
                                                        }}
                                                    >
                                                        {t.is_active === true
                                                            ? 'Active'
                                                            : t.is_active === false
                                                                ? 'Inactive'
                                                                : '—'}
                                                    </Text>
                                                </View>
                                            </View>

                                            {/* ACTIONS */}
                                            <View
                                                style={{
                                                    width: 100,

                                                    flexDirection:
                                                        'row',

                                                    alignItems:
                                                        'center',

                                                    gap: 14,
                                                }}
                                            >
                                                {/* UPDATE */}
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        onEdit(t)
                                                    }
                                                >
                                                    <Pencil
                                                        size={16}
                                                        color="#4F46E5"
                                                        strokeWidth={
                                                            2.3
                                                        }
                                                    />
                                                </TouchableOpacity>

                                                {/* DELETE */}
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        onDelete(t.id)
                                                    }
                                                >
                                                    <Trash2
                                                        size={16}
                                                        color="#EF4444"
                                                        strokeWidth={
                                                            2.3
                                                        }
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                }
                            )
                        ) : (
                            <View
                                style={{
                                    paddingVertical: 70,

                                    alignItems: 'center',
                                    justifyContent:
                                        'center',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 14,

                                        color: '#64748B',

                                        fontFamily:
                                            theme.typography
                                                .fontFamily,
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

const styles = {
    headerText: (theme: any) => ({
        fontSize: 11,

        fontWeight: '700' as const,

        textTransform:
            'uppercase' as const,

        letterSpacing: 1.2,

        color: '#64748B',

        fontFamily:
            theme.typography.fontFamily,
    }),

    cellText: (theme: any) => ({
        fontSize: 13,

        color: '#0F172A',

        fontWeight: '500' as const,

        fontFamily:
            theme.typography.fontFamily,
    }),
};