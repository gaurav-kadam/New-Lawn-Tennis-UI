import React from 'react';
import { DimensionValue, Modal, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useTheme } from '@/theme/themeContext';
import Button from '../ui/Button';
import Card from '../ui/Card';
import CreateMatchStep1 from './CreateMatchModal/CreateMatchStep1';
import CreateMatchStep2 from './CreateMatchModal/CreateMatchStep2';
import CreateMatchStep3 from './CreateMatchModal/CreateMatchStep3';
import useCreateMatchForm, { STEP_COUNT, type CreateMatchModalProps } from './CreateMatchModal/useCreateMatchForm';
import { styles } from './CreateMatchModal/CreateMatchModal.styles';

const TABLET_BREAKPOINT = 768;
const DESKTOP_WIDTH = 520;
const MOBILE_WIDTH = '92%';

export default function CreateMatchModal(props: CreateMatchModalProps) {
  const { visible, initialData } = props;
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isMobile = width < TABLET_BREAKPOINT;
  const modalWidth: DimensionValue = isMobile ? MOBILE_WIDTH : DESKTOP_WIDTH;
  const form = useCreateMatchForm(props);
  const { currentStep, handleClose, previousStep, handleSave } = form;
  const stepLabels = ['Match Details', 'Teams & Players', 'Officials'];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View
          style={{
            width: modalWidth,
            maxWidth: '100%',
          }}
        >
          <Card variant="elevated">
            <View style={styles.container}>
              {/* HEADER */}

              <View style={styles.header}>
                <View style={styles.headerText}>
                  <Text
                    style={[
                      styles.title,
                      {
                        color: theme.colors.textPrimary,
                      },
                    ]}
                  >
                    {initialData ? 'Update Match' : 'Schedule Match'}
                  </Text>

                  <Text
                    style={[
                      styles.subtitle,
                      {
                        color: theme.colors.textSecondary,
                      },
                    ]}
                  >
                    Step {currentStep} of {STEP_COUNT} —{' '}
                    {stepLabels[currentStep - 1]}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButton}
                >
                  <Text
                    style={[
                      styles.closeText,
                      {
                        color: theme.colors.textSecondary,
                      },
                    ]}
                  >
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>

              {/* PROGRESS */}

              <View style={styles.progressRow}>
                {stepLabels.map((label, index) => (
                  <View key={label} style={styles.progressItem}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          backgroundColor:
                            currentStep >= index + 1
                              ? theme.colors.primary
                              : '#e2e8f0',
                        },
                      ]}
                    />

                    <Text
                      style={[
                        styles.progressLabel,
                        {
                          color:
                            currentStep >= index + 1
                              ? theme.colors.primary
                              : theme.colors.textSecondary,
                        },
                      ]}
                    >
                      {label}
                    </Text>
                  </View>
                ))}
              </View>

              {/* CONTENT */}

              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
              >
                {currentStep === 1 && <CreateMatchStep1
                    formData={form.formData}
                    errors={form.errors}
                    tournamentOptions={form.tournamentOptions}
                    update={form.update}
                    convertToDate={form.convertToDate}
                    convertToDateString={form.convertToDateString}
                    isMobile={isMobile}
                  />}

                {currentStep === 2 && <CreateMatchStep2
                    formData={form.formData}
                    errors={form.errors}
                    teamOptions={form.teamOptions}
                    playerOptions={form.playerOptions}
                    getAvailablePlayers={form.getAvailablePlayers}
                    handleTeamChange={form.handleTeamChange}
                    update={form.update}
                  />}

                {currentStep === 3 && <CreateMatchStep3
                    formData={form.formData}
                    errors={form.errors}
                    officialOptions={form.officialOptions}
                    refereeOptions={form.refereeOptions}
                    scorerOptions={form.scorerOptions}
                    availableOfficials={form.availableOfficials}
                    update={form.update}
                  />}
              </ScrollView>

              {/* FOOTER */}

              <View style={styles.footer}>
                <Button
                  title={currentStep === 1 ? 'Cancel' : 'Back'}
                  variant="danger"
                  onPress={currentStep === 1 ? handleClose : previousStep}
                />

                <Button
                  title={
                    currentStep === STEP_COUNT
                      ? initialData
                        ? 'Update'
                        : 'Create'
                      : 'Next Step'
                  }
                  onPress={handleSave}
                />
              </View>
            </View>
          </Card>
        </View>
      </View>
    </Modal>
  );
}
