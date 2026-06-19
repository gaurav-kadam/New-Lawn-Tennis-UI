import { useEffect, useState } from 'react';
import tournamentService from '../services/tournament/tournamment.service';
// Note: Ensure you create the Tournament type in a .types file as well
import { Tournament } from '../services/tournament/tournament.type';

export const useTournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTournaments = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await tournamentService.getTournaments();

      // Based on your backend route format: { "message": "...", "data": [...] }
      // You might need to access response.data depending on your ApiService logic
      setTournaments(response.data || response);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while fetching tournaments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTournaments();
  }, []);

  return {
    tournaments,
    loading,
    error,
    reload: loadTournaments,
  };
};