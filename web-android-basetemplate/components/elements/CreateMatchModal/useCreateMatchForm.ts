import { useEffect, useState } from 'react';
import { usePlayers } from '@/hooks/useplayers';

import useCreateMatchFormOptions from './useCreateMatchFormOptions';
import { convertToDate, convertToDateString, normalizeInitialData, prepareSubmission } from './createMatchForm.utils';
import { validateStep1, validateStep2, validateStep3 } from './createMatchForm.validation';

export const STEP_COUNT = 3;

export type MatchType = 'SINGLES' | 'DOUBLES';

export type MatchFormat = 'BEST_OF_3' | 'BEST_OF_5';

export type Option = {
  label: string;
  value: string;
  teamName?: string;
};

export interface MatchFormData {
  tournamentCode: string;

  matchDate: string;
  matchTime: string;

  courtNo: string;
  matchNo: string;

  ageCategory: string;
  gender: string;

  matchType: MatchType;
  matchFormat: MatchFormat;

  team1Code: string;
  team1: string;

  team2Code: string;
  team2: string;

  player1: string;
  player2: string;

  player3: string;
  player4: string;

  firstServer: string;
  opposingFirstServer: string;

  digitalScorerCode: string;

  referee1Code: string;
  referee2Code: string;
}

export interface CreateMatchModalProps {
  visible: boolean;

  onClose: () => void;

  onSave: (payload: any) => void;

  initialData: any;

  teams?: any[];

  officials?: any[];

  tournaments?: any[];
}

const EMPTY_FORM: MatchFormData = {
  tournamentCode: '',

  matchDate: '',
  matchTime: '',

  courtNo: '',
  matchNo: '',

  ageCategory: 'OPEN',
  gender: 'Men',

  matchType: 'SINGLES',
  matchFormat: 'BEST_OF_3',

  team1Code: '',
  team1: '',

  team2Code: '',
  team2: '',

  player1: '',
  player2: '',

  player3: '',
  player4: '',

  firstServer: '',
  opposingFirstServer: '',

  digitalScorerCode: '',

  referee1Code: '',
  referee2Code: '',
};

export default function useCreateMatchForm({
  visible,
  onClose,
  onSave,
  initialData,
  teams = [],
  officials = [],
  tournaments = [],
}: CreateMatchModalProps) {
  const { players = [] } = usePlayers();

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<MatchFormData>({
    ...EMPTY_FORM,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!visible) return;
    setCurrentStep(1);
    setErrors({});
    setFormData(normalizeInitialData(initialData, teams));
  }, [visible, initialData, teams]);

  /* =======================================================
     UPDATE FIELD
  ======================================================= */

  const update = (field: keyof MatchFormData, value: string) => {
    setFormData((previous) => {
      const next = {
        ...previous,
        [field]: value,
      };

      // Player changes invalidate both opening-server selections. The
      // choices are re-made from the newly selected player names.
      if (
        field === 'player1' ||
        field === 'player2' ||
        field === 'player3' ||
        field === 'player4'
      ) {
        next.firstServer = '';
        next.opposingFirstServer = '';
      }

      return next;
    });

    if (errors[field]) {
      setErrors((previous) => ({
        ...previous,

        [field]: '',
      }));
    }
  };

  const { teamOptions, tournamentOptions, playerOptions, officialOptions, refereeOptions, scorerOptions, getAvailablePlayers, availableOfficials } =
    useCreateMatchFormOptions(teams, tournaments, players, officials, formData);

  /* =======================================================
     TEAM CHANGE
  ======================================================= */

  const handleTeamChange = (teamNumber: 1 | 2, code: string) => {
    const selectedTeam = teamOptions.find((team) => team.value === code);

    const teamName = selectedTeam?.teamName ?? '';

    if (teamNumber === 1) {
      setFormData((previous) => ({
        ...previous,

        team1Code: code,

        team1: teamName,

        player1: '',

        player2: '',

        firstServer: '',

        opposingFirstServer: '',
      }));

      setErrors((previous) => ({
        ...previous,

        team1Code: '',
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,

      team2Code: code,

      team2: teamName,

      player3: '',

      player4: '',

      firstServer: '',

      opposingFirstServer: '',
    }));

    setErrors((previous) => ({
      ...previous,

      team2Code: '',
    }));
  };

  /* =======================================================
     CLOSE
  ======================================================= */

  const handleClose = () => {
    setCurrentStep(1);

    setErrors({});

    setFormData({
      ...EMPTY_FORM,
    });

    onClose();
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateCurrentStep = () => {
    const nextErrors = currentStep === 1 ? validateStep1(formData)
      : currentStep === 2 ? validateStep2(formData)
      : currentStep === 3 ? validateStep3(formData) : {};
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };
  /* =======================================================
     NEXT
  ======================================================= */

  const nextStep = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < STEP_COUNT) {
      setCurrentStep((step) => step + 1);
    }
  };

  /* =======================================================
     BACK
  ======================================================= */

  const previousStep = () => {
    setErrors({});

    if (currentStep > 1) {
      setCurrentStep((step) => step - 1);
    }
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSave = () => {
    if (currentStep < STEP_COUNT) {
      nextStep();
      return;
    }

    if (!validateCurrentStep()) {
      return;
    }
    const result = prepareSubmission(formData, players, initialData);
    if (result.errors) {
      setErrors(result.errors);
      return;
    }
    const { payload, player1Name, player2Name } = result;

    console.log('SELECTED PLAYER 1:', {
      code: formData.player1,
      name: player1Name,
    });

    console.log('SELECTED PLAYER 2:', {
      code: formData.player3,
      name: player2Name,
    });

    console.log(
      'FINAL CREATE MATCH PAYLOAD:',
      JSON.stringify(payload, null, 2)
    );

    onSave(payload);
  };
  return {
    currentStep,
    formData,
    errors,
    convertToDate,
    convertToDateString,
    update,
    teamOptions,
    tournamentOptions,
    playerOptions,
    getAvailablePlayers,
    officialOptions,
    refereeOptions,
    scorerOptions,
    availableOfficials,
    handleTeamChange,
    handleClose,
    previousStep,
    handleSave,
  };
}

export type CreateMatchForm = ReturnType<typeof useCreateMatchForm>;
