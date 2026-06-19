import { useEffect, useState } from 'react';
import officialService from '../services/official/official.service';
import { Official } from '../services/official/official.type';

export const useOfficials = () => {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadOfficials = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await officialService.getOfficials();
      // Accessing response.data to match your FastAPI return format
      setOfficials(response.data || response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch officials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOfficials();
  }, []);

  return {
    officials,
    loading,
    error,
    reload: loadOfficials,
  };
};