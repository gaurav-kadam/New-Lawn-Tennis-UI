import React, {
  useEffect,
  useState,
} from 'react';

import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useTheme } from '@/theme/themeContext';
import { tokens } from '@/theme/token';

import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface CreatePlayerModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (payload: any) => Promise<void> | void;
  initialData?: any;
  teams?: any[];
}

export default function CreatePlayerModal({
  visible,
  onClose,
  onSave,
  initialData,
  teams = [],
}: CreatePlayerModalProps) {

  const theme = useTheme();

  const isEdit =
    Boolean(initialData);

  const [playerName, setPlayerName] =
    useState('');

  const [age, setAge] =
    useState('');

  const [gender, setGender] =
    useState('');

  const [weight, setWeight] =
    useState('');

  const [category, setCategory] =
    useState('');

  const [state, setState] =
    useState('');

  const [city, setCity] =
    useState('');

  const [mobile, setMobile] =
    useState('');

  const [ranking, setRanking] =
    useState('');

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {

    if (!visible) {
      return;
    }

    setPlayerName(
      initialData?.player_name ??
      ''
    );

    setAge(
      initialData?.age != null
        ? String(initialData.age)
        : ''
    );

    setGender(
      initialData?.gender ??
      ''
    );

    setWeight(
      initialData?.weight != null
        ? String(initialData.weight)
        : ''
    );

    setCategory(
      initialData?.category ??
      ''
    );

    setState(
      initialData?.state ??
      ''
    );

    setCity(
      initialData?.city ??
      ''
    );

    setMobile(
      initialData?.mobile ??
      ''
    );

    setRanking(
      initialData?.ranking != null
        ? String(initialData.ranking)
        : ''
    );

    setError(null);

  }, [
    visible,
    initialData,
  ]);

  const handleSave = async () => {

    setError(null);

    if (!playerName.trim()) {
      setError('Player name is required');
      return;
    }

    if (!gender) {
      setError('Gender is required');
      return;
    }

    if (!state.trim()) {
      setError('State is required');
      return;
    }

    if (!city.trim()) {
      setError('City is required');
      return;
    }

    try {

      setSaving(true);

      const payload = {
        player_name:
          playerName.trim(),

        age:
          age.trim()
            ? Number(age)
            : null,

        gender,

        weight:
          weight.trim()
            ? Number(weight)
            : null,

        category:
          category.trim() || null,

        state:
          state.trim(),

        city:
          city.trim(),

        mobile:
          mobile.trim() || null,

        ranking:
          ranking.trim()
            ? Number(ranking)
            : null,
      };

      await onSave(payload);

      onClose();

    } catch (err: any) {

      setError(
        err?.message ||
        'Failed to save player'
      );

    } finally {

      setSaving(false);

    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor:
            'rgba(0,0,0,0.45)',
          padding: 20,
        }}
      >

        <View
          style={{
            width: 520,
            maxWidth: '100%',
          }}
        >

          <Card variant="elevated">

            <View
              style={{
                paddingHorizontal: 24,
                paddingVertical: 20,
              }}
            >

              {/* HEADER */}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent:
                    'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >

                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '700',
                    color:
                      theme.colors.textPrimary,
                  }}
                >
                  {isEdit
                    ? 'Edit Player'
                    : 'Add Player'}
                </Text>

                <TouchableOpacity
                  onPress={onClose}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      color:
                        theme.colors.textSecondary,
                    }}
                  >
                    ✕
                  </Text>
                </TouchableOpacity>

              </View>

              <ScrollView
                style={{
                  maxHeight: 520,
                }}
                showsVerticalScrollIndicator={false}
              >

                <View
                  style={{
                    gap: tokens.spacing.md,
                  }}
                >

                  {/* PLAYER NAME */}

                  <Input
                    label="Player Name"
                    placeholder="Enter player name"
                    value={playerName}
                    onChangeText={
                      setPlayerName
                    }
                  />

                  {/* GENDER */}

                  <Select
                    label="Gender"
                    value={gender}
                    onChange={
                      (value: any) =>
                        setGender(value)
                    }
                    options={[
                      {
                        label: 'Male',
                        value: 'Male',
                      },
                      {
                        label: 'Female',
                        value: 'Female',
                      },
                    ]}
                  />

                  {/* AGE */}

                  <Input
                    label="Age"
                    placeholder="Enter age"
                    type="number"
                    value={age}
                    onChangeText={
                      (value: string) =>
                        setAge(
                          value.replace(
                            /[^0-9]/g,
                            ''
                          )
                        )
                    }
                  />

                  {/* WEIGHT */}

                  <Input
                    label="Weight"
                    placeholder="Enter weight"
                    type="number"
                    value={weight}
                    onChangeText={
                      (value: string) =>
                        setWeight(
                          value.replace(
                            /[^0-9.]/g,
                            ''
                          )
                        )
                    }
                  />

                  {/* CATEGORY */}

                  <Input
                    label="Category"
                    placeholder="e.g. Open"
                    value={category}
                    onChangeText={
                      setCategory
                    }
                  />

                  {/* STATE */}

                  <Input
                    label="State"
                    placeholder="Enter state"
                    value={state}
                    onChangeText={
                      setState
                    }
                  />

                  {/* CITY */}

                  <Input
                    label="City"
                    placeholder="Enter city"
                    value={city}
                    onChangeText={
                      setCity
                    }
                  />

                  {/* MOBILE */}

                  <Input
                    label="Mobile"
                    placeholder="Enter mobile number"
                    value={mobile}
                    onChangeText={
                      (value: string) =>
                        setMobile(
                          value.replace(
                            /[^0-9+]/g,
                            ''
                          )
                        )
                    }
                  />

                  {/* RANKING */}

                  <Input
                    label="Ranking"
                    placeholder="Enter ranking"
                    type="number"
                    value={ranking}
                    onChangeText={
                      (value: string) =>
                        setRanking(
                          value.replace(
                            /[^0-9]/g,
                            ''
                          )
                        )
                    }
                  />

                  {error ? (
                    <Text
                      style={{
                        color: '#ef4444',
                        fontSize: 13,
                      }}
                    >
                      {error}
                    </Text>
                  ) : null}

                </View>

              </ScrollView>

              {/* FOOTER */}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent:
                    'flex-end',
                  gap: 8,
                  marginTop: 20,
                }}
              >

                <Button
                  title="Cancel"
                  variant="danger"
                  onPress={onClose}
                  disabled={saving}
                />

                <Button
                  title={
                    saving
                      ? 'Saving...'
                      : isEdit
                        ? 'Update'
                        : 'Add Player'
                  }
                  onPress={handleSave}
                  disabled={saving}
                />

              </View>

            </View>

          </Card>

        </View>

      </View>
    </Modal>
  );
}