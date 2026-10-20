import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  HardDrive, Search, Upload, Folder, File, FileText, Image as ImageIcon,
  Video, RefreshCw, AlertCircle, X, Loader2, ExternalLink, Download, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import gsap from 'gsap';
import { useAuth } from '../../contexts/AuthContext';
import {
  listDriveFiles, searchDriveFiles, listDriveFolders, uploadToDrive,
  formatMimeType, GDriveFile, getDriveDownloadUrl,
} from '../../lib/googleDrive';

const MIME_ICONS: Record<string, React.ElementType> = {
  'application/vnd.google-apps.folder': Folder,
  'application/pdf': FileText,
  'image/jpeg': ImageIcon,
  'image/png': ImageIcon,
  'video/mp4': Video,
};

function getMimeIcon(mimeType: string) {
  return MIME_ICONS[mimeType] ?? File;
}

function getMimeColor(mimeType: string) {
  if (mimeType.includes('folder')) return 'text-amber-500';
  if (mimeType.includes('image')) return 'text-emerald-500';
  if (mimeType.includes('video')) return 'text-purple-500';
  if (mimeType.includes('pdf')) return 'text-red-500';
  if (mimeType.includes('google-apps.document')) return 'text-blue-500';
  if (mimeType.includes('google-apps.spreadsheet')) return 'text-green-500';
  if (mimeType.includes('google-apps.presentation')) return 'text-yellow-500';
  return 'text-text-muted';
}

