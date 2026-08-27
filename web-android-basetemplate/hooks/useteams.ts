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

  const {
    isActive,
    search,
    page = 0,
    rowsPerPage = 10,
  } = options || {};

  const loadTeams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, any> = {
        skip: page * rowsPerPage,
        limit: rowsPerPage,
      };

      if (isActive !== undefined) {
        params.is_active = isActive;
      }

      if (search && search.trim()) {
        params.search = search.trim();
      }

      const response = await teamService.getTeams(params);

      let raw: Team[] = [];

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
      } else if (Array.isArray(response?.teams)) {
        raw = response.teams;
      } else if (Array.isArray(response?.data?.teams)) {
        raw = response.data.teams;
      }

      /*
       * Always guarantee that the UI receives an array.
       */
      if (!Array.isArray(raw)) {
        raw = [];
      }

      /*
       * Extract total count safely.
       */
      let serverTotal = raw.length;

      if (typeof response?.total === 'number') {
        serverTotal = response.total;
      } else if (typeof response?.data?.total === 'number') {
        serverTotal = response.data.total;
      } else if (typeof response?.data?.data?.total === 'number') {
        serverTotal = response.data.data.total;
      } else if (typeof response?.data?.items?.total === 'number') {
        serverTotal = response.data.items.total;
      }

      /*
       * Apply active/inactive filter only when explicitly requested.
       */
      const result =
        isActive !== undefined
          ? raw.filter(
              (team) => Boolean(team.is_active) === isActive
            )
          : raw;

      setTeams(result);
      setTotal(serverTotal);
    } catch (err: any) {
      console.error('Fetch teams error:', err);

      setTeams([]);
      setTotal(0);

      setError(
        err?.message ||
          'Something went wrong while fetching teams'
      );
    } finally {
      setLoading(false);
    }
  }, [isActive, search, page, rowsPerPage]);

  useEffect(() => {
    if (options?.lazy) {
      return;
    }

    loadTeams();
  }, [loadTeams, options?.lazy]);

  return {
    teams,
    total,
    loading,
    error,
    reload: loadTeams,
  };
};