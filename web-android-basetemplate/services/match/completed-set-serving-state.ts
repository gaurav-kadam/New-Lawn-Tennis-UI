import type { ServingStateSnapshot } from '../../components/tennis-match/types/tennis.types';

export function serializeCompletedSetServingState(
  servingState: ServingStateSnapshot,
  matchType: 'SINGLES' | 'DOUBLES'
): ServingStateSnapshot {
  return {
    ...servingState,
    current_server:
      servingState.current_set_first_server ?? servingState.first_server,
    current_set_service_order: [
      ...servingState.current_set_service_order,
    ],
    doubles_serve_index:
      matchType === 'DOUBLES' ? 0 : servingState.doubles_serve_index,
  };
}
