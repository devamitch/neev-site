export interface GPhotoAlbum {
  id: string;
  title: string;
  productUrl: string;
  coverPhotoBaseUrl?: string;
  mediaItemsCount?: string;
}

export interface GMediaItem {
  id: string;
  description?: string;
  productUrl: string;
  baseUrl: string;
  mimeType: string;
  filename: string;
  mediaMetadata: {
    creationTime: string;
    width?: string;
    height?: string;
    photo?: { cameraMake?: string; cameraModel?: string };
    video?: { durationMillis?: string; status?: string };
  };
}

const BASE = 'https://photoslibrary.googleapis.com/v1';

async function gFetch(url: string, token: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.error?.message || `HTTP ${res.status}`), { status: res.status });
  return data;
}

export async function listAlbums(token: string, pageSize = 20): Promise<GPhotoAlbum[]> {
  const data = await gFetch(`${BASE}/albums?pageSize=${pageSize}`, token);
  return data?.albums ?? [];
}

export async function listMediaItems(token: string, pageSize = 50): Promise<GMediaItem[]> {
  const data = await gFetch(`${BASE}/mediaItems?pageSize=${pageSize}`, token);
  return data?.mediaItems ?? [];
}

export async function searchMediaItems(
  token: string,
  options: { albumId?: string; pageSize?: number; filters?: object } = {}
): Promise<GMediaItem[]> {
  const body: any = { pageSize: options.pageSize ?? 50 };
  if (options.albumId) body.albumId = options.albumId;
  if (options.filters) body.filters = options.filters;
  const data = await gFetch(`${BASE}/mediaItems:search`, token, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return data?.mediaItems ?? [];
}

export async function getAlbumMedia(token: string, albumId: string, pageSize = 100): Promise<GMediaItem[]> {
  return searchMediaItems(token, { albumId, pageSize });
}
