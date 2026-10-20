import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { fetchFitAggregate, fetchFitWeekly } from '../lib/googleFit';
import { STALE } from '../lib/queryClient';

type FitRange = 'today' | 'week' | 'month';

function getDateRange(range: FitRange): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  if (range === 'today') { start.setHours(0, 0, 0, 0); }
  else if (range === 'week') { start.setDate(end.getDate() - 6); start.setHours(0, 0, 0, 0); }
  else { start.setDate(end.getDate() - 29); start.setHours(0, 0, 0, 0); }
  return { start, end };
}

export function useFitAggregate(range: FitRange = 'today') {
  const { googleAccessToken, refreshGoogleToken } = useAuth();
  const { start, end } = getDateRange(range);

  return useQuery({
    queryKey: ['google', 'fit', 'aggregate', range, start.toDateString()],
    queryFn: async () => {
      let token = googleAccessToken;
      try { return await fetchFitAggregate(token!, start, end); }
      catch (err: any) {
        if (err.status === 401) { token = await refreshGoogleToken(); if (!token) throw err; return fetchFitAggregate(token, start, end); }
        throw err;
      }
    },
    enabled: !!googleAccessToken,
    staleTime: STALE.fit,
  });
}

export function useFitWeekly() {
  const { googleAccessToken, refreshGoogleToken } = useAuth();
  return useQuery({
    queryKey: ['google', 'fit', 'weekly', new Date().toDateString()],
    queryFn: async () => {
      let token = googleAccessToken;
      try { return await fetchFitWeekly(token!); }
      catch (err: any) {
        if (err.status === 401) { token = await refreshGoogleToken(); if (!token) throw err; return fetchFitWeekly(token); }
        throw err;
      }
    },
    enabled: !!googleAccessToken,
    staleTime: STALE.fit,
  });
}
