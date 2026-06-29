import { useEffect, useState } from 'react';
import officialService from '../services/official/official.service';
import { Official } from '../services/official/official.type';

// 🌟 Add config option param defaulting to an empty object
export const useOfficials = (options?: { lazy?: boolean }) => {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadOfficials = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await officialService.getOfficials();
      setOfficials(response.data || response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch officials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 🌟 Check if lazy execution is explicitly declared
    if (options?.lazy) return;
    loadOfficials();
  }, []);

  return {
    officials,
    loading,
    error,
    reload: loadOfficials,
  };
};