import React from 'react';
// Added Platform to the core react-native imports right here:
import { View, Text, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { useTheme } from '../../theme/themeContext';
import Button from '../../components/ui/Button';

interface ViewTournamentModalProps {
  tournament: any;
  onClose: () => void;
}

interface DetailRowProps {
  label: string;
  value: string | number | undefined | null;
  isBadge?: boolean;
  badgeColor?: string;
  textColor?: string;
}

export default function ViewTournamentModal({ tournament, onClose }: ViewTournamentModalProps) {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const isMobile = screenWidth < 1000; 

  if (!tournament) return null;

  const DetailRow = ({ 
    label, 
    value, 
    isBadge = false, 
    badgeColor, 
    textColor 
  }: DetailRowProps) => (
    <View style={{ marginBottom: 16, width: isMobile ? '100%' : '48%' }}>
      <Text style={{ 
        fontSize: 11, 
        fontWeight: '700', 
        textTransform: 'uppercase', 
        letterSpacing: 1.1, 
        color: theme.colors.textSecondary || '#64748B', 
        marginBottom: 4, 
        fontFamily: theme.typography.fontFamily 
      }}>
        {label}
      </Text>
      {isBadge ? (
        <View style={{ 
          alignSelf: 'flex-start', 
          paddingHorizontal: 10, 
          paddingVertical: 4, 
          borderRadius: 6, 
          backgroundColor: badgeColor || theme.colors.surface || '#EEF2FF' 
        }}>
          <Text style={{ 
            fontSize: 12, 
            fontWeight: '600', 
            color: textColor || theme.colors.textPrimary || '#334155', 
            fontFamily: theme.typography.fontFamily 
          }}>
            {value}
          </Text>
        </View>
      ) : (
        <Text style={{ 
          fontSize: 14, 
          color: theme.colors.textPrimary || '#0F172A', 
          fontWeight: '500', 
          fontFamily: theme.typography.fontFamily 
        }}>
          {value || '—'}
        </Text>
      )}
    </View>
  );

  return (
    <View style={{
      backgroundColor: theme.colors.surface || '#FFFFFF',
      borderRadius: theme.radius?.md || 12,
      padding: 24,

      // ================= CRITICAL FORCED WIDTH OVERRIDES =================
      width: isMobile ? '92%' : 420,
      minWidth: isMobile ? '92%' : 420, 
      maxWidth: isMobile ? '94%' : 420,
      
      // Platform will now work perfectly without throwing an error
      ...Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
        android: { elevation: 8 },
        web: { boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.1)' }
      })
    }}>
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottomWidth: 1, 
        borderColor: theme.colors.border || '#E2E8F0', 
        paddingBottom: 14, 
        marginBottom: 20 
      }}>
        <Text style={{ 
          fontSize: 18, 
          fontWeight: '700', 
          color: theme.colors.textPrimary || '#0F172A', 
          fontFamily: theme.typography.fontFamily 
        }}>
          Tournament Details
        </Text>
      </View>

      {/* Details Grid/Scroll Area Layout */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
        <View style={{ 
          flexDirection: isMobile ? 'column' : 'row', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between' 
        }}>
          <DetailRow label="Tournament Name" value={tournament.name || tournament.tournament_name} />
          <DetailRow label="Section" value={tournament.section} />
          <DetailRow label="State" value={tournament.state} />
          <DetailRow label="City" value={tournament.city} />
          
          <DetailRow 
            label="Gender" 
            value={tournament.gender} 
            isBadge={true} 
            badgeColor={theme.colors.surface || '#EEF2FF'} 
            textColor={theme.colors.primary || '#4F46E5'} 
          />

          <DetailRow 
            label="Status" 
            value={tournament.is_active ? 'Active' : 'Inactive'} 
            isBadge={true} 
            badgeColor={tournament.is_active ? '#ECFDF3' : '#FEF2F2'} 
            textColor={tournament.is_active ? theme.colors.success || '#16A34A' : theme.colors.error || '#DC2626'} 
          />
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={{ 
        marginTop: 14, 
        borderTopWidth: 1, 
        borderColor: theme.colors.border || '#E2E8F0', 
        paddingTop: 16, 
        alignItems: 'flex-end' 
      }}>
        <Button 
          title="Close"
          onPress={onClose}
          variant="primary"
          size="md" 
        />
      </View>
    </View>
  );
}