import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MobileLayout({ children }: any) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </SafeAreaView>
  );
}