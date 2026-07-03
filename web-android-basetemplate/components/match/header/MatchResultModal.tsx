import React from 'react';
import { View, Text, Modal, Alert } from 'react-native';
import { useTheme } from '../../../theme/themeContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { generateMatchWorkbook, saveWorkbook, LogEntry, PlayerEntry, MatchMeta } from '../../match/controls/excelUtils';
import { useMatch } from '../layout/MatchContext';
import TeamService from '../../../services/team/team.service';
import tournamentService from '../../../services/tournament/tournamment.service';
import ApiService from '../../../services/api/api.service';
import officialService from '../../../services/official/official.service';

interface MatchResultModalProps {
  isVisible: boolean;
  onClose: () => void;
  scoreA: number;
  scoreB: number;
  whiteTeamName: string;
  blueTeamName: string;
  whiteTeamCode?: string;
  blueTeamCode?: string;
  getQuarterScore: (teamSide: 'left' | 'right', quarter: number) => number;
}

export default function MatchResultModal({
  isVisible,
  onClose,
  scoreA,
  scoreB,
  whiteTeamName,
  blueTeamName,
  whiteTeamCode,
  blueTeamCode,
  getQuarterScore,
}: MatchResultModalProps) {
  const theme = useTheme();
  const { saveAllLogs, logs, activeMatch } = useMatch();

  // Resolve team codes from props first, then fall back to activeMatch in context
  const resolvedWhiteCode = whiteTeamCode || activeMatch?.white_team_code || activeMatch?.whiteTeamCode;
  const resolvedBlueCode  = blueTeamCode  || activeMatch?.blue_team_code  || activeMatch?.blueTeamCode;

  const winnerString = scoreA > scoreB
    ? `${whiteTeamName} (WHITE) Wins!`
    : scoreB > scoreA
      ? `${blueTeamName} (BLUE) Wins!`
      : "Match is a Draw!";

  const winnerTeamName = scoreA > scoreB
    ? whiteTeamName
    : scoreB > scoreA
      ? blueTeamName
      : '';

  const handleSubmitAndDownload = async () => {
    const targetFilename = `Waterpolo_Scoresheet_${Date.now()}.xlsx`;

    try {
      // ── Fetch players ──────────────────────────────────────────────────────
      let whitePlayers: PlayerEntry[] = [];
      let bluePlayers: PlayerEntry[] = [];
      try {
        if (resolvedWhiteCode) {
          const res = await TeamService.getPlayersByTeamCode(resolvedWhiteCode);
          whitePlayers = Array.isArray(res?.data) ? res.data : [];
        }
        if (resolvedBlueCode) {
          const res = await TeamService.getPlayersByTeamCode(resolvedBlueCode);
          bluePlayers = Array.isArray(res?.data) ? res.data : [];
        }
      } catch (playerFetchError) {
        console.error('Failed to fetch players for scoresheet:', playerFetchError);
      }

      // ── Fetch team head coaches ───────────────────────────────────────────
      let whiteCoach = '';
      let blueCoach = '';
      try {
        const resolveCoach = async (teamCode: string | undefined) => {
          if (!teamCode) return '';
          const res = await TeamService.getTeams({ team_code: teamCode });
          const list: any[] = res?.data?.data || res?.data || [];
          const team = list.find((t: any) => String(t.team_code) === String(teamCode));
          return team?.head_coach || '';
        };
        [whiteCoach, blueCoach] = await Promise.all([
          resolveCoach(resolvedWhiteCode),
          resolveCoach(resolvedBlueCode),
        ]);
      } catch {
        console.error('Failed to fetch team coach info');
      }

      // ── Fetch officials and resolve match official codes to names ─────────
      let matchOfficials: MatchMeta['matchOfficials'] = {};
      try {
        const offRes = await officialService.getOfficials({ limit: 500 });
        const allOfficials: any[] = offRes?.data?.data ?? offRes?.data ?? (Array.isArray(offRes) ? offRes : []);
        const resolveName = (code: string | null | undefined) => {
          if (!code) return '';
          const o = allOfficials.find(
            (item: any) =>
              String(item.id) === String(code) ||
              String(item.official_code) === String(code)
          );
          if (!o) return '';
          return `${o.first_name || ''} ${o.last_name || ''}`.trim();
        };
        matchOfficials = {
          referee1:      resolveName(activeMatch?.referee_1_code),
          referee2:      resolveName(activeMatch?.referee_2_code),
          timekeeper1:   resolveName(activeMatch?.timekeeper_1_code),
          timekeeper2:   resolveName(activeMatch?.timekeeper_2_code),
          goalJudge1:    resolveName(activeMatch?.goaljudge_1_code),
          goalJudge2:    resolveName(activeMatch?.goaljudge_2_code),
          digitalScorer: resolveName(activeMatch?.digital_scorer_code),
        };
      } catch {
        console.error('Failed to fetch officials for scoresheet');
      }

      // ── Fetch tournament venue ─────────────────────────────────────────────
      let venue = '';
      try {
        const tCode = activeMatch?.tournament_code;
        if (tCode) {
          const tRes = await tournamentService.getTournaments();
          const list: any[] = tRes?.data?.data || tRes?.data || [];
          const match = list.find((t: any) => String(t.tournament_code) === String(tCode));
          venue = match?.venue || '';
        }
      } catch {
        console.error('Failed to fetch tournament venue');
      }

      // ── Build match meta ──────────────────────────────────────────────────
      const meta: MatchMeta = {
        matchDate:     activeMatch?.match_date || '',
        matchNo:       activeMatch?.match_no   || '',
        gender:        activeMatch?.gender     || '',
        venue,
        whiteCoach,
        blueCoach,
        matchOfficials,
        quarterScores: {
          white: [
            getQuarterScore('left', 1),
            getQuarterScore('left', 2),
            getQuarterScore('left', 3),
            getQuarterScore('left', 4),
          ],
          blue: [
            getQuarterScore('right', 1),
            getQuarterScore('right', 2),
            getQuarterScore('right', 3),
            getQuarterScore('right', 4),
          ],
        },
      };

      // ── Map logs (goals, Exclusion Foul, TimeOut, all Penalty types) ──────
      const logEntries: LogEntry[] = logs
        .filter(log =>
          log.type.includes('Goal') ||
          log.type === 'Exclusion Foul' ||
          log.type === 'TimeOut' ||
          log.type.includes('Penalty')
        )
        .map(log => ({
          time:    log.time,
          player:  log.player,
          team:    log.team,
          type:    log.type,
          score:   log.score,
          quarter: log.quarter,
        }));

      const workbook = generateMatchWorkbook(
        logEntries, whitePlayers, bluePlayers, whiteTeamName, blueTeamName, meta
      );
      await saveWorkbook(workbook, targetFilename);

      // 1. Save all match logs to DB
      await saveAllLogs();
      if (activeMatch?.id) {
        // 2. Persist the winning team name
        if (winnerTeamName) {
          await ApiService.put(`/matches/${activeMatch.id}`, { winner: winnerTeamName });
        }
        // 3. Mark match as complete: PATCH is_complete = true
        await ApiService.post(`/matches/${activeMatch.id}/complete`, {});
      }
      onClose();
    } catch (exportSystemError) {
      console.error(exportSystemError);
      Alert.alert("Processing Error", "Failed to compile structure into an Excel document.");
    }
  };

  return (
    <Modal transparent visible={isVisible} animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: theme.colors.overlay || 'rgba(15, 23, 42, 0.75)', justifyContent: 'center', alignItems: 'center', padding: theme.spacing.lg }}>
        <View style={{ width: '100%', maxWidth: 420 }}>
          <Card variant="elevated">
            <View style={{ alignItems: 'center', width: '100%' }}>

              <Text style={{ color: theme.colors.error, fontSize: theme.typography.sizes.badge, fontWeight: theme.typography.weights.heavy as any, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: theme.spacing.xs }}>
                Match Finished
              </Text>

              <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.sizes.h3, fontWeight: theme.typography.weights.bold as any, textAlign: 'center', marginBottom: theme.spacing.lg }}>
                Result: {winnerString}
              </Text>

              <View style={{ backgroundColor: theme.colors.secondary, width: '100%', borderRadius: theme.radius.sm, paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.lg, alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text numberOfLines={1} style={{ color: theme.colors.textPrimary, fontSize: theme.typography.sizes.small, fontWeight: '700', textAlign: 'center' }}>{whiteTeamName}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: theme.spacing.sm }}>
                    <Text style={{ fontSize: theme.typography.sizes.h1, fontWeight: '900', color: theme.colors.textPrimary }}>{scoreA}</Text>
                    <Text style={{ fontSize: theme.typography.sizes.h2, fontWeight: '700', color: theme.colors.border, marginHorizontal: theme.spacing.sm }}>—</Text>
                    <Text style={{ fontSize: theme.typography.sizes.h1, fontWeight: '900', color: theme.colors.textPrimary }}>{scoreB}</Text>
                  </View>

                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text numberOfLines={1} style={{ color: theme.colors.textPrimary, fontSize: theme.typography.sizes.small, fontWeight: '700', textAlign: 'center' }}>{blueTeamName}</Text>
                  </View>
                </View>
              </View>

              <View style={{ width: '100%' }}>
                <Button title="Submit & Export Scoresheet" variant="danger" onPress={handleSubmitAndDownload} style={{ width: '100%' }} />
              </View>

            </View>
          </Card>
        </View>
      </View>
    </Modal>
  );
}
