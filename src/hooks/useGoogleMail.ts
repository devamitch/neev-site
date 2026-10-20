import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { fetchInbox, searchMail, fetchSchoolMails, getProfile } from '../lib/googleMail';
import { STALE } from '../lib/queryClient';

export function useMailProfile() {
  const { googleAccessToken, refreshGoogleToken } = useAuth();
  return useQuery({
    queryKey: ['google', 'mail', 'profile'],
    queryFn: async () => {
      let token = googleAccessToken;
      try { return await getProfile(token!); }
      catch (err: any) {
        if (err.status === 401) { token = await refreshGoogleToken(); if (!token) throw err; return getProfile(token); }
        throw err;
      }
    },
    enabled: !!googleAccessToken,
    staleTime: STALE.mail,
  });
}

export function useInbox(maxResults = 25) {
  const { googleAccessToken, refreshGoogleToken } = useAuth();
  return useQuery({
    queryKey: ['google', 'mail', 'inbox', maxResults],
    queryFn: async () => {
      let token = googleAccessToken;
      try { return await fetchInbox(token!, maxResults); }
      catch (err: any) {
        if (err.status === 401) { token = await refreshGoogleToken(); if (!token) throw err; return fetchInbox(token, maxResults); }
        throw err;
      }
    },
    enabled: !!googleAccessToken,
    staleTime: STALE.mail,
    refetchInterval: 2 * 60 * 1000,
  });
}

export function useMailSearch(query: string, maxResults = 20) {
  const { googleAccessToken } = useAuth();
  return useQuery({
    queryKey: ['google', 'mail', 'search', query],
    queryFn: () => searchMail(googleAccessToken!, query, maxResults),
    enabled: !!googleAccessToken && query.length > 2,
    staleTime: STALE.mail,
  });
}

export function useSchoolMails() {
  const { googleAccessToken, refreshGoogleToken } = useAuth();
  return useQuery({
    queryKey: ['google', 'mail', 'school'],
    queryFn: async () => {
      let token = googleAccessToken;
      try { return await fetchSchoolMails(token!); }
      catch (err: any) {
        if (err.status === 401) { token = await refreshGoogleToken(); if (!token) throw err; return fetchSchoolMails(token); }
        throw err;
      }
    },
    enabled: !!googleAccessToken,
    staleTime: STALE.mail,
  });
}
