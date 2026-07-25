import { useCallback, useEffect, useState } from 'react';
import teamService from '../services/team/team.service';
import { Team } from '../services/team/team.type';

export const useTeams = (options?: {
  lazy?: boolean;
  isActive?: boolean;
  search?: string;
  page?: number;
  rowsPerPage?: number;
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isActive, search, page = 0, rowsPerPage = 10 } = options || {};

  const loadTeams = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = {
        skip: page * rowsPerPage,
        limit: rowsPerPage,
      };
      if (isActive !== undefined) params.is_active = isActive;
      if (search) params.search = search;
      const response = await teamService.getTeams(params);
      const raw: Team[] = response?.data?.data ?? response?.data ?? (Array.isArray(response) ? response : []);
      const serverTotal: number = response?.data?.total ?? response?.total ?? raw.length;
      const result = isActive !== undefined
        ? raw.filter((t) => !!t.is_active === isActive)
        : raw;
      setTeams(result);
      setTotal(serverTotal);
    } catch (err) {
      console.log('Fetch teams error:', err);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }, [isActive, search, page, rowsPerPage]);

  useEffect(() => {
    if (options?.lazy) return;
    loadTeams();
  }, [loadTeams, options?.lazy]);

  return { teams, total, loading, reload: loadTeams };
};
