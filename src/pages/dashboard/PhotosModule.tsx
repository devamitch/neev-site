import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Image as ImageIcon, Grid, BookOpen, RefreshCw, AlertCircle, X, ChevronLeft, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import gsap from 'gsap';
import { useAuth } from '../../contexts/AuthContext';
import {
  listAlbums,
  listMediaItems,
  getAlbumMedia,
  GPhotoAlbum,
  GMediaItem,
} from '../../lib/googlePhotos';

export default function PhotosModule() {
  const { googleAccessToken, refreshGoogleToken } = useAuth();

  const [albums, setAlbums] = useState<GPhotoAlbum[]>([]);
  const [mediaItems, setMediaItems] = useState<GMediaItem[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<GPhotoAlbum | null>(null);
  const [view, setView] = useState<'albums' | 'grid'>('albums');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<GMediaItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current?.children || [], {
        y: 20, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
      });
    });
    return () => ctx.revert();
  }, []);

  const load = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const [albs, items] = await Promise.all([listAlbums(token), listMediaItems(token, 50)]);
      setAlbums(albs);
      setMediaItems(items);
    } catch (err: any) {
      if (err.status === 401) setError('Google token expired. Please reconnect.');
      else setError(err.message || 'Failed to load Google Photos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (googleAccessToken) load(googleAccessToken);
  }, [googleAccessToken, load]);

  const handleReconnect = async () => {
    const token = await refreshGoogleToken();
    if (token) load(token);
  };

  const openAlbum = async (album: GPhotoAlbum) => {
    if (!googleAccessToken) return;
    setSelectedAlbum(album);
    setView('grid');
    setLoading(true);
    setError(null);
    try {
      const items = await getAlbumMedia(googleAccessToken, album.id);
      setMediaItems(items);
    } catch (err: any) {
      setError(err.message || 'Failed to load album.');
    } finally {
      setLoading(false);
    }
    gsap.from(gridRef.current?.children || [], {
      scale: 0.9, opacity: 0, stagger: 0.04, duration: 0.6, ease: 'expo.out',
    });
  };

  const backToAlbums = () => {
    setSelectedAlbum(null);
    setView('albums');
    if (googleAccessToken) load(googleAccessToken);
  };

  const filteredAlbums = albums.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredMedia = mediaItems.filter((m) =>
    m.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1160px] mx-auto">
      {/* Header */}
      <div ref={headerRef} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          {selectedAlbum && (
            <button
              onClick={backToAlbums}
              className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary mb-3 transition-colors font-sans"
            >
              <ChevronLeft className="w-4 h-4" /> All Albums
            </button>
          )}
          <h1 className="font-serif text-3xl text-text-ink mb-2">
            {selectedAlbum ? selectedAlbum.title : 'Family Memories'}
          </h1>
          <p className="text-sm text-text-muted font-sans font-light">
            {googleAccessToken
              ? selectedAlbum
                ? `${filteredMedia.length} photos in this album`
                : `${albums.length} albums · ${mediaItems.length} recent photos`
              : 'Connect Google to view your family photos.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {googleAccessToken && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search photos…"
                  className="pl-9 bg-surface-hi border-surface-mid w-48"
                />
              </div>
              <Button variant="ghost" size="sm" onClick={() => googleAccessToken && load(googleAccessToken)} disabled={loading}
                className="border border-surface-mid bg-surface-hi text-text-ink">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </>
          )}
          {!selectedAlbum && googleAccessToken && (
            <div className="flex gap-1 p-1 bg-surface-hi border border-surface-mid rounded-xl">
              <button
                onClick={() => setView('albums')}
                className={`px-3 py-2 rounded-lg text-sm font-sans font-medium transition-all ${view === 'albums' ? 'bg-primary text-on-primary' : 'text-text-muted hover:text-text-ink'}`}
              >
                <BookOpen className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('grid')}
                className={`px-3 py-2 rounded-lg text-sm font-sans font-medium transition-all ${view === 'grid' ? 'bg-primary text-on-primary' : 'text-text-muted hover:text-text-ink'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
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
          <ImageIcon className="w-16 h-16 text-outline-variant/40 mx-auto" />
          <p className="font-sans text-on-surface-variant/60">Connect Google Photos to see your family memories.</p>
          <Button onClick={handleReconnect} className="bg-primary text-on-primary hover:bg-primary/90">Connect Google</Button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center p-16 gap-3 text-text-muted">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-sans text-sm">Loading from Google Photos…</span>
        </div>
      )}

      {/* Albums view */}
      {!loading && googleAccessToken && view === 'albums' && !selectedAlbum && (
        <div className="space-y-10">
          {/* Album grid */}
          {filteredAlbums.length > 0 && (
            <div>
              <h2 className="font-serif text-xl text-text-ink mb-5">Albums</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredAlbums.map((album) => (
                  <div
                    key={album.id}
                    onClick={() => openAlbum(album)}
                    className="group cursor-pointer rounded-2xl overflow-hidden border border-surface-mid hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                  >
                    <div className="aspect-square bg-surface-mid overflow-hidden">
                      {album.coverPhotoBaseUrl ? (
                        <img
                          src={`${album.coverPhotoBaseUrl}=w400-h400-c`}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-surface-hi">
                          <BookOpen className="w-10 h-10 text-outline-variant/40" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-surface-hi">
                      <h3 className="font-serif text-base text-text-ink truncate">{album.title}</h3>
                      {album.mediaItemsCount && (
                        <p className="text-[0.68rem] text-text-muted font-sans uppercase tracking-wider mt-1">
                          {album.mediaItemsCount} items
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent photos */}
          <div>
            <h2 className="font-serif text-xl text-text-ink mb-5">Recent Photos</h2>
            <div ref={gridRef} className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {filteredMedia.slice(0, 24).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setLightbox(item)}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer group"
                >
                  <img
                    src={`${item.baseUrl}=w300-h300-c`}
                    alt={item.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
            {filteredMedia.length === 0 && !loading && (
              <p className="text-sm text-text-muted font-sans font-light text-center py-8">No photos found.</p>
            )}
          </div>
        </div>
      )}

      {/* Grid view / Album detail */}
      {!loading && googleAccessToken && (view === 'grid' || selectedAlbum) && (
        <div ref={gridRef} className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightbox(item)}
              className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative"
            >
              <img
                src={`${item.baseUrl}=w400-h400-c`}
                alt={item.filename}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {item.mimeType.startsWith('video/') && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-transparent border-l-text-ink ml-1" />
                  </div>
                </div>
              )}
            </div>
          ))}
          {filteredMedia.length === 0 && (
            <div className="col-span-full p-12 text-center text-sm text-text-muted font-sans">No photos in this album.</div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-4xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={`${lightbox.baseUrl}=w1600-h1200`}
              alt={lightbox.filename}
              className="max-w-full max-h-[80vh] rounded-xl object-contain"
            />
            <div className="mt-3 text-center">
              <p className="text-white/70 text-sm font-sans">{lightbox.filename}</p>
              <p className="text-white/40 text-xs font-sans mt-1">
                {new Date(lightbox.mediaMetadata.creationTime).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
