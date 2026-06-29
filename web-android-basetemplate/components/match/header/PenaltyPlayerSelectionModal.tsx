// PenaltyPlayerSelectionModal.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Button from '../../ui/Button';
import Card from '../../ui/Card';
import { useTheme } from '../../../theme/themeContext';
import teamService from '../../../services/team/team.service';
import type { PenaltyLineup } from '../layout/MatchContext';

type PlayerOption = {
  id: string;
  capNo: string;
  name: string;
};

const fallbackPlayers: PlayerOption[] = Array.from({ length: 15 }, (_, index) => {
  const number = String(index + 1);
  return {
    id: number,
    capNo: number,
    name: '', // Empty name for fallback placeholders
  };
});

const normalizePlayers = (response: any): PlayerOption[] => {
  const list = response?.data || response || [];

  if (!Array.isArray(list) || list.length === 0) {
    return fallbackPlayers;
  }

  return list.map((player: any, index: number) => {
    const capNumber =
      player.cap_no ||
      player.capNo ||
      player.jersey_no ||
      player.jerseyNo ||
      player.player_no ||
      player.number ||
      index + 1;

    // Check for explicit first and last name fields from your API response payload
    let playerName = '';
    if (player.first_name || player.last_name) {
      playerName = `${player.first_name || ''} ${player.last_name || ''}`.trim();
    } else {
      // Fallback handlers for existing fallback string rules
      playerName =
        player.player_name ||
        player.playerName ||
        player.name ||
        player.full_name ||
        player.fullName ||
        '';
    }

    return {
      id: String(capNumber),
      capNo: String(capNumber),
      name: playerName,
    };
  });
};

