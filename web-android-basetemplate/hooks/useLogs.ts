import { useEffect, useState } from 'react';
import logService from '../services/log/Log.service';

export const useLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError('');
      // Based on your backend returning { message, logged_in_user, data }
      const response = await logService.getLogs();
      setLogs(response.data); 
    } catch (err: any) {
      setError(err.message || 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return {
    logs,
    loading,
    error,
    refreshLogs: loadLogs,
  };
};