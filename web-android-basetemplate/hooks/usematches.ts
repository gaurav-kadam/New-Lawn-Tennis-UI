import { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import matchService from '../services/match/match.service';
import { Match } from '../services/match/match.type';

export const useMatches = (isComplete?: boolean, search?: string, page = 0, rowsPerPage = 10) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { tournament_code } = useLocalSearchParams<{ tournament_code?: string }>();

  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params: Record<string, any> = {
        skip: page * rowsPerPage,
        limit: rowsPerPage,
      };
      if (isComplete !== undefined) params.is_complete = isComplete;
      if (search) params.search = search;

      let response;
      if (tournament_code) {
        response = await matchService.getMatchesByTournament(tournament_code, params);
      } else {
        response = await matchService.getMatches(params);
      }

      const extractedData = response?.data?.data ?? response?.data ?? (Array.isArray(response) ? response : []);
      const serverTotal: number = response?.data?.total ?? response?.total ?? extractedData.length;
      const raw: Match[] = Array.isArray(extractedData) ? extractedData : [];
      // Client-side guard: backend may not filter by is_complete, so enforce it here
      const result = isComplete !== undefined
        ? raw.filter((m) => !!(m as any).is_complete === isComplete)
        : raw;
      setMatches(result);
      setTotal(serverTotal);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while fetching matches');
      console.error('Fetch matches error:', err);
    } finally {
      setLoading(false);
    }
  }, [tournament_code, isComplete, search, page, rowsPerPage]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  return { matches, total, loading, error, reload: loadMatches };
};
