import TennisMatchScreenView from '@/components/tennis-match/TennisMatchScreenView';
import TennisPaperProvider from '@/components/tennis-match/ui/TennisPaperProvider';

export default function TennisMatchScreen() {
  return (
    <TennisPaperProvider>
      <TennisMatchScreenView />
    </TennisPaperProvider>
  );
}
