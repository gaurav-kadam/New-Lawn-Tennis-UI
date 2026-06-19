import { useCallback, useEffect, useState } from 'react';

import playerService from '../services/player/Player.services';

export const usePlayers = () => {

  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPlayers = useCallback(async () => {

    try {

      setLoading(true);

      const response =
        await playerService.getPlayers();

      console.log('PLAYERS RESPONSE:', response);

        setPlayers(response || []);

    } catch (err) {

      console.log('Fetch players error:', err);

      setPlayers([]);

    } finally {

      setLoading(false);
    }

  }, []);

  useEffect(() => {

    loadPlayers();

  }, [loadPlayers]);

  return {
    players,
    loading,
    reload: loadPlayers,
  };
};