import { useCallback, useEffect, useState } from 'react';
import teamService from '../services/team/team.service';
import { Team } from '../services/team/team.type';

// 🌟 Add config option param defaulting to an empty object
export const useTeams = (options?: { lazy?: boolean }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTeams = useCallback(async () => {
    try {
      setLoading(true);
      const response = await teamService.getTeams();
      const data = response?.data || response;
      setTeams(data || []);
    } catch (err) {
      console.log('Fetch teams error:', err);
      setTeams([]); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 🌟 Check if lazy execution is explicitly declared
    if (options?.lazy) return;
    loadTeams();
  }, [loadTeams]); // Removed the option object dependency to avoid infinite cycles

  return {
    teams,
    loading,
    reload: loadTeams,
  };
};