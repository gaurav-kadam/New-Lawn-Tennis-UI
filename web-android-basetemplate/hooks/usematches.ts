import { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

import matchService from '../services/match/match.service';
import { Match } from '../services/match/match.type';

export const useMatches = (
  isComplete?: boolean,
  search?: string,
  page = 0,
  rowsPerPage = 10
) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { tournament_code } =
    useLocalSearchParams<{
      tournament_code?: string;
    }>();

  const loadMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params: Record<string, any> = {
        skip: page * rowsPerPage,
        limit: rowsPerPage,
      };

      if (isComplete !== undefined) {
        params.is_complete = isComplete;
      }

      if (search) {
        params.search = search;
      }

      let response;

      if (tournament_code) {
        response =
          await matchService.getMatchesByTournament(
            tournament_code,
            params
          );
      } else {
        response =
          await matchService.getMatches(params);
      }

      // =========================================================
      // DEBUG
      // =========================================================

      console.log(
        '========== MATCH API RESPONSE =========='
      );

      console.log(
        'RAW MATCH RESPONSE:',
        response
      );

      console.log(
        'MATCH RESPONSE DATA:',
        response?.data
      );

      console.log(
        'MATCH ITEMS:',
        response?.data?.items
      );

      console.log(
        'MATCH TOTAL:',
        response?.data?.total
      );

      console.log(
        '========================================'
      );

      // =========================================================
      // EXTRACT MATCH ITEMS
      //
      // Actual backend response:
      //
      // response.data.items
      //
      // =========================================================

      let rawMatches: Match[] = [];

      if (
        Array.isArray(
          response?.data?.items
        )
      ) {
        rawMatches =
          response.data.items;
      } else if (
        Array.isArray(
          response?.items
        )
      ) {
        rawMatches =
          response.items;
      } else if (
        Array.isArray(
          response?.data
        )
      ) {
        rawMatches =
          response.data;
      } else if (
        Array.isArray(response)
      ) {
        rawMatches =
          response;
      }

      // =========================================================
      // TOTAL
      // =========================================================

      const serverTotal =
        Number(
          response?.data?.total ??
          response?.total ??
          rawMatches.length
        );

      // =========================================================
      // CLIENT-SIDE COMPLETION FILTER
      // =========================================================

      const result =
        isComplete === undefined
          ? rawMatches
          : rawMatches.filter(
              (match: any) => {
                const completed =
                  Boolean(
                    match?.is_complete
                  ) ||
                  match?.is_complete === 1 ||
                  match?.is_complete === '1' ||
                  match?.status === 'COMPLETED';

                return completed === isComplete;
              }
            );

      console.log(
        'NORMALIZED MATCHES:',
        result
      );

      console.log(
        'NORMALIZED MATCH COUNT:',
        result.length
      );

      // =========================================================
      // UPDATE STATE
      // =========================================================

      setMatches(result);

      setTotal(
        isComplete === undefined
          ? serverTotal
          : result.length
      );

    } catch (err: any) {
      console.error(
        'Fetch matches error:',
        err
      );

      setMatches([]);

      setTotal(0);

      setError(
        err?.message ||
        'Something went wrong while fetching matches'
      );
    } finally {
      setLoading(false);
    }
  }, [
    tournament_code,
    isComplete,
    search,
    page,
    rowsPerPage,
  ]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  return {
    matches,
    total,
    loading,
    error,
    reload: loadMatches,
  };
};