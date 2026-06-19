import { Slot } from 'expo-router';

import { SafeAreaProvider }
from 'react-native-safe-area-context';

import { ThemeProvider }
from '../theme/themeContext';

import { AuthProvider }
from '../context/AuthContext';
import { LoaderProvider } from '@/context/LoaderContext';

export default function RootLayout() {

  return (

    <ThemeProvider>

      <SafeAreaProvider>
          <LoaderProvider>


        <AuthProvider>

          <Slot />

        </AuthProvider>
         </LoaderProvider>

      </SafeAreaProvider>

    </ThemeProvider>
  );
}