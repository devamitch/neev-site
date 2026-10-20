import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

// Stale times per service
export const STALE = {
  calendar: 5 * 60 * 1000,    // 5 min
  tasks: 2 * 60 * 1000,       // 2 min
  photos: 30 * 60 * 1000,     // 30 min
  drive: 10 * 60 * 1000,      // 10 min
  fit: 15 * 60 * 1000,        // 15 min
  mail: 2 * 60 * 1000,        // 2 min
  contacts: 60 * 60 * 1000,   // 60 min
  auth: 55 * 60 * 1000,       // 55 min
} as const;

export const GC_TIME = 24 * 60 * 60 * 1000; // 24 hours — kept across page refreshes

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: GC_TIME,
      staleTime: STALE.tasks, // default 2 min
      retry: (failureCount, error: any) => {
        // Don't retry on 401 (handled by token refresh) or 403
        if (error?.status === 401 || error?.status === 403) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Persist to localStorage — survives page refreshes
const persister = createSyncStoragePersister({
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  key: 'neev-react-query-cache',
  throttleTime: 1000,
});

if (typeof window !== 'undefined') {
  persistQueryClient({
    queryClient,
    persister,
    maxAge: GC_TIME,
    buster: 'neev-v2', // change to bust cache on deploy
  });
}

export default queryClient;
