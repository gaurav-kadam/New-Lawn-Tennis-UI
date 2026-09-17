import React from 'react';
import { Text } from 'react-native';
import { useTheme } from '@/theme/themeContext';
import Select from '../../ui/Select';
import { styles } from './CreateMatchModal.styles';
import type { CreateMatchForm } from './useCreateMatchForm';

type Props = Pick<CreateMatchForm, 'formData' | 'errors' | 'officialOptions' | 'refereeOptions' | 'scorerOptions' | 'availableOfficials' | 'update'>;

export default function CreateMatchStep3({
  formData, errors, officialOptions, refereeOptions, scorerOptions, availableOfficials, update,
}: Props) {
  const theme = useTheme();
  return (
    <>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: theme.colors.textPrimary,
          },
        ]}
      >
        Match Officials
      </Text>

      <Text
        style={[
          styles.sectionDescription,
          {
            color: theme.colors.textSecondary,
          },
        ]}
      >
        Assign the officials responsible for this match.
      </Text>

      <Select
        label="Digital Scorer"
        value={formData.digitalScorerCode}
        onChange={(value: string) => update('digitalScorerCode', value)}
        options={availableOfficials(
          formData.digitalScorerCode,
          scorerOptions.length ? scorerOptions : officialOptions
        )}
        error={errors.digitalScorerCode}
      />

      <Select
        label="Referee 1"
        value={formData.referee1Code}
        onChange={(value: string) => update('referee1Code', value)}
        options={availableOfficials(
          formData.referee1Code,
          refereeOptions.length ? refereeOptions : officialOptions
        )}
        error={errors.referee1Code}
      />

      <Select
        label="Referee 2"
        value={formData.referee2Code}
        onChange={(value: string) => update('referee2Code', value)}
        options={availableOfficials(
          formData.referee2Code,
          refereeOptions.length ? refereeOptions : officialOptions
        )}
        error={errors.referee2Code}
      />
    </>
  );
}

