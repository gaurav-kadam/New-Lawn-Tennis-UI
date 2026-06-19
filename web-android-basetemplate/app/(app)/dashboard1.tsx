import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Card from '../../components/ui/Card';
import { useDashboard } from '../../hooks/usedashboard';
import { useTheme } from '../../theme/themeContext';

export default function Dashboard() {
  const theme = useTheme();
  const router = useRouter(); 
  const { width: screenWidth } = useWindowDimensions();
  const isMobile = screenWidth < 768; 

  // Clean data delivery straight from our custom hook!
  const { stats, loading, error } = useDashboard();

  const modules = [
    { id: 'tournament', title: 'Tournament', ...stats.tournament, path: '/tournaments' },
    { id: 'team', title: 'Team', ...stats.team, path: '/teams' },
    { id: 'official', title: 'Official', ...stats.official, path: '/officials' },
    { id: 'match', title: 'Match', ...stats.match, path: '/matches' },
  ];

  const handleCardPress = (path: string) => {
    if (router) {
      router.push(path as any);
    } else {
      console.warn(`Expo Router context is not ready yet.`);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={[styles.scrollContainer, { backgroundColor: theme.colors.background }]}
    >
       <View style={{marginBottom: 24}}>
              
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                  }}
                >
              
                  <Text
                    style={
                      {
                        fontWeight: 'bold',
                        color: theme.colors.textPrimary,
                        fontSize: theme.typography.sizes.h2,
                    }}
                  >
                    Dashboard
                  </Text>
              
                  <Text
                    style={{
                      color: theme.colors.textSecondary,
              
                      marginTop: 4,
              
                      fontSize: theme.typography.sizes.small,
                    }}
                  >
                    View Overall Stats
                  </Text>
              
                </View>
              
              
              
              </View>

      {loading && (
        <View style={styles.centerWrapper}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}

      {error ? (
        <View style={styles.centerWrapper}>
          <Text style={{ color: 'theme.colors.textprimary', fontWeight: '500' }}>{error}</Text>
        </View>
      ) : null}

      {!loading && !error && (
        <View style={styles.gridRow}>
          {modules.map((item) => (
            <View 
              key={item.id} 
              style={[styles.cardWrapper, { width: isMobile ? '100%' : '50%' }]}
            >
              <Card variant="elevated" onPress={() => handleCardPress(item.path)}>
                <View style={styles.cardContent}>
                  
                  <Text 
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={[
                      styles.cardTitle, 
                      { 
                        color: theme.colors.textPrimary, 
                        fontSize: theme.typography.sizes.h2,
                        fontFamily: theme.typography.fontFamily 
                      }
                    ]}
                  >
                    {item.title}
                  </Text>
                  
                  <View style={styles.metricsContainer}>
                    {/* Active Column */}
                    <View style={styles.metricBlock}>
                      <Text style={[styles.metricLabel, { color: theme.colors.primary, fontSize: theme.typography.sizes.small, fontFamily: theme.typography.fontFamily }]}>
                        Active
                      </Text>
                      <Text style={[styles.metricValue, { color: theme.colors.primary, fontSize: theme.typography.sizes.small, fontFamily: theme.typography.fontFamily }]}>
                        {item.active ?? 0}
                      </Text>
                    </View>

                    {/* Inactive Column */}
                    <View style={[styles.metricBlock, styles.middleMetricBlock, { borderColor: theme.colors.border }]}>
                      <Text style={[styles.metricLabel, { color: theme.colors.primary, fontSize: theme.typography.sizes.small, fontFamily: theme.typography.fontFamily }]}>
                        Inactive
                      </Text>
                      <Text style={[styles.metricValue, { color: theme.colors.primary, fontSize: theme.typography.sizes.small, fontFamily: theme.typography.fontFamily }]}>
                        {item.inactive ?? 0}
                      </Text>
                    </View>

                    {/* All Column */}
                    <View style={styles.metricBlock}>
                      <Text style={[styles.metricLabel, { color: theme.colors.primary, fontSize: theme.typography.sizes.small, fontFamily: theme.typography.fontFamily }]}>
                        All
                      </Text>
                      <Text style={[styles.metricValue, { color: theme.colors.primary, fontSize: theme.typography.sizes.small, fontFamily: theme.typography.fontFamily }]}>
                        {item.total ?? 0}
                      </Text>
                    </View>
                  </View>

                </View>
              </Card>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  headerSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  titleText: {
    fontWeight: 'bold',
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8, 
  },
  cardWrapper: {
    padding: 8,   
  },
  cardContent: {
    minHeight: 110, 
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
  },
  metricBlock: {
    flex: 1,
    alignItems: 'center',
  },
  middleMetricBlock: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  metricLabel: {
    fontWeight: '500',
    marginBottom: 2,
  },
  metricValue: {
    fontWeight: '700',
  },
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  }
});