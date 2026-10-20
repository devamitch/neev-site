import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Users, Search, Phone, Mail, RefreshCw, AlertCircle, X, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import gsap from 'gsap';
import { useAuth } from '../../contexts/AuthContext';
import { listContacts, searchContacts, ParsedContact } from '../../lib/googleContacts';

function ContactCard({ contact, onClick, selected }: {
  contact: ParsedContact;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`px-5 py-4 flex items-center gap-4 hover:bg-surface-lo transition-colors cursor-pointer group ${selected ? 'bg-primary/5 border-l-2 border-primary' : ''}`}
    >
      <Avatar className="w-10 h-10 rounded-full shrink-0">
        {contact.photoUrl && <AvatarImage src={contact.photoUrl} alt={contact.displayName} />}
        <AvatarFallback className="bg-primary/10 text-primary font-serif">
          {contact.displayName?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className={`text-[0.95rem] font-sans font-medium truncate ${selected ? 'text-primary' : 'text-text-ink group-hover:text-primary transition-colors'}`}>
          {contact.displayName || contact.email}
        </p>
        <p className="text-xs text-text-muted font-sans font-light truncate">{contact.email || contact.phone}</p>
      </div>
      {contact.organization && (
        <span className="text-[0.6rem] font-sans uppercase tracking-widest text-text-ghost shrink-0 hidden sm:block">
          {contact.organization}
        </span>
      )}
    </div>
  );
}

export default function ContactsModule() {
  const { googleAccessToken, refreshGoogleToken } = useAuth();

  const [contacts, setContacts] = useState<ParsedContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<ParsedContact | null>(null);

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

  const load = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listContacts(token, 100);
      setContacts(data);
    } catch (err: any) {
      if (err.status === 401) setError('Google token expired. Please reconnect.');
      else setError(err.message || 'Failed to load contacts.');
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleAccessToken) return;
    if (!searchQuery.trim()) { load(googleAccessToken); return; }
    setSearching(true);
    try {
      const results = await searchContacts(googleAccessToken, searchQuery);
      setContacts(results);
    } catch (err: any) {
      setError(err.message || 'Search failed.');
    } finally {
      setSearching(false);
    }
  };

  // Group contacts by first letter
  const grouped = contacts.reduce<Record<string, ParsedContact[]>>((acc, c) => {
    const letter = c.displayName?.charAt(0)?.toUpperCase() || '#';
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(c);
    return acc;
  }, {});
  const letters = Object.keys(grouped).sort();

  return (
    <div className="max-w-[1160px] mx-auto">
      {/* Header */}
      <div ref={headerRef} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="font-serif text-3xl text-text-ink mb-2">Contacts</h1>
          <p className="text-sm text-text-muted font-sans font-light">
            {googleAccessToken ? `${contacts.length} contacts synced from Google` : 'Connect Google to view your contacts.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {googleAccessToken && (
            <>
              <form onSubmit={handleSearch} className="relative flex">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contacts…"
                  className="pl-9 bg-surface-hi border-surface-mid w-52"
                />
              </form>
              <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); load(googleAccessToken); }} disabled={loading}
                className="border border-surface-mid bg-surface-hi text-text-ink">
                <RefreshCw className={`w-4 h-4 ${loading || searching ? 'animate-spin' : ''}`} />
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
          <Users className="w-16 h-16 text-outline-variant/40 mx-auto" />
          <p className="font-sans text-on-surface-variant/60">Connect Google Contacts to manage your family and personal contacts.</p>
          <Button onClick={handleReconnect} className="bg-primary text-on-primary hover:bg-primary/90">Connect Google</Button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center p-16 gap-3 text-text-muted">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-sans text-sm">Loading contacts from Google…</span>
        </div>
      )}

      {!loading && googleAccessToken && (
        <div className="flex gap-8">
          {/* Contact list */}
          <div className="flex-1 min-w-0">
            <div ref={listRef}>
              <Card className="bg-surface-hi border-none rounded-2xl overflow-hidden">
                {contacts.length === 0 ? (
                  <div className="p-12 text-center">
                    <Users className="w-12 h-12 text-surface-mid mx-auto mb-3" />
                    <p className="text-sm text-text-muted font-sans">
                      {searchQuery ? `No contacts matching "${searchQuery}"` : 'No contacts found.'}
                    </p>
                  </div>
                ) : (
                  <div>
                    {letters.map((letter) => (
                      <div key={letter}>
                        <div className="px-5 py-2 bg-surface-lo/50 border-y border-surface-lo sticky top-0">
                          <span className="text-[0.68rem] font-sans font-bold uppercase tracking-[0.3em] text-text-muted">{letter}</span>
                        </div>
                        <div className="divide-y divide-surface-lo">
                          {grouped[letter].map((c) => (
                            <div key={c.id}>
                              <ContactCard
                                contact={c}
                                onClick={() => setSelected(selected?.id === c.id ? null : c)}
                                selected={selected?.id === c.id}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="lg:w-[340px] shrink-0">
              <Card className="bg-surface-hi border-none rounded-2xl p-8 space-y-6 sticky top-8">
                <div className="flex justify-end">
                  <button onClick={() => setSelected(null)} className="text-text-ghost hover:text-text-ink">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Avatar */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <Avatar className="w-20 h-20 rounded-full">
                    {selected.photoUrl && <AvatarImage src={selected.photoUrl} alt={selected.displayName} />}
                    <AvatarFallback className="bg-primary/10 text-primary font-serif text-3xl">
                      {selected.displayName?.charAt(0)?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-serif text-2xl text-text-ink">{selected.displayName}</h2>
                    {selected.organization && (
                      <p className="text-sm text-text-muted font-sans font-light mt-1">{selected.title ? `${selected.title} at ` : ''}{selected.organization}</p>
                    )}
                  </div>
                </div>

                {/* Contact details */}
                <div className="space-y-4 pt-4 border-t border-surface-lo">
                  {selected.email && (
                    <a href={`mailto:${selected.email}`} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-sans font-medium text-text-ink group-hover:text-primary transition-colors">{selected.email}</p>
                        <p className="text-[0.65rem] text-text-muted uppercase tracking-wider font-sans">Email</p>
                      </div>
                    </a>
                  )}
                  {selected.phone && (
                    <a href={`tel:${selected.phone}`} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-sans font-medium text-text-ink group-hover:text-primary transition-colors">{selected.phone}</p>
                        <p className="text-[0.65rem] text-text-muted uppercase tracking-wider font-sans">Phone</p>
                      </div>
                    </a>
                  )}
                  {selected.birthday && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500 shrink-0">
                        <span className="text-base">🎂</span>
                      </div>
                      <div>
                        <p className="text-sm font-sans font-medium text-text-ink">{selected.birthday}</p>
                        <p className="text-[0.65rem] text-text-muted uppercase tracking-wider font-sans">Birthday</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
