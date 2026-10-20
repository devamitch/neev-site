export interface GDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime: string;
  webViewLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  parents?: string[];
  shared?: boolean;
  starred?: boolean;
}

const BASE = 'https://www.googleapis.com/drive/v3';

async function gFetch(url: string, token: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.error?.message || `HTTP ${res.status}`), { status: res.status });
  return data;
}

export async function listDriveFiles(
  token: string,
  opts: { query?: string; pageSize?: number; folderId?: string } = {}
): Promise<GDriveFile[]> {
  const fields = 'files(id,name,mimeType,size,modifiedTime,webViewLink,iconLink,thumbnailLink,parents,shared,starred)';
  const params = new URLSearchParams({
    pageSize: String(opts.pageSize ?? 50),
    fields,
    orderBy: 'modifiedTime desc',
  });
  if (opts.folderId) {
    params.set('q', `'${opts.folderId}' in parents and trashed=false`);
  } else if (opts.query) {
    params.set('q', opts.query);
  } else {
    params.set('q', 'trashed=false');
  }
  const data = await gFetch(`${BASE}/files?${params}`, token);
  return data?.files ?? [];
}

export async function searchDriveFiles(token: string, query: string): Promise<GDriveFile[]> {
  return listDriveFiles(token, {
    query: `fullText contains '${query.replace(/'/g, "\\'")}' and trashed=false`,
    pageSize: 30,
  });
}

export async function getDriveFile(token: string, fileId: string): Promise<GDriveFile> {
  const fields = 'id,name,mimeType,size,modifiedTime,webViewLink,thumbnailLink,parents,shared';
  return gFetch(`${BASE}/files/${fileId}?fields=${fields}`, token);
}

export async function listDriveFolders(token: string): Promise<GDriveFile[]> {
  return listDriveFiles(token, {
    query: "mimeType='application/vnd.google-apps.folder' and trashed=false",
    pageSize: 30,
  });
}

export function getDriveDownloadUrl(fileId: string, token: string): string {
  return `${BASE}/files/${fileId}?alt=media&access_token=${token}`;
}

export async function uploadToDrive(
  token: string,
  file: File,
  folderId?: string
): Promise<GDriveFile> {
  const metadata: any = { name: file.name };
  if (folderId) metadata.parents = [folderId];

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,modifiedTime,webViewLink', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.error?.message || `HTTP ${res.status}`), { status: res.status });
  return data;
}

export function formatMimeType(mimeType: string): string {
  const map: Record<string, string> = {
    'application/vnd.google-apps.document': 'Google Doc',
    'application/vnd.google-apps.spreadsheet': 'Google Sheet',
    'application/vnd.google-apps.presentation': 'Google Slides',
    'application/vnd.google-apps.folder': 'Folder',
    'application/pdf': 'PDF',
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'video/mp4': 'MP4',
    'application/zip': 'ZIP',
  };
  return map[mimeType] ?? mimeType.split('/')[1]?.toUpperCase() ?? 'File';
}
