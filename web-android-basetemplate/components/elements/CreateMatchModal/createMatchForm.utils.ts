import type { MatchFormData } from './useCreateMatchForm';

export const convertToDate = (value: string) => {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.split('-');

  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return Number.isNaN(date.getTime()) ? undefined : date;
};


export const convertToDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};


const getTeamName = (teams: any[], code?: string) => {
  if (!code) {
    return '';
  }

  const team = teams.find(
    (item: any) => String(item?.team_code ?? item?.id ?? '') === String(code)
  );

  return team?.team_name ?? team?.teamName ?? '';
};


const getPlayerName = (players: any[], playerCode: string): string => {
  if (!playerCode) {
    return '';
  }

  const player = players.find((player) => {
    const code = player.player_code ?? player.id;

    return String(code) === String(playerCode);
  });

  const rawPlayer = player as any;
  return (
    rawPlayer?.player_name ??
    rawPlayer?.playerName ??
    rawPlayer?.full_name ??
    rawPlayer?.fullName ??
    rawPlayer?.name ??
    `${rawPlayer?.first_name ?? ''} ${rawPlayer?.last_name ?? ''}`.trim()
  );
};


const getPlayerSlot = (playerCode: string, slots: string[]): string => {
  const index = slots.indexOf(playerCode);
  return index >= 0 ? `PLAYER${index + 1}` : '';
};


export function normalizeInitialData(initialData: any, teams: any[]): MatchFormData {
  const team1Code = String(
    initialData?.team1_code ?? initialData?.team1_id ?? ''
  );

  const team2Code = String(
    initialData?.team2_code ?? initialData?.team2_id ?? ''
  );

  const matchType =
    String(
      initialData?.match_type ?? initialData?.matchType ?? 'SINGLES'
    ).toUpperCase() === 'DOUBLES'
      ? 'DOUBLES'
      : 'SINGLES';

  const matchFormat =
    String(
      initialData?.match_format ?? initialData?.matchFormat ?? 'BEST_OF_3'
    ).toUpperCase() === 'BEST_OF_5'
      ? 'BEST_OF_5'
      : 'BEST_OF_3';

  return {
    tournamentCode: String(
      initialData?.tournament_code ??
        initialData?.tournamentId ??
        initialData?.tournament_id ??
        ''
    ),

    matchDate: initialData?.matchDate ?? initialData?.match_date ?? '',

    matchTime: initialData?.matchTime ?? initialData?.match_time ?? '',

    courtNo: String(initialData?.courtNo ?? initialData?.court_no ?? ''),

    matchNo: String(initialData?.matchNo ?? initialData?.match_no ?? ''),

    ageCategory:
      initialData?.ageCategory ?? initialData?.age_category ?? 'OPEN',

    gender: initialData?.gender ?? 'Men',

    matchType,

    matchFormat,

    team1Code: team1Code === 'undefined' ? '' : team1Code,

    team1: initialData?.team1 ?? getTeamName(teams, team1Code),

    team2Code: team2Code === 'undefined' ? '' : team2Code,

    team2: initialData?.team2 ?? getTeamName(teams, team2Code),

    player1: String(
      initialData?.player1 ??
        initialData?.player1_code ??
        initialData?.player1_id ??
        ''
    ),

    player2: String(
      initialData?.player2 ??
        initialData?.player2_code ??
        initialData?.player2_id ??
        ''
    ),

    player3: String(
      initialData?.player3 ??
        initialData?.player3_code ??
        initialData?.player3_id ??
        ''
    ),

    player4: String(
      initialData?.player4 ??
        initialData?.player4_code ??
        initialData?.player4_id ??
        ''
    ),

    firstServer: (() => {
      const slot =
        initialData?.serving_state?.first_server ??
        initialData?.serving_state?.current_set_first_server;
      const selected = [
        initialData?.player1 ?? initialData?.player1_id ?? '',
        initialData?.player2 ?? initialData?.player2_id ?? '',
        initialData?.player3 ?? initialData?.player3_id ?? '',
        initialData?.player4 ?? initialData?.player4_id ?? '',
      ];
      const index = ['PLAYER1', 'PLAYER2', 'PLAYER3', 'PLAYER4'].indexOf(
        slot
      );
      return index >= 0 ? String(selected[index] ?? '') : '';
    })(),

    opposingFirstServer: (() => {
      const slot = initialData?.serving_state?.opposing_first_server;
      const selected = [
        initialData?.player1 ?? initialData?.player1_id ?? '',
        initialData?.player2 ?? initialData?.player2_id ?? '',
        initialData?.player3 ?? initialData?.player3_id ?? '',
        initialData?.player4 ?? initialData?.player4_id ?? '',
      ];
      const index = ['PLAYER1', 'PLAYER2', 'PLAYER3', 'PLAYER4'].indexOf(
        slot
      );
      return index >= 0 ? String(selected[index] ?? '') : '';
    })(),

    digitalScorerCode: String(
      initialData?.digital_scorer_code ??
        initialData?.digital_scorer_id ??
        initialData?.digitalScorer ??
        ''
    ),

    referee1Code: String(
      initialData?.referee_1_code ??
        initialData?.referee_1_id ??
        initialData?.referee1 ??
        ''
    ),

    referee2Code: String(
      initialData?.referee_2_code ??
        initialData?.referee_2_id ??
        initialData?.referee2 ??
        ''
    ),
  };
}

