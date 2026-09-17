import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@/theme/themeContext';
import Select from '../../ui/Select';
import { styles } from './CreateMatchModal.styles';
import type { CreateMatchForm } from './useCreateMatchForm';

type Props = Pick<CreateMatchForm, 'formData' | 'errors' | 'teamOptions' | 'playerOptions' | 'getAvailablePlayers' | 'handleTeamChange' | 'update'>;

export default function CreateMatchStep2({
  formData, errors, teamOptions, playerOptions, getAvailablePlayers, handleTeamChange, update,
}: Props) {
  const theme = useTheme();
  return (
    <>
      {/* TEAM 1 */}

      <View style={styles.teamBox}>
        <Text
          style={[
            styles.teamTitle,
            {
              color: theme.colors.textPrimary,
            },
          ]}
        >
          Team 1
        </Text>

        <Select
          label="Team 1"
          value={formData.team1Code}
          onChange={(value: string) => handleTeamChange(1, value)}
          options={teamOptions.filter(
            (team) => team.value !== formData.team2Code
          )}
          error={errors.team1Code}
        />

        <Select
          label={formData.matchType === 'DOUBLES' ? 'Player 1' : 'Player 1'}
          value={formData.player1}
          onChange={(value: string) => update('player1', value)}
          options={getAvailablePlayers(formData.player1)}
          error={errors.player1}
        />

        {formData.matchType === 'DOUBLES' && (
          <Select
            label="Player 2"
            value={formData.player2}
            onChange={(value: string) => update('player2', value)}
            options={getAvailablePlayers(formData.player2)}
            error={errors.player2}
          />
        )}
      </View>
      {/* VS */}

      <View style={styles.vs}>
        <Text
          style={[
            styles.vsText,
            {
              color: theme.colors.textSecondary,
            },
          ]}
        >
          VS
        </Text>
      </View>

      {/* TEAM 2 */}

      <View style={styles.teamBox}>
        <Text
          style={[
            styles.teamTitle,
            {
              color: theme.colors.textPrimary,
            },
          ]}
        >
          Team 2
        </Text>

        <Select
          label="Team 2"
          value={formData.team2Code}
          onChange={(value: string) => handleTeamChange(2, value)}
          options={teamOptions.filter(
            (team) => team.value !== formData.team1Code
          )}
          error={errors.team2Code}
        />

        <Select
          label={formData.matchType === 'DOUBLES' ? 'Player 1' : 'Player 2'}
          value={formData.player3}
          onChange={(value: string) => update('player3', value)}
          options={playerOptions.filter(
            (player) => player.value !== formData.player4
          )}
          error={errors.player3}
        />

        {formData.matchType === 'DOUBLES' && (
          <Select
            label="Player 2"
            value={formData.player4}
            onChange={(value: string) => update('player4', value)}
            options={playerOptions.filter(
              (player) => player.value !== formData.player3
            )}
            error={errors.player4}
          />
        )}
      </View>

      {((formData.matchType === 'SINGLES' &&
        formData.player1 &&
        formData.player3) ||
        (formData.matchType === 'DOUBLES' &&
          formData.player1 &&
          formData.player2 &&
          formData.player3 &&
          formData.player4)) &&
        (formData.matchType === 'SINGLES' ? (
          <View style={styles.serverSelection}>
            <Text
              style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
            >
              First Server
            </Text>

            <Select
              label="Opening game server"
              value={formData.firstServer}
              onChange={(value: string) => update('firstServer', value)}
              options={playerOptions.filter((player) =>
                [formData.player1, formData.player3].includes(player.value)
              )}
              error={errors.firstServer}
            />
          </View>
        ) : (
          <View style={styles.serverSelection}>
            <Text
              style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}
            >
              Opening Servers
            </Text>

            <Select
              label="Team 1 Opening Server"
              value={formData.firstServer}
              onChange={(value: string) => update('firstServer', value)}
              options={playerOptions.filter((player) =>
                [formData.player1, formData.player2].includes(player.value)
              )}
              error={errors.firstServer}
            />

            <Select
              label="Team 2 Opening Server"
              value={formData.opposingFirstServer}
              onChange={(value: string) => update('opposingFirstServer', value)}
              options={playerOptions.filter((player) =>
                [formData.player3, formData.player4].includes(player.value)
              )}
              error={errors.opposingFirstServer}
            />
          </View>
        ))}
    </>
  );
}

