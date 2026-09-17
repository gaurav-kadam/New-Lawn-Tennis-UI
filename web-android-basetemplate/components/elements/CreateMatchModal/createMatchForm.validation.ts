import type { MatchFormData } from './useCreateMatchForm';

export function validateStep1(formData: MatchFormData): Record<string, string> {
  const nextErrors: Record<string, string> = {};
  if (!formData.tournamentCode) {
    nextErrors.tournamentCode = 'Select Tournament';
  }

  if (!formData.matchDate) {
    nextErrors.matchDate = 'Select Date';
  }

  if (!formData.matchTime) {
    nextErrors.matchTime = 'Select Time';
  }

  if (!formData.courtNo) {
    nextErrors.courtNo = 'Enter Court Number';
  } else if (
    !/^\d+$/.test(formData.courtNo) ||
    Number(formData.courtNo) <= 0
  ) {
    nextErrors.courtNo = 'Enter a valid Court Number';
  }

  if (!formData.matchNo) {
    nextErrors.matchNo = 'Enter Match Number';
  }

  if (!formData.ageCategory) {
    nextErrors.ageCategory = 'Select Age Category';
  }

  if (!formData.gender) {
    nextErrors.gender = 'Select Gender';
  }

  if (!formData.matchType) {
    nextErrors.matchType = 'Select Match Type';
  }

  if (!formData.matchFormat) {
    nextErrors.matchFormat = 'Select Match Format';
  }
  return nextErrors;
}

export function validateStep2(formData: MatchFormData): Record<string, string> {
  const nextErrors: Record<string, string> = {};
  if (!formData.team1Code) {
    nextErrors.team1Code = 'Select Team 1';
  }

  if (!formData.team2Code) {
    nextErrors.team2Code = 'Select Team 2';
  }

  if (
    formData.team1Code &&
    formData.team2Code &&
    formData.team1Code === formData.team2Code
  ) {
    nextErrors.team2Code = 'Team 1 and Team 2 must be different';
  }

  if (!formData.player1) {
    nextErrors.player1 = 'Select Player';
  }

  if (!formData.player3) {
    nextErrors.player3 = 'Select Player';
  }

  if (formData.matchType === 'DOUBLES') {
    if (!formData.player2) {
      nextErrors.player2 = 'Select Player 2';
    }

    if (!formData.player4) {
      nextErrors.player4 = 'Select Player 2';
    }

    const playersSelected = [
      formData.player1,
      formData.player2,
      formData.player3,
      formData.player4,
    ].filter(Boolean);

    if (new Set(playersSelected).size !== playersSelected.length) {
      nextErrors.player4 = 'Players must be different';
    }
  }

  if (!formData.firstServer) {
    nextErrors.firstServer = 'Select the first server';
  }

  if (
    formData.matchType === 'SINGLES' &&
    formData.firstServer &&
    ![formData.player1, formData.player3].includes(formData.firstServer)
  ) {
    nextErrors.firstServer = 'Select one of the singles players';
  }

  if (formData.matchType === 'DOUBLES') {
    if (!formData.opposingFirstServer) {
      nextErrors.opposingFirstServer =
        'Select the opposing team first server';
    } else if (
      formData.firstServer &&
      (([formData.player1, formData.player2].includes(
        formData.firstServer
      ) &&
        [formData.player1, formData.player2].includes(
          formData.opposingFirstServer
        )) ||
        ([formData.player3, formData.player4].includes(
          formData.firstServer
        ) &&
          [formData.player3, formData.player4].includes(
            formData.opposingFirstServer
          )))
    ) {
      nextErrors.opposingFirstServer =
        'Choose a player from the opposing team';
    }
  }
  return nextErrors;
}

export function validateStep3(formData: MatchFormData): Record<string, string> {
  const nextErrors: Record<string, string> = {};
  if (!formData.digitalScorerCode) {
    nextErrors.digitalScorerCode = 'Select Digital Scorer';
  }

  if (!formData.referee1Code) {
    nextErrors.referee1Code = 'Select Referee 1';
  }

  if (!formData.referee2Code) {
    nextErrors.referee2Code = 'Select Referee 2';
  }

  if (
    formData.referee1Code &&
    formData.referee2Code &&
    formData.referee1Code === formData.referee2Code
  ) {
    nextErrors.referee2Code = 'Referee 1 and Referee 2 must be different';
  }
  return nextErrors;
}
