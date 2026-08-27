import { useCallback, useEffect, useRef, useState } from 'react';

export type MatchTimerStatus =
  | 'idle'
  | 'running'
  | 'paused'
  | 'stopped';

export function useMatchTimer() {
  const [status, setStatus] =
    useState<MatchTimerStatus>('idle');

  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);

  const statusRef =
    useRef<MatchTimerStatus>('idle');

  const startedAtRef =
    useRef<number | null>(null);

  const accumulatedSecondsRef =
    useRef(0);

  const intervalRef =
    useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const updateElapsed = useCallback(() => {
    if (startedAtRef.current === null) {
      return;
    }

    const runningSeconds = Math.floor(
      (Date.now() - startedAtRef.current) / 1000
    );

    setElapsedSeconds(
      accumulatedSecondsRef.current +
        runningSeconds
    );
  }, []);

  /*
   * START / RESUME
   */
  const start = useCallback(() => {
    if (
      statusRef.current === 'running' ||
      statusRef.current === 'stopped'
    ) {
      return;
    }

    startedAtRef.current = Date.now();

    statusRef.current = 'running';
    setStatus('running');
  }, []);

  /*
   * PAUSE
   */
  const pause = useCallback(() => {
    if (
      statusRef.current !== 'running'
    ) {
      return;
    }

    if (
      startedAtRef.current !== null
    ) {
      const runningSeconds = Math.floor(
        (Date.now() -
          startedAtRef.current) /
          1000
      );

      accumulatedSecondsRef.current +=
        runningSeconds;
    }

    startedAtRef.current = null;

    setElapsedSeconds(
      accumulatedSecondsRef.current
    );

    statusRef.current = 'paused';
    setStatus('paused');
  }, []);

  /*
   * STOP
   *
   * Stops permanently but preserves
   * the final elapsed time.
   */
  const stop = useCallback(() => {
    if (
      statusRef.current === 'stopped'
    ) {
      return;
    }

    if (
      statusRef.current === 'running' &&
      startedAtRef.current !== null
    ) {
      const runningSeconds = Math.floor(
        (Date.now() -
          startedAtRef.current) /
          1000
      );

      accumulatedSecondsRef.current +=
        runningSeconds;
    }

    startedAtRef.current = null;

    clearTimer();

    setElapsedSeconds(
      accumulatedSecondsRef.current
    );

    statusRef.current = 'stopped';
    setStatus('stopped');
  }, [clearTimer]);

 
const reset = useCallback(() => {
  clearTimer();

  startedAtRef.current = null;
  accumulatedSecondsRef.current = 0;

  setElapsedSeconds(0);

  statusRef.current = 'idle';
  setStatus('idle');
}, [clearTimer]);

  // TIMER LOOP

  useEffect(() => {
    clearTimer();

    if (status !== 'running') {
      return;
    }

    updateElapsed();

    intervalRef.current = setInterval(
      updateElapsed,
      250
    );

    return clearTimer;
  }, [
    status,
    clearTimer,
    updateElapsed,
  ]);

  // FINAL CLEANUP
  
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    status,
    elapsedSeconds,
    start,
    pause,
    stop,
    reset
  };
}

export function formatMatchTime(
  totalSeconds: number
): string {
  const minutes = Math.floor(
    totalSeconds / 60
  );

  const seconds =
    totalSeconds % 60;

  return `${minutes
    .toString()
    .padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}