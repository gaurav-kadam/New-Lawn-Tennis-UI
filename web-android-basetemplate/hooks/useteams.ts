import { useCallback, useEffect, useState } from 'react';

import teamService from '../services/team/team.service';
import { Team } from '../services/team/team.type';

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTeams = useCallback(async () => {
    try {
      setLoading(true);

      const response = await teamService.getTeams();
      console.log('TEAMS RESPONSE:', response);

      // Handle both raw array or { data: [] } response formats safely
      const data = response?.data || response;
      setTeams(data || []);
      
    } catch (err) {
      console.log('Fetch teams error:', err);
      setTeams([]); // Prevents UI breakdown on failure
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  return {
    teams,
    loading,
    reload: loadTeams,
  };
};