import { useMemo } from 'react';
import type { MatchFormData, Option } from './useCreateMatchForm';

export default function useCreateMatchFormOptions(
  teams: any[], tournaments: any[], players: any[], officials: any[], formData: MatchFormData,
) {
  const teamOptions = useMemo<Option[]>(
    () =>
      teams
        .filter((team: any) => Boolean(team?.team_code ?? team?.id))
        .map((team: any) => {
          const name = team?.team_name ?? team?.teamName ?? '';

          const shortName = team?.short_name ?? team?.shortName ?? '';

          return {
            label: shortName ? `${name} (${shortName})` : name,

            value: String(team?.team_code ?? team?.id),

            teamName: name,
          };
        }),
    [teams]
  );

  /* =======================================================
     TOURNAMENT OPTIONS
  ======================================================= */

  const tournamentOptions = useMemo<Option[]>(
    () =>
      tournaments
        .filter((item: any) => item?.tournament_code)
        .map((item: any) => ({
          label:
            item?.name ??
            item?.tournament_name ??
            item?.title ??
            `Tournament ${item.tournament_code}`,

          value: String(item.tournament_code),
        })),
    [tournaments]
  );

  /* =======================================================
     GLOBAL PLAYER OPTIONS

     IMPORTANT:
     Players are intentionally NOT filtered by team.

     The Players module is independent from Teams.
  ======================================================= */

  const playerOptions = useMemo<Option[]>(
    () =>
      players
        .map((player: any) => {
          const code = player?.player_code ?? player?.playerCode ?? player?.id;

          if (code === undefined || code === null) {
            return null;
          }

          const fullName = `${player?.first_name ?? ''} ${
            player?.last_name ?? ''
          }`.trim();

          const name =
            player?.player_name ??
            player?.playerName ??
            player?.full_name ??
            player?.fullName ??
            player?.name ??
            fullName;

          return {
            label: name || `Player ${code}`,

            value: String(code),
          };
        })
        .filter(Boolean) as Option[],
    [players]
  );



  const getAvailablePlayers = (currentPlayer: string): Option[] => {
    const selectedPlayers = new Set(
      [
        formData.player1,
        formData.player2,
        formData.player3,
        formData.player4,
      ].filter(Boolean)
    );

    // Keep the currently selected player
    // visible in its own dropdown.
    if (currentPlayer) {
      selectedPlayers.delete(currentPlayer);
    }

    return playerOptions.filter((player) => !selectedPlayers.has(player.value));
  };
  /* =======================================================
     OFFICIAL HELPERS
  ======================================================= */

  const getOfficialName = (official: any) => {
    const fullName = `${official?.first_name ?? ''} ${
      official?.last_name ?? ''
    }`.trim();

    return (
      official?.name ??
      official?.official_name ??
      official?.full_name ??
      official?.fullName ??
      fullName ??
      official?.username ??
      ''
    );
  };

  const getOfficialRole = (official: any) =>
    official?.role ??
    official?.official_role ??
    official?.designation ??
    'Official';

  /* =======================================================
     ALL OFFICIAL OPTIONS
  ======================================================= */

  const officialOptions = useMemo<Option[]>(
    () =>
      officials
        .filter((official: any) => official?.official_code ?? official?.id)
        .map((official: any) => ({
          label: `${getOfficialName(official)} (${getOfficialRole(official)})`,

          value: String(official.id),
        })),
    [officials]
  );

  /* =======================================================
     REFEREE OPTIONS
  ======================================================= */

  const refereeOptions = useMemo<Option[]>(
    () =>
      officials
        .filter((official: any) =>
          getOfficialRole(official).toLowerCase().includes('referee')
        )
        .filter((official: any) => official?.official_code ?? official?.id)
        .map((official: any) => ({
          label: `${getOfficialName(official)} (${getOfficialRole(official)})`,

          value: String(official?.official_code ?? official?.id),
        })),
    [officials]
  );

  /* =======================================================
     SCORER OPTIONS
  ======================================================= */

  const scorerOptions = useMemo<Option[]>(
    () =>
      officials
        .filter((official: any) =>
          getOfficialRole(official).toLowerCase().includes('scorer')
        )
        .filter((official: any) => official?.official_code ?? official?.id)
        .map((official: any) => ({
          label: `${getOfficialName(official)} (${getOfficialRole(official)})`,

          value: String(official?.official_code ?? official?.id),
        })),
    [officials]
  );

  /* =======================================================
     OFFICIAL DUPLICATE PREVENTION
  ======================================================= */

  const selectedOfficials = new Set(
    [
      formData.digitalScorerCode,
      formData.referee1Code,
      formData.referee2Code,
    ].filter(Boolean)
  );

  const availableOfficials = (currentValue: string, options: Option[]) =>
    options.filter(
      (option) =>
        !selectedOfficials.has(option.value) || option.value === currentValue
    );

  return { teamOptions, tournamentOptions, playerOptions, officialOptions, refereeOptions, scorerOptions, getAvailablePlayers, availableOfficials };
}
