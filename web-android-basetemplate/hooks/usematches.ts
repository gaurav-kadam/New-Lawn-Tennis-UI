import { useEffect, useState, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router'; // 🌟 Import route params hook
import matchService from '../services/match/match.service';
import { Match } from '../services/match/match.type';

export const useMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🌟 Extract tournament_code from the current route parameters if present
  const { tournament_code } = useLocalSearchParams<{ tournament_code?: string }>();

  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      let response;
      
      if (tournament_code) {
        response = await matchService.getMatchesByTournament(tournament_code);
      } else {
        // Clicking directly on global Matches tab will hit the default route
        response = await matchService.getMatches();
      }

      const extractedData = response?.data?.data || response?.data || response;
      
      setMatches(Array.isArray(extractedData) ? extractedData : []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while fetching matches');
      console.error("Fetch matches error:", err);
    } finally {
      setLoading(false);
    }
  }, [tournament_code]); // Re-fetch whenever the parameter path context changes

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  return {
    matches,
    loading,
    error,
    reload: loadMatches,
  };
};