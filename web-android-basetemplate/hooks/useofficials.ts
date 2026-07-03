import { useCallback, useEffect, useState } from 'react';
import officialService from '../services/official/official.service';
import { Official } from '../services/official/official.type';

export const useOfficials = (options?: {
  lazy?: boolean;
  isActive?: boolean;
  search?: string;
  page?: number;
  rowsPerPage?: number;
}) => {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { isActive, search, page = 0, rowsPerPage = 10 } = options || {};

  const loadOfficials = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params: Record<string, any> = {
        skip: page * rowsPerPage,
        limit: rowsPerPage,
      };
      if (isActive !== undefined) params.is_active = isActive;
      if (search) params.search = search;
      const response = await officialService.getOfficials(params);
      const raw: Official[] = response?.data?.data ?? response?.data ?? (Array.isArray(response) ? response : []);
      const serverTotal: number = response?.data?.total ?? response?.total ?? raw.length;
      const result = isActive !== undefined
        ? raw.filter((o) => !!o.is_active === isActive)
        : raw;
      setOfficials(result);
      setTotal(serverTotal);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch officials');
    } finally {
      setLoading(false);
    }
  }, [isActive, search, page, rowsPerPage]);

  useEffect(() => {
    if (options?.lazy) return;
    loadOfficials();
  }, [loadOfficials, options?.lazy]);

  return { officials, total, loading, error, reload: loadOfficials };
};