export default function PenaltyPlayerSelectionModal({
  isVisible,
  onClose,
  onNext,
  whiteTeamCode,
  blueTeamCode,
  whiteTeamName,
  blueTeamName,
}: PenaltyPlayerSelectionModalProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [whitePlayers, setWhitePlayers] = useState<PlayerOption[]>(fallbackPlayers);
  const [bluePlayers, setBluePlayers] = useState<PlayerOption[]>(fallbackPlayers);
  const [whiteShooters, setWhiteShooters] = useState<string[]>([]);
  const [blueShooters, setBlueShooters] = useState<string[]>([]);
  const [whiteGoalkeeper, setWhiteGoalkeeper] = useState('');
  const [blueGoalkeeper, setBlueGoalkeeper] = useState('');

  const canContinue = useMemo(
    () =>
      whiteShooters.length === 5 &&
      blueShooters.length === 5 &&
      Boolean(whiteGoalkeeper) &&
      Boolean(blueGoalkeeper),
    [blueGoalkeeper, blueShooters.length, whiteGoalkeeper, whiteShooters.length]
  );

  useEffect(() => {
    if (!isVisible) return;

    setWhiteShooters([]);
    setBlueShooters([]);
    setWhiteGoalkeeper('');
    setBlueGoalkeeper('');

    const loadPlayers = async () => {
      setLoading(true);

      try {
        const [whiteResponse, blueResponse] = await Promise.all([
          whiteTeamCode
            ? teamService.getPlayersByTeamCode(String(whiteTeamCode))
            : Promise.resolve([]),
          blueTeamCode
            ? teamService.getPlayersByTeamCode(String(blueTeamCode))
            : Promise.resolve([]),
        ]);

        setWhitePlayers(normalizePlayers(whiteResponse));
        setBluePlayers(normalizePlayers(blueResponse));
      } catch (error) {
        console.log('Fetch penalty players error:', error);
        setWhitePlayers(fallbackPlayers);
        setBluePlayers(fallbackPlayers);
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, [blueTeamCode, isVisible, whiteTeamCode]);

  const toggleShooter = (
    playerId: string,
    selectedShooters: string[],
    setSelectedShooters: (players: string[]) => void,
    goalkeeper: string,
    setGoalkeeper: (player: string) => void
  ) => {
    if (selectedShooters.includes(playerId)) {
      setSelectedShooters(selectedShooters.filter(item => item !== playerId));
      return;
    }

    if (selectedShooters.length >= 5) {
      Alert.alert('Penalty Lineup', 'Select exactly 5 shooters for each team.');
      return;
    }

    if (goalkeeper === playerId) {
      setGoalkeeper('');
    }

    setSelectedShooters([...selectedShooters, playerId]);
  };

  const selectGoalkeeper = (
    playerId: string,
    selectedShooters: string[],
    setSelectedShooters: (players: string[]) => void,
    setGoalkeeper: (player: string) => void
  ) => {
    setSelectedShooters(selectedShooters.filter(item => item !== playerId));
    setGoalkeeper(playerId);
  };

  const handleNext = () => {
    if (!canContinue) {
      Alert.alert(
        'Penalty Lineup',
        'Select 5 shooters and 1 goalkeeper for both teams.'
      );
      return;
    }

    onNext({
      whiteShooters,
      blueShooters,
      whiteGoalkeeper,
      blueGoalkeeper,
    });
  };

  const renderTeamSelector = (
    teamName: string,
    players: PlayerOption[],
    selectedShooters: string[],
    setSelectedShooters: (players: string[]) => void,
    goalkeeper: string,
    setGoalkeeper: (player: string) => void
  ) => (
    <View
      style={{
        flex: 1,
        minWidth: 280,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.background,
      }}
    >
      <Text
        numberOfLines={1}
        style={{
          color: theme.colors.textPrimary,
          fontSize: theme.typography.sizes.body,
          fontWeight: theme.typography.weights.bold as any,
          marginBottom: theme.spacing.xs,
        }}
      >
        {teamName}
      </Text>

      <Text
        style={{
          color: theme.colors.textSecondary,
          fontSize: theme.typography.sizes.caption,
          marginBottom: theme.spacing.sm,
        }}
      >
        Shooters {selectedShooters.length}/5 | Goalkeeper {goalkeeper || '-'}
      </Text>

      <View style={{ gap: theme.spacing.xs }}>
        {players.map(player => {
          const isShooter = selectedShooters.includes(player.id);
          const isGoalkeeper = goalkeeper === player.id;

          return (
            <View
              key={player.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing.xs,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  toggleShooter(
                    player.id,
                    selectedShooters,
                    setSelectedShooters,
                    goalkeeper,
                    setGoalkeeper
                  )
                }
                style={{
                  flex: 1,
                  flexDirection: 'row', // Arranges cap number and name side-by-side
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: isShooter ? theme.colors.primary : theme.colors.border,
                  borderRadius: theme.radius.sm,
                  paddingVertical: theme.spacing.xs,
                  paddingHorizontal: theme.spacing.sm,
                  backgroundColor: isShooter ? theme.colors.secondary : theme.colors.surface,
                }}
              >
                {/* Left side: Cap Number */}
                <Text
                  style={{
                    color: theme.colors.textPrimary,
                    fontSize: theme.typography.sizes.caption,
                    fontWeight: theme.typography.weights.bold as any,
                    width: 55, // Set fixed structural width so names line up straight
                  }}
                >
                  Cap {player.capNo}
                </Text>

                {/* Middle space: Dynamic Player Name */}
                <Text
                  numberOfLines={1}
                  style={{
                    flex: 1,
                    color: theme.colors.textPrimary,
                    fontSize: theme.typography.sizes.caption,
                    fontWeight: isShooter
                      ? (theme.typography.weights.bold as any)
                      : (theme.typography.weights.medium as any),
                    textAlign: 'left',
                    paddingLeft: theme.spacing.sm,
                  }}
                >
                  {player.name || '—————'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  selectGoalkeeper(
                    player.id,
                    selectedShooters,
                    setSelectedShooters,
                    setGoalkeeper
                  )
                }
                style={{
                  width: 44,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: isGoalkeeper ? theme.colors.error : theme.colors.border,
                  borderRadius: theme.radius.sm,
                  paddingVertical: theme.spacing.xs,
                  backgroundColor: isGoalkeeper ? '#FEE2E2' : theme.colors.surface,
                }}
              >
                <Text
                  style={{
                    color: isGoalkeeper ? theme.colors.error : theme.colors.textSecondary,
                    fontSize: theme.typography.sizes.caption,
                    fontWeight: theme.typography.weights.bold as any,
                  }}
                >
                  GK
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.overlay || 'rgba(15, 23, 42, 0.75)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: theme.spacing.lg,
        }}
      >
        <View style={{ width: '100%', maxWidth: 760 }}>
          <Card variant="elevated">
            <View style={{ width: '100%', gap: theme.spacing.md }}>
              <View>
                <Text
                  style={{
                    color: theme.colors.textPrimary,
                    fontSize: theme.typography.sizes.h3,
                    fontWeight: theme.typography.weights.bold as any,
                    textAlign: 'center',
                  }}
                >
                  Select Penalty Players
                </Text>
                <Text
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.sizes.caption,
                    textAlign: 'center',
                    marginTop: theme.spacing.xs,
                  }}
                >
                  Choose 5 shooters and 1 goalkeeper for both teams.
                </Text>
              </View>

              {loading ? (
                <ActivityIndicator color={theme.colors.primary} />
              ) : (
                <ScrollView style={{ maxHeight: 420 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      gap: theme.spacing.md,
                    }}
                  >
                    {renderTeamSelector(
                      whiteTeamName,
                      whitePlayers,
                      whiteShooters,
                      setWhiteShooters,
                      whiteGoalkeeper,
                      setWhiteGoalkeeper
                    )}
                    {renderTeamSelector(
                      blueTeamName,
                      bluePlayers,
                      blueShooters,
                      setBlueShooters,
                      blueGoalkeeper,
                      setBlueGoalkeeper
                    )}
                  </View>
                </ScrollView>
              )}

              <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
                <Button
                  title="Back"
                  variant="ghost"
                  onPress={onClose}
                  backgroundColor={theme.colors.border}
                  textColor={theme.colors.textSecondary}
                  style={{ flex: 1 }}
                />
                <Button
                  title="Next"
                  onPress={handleNext}
                  disabled={!canContinue || loading}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          </Card>
        </View>
      </View>
    </Modal>
  );
}