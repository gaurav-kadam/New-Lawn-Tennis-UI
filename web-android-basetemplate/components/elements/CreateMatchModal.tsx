import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  DimensionValue,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { useTheme } from '@/theme/themeContext';
import { usePlayers } from '@/hooks/useplayers';

import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import RadioGroup from '../ui/RadioGroup';
import Select from '../ui/Select';
import DatePicker from '../ui/DatePicker';
import TimePicker from '../ui/TimePicker';

/* =========================================================
   CONSTANTS
========================================================= */

const TABLET_BREAKPOINT = 768;

const DESKTOP_WIDTH = 520;

const MOBILE_WIDTH = '92%';

const STEP_COUNT = 3;

/* =========================================================
   TYPES
========================================================= */

type MatchType =
  | 'SINGLES'
  | 'DOUBLES';

type MatchFormat =
  | 'BEST_OF_3'
  | 'BEST_OF_5';

type Option = {
  label: string;
  value: string;
  teamName?: string;
};

interface MatchFormData {
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

  digitalScorerCode: string;

  referee1Code: string;
  referee2Code: string;
}

interface CreateMatchModalProps {
  visible: boolean;

  onClose: () => void;

  onSave: (
    payload: any
  ) => void;

  initialData: any;

  teams?: any[];

  officials?: any[];

  tournaments?: any[];
}

/* =========================================================
   DEFAULT FORM
========================================================= */

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

  digitalScorerCode: '',

  referee1Code: '',
  referee2Code: '',
};

/* =========================================================
   COMPONENT
========================================================= */