function formatSize(bytes?: string) {
  if (!bytes) return '';
  const b = parseInt(bytes);
  if (b >= 1024 * 1024 * 1024) return `${(b / 1024 / 1024 / 1024).toFixed(1)} GB`;
  if (b >= 1024 * 1024) return `${(b / 1024 / 1024).toFixed(1)} MB`;
  if (b >= 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${b} B`;
}

export default function DriveModule() {
  const { googleAccessToken, refreshGoogleToken } = useAuth();

  const [files, setFiles] = useState<GDriveFile[]>([]);
  const [folders, setFolders] = useState<GDriveFile[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<GDriveFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'images' | 'videos' | 'docs' | 'sheets'>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current?.children || [], {
        y: 20, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
      });
    });
    return () => ctx.revert();
  }, []);

  const load = useCallback(async (token: string, folderId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const [fileList, folderList] = await Promise.all([
        listDriveFiles(token, { folderId, pageSize: 50 }),
        listDriveFolders(token),
      ]);
      setFiles(fileList.filter((f) => f.mimeType !== 'application/vnd.google-apps.folder'));
      setFolders(folderList);
    } catch (err: any) {
      if (err.status === 401) setError('Google token expired. Please reconnect.');
      else setError(err.message || 'Failed to load Drive files.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (googleAccessToken) load(googleAccessToken);
  }, [googleAccessToken, load]);

  const handleReconnect = async () => {
    const token = await refreshGoogleToken();
    if (token) load(token, selectedFolder?.id);
  };

  const handleSearch = async () => {
    if (!googleAccessToken || !searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const results = await searchDriveFiles(googleAccessToken, searchQuery);
      setFiles(results.filter((f) => f.mimeType !== 'application/vnd.google-apps.folder'));
    } catch (err: any) {
      setError(err.message || 'Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !googleAccessToken) return;
    setUploading(true);
    try {
      const uploaded = await uploadToDrive(googleAccessToken, file, selectedFolder?.id);
      setFiles((prev) => [uploaded, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
    e.target.value = '';
  };

  const openFolder = (folder: GDriveFile) => {
    setSelectedFolder(folder);
    setSearchQuery('');
    if (googleAccessToken) load(googleAccessToken, folder.id);
  };

  const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'images', label: 'Images', q: 'image/' },
    { key: 'videos', label: 'Videos', q: 'video/' },
    { key: 'docs', label: 'Docs', q: 'google-apps.document' },
    { key: 'sheets', label: 'Sheets', q: 'google-apps.spreadsheet' },
  ] as const;

  const filteredFiles = files.filter((f) => {
    const matchSearch = !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchSearch) return false;
    if (filterType === 'all') return true;
    const filter = FILTERS.find((fi) => fi.key === filterType);
    return filter && 'q' in filter ? f.mimeType.includes(filter.q) : true;
  });

  return (
    <div className="max-w-[1160px] mx-auto">
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} />

      {/* Header */}
      <div ref={headerRef} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          {selectedFolder && (
            <button
              onClick={() => { setSelectedFolder(null); if (googleAccessToken) load(googleAccessToken); }}
              className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary mb-3 transition-colors font-sans"
            >
              <HardDrive className="w-4 h-4" /> My Drive
            </button>
          )}
          <h1 className="font-serif text-3xl text-text-ink mb-2">
            {selectedFolder ? selectedFolder.name : 'Google Drive'}
          </h1>
          <p className="text-sm text-text-muted font-sans font-light">
            {googleAccessToken
              ? `${filteredFiles.length} files${selectedFolder ? ` in ${selectedFolder.name}` : ''}`
              : 'Connect Google to browse your Drive files.'}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {googleAccessToken && (
            <>
              <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="relative flex">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (!e.target.value && googleAccessToken) load(googleAccessToken, selectedFolder?.id);
                  }}
                  placeholder="Search Drive…"
                  className="pl-9 bg-surface-hi border-surface-mid w-48"
                />
              </form>
              <Button variant="ghost" size="sm" onClick={() => load(googleAccessToken, selectedFolder?.id)} disabled={loading}
                className="border border-surface-mid bg-surface-hi text-text-ink">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                size="sm"
                className="flex items-center gap-2 bg-primary text-on-primary hover:bg-primary/90"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? 'Uploading…' : 'Upload'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="flex-1 text-sm font-sans">{error}</span>
          <Button size="sm" onClick={handleReconnect} className="bg-amber-600 text-white hover:bg-amber-700 shrink-0">Reconnect</Button>
          <button onClick={() => setError(null)}><X className="w-4 h-4 opacity-40 hover:opacity-100" /></button>
        </div>
      )}

      {/* No token */}
      {!googleAccessToken && !error && (
        <div className="p-12 rounded-2xl border-2 border-dashed border-outline-variant/30 text-center space-y-4">
          <HardDrive className="w-16 h-16 text-outline-variant/40 mx-auto" />
          <p className="font-sans text-on-surface-variant/60">Connect Google Drive to browse, upload and manage files.</p>
          <Button onClick={handleReconnect} className="bg-primary text-on-primary hover:bg-primary/90">Connect Google</Button>
        </div>
      )}

      {googleAccessToken && (
        <>
          {/* Folder chips */}
          {!selectedFolder && folders.length > 0 && (
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
              {folders.slice(0, 10).map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => openFolder(folder)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-colors text-sm font-sans font-medium whitespace-nowrap shrink-0"
                >
                  <Folder className="w-4 h-4" />
                  {folder.name}
                </button>
              ))}
            </div>
          )}

          {/* Type filters */}
          <div className="flex gap-1 mb-6 p-1 bg-surface-hi rounded-xl w-fit border border-surface-lo">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key)}
                className={`px-4 py-2 rounded-lg text-sm font-sans font-medium capitalize transition-all ${filterType === f.key ? 'bg-primary text-on-primary shadow-sm' : 'text-text-muted hover:text-text-ink'}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* File list */}
          {loading ? (
            <div className="flex items-center justify-center p-16 gap-3 text-text-muted">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="font-sans text-sm">Loading from Google Drive…</span>
            </div>
          ) : (
            <div ref={listRef}>
              <Card className="bg-surface-hi border-none rounded-2xl overflow-hidden">
                {filteredFiles.length === 0 ? (
                  <p className="p-12 text-center text-sm text-text-muted font-sans font-light">
                    {searchQuery ? `No results for "${searchQuery}"` : 'No files found.'}
                  </p>
                ) : (
                  <div className="divide-y divide-surface-lo">
                    {filteredFiles.map((file) => {
                      const Icon = getMimeIcon(file.mimeType);
                      const color = getMimeColor(file.mimeType);
                      return (
                        <div
                          key={file.id}
                          className="px-6 py-4 flex items-center gap-4 hover:bg-surface-lo transition-colors group"
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-surface-mid shrink-0 ${color}`}>
                            <Icon className="w-5 h-5" />
                          </div>

                          {file.thumbnailLink && (
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 hidden sm:block">
                              <img src={file.thumbnailLink} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <p className="font-sans font-medium text-text-ink truncate group-hover:text-primary transition-colors text-[0.95rem]">
                              {file.name}
                            </p>
                            <div className="flex items-center gap-3 mt-1 text-[0.68rem] text-text-muted font-sans uppercase tracking-wider">
                              <span>{formatMimeType(file.mimeType)}</span>
                              {file.size && <><span>·</span><span>{formatSize(file.size)}</span></>}
                              <span>·</span>
                              <span>{new Date(file.modifiedTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              {file.starred && <Star className="w-3 h-3 text-amber-500" />}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg text-text-ghost hover:text-primary hover:bg-primary/10 transition-all"
                                title="Open in Drive"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            {file.size && googleAccessToken && (
                              <a
                                href={getDriveDownloadUrl(file.id, googleAccessToken)}
                                download={file.name}
                                className="p-2 rounded-lg text-text-ghost hover:text-primary hover:bg-primary/10 transition-all"
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
