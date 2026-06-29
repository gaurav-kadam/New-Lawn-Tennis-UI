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

const TABLE_MAX_HEIGHT = 500;

export default function OfficialsTable({
  tournaments,
  officials,
  onEdit,
  onDelete,
}: any) {
  const theme = useTheme();

  const data = officials || tournaments || [];

  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const getFullName = (item: any) =>
    `${item.first_name || ''} ${item.last_name || ''}`.trim() || '—';

  return (
    <View style={{ width: '100%', alignSelf: 'center', paddingHorizontal: tokens.spacing.md }}>
      <View 
        style={{
          width: '100%',
          backgroundColor: theme.colors.surface,
          borderRadius: tokens.radius.lg,
          overflow: 'hidden',
          borderWidth: tokens.layout.dividerHeight,
          borderColor: theme.colors.border,
          ...tokens.shadow.light,
        }}
      >
        {/* Header Row */}
        <View 
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: tokens.spacing.md,
            paddingHorizontal: tokens.spacing.md,
            backgroundColor: theme.colors.secondary,
            borderBottomWidth: tokens.layout.dividerHeight,
            borderBottomColor: theme.colors.border,
          }}
        >
          <Text 
            style={{
              width: '18%',
              textAlign: 'left',
              fontSize: tokens.typography.sizes.caption || 11,
              fontWeight: tokens.typography.weights.bold as any,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fontFamily,
            }}
          >
            Name
          </Text>

          <Text 
            style={{
              width: '24%',
              textAlign: 'left',
              paddingHorizontal: tokens.spacing.xs,
              fontSize: tokens.typography.sizes.caption || 11,
              fontWeight: tokens.typography.weights.bold as any,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fontFamily,
            }}
          >
            Email
          </Text>

          <Text 
            style={{
              width: '18%',
              textAlign: 'center',
              fontSize: tokens.typography.sizes.caption || 11,
              fontWeight: tokens.typography.weights.bold as any,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fontFamily,
            }}
          >
            Phone Number
          </Text>

          <Text 
            style={{
              width: '12%',
              textAlign: 'center',
              fontSize: tokens.typography.sizes.caption || 11,
              fontWeight: tokens.typography.weights.bold as any,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fontFamily,
            }}
          >
            State
          </Text>

          <View style={{ width: '11%', alignItems: 'center', justifyContent: 'center' }}>
            <Text 
              style={{
                fontSize: tokens.typography.sizes.caption || 11,
                fontWeight: tokens.typography.weights.bold as any,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fontFamily,
              }}
            >
              Gender
            </Text>
          </View>

          <View style={{ width: '11%', alignItems: 'center', justifyContent: 'center' }}>
            <Text 
              style={{
                fontSize: tokens.typography.sizes.caption || 11,
                fontWeight: tokens.typography.weights.bold as any,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fontFamily,
              }}
            >
              Is Active
            </Text>
          </View>

          <View style={{ width: '6%', alignItems: 'center', justifyContent: 'center' }}>
            <Text 
              style={{
                fontSize: tokens.typography.sizes.caption || 11,
                fontWeight: tokens.typography.weights.bold as any,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                color: theme.colors.textSecondary,
                fontFamily: theme.typography.fontFamily,
              }}
            >
              Actions
            </Text>
          </View>
        </View>

        {/* Data Rows Area */}
        <View style={{ maxHeight: TABLE_MAX_HEIGHT }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {data.length > 0 ? (
              data.map((item: any, index: number) => {
                const isHovered = hoveredRow === item.id;

                return (
                  <View
                    key={item.id}
                    // @ts-ignore web hover only
                    onMouseEnter={() => setHoveredRow(item.id)}
                    // @ts-ignore web hover only
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: tokens.spacing.sm + tokens.spacing.xs,
                      paddingHorizontal: tokens.spacing.md,
                      borderBottomWidth: index !== data.length - 1 ? tokens.layout.dividerHeight : 0,
                      borderBottomColor: theme.colors.border,
                      backgroundColor: isHovered ? theme.colors.background : theme.colors.surface,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        width: '18%',
                        textAlign: 'left',
                        fontSize: tokens.typography.sizes.small,
                        fontWeight: tokens.typography.weights.bold as any,
                        color: theme.colors.textPrimary,
                        fontFamily: theme.typography.fontFamily,
                      }}
                    >
                      {getFullName(item)}
                    </Text>

                    <Text
                      numberOfLines={1}
                      style={{
                        width: '24%',
                        textAlign: 'left',
                        paddingHorizontal: tokens.spacing.xs,
                        fontSize: tokens.typography.sizes.tableText,
                        fontWeight: tokens.typography.weights.medium as any,
                        color: theme.colors.textPrimary,
                        fontFamily: theme.typography.fontFamily,
                      }}
                    >
                      {item.email || '—'}
                    </Text>

                    <Text
                      numberOfLines={1}
                      style={{
                        width: '18%',
                        textAlign: 'center',
                        fontSize: tokens.typography.sizes.tableText,
                        fontWeight: tokens.typography.weights.medium as any,
                        color: theme.colors.textPrimary,
                        fontFamily: theme.typography.fontFamily,
                      }}
                    >
                      {item.phone_no || '—'}
                    </Text>

                    <Text
                      numberOfLines={1}
                      style={{
                        width: '12%',
                        textAlign: 'center',
                        fontSize: tokens.typography.sizes.tableText,
                        fontWeight: tokens.typography.weights.medium as any,
                        color: theme.colors.textPrimary,
                        fontFamily: theme.typography.fontFamily,
                      }}
                    >
                      {item.state || '—'}
                    </Text>

                    <View style={{ width: '11%', alignItems: 'center', justifyContent: 'center' }}>
                      <View 
                        style={{
                          paddingHorizontal: tokens.spacing.sm,
                          paddingVertical: tokens.spacing.xs,
                          borderRadius: tokens.radius.round,
                          backgroundColor: theme.colors.secondary,
                        }}
                      >
                        <Text 
                          style={{
                            fontSize: tokens.typography.sizes.badge,
                            fontWeight: tokens.typography.weights.medium as any,
                            color: theme.colors.primary,
                            fontFamily: theme.typography.fontFamily,
                          }}
                        >
                          {item.gender || '—'}
                        </Text>
                      </View>
                    </View>

                    <View style={{ width: '11%', alignItems: 'center', justifyContent: 'center' }}>
                      <View 
                        style={{
                          paddingHorizontal: tokens.spacing.sm,
                          paddingVertical: tokens.spacing.xs,
                          borderRadius: tokens.radius.round,
                          backgroundColor: item.is_active ? tokens.colors.actions.saveBg : tokens.colors.actions.deleteBg,
                        }}
                      >
                        <Text 
                          style={{
                            fontSize: tokens.typography.sizes.badge,
                            fontWeight: tokens.typography.weights.medium as any,
                            color: item.is_active ? tokens.colors.success : tokens.colors.error,
                            fontFamily: theme.typography.fontFamily,
                          }}
                        >
                          {item.is_active === true
                            ? 'Active'
                            : item.is_active === false
                              ? 'Inactive'
                              : '—'}
                        </Text>
                      </View>
                    </View>

                    <View 
                      style={{
                        width: '6%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: tokens.spacing.sm,
                      }}
                    >
                      <TouchableOpacity onPress={() => onEdit(item)}>
                        <Pencil
                          size={tokens.typography.sizes.body}
                          color={theme.colors.primary}
                          strokeWidth={tokens.layout.elevationMultiplier}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => onDelete(item.id)}>
                        <Trash2
                          size={tokens.typography.sizes.body}
                          color={theme.colors.error}
                          strokeWidth={tokens.layout.elevationMultiplier}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={{ paddingVertical: tokens.spacing.xl * 2, alignItems: 'center', justifyContent: 'center' }}>
                <Text 
                  style={{
                    fontSize: tokens.typography.sizes.small,
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.fontFamily,
                  }}
                >
                  No officials found
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}