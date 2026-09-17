import React from 'react';
import { View } from 'react-native';
import Select from '../../ui/Select';
import Input from '../../ui/Input';
import RadioGroup from '../../ui/RadioGroup';
import DatePicker from '../../ui/DatePicker';
import TimePicker from '../../ui/TimePicker';
import { styles } from './CreateMatchModal.styles';
import type { CreateMatchForm, MatchType, MatchFormat } from './useCreateMatchForm';

type Props = Pick<CreateMatchForm, 'formData' | 'errors' | 'tournamentOptions' | 'update' | 'convertToDate' | 'convertToDateString'> & { isMobile: boolean };

export default function CreateMatchStep1({
  formData, errors, tournamentOptions, update, convertToDate, convertToDateString, isMobile,
}: Props) {
  return (
    <>
      <Select
        label="Tournament"
        value={formData.tournamentCode}
        onChange={(value: string) => update('tournamentCode', value)}
        options={tournamentOptions}
        error={errors.tournamentCode}
      />

      <View style={[styles.row, isMobile && styles.column]}>
        <View style={styles.flex}>
          <DatePicker
            label="Date"
            value={convertToDate(formData.matchDate)}
            onChange={(date) => update('matchDate', convertToDateString(date))}
            error={errors.matchDate}
          />
        </View>

        <View style={styles.flex}>
          <TimePicker
            label="Time"
            value={formData.matchTime}
            onChange={(value: string) => update('matchTime', value)}
            error={errors.matchTime}
          />
        </View>
      </View>

      <View style={[styles.row, isMobile && styles.column]}>
        <View style={styles.flex}>
          <Input
            label="Court No."
            placeholder="e.g. 1"
            type="number"
            value={formData.courtNo}
            onChangeText={(value: string) =>
              update('courtNo', value.replace(/[^0-9]/g, ''))
            }
            error={errors.courtNo}
          />
        </View>

        <View style={styles.flex}>
          <Input
            label="Match No."
            placeholder="e.g. M01"
            value={formData.matchNo}
            onChangeText={(value: string) => update('matchNo', value)}
            error={errors.matchNo}
          />
        </View>
      </View>

      <View style={[styles.row, isMobile && styles.column]}>
        <View style={styles.flex}>
          <RadioGroup
            label="Gender"
            value={formData.gender}
            onChange={(value: string) => update('gender', value)}
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
            error={errors.gender}
          />
        </View>

        <View style={styles.flex}>
          <Select
            label="Age Category"
            value={formData.ageCategory}
            onChange={(value: string) => update('ageCategory', value)}
            options={[
              {
                label: 'Under 15',
                value: 'UNDER_15',
              },
              {
                label: 'Under 19',
                value: 'UNDER_19',
              },
              {
                label: 'Open',
                value: 'OPEN',
              },
            ]}
            error={errors.ageCategory}
          />
        </View>
      </View>

      <View style={styles.optionBox}>
        <RadioGroup
          label="Match Type"
          value={formData.matchType}
          onChange={(value: string) => update('matchType', value as MatchType)}
          options={[
            {
              label: 'Singles',
              value: 'SINGLES',
            },
            {
              label: 'Doubles',
              value: 'DOUBLES',
            },
          ]}
          error={errors.matchType}
        />
      </View>

      <View style={styles.optionBox}>
        <RadioGroup
          label="Match Format"
          value={formData.matchFormat}
          onChange={(value: string) =>
            update('matchFormat', value as MatchFormat)
          }
          options={[
            {
              label: 'Best of 3',
              value: 'BEST_OF_3',
            },
            {
              label: 'Best of 5',
              value: 'BEST_OF_5',
            },
          ]}
          error={errors.matchFormat}
        />
      </View>
    </>
  );
}

