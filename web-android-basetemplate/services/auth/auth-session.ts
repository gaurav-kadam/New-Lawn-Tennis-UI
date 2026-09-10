import AsyncStorage from '@react-native-async-storage/async-storage';

const listeners = new Set<() => void>();
let revision = 0;

export const getSessionRevision = () => revision;

export function onSessionInvalidated(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export async function invalidateSession() {
  revision += 1;
  listeners.forEach(listener => listener());
  // Never clear match drafts when invalidating authentication.
  const results = await Promise.allSettled([
    AsyncStorage.removeItem('access_token'),
    AsyncStorage.removeItem('user'),
  ]);
  if (results.some(result => result.status === 'rejected')) {
    throw new Error('Unable to clear stored session');
  }
}
