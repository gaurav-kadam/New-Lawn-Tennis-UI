    import React, { useState } from 'react';

    import {
        ScrollView,
        Text,
        TouchableOpacity,
        View,
    } from 'react-native';

    import {Eye, Link,
        Pencil,
        Trash2,
    } from 'lucide-react-native';

    import { useTheme } from '@/theme/themeContext';

    const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return '—';
    
    // Normalize separator to support both YYYY/MM/DD and YYYY-MM-DD
    const normalizedDate = dateString.replace(/-/g, '/');
    const parts = normalizedDate.split('/');
    
    // Check if it matches expected YYYY/MM/DD format parts
    if (parts.length === 3 && parts[0].length === 4) {
        const [year, month, day] = parts;
        return `${day}/${month}/${year}`;
    }
    
    return dateString; // Fallback to raw string if format is unexpected
};

    export default function TournamentTable({
        tournaments,
        onEdit,
        onDelete,
        onView, onAttach,
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
                                { flex: 2.5 },
                            ]}
                        >
                            Tournament
                        </Text>

                        <Text
                            style={[
                                styles.headerText(theme),
                                { flex: 1 },
                            ]}
                        >
                            Start
                        </Text>

                        <Text
                            style={[
                                styles.headerText(theme),
                                { flex: 1 },
                            ]}
                        >
                            End
                        </Text>

                        <Text
                            style={[
                                styles.headerText(theme),
                                { flex: 1 },
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
                                { width: 140 },
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
                                                {/* TOURNAMENT */}
                                                <View
                                                    style={{
                                                        flex: 2.3,

                                                        flexDirection: 'row',

                                                        alignItems: 'center',

                                                        gap: 10,
                                                    }}
                                                >
                                                    {/* STATUS DOT */}
                                                    <View
                                                        style={{
                                                            width: 8,
                                                            height: 8,

                                                            borderRadius: 999,

                                                            backgroundColor:
                                                                '#22C55E',
                                                        }}
                                                    />

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
                                                        {t.tournament_name}
                                                    </Text>
                                                </View>

                                                {/* START DATE */}
                                                <Text
                                                    style={[
                                                        styles.cellText(
                                                            theme
                                                        ),
                                                        { flex: 1 },
                                                    ]}
                                                >
                                                    {formatDateToDDMMYYYY(t.start_date)}
                                                </Text>

                                                {/* END DATE */}
                                                <Text
                                                    style={[
                                                        styles.cellText(
                                                            theme
                                                        ),
                                                        { flex: 1 },
                                                    ]}
                                                >
                                                    {formatDateToDDMMYYYY(t.end_date)}
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
                                                        width: 140,

                                                        flexDirection:
                                                            'row',

                                                        alignItems:
                                                            'center',

                                                        gap: 12,
                                                    }}
                                                >
                                                    {/* 1. VIEW */}
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            onView(t) 
                                                        }
                                                            >
                                                        <Eye
                                                            size={16}
                                                            color="#64748B" // Cool gray color for view
                                                            strokeWidth={2.3}
                                                    /> 
                                                    </TouchableOpacity>
                                                    
                                                    {/* 2. ATTACH */}
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            onAttach(t) // Replace with your actual attach handler
                                                                  }
    >
                                                        <Link
                                                            size={16}
                                                            color="#0284C7" // Sky blue color for attachment
                                                            strokeWidth={2.3}
                                                        />
                                                        </TouchableOpacity>
                                                    
                                                    
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