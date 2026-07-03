import { useCallback, useEffect, useState } from 'react';
import tournamentService from '../services/tournament/tournamment.service';
import { Tournament } from '../services/tournament/tournament.type';

export const useTournaments = (isActive?: boolean, search?: string, page = 0, rowsPerPage = 10) => {
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
      if (isActive !== undefined) params.is_active = isActive;
      if (search) params.search = search;
      const response = await tournamentService.getTournaments(params);
      const raw: Tournament[] = response?.data?.data ?? response?.data ?? (Array.isArray(response) ? response : []);
      const serverTotal: number = response?.data?.total ?? response?.total ?? raw.length;
      const result = isActive !== undefined
        ? raw.filter((t) => !!t.is_active === isActive)
        : raw;
      setTournaments(result);
      setTotal(serverTotal);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while fetching tournaments');
    } finally {
      setLoading(false);
    }
  }, [isActive, search, page, rowsPerPage]);

  useEffect(() => {
    loadTournaments();
  }, [loadTournaments]);

  return { tournaments, total, loading, error, reload: loadTournaments };
};
