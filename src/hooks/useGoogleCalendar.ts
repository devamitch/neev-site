import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import {
  fetchCalendarEvents,
  createCalendarEvent,
  deleteCalendarEvent,
  updateCalendarEvent,
  CreateEventInput,
  GCalEvent,
} from '../lib/googleCalendar';
import { STALE } from '../lib/queryClient';
import { startOfMonth, endOfMonth, addMonths } from 'date-fns';

export function useCalendarEvents(currentDate: Date) {
  const { googleAccessToken, refreshGoogleToken } = useAuth();
  const timeMin = startOfMonth(addMonths(currentDate, -1));
  const timeMax = endOfMonth(addMonths(currentDate, 1));

  return useQuery({
    queryKey: ['google', 'calendar', 'events', timeMin.toISOString(), timeMax.toISOString()],
    queryFn: async () => {
      let token = googleAccessToken;
      try {
        return await fetchCalendarEvents(token!, timeMin, timeMax);
      } catch (err: any) {
        if (err.status === 401) {
          token = await refreshGoogleToken();
          if (!token) throw err;
          return fetchCalendarEvents(token, timeMin, timeMax);
        }
        throw err;
      }
    },
    enabled: !!googleAccessToken,
    staleTime: STALE.calendar,
  });
}

export function useTodayEvents() {
  const { googleAccessToken, refreshGoogleToken } = useAuth();
  const today = new Date();
  const start = new Date(today); start.setHours(0, 0, 0, 0);
  const end = new Date(today); end.setHours(23, 59, 59, 999);

  return useQuery({
    queryKey: ['google', 'calendar', 'today', today.toDateString()],
    queryFn: async () => {
      let token = googleAccessToken;
      try {
        return await fetchCalendarEvents(token!, start, end);
      } catch (err: any) {
        if (err.status === 401) {
          token = await refreshGoogleToken();
          if (!token) throw err;
          return fetchCalendarEvents(token, start, end);
        }
        throw err;
      }
    },
    enabled: !!googleAccessToken,
    staleTime: STALE.calendar,
    refetchInterval: 5 * 60 * 1000, // auto-refresh every 5 min
  });
}

export function useCreateEvent() {
  const { googleAccessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateEventInput) => createCalendarEvent(googleAccessToken!, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['google', 'calendar'] });
    },
  });
}

export function useDeleteEvent() {
  const { googleAccessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => deleteCalendarEvent(googleAccessToken!, eventId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['google', 'calendar'] });
    },
  });
}
