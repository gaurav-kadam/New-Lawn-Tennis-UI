import { useCallback, useEffect, useState } from 'react';
import UserService from '../services/users/user.Service';

export const useUsers = (options?: {
  isActive?: boolean;
  search?: string;
  page?: number;
  rowsPerPage?: number;
}) => {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { isActive, search, page = 0, rowsPerPage = 10 } = options || {};

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params: Record<string, any> = {
        skip: page * rowsPerPage,
        limit: rowsPerPage,
      };
      if (isActive !== undefined) params.is_active = isActive;
      if (search) params.search = search;

      const response = await UserService.getUsers(params);
      const raw: any[] = response?.data?.data ?? response?.data ?? (Array.isArray(response) ? response : []);
      const serverTotal: number = response?.data?.total ?? response?.total ?? raw.length;

      const result = isActive !== undefined
        ? raw.filter((u: any) => !!(u.role?.is_active) === isActive)
        : raw;

      setUsers(result);
      setTotal(serverTotal);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while fetching users');
    } finally {
      setLoading(false);
    }
  }, [isActive, search, page, rowsPerPage]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return { users, total, loading, error, reload: loadUsers };
};
