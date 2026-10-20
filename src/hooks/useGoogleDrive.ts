import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { listDriveFiles, listDriveFolders, uploadToDrive, searchDriveFiles } from '../lib/googleDrive';
import { STALE } from '../lib/queryClient';

export function useDriveFiles(folderId?: string | null) {
  const { googleAccessToken, refreshGoogleToken } = useAuth();
  return useQuery({
    queryKey: ['google', 'drive', 'files', folderId ?? 'root'],
    queryFn: async () => {
      let token = googleAccessToken;
      try {
        const files = await listDriveFiles(token!, { folderId: folderId ?? undefined, pageSize: 50 });
        return files.filter((f) => f.mimeType !== 'application/vnd.google-apps.folder');
      } catch (err: any) {
        if (err.status === 401) {
          token = await refreshGoogleToken();
          if (!token) throw err;
          const files = await listDriveFiles(token, { folderId: folderId ?? undefined, pageSize: 50 });
          return files.filter((f) => f.mimeType !== 'application/vnd.google-apps.folder');
        }
        throw err;
      }
    },
    enabled: !!googleAccessToken,
    staleTime: STALE.drive,
  });
}

export function useDriveFolders() {
  const { googleAccessToken, refreshGoogleToken } = useAuth();
  return useQuery({
    queryKey: ['google', 'drive', 'folders'],
    queryFn: async () => {
      let token = googleAccessToken;
      try { return await listDriveFolders(token!); }
      catch (err: any) {
        if (err.status === 401) { token = await refreshGoogleToken(); if (!token) throw err; return listDriveFolders(token); }
        throw err;
      }
    },
    enabled: !!googleAccessToken,
    staleTime: STALE.drive,
  });
}

export function useDriveSearch(query: string) {
  const { googleAccessToken } = useAuth();
  return useQuery({
    queryKey: ['google', 'drive', 'search', query],
    queryFn: () => searchDriveFiles(googleAccessToken!, query),
    enabled: !!googleAccessToken && query.length > 1,
    staleTime: STALE.drive,
  });
}

export function useUploadToDrive() {
  const { googleAccessToken } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, folderId }: { file: File; folderId?: string }) =>
      uploadToDrive(googleAccessToken!, file, folderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['google', 'drive'] });
    },
  });
}
