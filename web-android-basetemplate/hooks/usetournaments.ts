import { useCallback, useEffect, useState } from 'react';
import tournamentService from '../services/tournament/tournamment.service';
import { Tournament } from '../services/tournament/tournament.type';

export const useTournaments = (
  isActive?: boolean,
  search?: string,
  page = 0,
  rowsPerPage = 10
) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTournaments = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const params: Record<string, any> = {
        skip: page * rowsPerPage,
        limit: rowsPerPage,
      };

      if (isActive !== undefined) {
        params.is_active = isActive;
      }

      if (search) {
        params.search = search;
      }

      const response = await tournamentService.getTournaments(params);

      let raw: Tournament[] = [];

      if (Array.isArray(response)) {
        raw = response;
      } else if (Array.isArray(response?.data)) {
        raw = response.data;
      } else if (Array.isArray(response?.data?.data)) {
        raw = response.data.data;
      } else if (Array.isArray(response?.data?.items)) {
        raw = response.data.items;
      } else if (Array.isArray(response?.items)) {
        raw = response.items;
      }

      const serverTotal =
        typeof response?.total === 'number'
          ? response.total
          : typeof response?.data?.total === 'number'
            ? response.data.total
            : typeof response?.data?.data?.total === 'number'
              ? response.data.data.total
              : raw.length;

      const result =
        isActive !== undefined
          ? raw.filter(
              (tournament) =>
                Boolean(tournament.is_active) === isActive
            )
          : raw;

      setTournaments(result);
      setTotal(serverTotal);
    } catch (err: any) {
      setTournaments([]);
      setTotal(0);
      setError(
        err?.message ||
          'Something went wrong while fetching tournaments'
      );
    } finally {
      setLoading(false);
    }
  }, [isActive, search, page, rowsPerPage]);

  useEffect(() => {
    loadTournaments();
  }, [loadTournaments]);

  return {
    tournaments,
    total,
    loading,
    error,
    reload: loadTournaments,
  };
};