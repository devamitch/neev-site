import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { listAlbums, listMediaItems, getAlbumMedia } from '../lib/googlePhotos';
import { STALE } from '../lib/queryClient';

export function usePhotoAlbums() {
  const { googleAccessToken, refreshGoogleToken } = useAuth();
  return useQuery({
    queryKey: ['google', 'photos', 'albums'],
    queryFn: async () => {
      let token = googleAccessToken;
      try { return await listAlbums(token!, 30); }
      catch (err: any) {
        if (err.status === 401) { token = await refreshGoogleToken(); if (!token) throw err; return listAlbums(token, 30); }
        throw err;
      }
    },
    enabled: !!googleAccessToken,
    staleTime: STALE.photos,
  });
}

export function useRecentMedia(pageSize = 50) {
  const { googleAccessToken, refreshGoogleToken } = useAuth();
  return useQuery({
    queryKey: ['google', 'photos', 'recent', pageSize],
    queryFn: async () => {
      let token = googleAccessToken;
      try { return await listMediaItems(token!, pageSize); }
      catch (err: any) {
        if (err.status === 401) { token = await refreshGoogleToken(); if (!token) throw err; return listMediaItems(token, pageSize); }
        throw err;
      }
    },
    enabled: !!googleAccessToken,
    staleTime: STALE.photos,
  });
}

export function useAlbumMedia(albumId: string | null) {
  const { googleAccessToken, refreshGoogleToken } = useAuth();
  return useQuery({
    queryKey: ['google', 'photos', 'album', albumId],
    queryFn: async () => {
      let token = googleAccessToken;
      try { return await getAlbumMedia(token!, albumId!); }
      catch (err: any) {
        if (err.status === 401) { token = await refreshGoogleToken(); if (!token) throw err; return getAlbumMedia(token, albumId!); }
        throw err;
      }
    },
    enabled: !!googleAccessToken && !!albumId,
    staleTime: STALE.photos,
  });
}
