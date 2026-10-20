import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { listContacts, searchContacts } from '../lib/googleContacts';
import { STALE } from '../lib/queryClient';

export function useContacts(pageSize = 100) {
  const { googleAccessToken, refreshGoogleToken } = useAuth();
  return useQuery({
    queryKey: ['google', 'contacts', pageSize],
    queryFn: async () => {
      let token = googleAccessToken;
      try { return await listContacts(token!, pageSize); }
      catch (err: any) {
        if (err.status === 401) { token = await refreshGoogleToken(); if (!token) throw err; return listContacts(token, pageSize); }
        throw err;
      }
    },
    enabled: !!googleAccessToken,
    staleTime: STALE.contacts,
  });
}

export function useContactSearch(query: string) {
  const { googleAccessToken } = useAuth();
  return useQuery({
    queryKey: ['google', 'contacts', 'search', query],
    queryFn: () => searchContacts(googleAccessToken!, query),
    enabled: !!googleAccessToken && query.length > 1,
    staleTime: STALE.contacts,
  });
}
