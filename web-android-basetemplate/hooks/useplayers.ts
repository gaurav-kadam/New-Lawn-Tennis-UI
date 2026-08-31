import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import playerService from '@/services/player/player.service';

import {
  Player,
  PlayerCreatePayload,
  PlayerUpdatePayload,
} from '@/services/player/player.type';

export const usePlayers = (
  options?: {
    lazy?: boolean;
    page?: number;
    pageSize?: number;
    isActive?: boolean;
  }
) => {

  const page =
    options?.page ?? 1;

  const pageSize =
    options?.pageSize ?? 100;

  const isActive =
    options?.isActive;

  const [
    players,
    setPlayers,
  ] = useState<Player[]>([]);

  const [
    total,
    setTotal,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const loadPlayers =
    useCallback(async () => {

      try {

        setLoading(true);
        setError(null);

        const response =
          await playerService.getPlayers(
            page,
            pageSize,
            isActive
          );

        const data =
          response?.data?.data ??
          response?.data ??
          response;

        const items =
          Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data)
              ? data
              : [];

        setPlayers(items);

        setTotal(
          Number(data?.total ?? items.length)
        );

      } catch (err: any) {

        console.error(
          'Load players error:',
          err
        );

        setPlayers([]);
        setTotal(0);

        setError(
          err?.message ||
          'Failed to load players'
        );

      } finally {

        setLoading(false);

      }

    }, [
      page,
      pageSize,
      isActive,
    ]);

  const createPlayer =
    useCallback(
      async (
        payload: PlayerCreatePayload
      ) => {

        const response =
          await playerService.createPlayer(
            payload
          );

        await loadPlayers();

        return response;

      },
      [loadPlayers]
    );

  const updatePlayer =
    useCallback(
      async (
        id: number,
        payload: PlayerUpdatePayload
      ) => {

        const response =
          await playerService.updatePlayer(
            id,
            payload
          );

        await loadPlayers();

        return response;

      },
      [loadPlayers]
    );

  const deletePlayer =
    useCallback(
      async (id: number) => {

        const response =
          await playerService.deletePlayer(id);

        await loadPlayers();

        return response;

      },
      [loadPlayers]
    );

  const restorePlayer =
    useCallback(
      async (id: number) => {

        const response =
          await playerService.restorePlayer(id);

        await loadPlayers();

        return response;

      },
      [loadPlayers]
    );

  useEffect(() => {

    if (options?.lazy) {
      return;
    }

    loadPlayers();

  }, [
    loadPlayers,
    options?.lazy,
  ]);

  return {
    players,
    total,

    loading,
    error,

    reload: loadPlayers,

    createPlayer,
    updatePlayer,
    deletePlayer,
    restorePlayer,
  };
};