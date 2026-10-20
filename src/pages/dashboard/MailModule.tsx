import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mail, Search, RefreshCw, AlertCircle, X, Loader2, Star, Inbox, BookOpen, GraduationCap, Tag, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import gsap from 'gsap';
import { useAuth } from '../../contexts/AuthContext';
import { fetchInbox, searchMail, fetchSchoolMails, getProfile, ParsedMail } from '../../lib/googleMail';

const QUICK_FILTERS = [
  { key: 'inbox', label: 'Inbox', icon: Inbox, query: 'in:inbox' },
  { key: 'school', label: 'School', icon: GraduationCap, query: 'school OR circular OR fees OR homework OR exam OR result' },
  { key: 'unread', label: 'Unread', icon: Mail, query: 'in:inbox is:unread' },
  { key: 'starred', label: 'Starred', icon: Star, query: 'in:inbox is:starred' },
  { key: 'bills', label: 'Bills', icon: Tag, query: 'bill OR invoice OR payment OR receipt' },
] as const;

type FilterKey = typeof QUICK_FILTERS[number]['key'];

function MailRow({ mail, onClick }: { mail: ParsedMail; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`px-6 py-5 flex items-start gap-4 hover:bg-surface-lo transition-colors cursor-pointer group ${mail.isUnread ? 'bg-primary/5' : ''}`}
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-serif text-lg shrink-0">
        {mail.fromName?.charAt(0)?.toUpperCase() || mail.from.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4">
          <p className={`text-[0.95rem] font-sans truncate ${mail.isUnread ? 'font-semibold text-text-ink' : 'font-medium text-text-ink/80'}`}>
            {mail.fromName || mail.from}
          </p>
          <span className="text-[0.68rem] text-text-muted font-sans shrink-0">
            {mail.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
        <p className={`text-sm truncate mt-0.5 ${mail.isUnread ? 'text-text-ink font-medium' : 'text-text-muted'}`}>
          {mail.subject}
        </p>
        <p className="text-xs text-text-ghost truncate mt-0.5 font-sans font-light">{mail.snippet}</p>
      </div>

      {mail.isUnread && (
        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
      )}
    </div>
  );
}

export default function MailModule() {
  const { googleAccessToken, refreshGoogleToken } = useAuth();

  const [mails, setMails] = useState<ParsedMail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [selectedMail, setSelectedMail] = useState<ParsedMail | null>(null);
  const [profile, setProfile] = useState<{ emailAddress: string; messagesTotal: number } | null>(null);

  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current?.children || [], {
        y: 20, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
      });
    });
    return () => ctx.revert();
  }, []);

  const load = useCallback(async (token: string, filter: FilterKey = activeFilter) => {
    setLoading(true);
    setError(null);
    setSelectedMail(null);
    try {
      const [mailList, prof] = await Promise.all([
        filter === 'inbox'
          ? fetchInbox(token, 25)
          : filter === 'school'
          ? fetchSchoolMails(token)
          : searchMail(token, QUICK_FILTERS.find((f) => f.key === filter)!.query, 25),
        getProfile(token).catch(() => null),
      ]);
      setMails(mailList);
      if (prof) setProfile(prof);
    } catch (err: any) {
      if (err.status === 401) setError('Google token expired. Please reconnect.');
      else setError(err.message || 'Failed to load Gmail.');
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    if (googleAccessToken) load(googleAccessToken, activeFilter);
  }, [googleAccessToken, activeFilter]);

  const handleReconnect = async () => {
    const token = await refreshGoogleToken();
    if (token) load(token, activeFilter);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleAccessToken || !searchQuery.trim()) return;
    setSearching(true);
    setError(null);
    setSelectedMail(null);
    try {
      const results = await searchMail(googleAccessToken, searchQuery, 20);
      setMails(results);
    } catch (err: any) {
      setError(err.message || 'Search failed.');
    } finally {
      setSearching(false);
    }
  };

  const unreadCount = mails.filter((m) => m.isUnread).length;

  return (
    <div className="max-w-[1160px] mx-auto">
      {/* Sanctuary Privacy Shield Notification (Section 48) */}
      <div className="mb-8 p-5 bg-primary/5 border border-primary/20 rounded-2xl flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-base font-semibold text-text-ink">Sanctuary Privacy Protection: Gmail Features Blocked</h3>
          <p className="text-xs text-text-muted mt-1 leading-relaxed font-sans">
            In accordance with the Neev Privacy Architecture (Section 48), direct personal email reading and writing is permanently blocked. Your family sanctuary operates strictly on kinship graphs, rituals, and shared calendar logistics—with zero email scraping or diary inspection.
          </p>
        </div>
      </div>

      {/* Header */}
      <div ref={headerRef} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="font-serif text-3xl text-text-ink mb-2">Family Inbox (Protected)</h1>
          <p className="text-sm text-text-muted font-sans font-light">
            Sanctuary Shield Active · 0 Emails Read · Privacy Boundary Enforced
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
                  placeholder="Search mail…"
                  className="pl-9 bg-surface-hi border-surface-mid w-48"
                />
              </form>
              <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); load(googleAccessToken, activeFilter); }} disabled={loading}
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
          <Mail className="w-16 h-16 text-outline-variant/40 mx-auto" />
          <p className="font-sans text-on-surface-variant/60">Connect Gmail to see school circulars, bills and family emails.</p>
          <Button onClick={handleReconnect} className="bg-primary text-on-primary hover:bg-primary/90">Connect Google</Button>
        </div>
      )}

      {googleAccessToken && (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Filter + list */}
          <div className="flex-1 min-w-0">
            {/* Filter tabs */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {QUICK_FILTERS.map((f) => {
                const Icon = f.icon;
                return (
                  <button
                    key={f.key}
                    onClick={() => { setActiveFilter(f.key); setSearchQuery(''); }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-sans font-medium whitespace-nowrap transition-all shrink-0 ${activeFilter === f.key ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-hi border border-surface-mid text-text-muted hover:text-text-ink hover:bg-surface-lo'}`}
                  >
                    <Icon className="w-4 h-4" />
                    {f.label}
                  </button>
                );
              })}
            </div>

            <Card className="bg-surface-hi border-none rounded-2xl overflow-hidden">
              {loading || searching ? (
                <div className="flex items-center justify-center p-16 gap-3 text-text-muted">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="font-sans text-sm">
                    {searching ? 'Searching Gmail…' : 'Loading Gmail…'}
                  </span>
                </div>
              ) : mails.length === 0 ? (
                <div className="p-12 text-center">
                  <Mail className="w-12 h-12 text-surface-mid mx-auto mb-3" />
                  <p className="text-sm text-text-muted font-sans">No messages found.</p>
                </div>
              ) : (
                <div className="divide-y divide-surface-lo">
                  {mails.map((mail) => (
                    <div key={mail.id}>
                    <MailRow
                      mail={mail}
                      onClick={() => setSelectedMail(selectedMail?.id === mail.id ? null : mail)}
                    />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right: Detail panel */}
          {selectedMail && (
            <div className="lg:w-[380px] shrink-0">
              <Card className="bg-surface-hi border-none rounded-2xl p-6 space-y-5 sticky top-8">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-serif text-lg text-text-ink leading-snug">{selectedMail.subject}</h2>
                  <button onClick={() => setSelectedMail(null)} className="text-text-ghost hover:text-text-ink shrink-0">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 pb-4 border-b border-surface-lo">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-serif text-sm shrink-0">
                      {selectedMail.fromName?.charAt(0)?.toUpperCase() || selectedMail.from.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-sans font-medium text-text-ink">{selectedMail.fromName || selectedMail.from}</p>
                      <p className="text-xs text-text-muted font-sans">{selectedMail.from}</p>
                    </div>
                  </div>
                  <p className="text-[0.68rem] text-text-muted font-sans uppercase tracking-wider">
                    {selectedMail.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[0.68rem] text-text-muted font-sans uppercase tracking-widest font-bold">Preview</p>
                  <p className="text-sm text-text-ink font-sans font-light leading-relaxed">{selectedMail.snippet}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedMail.labelIds
                    .filter((l) => !['INBOX', 'UNREAD', 'CATEGORY_PERSONAL'].includes(l))
                    .slice(0, 3)
                    .map((label) => (
                      <span key={label} className="text-[0.6rem] font-sans font-bold uppercase tracking-widest text-primary bg-primary-container px-2 py-1 rounded-full">
                        {label.replace('CATEGORY_', '').toLowerCase()}
                      </span>
                    ))}
                </div>

                {selectedMail.isUnread && (
                  <div className="flex items-center gap-2 text-xs text-primary font-sans font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Unread
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