export default function CreateMatchModal({
  visible,
  onClose,
  onSave,
  initialData,

  teams = [],

  officials = [],

  tournaments = [],
}: CreateMatchModalProps) {
  const theme = useTheme();

  const {
    width,
  } = useWindowDimensions();

  const {
    players = [],
  } = usePlayers();

  const isMobile =
    width < TABLET_BREAKPOINT;

  const modalWidth: DimensionValue =
    isMobile
      ? MOBILE_WIDTH
      : DESKTOP_WIDTH;

  /* =======================================================
     STATE
  ======================================================= */

  const [
    currentStep,
    setCurrentStep,
  ] = useState(1);

  const [
    formData,
    setFormData,
  ] = useState<MatchFormData>({
    ...EMPTY_FORM,
  });

  const [
    errors,
    setErrors,
  ] = useState<
    Record<string, string>
  >({});

  /* =======================================================
     DATE HELPERS
  ======================================================= */
const convertToDate = (value: string) => {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.split('-');

  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  return Number.isNaN(date.getTime())
    ? undefined
    : date;
};

const convertToDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

  /* =======================================================
     TEAM NAME
  ======================================================= */

  const getTeamName = (
    code?: string
  ) => {
    if (!code) {
      return '';
    }

    const team =
      teams.find(
        (item: any) =>
          String(
            item?.team_code ??
              item?.id ??
              ''
          ) ===
          String(code)
      );

    return (
      team?.team_name ??
      team?.teamName ??
      ''
    );
  };

  /* =======================================================
     RESET / LOAD FORM
  ======================================================= */

  useEffect(() => {
    if (!visible) {
      return;
    }

    const team1Code =
      String(
        initialData?.team1_code ??
          initialData?.team1_id ??
          ''
      );

    const team2Code =
      String(
        initialData?.team2_code ??
          initialData?.team2_id ??
          ''
      );

    const matchType =
      String(
        initialData?.match_type ??
          initialData?.matchType ??
          'SINGLES'
      ).toUpperCase() ===
      'DOUBLES'
        ? 'DOUBLES'
        : 'SINGLES';

    const matchFormat =
      String(
        initialData?.match_format ??
          initialData?.matchFormat ??
          'BEST_OF_3'
      ).toUpperCase() ===
      'BEST_OF_5'
        ? 'BEST_OF_5'
        : 'BEST_OF_3';

    setCurrentStep(1);

    setErrors({});

    setFormData({
      tournamentCode:
        String(
          initialData?.tournament_code ??
            initialData?.tournamentId ??
            initialData?.tournament_id ??
            ''
        ),

      matchDate:
        initialData?.matchDate ??
        initialData?.match_date ??
        '',

      matchTime:
        initialData?.matchTime ??
        initialData?.match_time ??
        '',

      courtNo:
        String(
          initialData?.courtNo ??
            initialData?.court_no ??
            ''
        ),

      matchNo:
        String(
          initialData?.matchNo ??
            initialData?.match_no ??
            ''
        ),

      ageCategory:
        initialData?.ageCategory ??
        initialData?.age_category ??
        'OPEN',

      gender:
        initialData?.gender ??
        'Men',

      matchType,

      matchFormat,

      team1Code:
        team1Code ===
        'undefined'
          ? ''
          : team1Code,

      team1:
        initialData?.team1 ??
        getTeamName(
          team1Code
        ),

      team2Code:
        team2Code ===
        'undefined'
          ? ''
          : team2Code,

      team2:
        initialData?.team2 ??
        getTeamName(
          team2Code
        ),

      player1:
        String(
          initialData?.player1 ??
            initialData?.player1_code ??
            initialData?.player1_id ??
            ''
        ),

      player2:
        String(
          initialData?.player2 ??
            initialData?.player2_code ??
            initialData?.player2_id ??
            ''
        ),

      player3:
        String(
          initialData?.player3 ??
            initialData?.player3_code ??
            initialData?.player3_id ??
            ''
        ),

      player4:
        String(
          initialData?.player4 ??
            initialData?.player4_code ??
            initialData?.player4_id ??
            ''
        ),

      digitalScorerCode:
        String(
          initialData?.digital_scorer_code ??
            initialData?.digital_scorer_id ??
            initialData?.digitalScorer ??
            ''
        ),

      referee1Code:
        String(
          initialData?.referee_1_code ??
            initialData?.referee_1_id ??
            initialData?.referee1 ??
            ''
        ),

      referee2Code:
        String(
          initialData?.referee_2_code ??
            initialData?.referee_2_id ??
            initialData?.referee2 ??
            ''
        ),
    });
  }, [
    visible,
    initialData,
    teams,
  ]);

  /* =======================================================
     UPDATE FIELD
  ======================================================= */

  const update = (
    field: keyof MatchFormData,
    value: string
  ) => {
    setFormData(
      previous => ({
        ...previous,

        [field]: value,
      })
    );

    if (errors[field]) {
      setErrors(
        previous => ({
          ...previous,

          [field]: '',
        })
      );
    }
  };

  /* =======================================================
     TEAM OPTIONS
  ======================================================= */

  const teamOptions =
    useMemo<Option[]>(
      () =>
        teams
          .filter(
            (team: any) =>
              Boolean(
                team?.team_code ??
                  team?.id
              )
          )
          .map(
            (team: any) => {
              const name =
                team?.team_name ??
                team?.teamName ??
                '';

              const shortName =
                team?.short_name ??
                team?.shortName ??
                '';

              return {
                label:
                  shortName
                    ? `${name} (${shortName})`
                    : name,

                value: String(
                  team?.team_code ??
                    team?.id
                ),

                teamName: name,
              };
            }
          ),
      [teams]
    );

  /* =======================================================
     TOURNAMENT OPTIONS
  ======================================================= */

  const tournamentOptions =
    useMemo<Option[]>(
      () =>
        tournaments
          .filter(
            (item: any) =>
              item?.tournament_code
          )
          .map(
            (item: any) => ({
              label:
                item?.name ??
                item?.tournament_name ??
                item?.title ??
                `Tournament ${item.tournament_code}`,

              value: String(
                item.tournament_code
              ),
            })
          ),
      [tournaments]
    );

  /* =======================================================
     GLOBAL PLAYER OPTIONS

     IMPORTANT:
     Players are intentionally NOT filtered by team.

     The Players module is independent from Teams.
  ======================================================= */

  const playerOptions =
    useMemo<Option[]>(
      () =>
        players
          .map(
            (player: any) => {
              const code =
                player?.player_code ??
                player?.playerCode ??
                player?.id;

              if (
                code ===
                  undefined ||
                code === null
              ) {
                return null;
              }

              const fullName =
                `${player?.first_name ?? ''} ${
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
                label:
                  name ||
                  `Player ${code}`,

                value: String(
                  code
                ),
              };
            }
          )
          .filter(
            Boolean
          ) as Option[],
      [players]
    );

    const getPlayerName = (
  playerCode: string
): string => {
  if (!playerCode) {
    return '';
  }

  const player = players.find(
    player => {
      const code =
        player.player_code ??
        player.id;

      return (
        String(code) ===
        String(playerCode)
      );
    }
  );

  return player?.player_name ?? '';
};

const getAvailablePlayers = (
  currentPlayer: string
): Option[] => {
  const selectedPlayers =
    new Set(
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
    selectedPlayers.delete(
      currentPlayer
    );
  }

  return playerOptions.filter(
    player =>
      !selectedPlayers.has(
        player.value
      )
  );
};
  /* =======================================================
     OFFICIAL HELPERS
  ======================================================= */

  const getOfficialName = (
    official: any
  ) => {
    const fullName =
      `${official?.first_name ?? ''} ${
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

  const getOfficialRole = (
    official: any
  ) =>
    official?.role ??
    official?.official_role ??
    official?.designation ??
    'Official';

  /* =======================================================
     ALL OFFICIAL OPTIONS
  ======================================================= */

  const officialOptions =
    useMemo<Option[]>(
      () =>
        officials
          .filter(
            (official: any) =>
              official?.official_code ??
              official?.id
          )
          .map(
            (official: any) => ({
              label: `${getOfficialName(
                official
              )} (${getOfficialRole(
                official
              )})`,

              value: String(official.id),
            })
          ),
      [officials]
    );

  /* =======================================================
     REFEREE OPTIONS
  ======================================================= */

  const refereeOptions =
    useMemo<Option[]>(
      () =>
        officials
          .filter(
            (official: any) =>
              getOfficialRole(
                official
              )
                .toLowerCase()
                .includes(
                  'referee'
                )
          )
          .filter(
            (official: any) =>
              official?.official_code ??
              official?.id
          )
          .map(
            (official: any) => ({
              label: `${getOfficialName(
                official
              )} (${getOfficialRole(
                official
              )})`,

              value: String(
                official?.official_code ??
                  official?.id
              ),
            })
          ),
      [officials]
    );

  /* =======================================================
     SCORER OPTIONS
  ======================================================= */

  const scorerOptions =
    useMemo<Option[]>(
      () =>
        officials
          .filter(
            (official: any) =>
              getOfficialRole(
                official
              )
                .toLowerCase()
                .includes(
                  'scorer'
                )
          )
          .filter(
            (official: any) =>
              official?.official_code ??
              official?.id
          )
          .map(
            (official: any) => ({
              label: `${getOfficialName(
                official
              )} (${getOfficialRole(
                official
              )})`,

              value: String(
                official?.official_code ??
                  official?.id
              ),
            })
          ),
      [officials]
    );

  /* =======================================================
     OFFICIAL DUPLICATE PREVENTION
  ======================================================= */

  const selectedOfficials =
    new Set(
      [
        formData.digitalScorerCode,
        formData.referee1Code,
        formData.referee2Code,
      ].filter(Boolean)
    );

  const availableOfficials = (
    currentValue: string,
    options: Option[]
  ) =>
    options.filter(
      option =>
        !selectedOfficials.has(
          option.value
        ) ||
        option.value ===
          currentValue
    );

  /* =======================================================
     TEAM CHANGE
  ======================================================= */

  const handleTeamChange = (
    teamNumber: 1 | 2,
    code: string
  ) => {
    const selectedTeam =
      teamOptions.find(
        team =>
          team.value === code
      );

    const teamName =
      selectedTeam?.teamName ??
      '';

    if (
      teamNumber === 1
    ) {
      setFormData(
        previous => ({
          ...previous,

          team1Code: code,

          team1: teamName,

          player1: '',

          player2: '',
        })
      );

      setErrors(
        previous => ({
          ...previous,

          team1Code: '',
        })
      );

      return;
    }

    setFormData(
      previous => ({
        ...previous,

        team2Code: code,

        team2: teamName,

        player3: '',

        player4: '',
      })
    );

    setErrors(
      previous => ({
        ...previous,

        team2Code: '',
      })
    );
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

  const validateCurrentStep =
    () => {
      const nextErrors: Record<
        string,
        string
      > = {};

      /* -----------------------------
         STEP 1
      ----------------------------- */

      if (
        currentStep === 1
      ) {
        if (
          !formData.tournamentCode
        ) {
          nextErrors.tournamentCode =
            'Select Tournament';
        }

        if (
          !formData.matchDate
        ) {
          nextErrors.matchDate =
            'Select Date';
        }

        if (
          !formData.matchTime
        ) {
          nextErrors.matchTime =
            'Select Time';
        }

        if (
          !formData.courtNo
        ) {
          nextErrors.courtNo =
            'Enter Court Number';
        } else if (
          !/^\d+$/.test(
            formData.courtNo
          ) ||
          Number(
            formData.courtNo
          ) <= 0
        ) {
          nextErrors.courtNo =
            'Enter a valid Court Number';
        }

        if (
          !formData.matchNo
        ) {
          nextErrors.matchNo =
            'Enter Match Number';
        }

        if (
          !formData.ageCategory
        ) {
          nextErrors.ageCategory =
            'Select Age Category';
        }

        if (
          !formData.gender
        ) {
          nextErrors.gender =
            'Select Gender';
        }

        if (
          !formData.matchType
        ) {
          nextErrors.matchType =
            'Select Match Type';
        }

        if (
          !formData.matchFormat
        ) {
          nextErrors.matchFormat =
            'Select Match Format';
        }
      }

      /* -----------------------------
         STEP 2
      ----------------------------- */

      if (
        currentStep === 2
      ) {
        if (
          !formData.team1Code
        ) {
          nextErrors.team1Code =
            'Select Team 1';
        }

        if (
          !formData.team2Code
        ) {
          nextErrors.team2Code =
            'Select Team 2';
        }

        if (
          formData.team1Code &&
          formData.team2Code &&
          formData.team1Code ===
            formData.team2Code
        ) {
          nextErrors.team2Code =
            'Team 1 and Team 2 must be different';
        }

        if (
          !formData.player1
        ) {
          nextErrors.player1 =
            'Select Player';
        }

        if (
          !formData.player3
        ) {
          nextErrors.player3 =
            'Select Player';
        }

        if (
          formData.matchType ===
          'DOUBLES'
        ) {
          if (
            !formData.player2
          ) {
            nextErrors.player2 =
              'Select Player 2';
          }

          if (
            !formData.player4
          ) {
            nextErrors.player4 =
              'Select Player 2';
          }

          const playersSelected =
            [
              formData.player1,
              formData.player2,
              formData.player3,
              formData.player4,
            ].filter(Boolean);

          if (
            new Set(
              playersSelected
            ).size !==
            playersSelected.length
          ) {
            nextErrors.player4 =
              'Players must be different';
          }
        }
      }

      /* -----------------------------
         STEP 3
      ----------------------------- */

      if (
        currentStep === 3
      ) {
        if (
          !formData.digitalScorerCode
        ) {
          nextErrors.digitalScorerCode =
            'Select Digital Scorer';
        }

        if (
          !formData.referee1Code
        ) {
          nextErrors.referee1Code =
            'Select Referee 1';
        }

        if (
          !formData.referee2Code
        ) {
          nextErrors.referee2Code =
            'Select Referee 2';
        }

        if (
          formData.referee1Code &&
          formData.referee2Code &&
          formData.referee1Code ===
            formData.referee2Code
        ) {
          nextErrors.referee2Code =
            'Referee 1 and Referee 2 must be different';
        }
      }

      setErrors(
        nextErrors
      );

      return (
        Object.keys(
          nextErrors
        ).length === 0
      );
    };

  /* =======================================================
     NEXT
  ======================================================= */

  const nextStep = () => {
    if (
      !validateCurrentStep()
    ) {
      return;
    }

    if (
      currentStep <
      STEP_COUNT
    ) {
      setCurrentStep(
        step =>
          step + 1
      );
    }
  };

  /* =======================================================
     BACK
  ======================================================= */

  const previousStep = () => {
    setErrors({});

    if (
      currentStep > 1
    ) {
      setCurrentStep(
        step =>
          step - 1
      );
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
const player1Name =
  getPlayerName(
    formData.player1
  );

const player2Name =
  getPlayerName(
    formData.player3
  );

if (!player1Name) {
  setErrors({
    player1:
      'Selected Player 1 was not found',
  });

  return;
}

if (!player2Name) {
  setErrors({
    player3:
      'Selected Player 2 was not found',
  });

  return;
}
  console.log(
    'SELECTED PLAYER 1:',
    {
      code: formData.player1,
      name: player1Name,
    }
  );

  console.log(
    'SELECTED PLAYER 2:',
    {
      code: formData.player3,
      name: player2Name,
    }
  );

  const payload = {
    tournament_code:
      formData.tournamentCode,

    match_date:
      formData.matchDate,

    match_time:
      formData.matchTime,

    court_no:
      formData.courtNo,

    match_no:
      formData.matchNo,

    age_category:
      formData.ageCategory,

    gender:
      formData.gender,

    match_type:
      formData.matchType,

    match_format:
      formData.matchFormat,

    team1_code:
      formData.team1Code,

    team2_code:
      formData.team2Code,

    team1:
      formData.team1,

    team2:
      formData.team2,

    /*
     * IMPORTANT
     * Backend requires these two fields.
     */
    player1_name:
      player1Name,

    player2_name:
      player2Name,

    /*
     * Keep player codes as well.
     */
    player1:
      formData.player1,

    player2:
      formData.matchType ===
      'DOUBLES'
        ? formData.player2
        : null,

    player3:
      formData.player3,

    player4:
      formData.matchType ===
      'DOUBLES'
        ? formData.player4
        : null,

    digital_scorer_id:
      Number(formData.digitalScorerCode),
      
    referee_1_id:
      Number(formData.referee1Code),
      
    referee_2_id:
      Number(formData.referee2Code),

    is_active:
      initialData?.is_active ??
      true,

    is_complete:
      initialData?.is_complete ??
      false,
  };

  console.log(
    'FINAL CREATE MATCH PAYLOAD:',
    JSON.stringify(
      payload,
      null,
      2
    )
  );

  onSave(payload);
};
  /* =======================================================
     STEP LABELS
  ======================================================= */

  const stepLabels = [
    'Match Details',
    'Teams & Players',
    'Officials',
  ];

  /* =======================================================
     STEP 1
  ======================================================= */

  const renderStep1 =
    () => (
      <>
        <Select
          label="Tournament"
          value={
            formData.tournamentCode
          }
          onChange={(
            value: string
          ) =>
            update(
              'tournamentCode',
              value
            )
          }
          options={
            tournamentOptions
          }
          error={
            errors.tournamentCode
          }
        />

        <View
          style={[
            styles.row,
            isMobile &&
              styles.column,
          ]}
        >
          <View
            style={styles.flex}
          >
            <DatePicker
              label="Date"
              value={convertToDate(
                formData.matchDate
              )}
              onChange={date =>
                update(
                  'matchDate',
                  convertToDateString(
                    date
                  )
                )
              }
              error={
                errors.matchDate
              }
            />
          </View>

          <View
            style={styles.flex}
          >
            <TimePicker
              label="Time"
              value={
                formData.matchTime
              }
              onChange={(
                value: string
              ) =>
                update(
                  'matchTime',
                  value
                )
              }
              error={
                errors.matchTime
              }
            />
          </View>
        </View>

        <View
          style={[
            styles.row,
            isMobile &&
              styles.column,
          ]}
        >
          <View
            style={styles.flex}
          >
            <Input
              label="Court No."
              placeholder="e.g. 1"
              type="number"
              value={
                formData.courtNo
              }
              onChangeText={(
                value: string
              ) =>
                update(
                  'courtNo',
                  value.replace(
                    /[^0-9]/g,
                    ''
                  )
                )
              }
              error={
                errors.courtNo
              }
            />
          </View>

          <View
            style={styles.flex}
          >
            <Input
              label="Match No."
              placeholder="e.g. M01"
              value={
                formData.matchNo
              }
              onChangeText={(
                value: string
              ) =>
                update(
                  'matchNo',
                  value
                )
              }
              error={
                errors.matchNo
              }
            />
          </View>
        </View>

        <View
          style={[
            styles.row,
            isMobile &&
              styles.column,
          ]}
        >
          <View
            style={styles.flex}
          >
            <RadioGroup
              label="Gender"
              value={
                formData.gender
              }
              onChange={(
                value: string
              ) =>
                update(
                  'gender',
                  value
                )
              }
              options={[
                {
                  label: 'Men',
                  value: 'Men',
                },
                {
                  label: 'Women',
                  value: 'Women',
                },
              ]}
              error={
                errors.gender
              }
            />
          </View>

          <View
            style={styles.flex}
          >
            <Select
              label="Age Category"
              value={
                formData.ageCategory
              }
              onChange={(
                value: string
              ) =>
                update(
                  'ageCategory',
                  value
                )
              }
              options={[
                {
                  label:
                    'Under 15',
                  value:
                    'UNDER_15',
                },
                {
                  label:
                    'Under 19',
                  value:
                    'UNDER_19',
                },
                {
                  label: 'Open',
                  value: 'OPEN',
                },
              ]}
              error={
                errors.ageCategory
              }
            />
          </View>
        </View>

        <View
          style={styles.optionBox}
        >
          <RadioGroup
            label="Match Type"
            value={
              formData.matchType
            }
            onChange={(
              value: string
            ) =>
              update(
                'matchType',
                value as MatchType
              )
            }
            options={[
              {
                label: 'Singles',
                value:
                  'SINGLES',
              },
              {
                label: 'Doubles',
                value:
                  'DOUBLES',
              },
            ]}
            error={
              errors.matchType
            }
          />
        </View>

        <View
          style={styles.optionBox}
        >
          <RadioGroup
            label="Match Format"
            value={
              formData.matchFormat
            }
            onChange={(
              value: string
            ) =>
              update(
                'matchFormat',
                value as MatchFormat
              )
            }
            options={[
              {
                label:
                  'Best of 3',
                value:
                  'BEST_OF_3',
              },
              {
                label:
                  'Best of 5',
                value:
                  'BEST_OF_5',
              },
            ]}
            error={
              errors.matchFormat
            }
          />
        </View>
      </>
    );

  /* =======================================================
     STEP 2
  ======================================================= */

  const renderStep2 =
    () => (
      <>
        {/* TEAM 1 */}

        <View
          style={styles.teamBox}
        >
          <Text
            style={[
              styles.teamTitle,
              {
                color:
                  theme.colors
                    .textPrimary,
              },
            ]}
          >
            Team 1
          </Text>

          <Select
            label="Team 1"
            value={
              formData.team1Code
            }
            onChange={(
              value: string
            ) =>
              handleTeamChange(
                1,
                value
              )
            }
            options={
              teamOptions.filter(
                team =>
                  team.value !==
                  formData.team2Code
              )
            }
            error={
              errors.team1Code
            }
          />

          <Select
            label={
              formData.matchType ===
              'DOUBLES'
                ? 'Player 1'
                : 'Player'
            }
            value={
              formData.player1
            }
            onChange={(
              value: string
            ) =>
              update(
                'player1',
                value
              )
            }
            options={getAvailablePlayers(
              formData.player1
            )}
            error={
              errors.player1
            }
          />

          {formData.matchType ===
            'DOUBLES' && (
            <Select
              label="Player 2"
              value={formData.player2}
              onChange={(value: string) =>
                update(
                  'player2',
                  value
                )
              }
              options={getAvailablePlayers(
                formData.player2
              )}
              error={errors.player2}
            />
          )}  
        </View>
        {/* VS */}

        <View
          style={styles.vs}
        >
          <Text
            style={[
              styles.vsText,
              {
                color:
                  theme.colors
                    .textSecondary,
              },
            ]}
          >
            VS
          </Text>
        </View>

        {/* TEAM 2 */}

        <View
          style={styles.teamBox}
        >
          <Text
            style={[
              styles.teamTitle,
              {
                color:
                  theme.colors
                    .textPrimary,
              },
            ]}
          >
            Team 2
          </Text>

          <Select
            label="Team 2"
            value={
              formData.team2Code
            }
            onChange={(
              value: string
            ) =>
              handleTeamChange(
                2,
                value
              )
            }
            options={
              teamOptions.filter(
                team =>
                  team.value !==
                  formData.team1Code
              )
            }
            error={
              errors.team2Code
            }
          />

          <Select
            label={
              formData.matchType ===
              'DOUBLES'
                ? 'Player 1'
                : 'Player'
            }
            value={
              formData.player3
            }
            onChange={(
              value: string
            ) =>
              update(
                'player3',
                value
              )
            }
            options={
              playerOptions.filter(
                player =>
                  player.value !==
                  formData.player4
              )
            }
            error={
              errors.player3
            }
          />

          {formData.matchType ===
            'DOUBLES' && (
            <Select
              label="Player 2"
              value={
                formData.player4
              }
              onChange={(
                value: string
              ) =>
                update(
                  'player4',
                  value
                )
              }
              options={
                playerOptions.filter(
                  player =>
                    player.value !==
                    formData.player3
                )
              }
              error={
                errors.player4
              }
            />
          )}
        </View>
      </>
    );

  /* =======================================================
     STEP 3
  ======================================================= */

  const renderStep3 =
    () => (
      <>
        <Text
          style={[
            styles.sectionTitle,
            {
              color:
                theme.colors
                  .textPrimary,
            },
          ]}
        >
          Match Officials
        </Text>

        <Text
          style={[
            styles.sectionDescription,
            {
              color:
                theme.colors
                  .textSecondary,
            },
          ]}
        >
          Assign the officials responsible
          for this match.
        </Text>

        <Select
          label="Digital Scorer"
          value={
            formData.digitalScorerCode
          }
          onChange={(
            value: string
          ) =>
            update(
              'digitalScorerCode',
              value
            )
          }
          options={availableOfficials(
            formData.digitalScorerCode,
            scorerOptions.length
              ? scorerOptions
              : officialOptions
          )}
          error={
            errors.digitalScorerCode
          }
        />

        <Select
          label="Referee 1"
          value={
            formData.referee1Code
          }
          onChange={(
            value: string
          ) =>
            update(
              'referee1Code',
              value
            )
          }
          options={availableOfficials(
            formData.referee1Code,
            refereeOptions.length
              ? refereeOptions
              : officialOptions
          )}
          error={
            errors.referee1Code
          }
        />

        <Select
          label="Referee 2"
          value={
            formData.referee2Code
          }
          onChange={(
            value: string
          ) =>
            update(
              'referee2Code',
              value
            )
          }
          options={availableOfficials(
            formData.referee2Code,
            refereeOptions.length
              ? refereeOptions
              : officialOptions
          )}
          error={
            errors.referee2Code
          }
        />
      </>
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={
        handleClose
      }
    >
      <View
        style={styles.overlay}
      >
        <View
          style={{
            width: modalWidth,
            maxWidth: '100%',
          }}
        >
          <Card variant="elevated">
            <View
              style={styles.container}
            >
              {/* HEADER */}

              <View
                style={
                  styles.header
                }
              >
                <View
                  style={styles.headerText}
                >
                  <Text
                    style={[
                      styles.title,
                      {
                        color:
                          theme
                            .colors
                            .textPrimary,
                      },
                    ]}
                  >
                    {initialData
                      ? 'Update Match'
                      : 'Schedule Match'}
                  </Text>

                  <Text
                    style={[
                      styles.subtitle,
                      {
                        color:
                          theme
                            .colors
                            .textSecondary,
                      },
                    ]}
                  >
                    Step {currentStep}{' '}
                    of {STEP_COUNT} —{' '}
                    {
                      stepLabels[
                        currentStep -
                          1
                      ]
                    }
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={
                    handleClose
                  }
                  style={
                    styles.closeButton
                  }
                >
                  <Text
                    style={[
                      styles.closeText,
                      {
                        color:
                          theme
                            .colors
                            .textSecondary,
                      },
                    ]}
                  >
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>

              {/* PROGRESS */}

              <View
                style={
                  styles.progressRow
                }
              >
                {stepLabels.map(
                  (
                    label,
                    index
                  ) => (
                    <View
                      key={label}
                      style={
                        styles.progressItem
                      }
                    >
                      <View
                        style={[
                          styles.progressBar,
                          {
                            backgroundColor:
                              currentStep >=
                              index +
                                1
                                ? theme
                                    .colors
                                    .primary
                                : '#e2e8f0',
                          },
                        ]}
                      />

                      <Text
                        style={[
                          styles.progressLabel,
                          {
                            color:
                              currentStep >=
                              index +
                                1
                                ? theme
                                    .colors
                                    .primary
                                : theme
                                    .colors
                                    .textSecondary,
                          },
                        ]}
                      >
                        {label}
                      </Text>
                    </View>
                  )
                )}
              </View>

              {/* CONTENT */}

              <ScrollView
                showsVerticalScrollIndicator={
                  false
                }
                style={
                  styles.scroll
                }
                contentContainerStyle={
                  styles.scrollContent
                }
              >
                {currentStep ===
                  1 &&
                  renderStep1()}

                {currentStep ===
                  2 &&
                  renderStep2()}

                {currentStep ===
                  3 &&
                  renderStep3()}
              </ScrollView>

              {/* FOOTER */}

              <View
                style={
                  styles.footer
                }
              >
                <Button
                  title={
                    currentStep ===
                    1
                      ? 'Cancel'
                      : 'Back'
                  }
                  variant="danger"
                  onPress={
                    currentStep ===
                    1
                      ? handleClose
                      : previousStep
                  }
                />

                <Button
                  title={
                    currentStep ===
                    STEP_COUNT
                      ? initialData
                        ? 'Update'
                        : 'Create'
                      : 'Next Step'
                  }
                  onPress={
                    handleSave
                  }
                />
              </View>
            </View>
          </Card>
        </View>
      </View>
    </Modal>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    backgroundColor:
      'rgba(0,0,0,0.45)',

    padding: 20,
  },

  container: {
    paddingHorizontal: 16,

    paddingVertical: 16,
  },

  header: {
    flexDirection: 'row',

    justifyContent:
      'space-between',

    alignItems: 'flex-start',

    marginBottom: 10,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 22,

    fontWeight: '700',
  },

  subtitle: {
    marginTop: 3,

    fontSize: 12,
  },

  closeButton: {
    padding: 4,
  },

  closeText: {
    fontSize: 20,
  },

  progressRow: {
    flexDirection: 'row',

    gap: 8,

    marginBottom: 16,
  },

  progressItem: {
    flex: 1,
  },

  progressBar: {
    height: 4,

    borderRadius: 2,
  },

  progressLabel: {
    marginTop: 4,

    fontSize: 9,

    textAlign: 'center',
  },

  scroll: {
    maxHeight: 430,
  },

  scrollContent: {
    paddingBottom: 4,

    gap: 12,
  },

  row: {
    flexDirection: 'row',

    gap: 12,
  },

  column: {
    flexDirection: 'column',
  },

  flex: {
    flex: 1,
  },

  optionBox: {
    padding: 12,

    borderWidth: 1,

    borderColor: '#dbe3ef',

    borderRadius: 10,
  },

  teamBox: {
    padding: 12,

    borderWidth: 1,

    borderColor: '#dbe3ef',

    borderRadius: 10,

    gap: 4,
  },

  teamTitle: {
    fontSize: 15,

    fontWeight: '700',

    marginBottom: 4,
  },

  vs: {
    alignItems: 'center',

    paddingVertical: 2,
  },

  vsText: {
    fontSize: 15,

    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 15,

    fontWeight: '700',

    marginBottom: 2,
  },

  sectionDescription: {
    fontSize: 12,

    marginBottom: 4,
  },

  footer: {
    flexDirection: 'row',

    justifyContent:
      'flex-end',

    alignItems: 'center',

    gap: 8,

    marginTop: 16,
  },
});