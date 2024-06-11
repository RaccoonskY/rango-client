import type { Events } from '../../types';

import { useEvents } from '@rango-dev/queue-manager-rango-preset';

export function useWidgetEvents() {
  return useEvents<Events>();
}
