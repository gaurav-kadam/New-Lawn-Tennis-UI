import React from 'react';

import {
  ActivityIndicator,
  Modal,
  View,
} from 'react-native';

import { useTheme }
from '../../theme/themeContext';

import {
  useLoader,
} from '../../contexts/LoaderContext';

export default function Loader() {

  const theme = useTheme();

  const { loading } =
    useLoader();

  return (

    <Modal
      visible={loading}
      transparent
      animationType="fade"
    >

      <View
        style={{
          flex: 1,

          backgroundColor:
            'rgba(0,0,0,0.25)',

          justifyContent: 'center',
          alignItems: 'center',
        }}
      >

        <View
          style={{
            width: 90,
            height: 90,

            borderRadius:
              theme.radius.lg,

            backgroundColor:
              theme.colors.surface,

            justifyContent: 'center',
            alignItems: 'center',
          }}
        >

          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
          />

        </View>

      </View>

    </Modal>
  );
}