export function prepareSubmission(formData: MatchFormData, players: any[], initialData: any) {
  const player1Name = getPlayerName(players, formData.player1);

  const player2Name = getPlayerName(players, 
    formData.matchType === 'DOUBLES' ? formData.player2 : formData.player3
  );

  const player3Name =
    formData.matchType === 'DOUBLES' ? getPlayerName(players, formData.player3) : '';

  const player4Name =
    formData.matchType === 'DOUBLES' ? getPlayerName(players, formData.player4) : '';

  const playerSlots =
    formData.matchType === 'DOUBLES'
      ? [
          formData.player1,
          formData.player2,
          formData.player3,
          formData.player4,
        ]
      : [formData.player1, formData.player3];

  const firstServerSlot = getPlayerSlot(formData.firstServer, playerSlots);

  const opposingFirstServerSlot =
    formData.matchType === 'DOUBLES'
      ? getPlayerSlot(formData.opposingFirstServer, playerSlots)
      : '';

  if (!player1Name) {
    return { errors: {
      player1: 'Selected Player 1 was not found',
    } as Record<string, string> };
  }

  if (!player2Name) {
    return { errors: {
      player3: 'Selected Player 2 was not found',
    } as Record<string, string> };
  }

  if (formData.matchType === 'DOUBLES' && (!player3Name || !player4Name)) {
    return { errors: {
      player2: 'All four doubles players are required',
    } as Record<string, string> };
  }
  const payload = {
    tournament_code: formData.tournamentCode,

    match_date: formData.matchDate,

    match_time: formData.matchTime,

    court_no: formData.courtNo,

    match_no: formData.matchNo,

    age_category: formData.ageCategory,

    gender: formData.gender,

    match_type: formData.matchType,

    match_format: formData.matchFormat,

    team1_code: formData.team1Code,

    team2_code: formData.team2Code,

    team1: formData.team1,

    team2: formData.team2,

    player1_name: player1Name,

    player2_name: player2Name,

    player3_name: formData.matchType === 'DOUBLES' ? player3Name : null,

    player4_name: formData.matchType === 'DOUBLES' ? player4Name : null,

    player1_id: Number(formData.player1) || null,

    player2_id:
      Number(
        formData.matchType === 'DOUBLES' ? formData.player2 : formData.player3
      ) || null,

    player3_id:
      formData.matchType === 'DOUBLES'
        ? Number(formData.player3) || null
        : null,

    player4_id:
      formData.matchType === 'DOUBLES'
        ? Number(formData.player4) || null
        : null,

    serving_state: {
      version: 1,
      match_type: formData.matchType,
      first_server: firstServerSlot,
      ...(formData.matchType === 'DOUBLES'
        ? {
            opposing_first_server: opposingFirstServerSlot,
          }
        : {}),
    },

    digital_scorer_id: Number(formData.digitalScorerCode),

    referee_1_id: Number(formData.referee1Code),

    referee_2_id: Number(formData.referee2Code),

    is_active: initialData?.is_active ?? true,

    is_complete: initialData?.is_complete ?? false,
  };

  return { payload, player1Name, player2Name };
}
