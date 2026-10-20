import React, { useState, useEffect, useRef } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Plus, X, Loader2, RefreshCw, AlertCircle, Trash2, MapPin, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import gsap from 'gsap';
import { useAuth } from '../../contexts/AuthContext';
import { GCalEvent } from '../../lib/googleCalendar';
import { useCalendarEvents, useCreateEvent, useDeleteEvent } from '../../hooks/useGoogleCalendar';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

type CalEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: GCalEvent;
};

export default function CalendarModule() {
  const { googleAccessToken, refreshGoogleToken } = useAuth();
  const [view, setView] = useState('week');
  const [date, setDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalEvent | null>(null);

  // Form state
  const [form, setForm] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    description: '',
    attendees: '',
    allDay: false,
  });

  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const { data: rawEvents, isLoading, error, refetch } = useCalendarEvents(date);
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();

  const events: CalEvent[] = (rawEvents || []).map(ev => ({
    id: ev.id,
    title: ev.summary || '(No title)',
    start: ev.start.dateTime ? new Date(ev.start.dateTime) : new Date(ev.start.date!),
    end: ev.end.dateTime ? new Date(ev.end.dateTime) : new Date(ev.end.date!),
    resource: ev,
  }));

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(headerRef.current?.children || [], { y: 20, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' })
        .from(cardRef.current, { y: 30, opacity: 0, duration: 1, ease: 'expo.out' }, '-=0.4');
    });
    return () => ctx.revert();
  }, []);

  const handleReconnect = async () => {
    await refreshGoogleToken();
    refetch();
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const base = new Date(form.date);
    let start: Date, end: Date;
    if (form.allDay) {
      start = base; end = base;
    } else {
      const [sh, sm] = form.startTime.split(':').map(Number);
      const [eh, em] = form.endTime.split(':').map(Number);
      start = new Date(base); start.setHours(sh, sm, 0, 0);
      end = new Date(base); end.setHours(eh, em, 0, 0);
    }
    const attendees = form.attendees.split(',').map(s => s.trim()).filter(Boolean);
    await createEvent.mutateAsync({
      summary: form.title.trim(),
      description: form.description.trim() || undefined,
      location: form.location.trim() || undefined,
      start, end, attendees, allDay: form.allDay,
    });
    setForm({ title: '', date: format(new Date(), 'yyyy-MM-dd'), startTime: '09:00', endTime: '10:00', location: '', description: '', attendees: '', allDay: false });
    setShowForm(false);
  };

  const handleDeleteEvent = async (eventId: string) => {
    await deleteEvent.mutateAsync(eventId);
    setSelectedEvent(null);
  };

  const eventStyleGetter = () => ({
    style: {
      backgroundColor: '#F0F4F0',
      color: '#3D3F38',
      border: 'none',
      borderLeft: '3px solid #7D8C7D',
      borderRadius: '4px',
      fontSize: '0.85rem',
      padding: '2px 6px',
    },
  });

  const errorMsg = error ? (error as any)?.message || 'Failed to load calendar.' : null;
  const isTokenError = errorMsg?.includes('401') || (error as any)?.status === 401;

  return (
    <div className="max-w-[1160px] mx-auto">
      <div ref={headerRef} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="font-serif text-3xl text-text-ink mb-2">Family Calendar</h1>
          <p className="text-sm text-text-muted font-sans font-light">
            {googleAccessToken ? 'Live sync with Google Calendar.' : 'Connect Google to see your real calendar.'}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          {googleAccessToken && (
            <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isLoading}
              className="flex items-center gap-2 border border-surface-mid hover:bg-surface-lo bg-surface-hi text-text-ink">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Sync
            </Button>
          )}
          <Button size="sm"
            className="flex items-center gap-2 bg-primary text-on-primary hover:bg-primary/90"
            onClick={() => { if (!googleAccessToken) { handleReconnect(); } else { setShowForm(v => !v); } }}>
            <Plus className="w-4 h-4" />
            {googleAccessToken ? 'Book Event' : 'Connect Google'}
          </Button>
        </div>
      </div>

      {(errorMsg || isTokenError) && (
        <div className="mb-4 flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="flex-1 text-sm">{isTokenError ? 'Google token expired. Please reconnect.' : errorMsg}</span>
          <Button size="sm" onClick={handleReconnect} className="bg-amber-600 text-white hover:bg-amber-700 shrink-0">Reconnect</Button>
        </div>
      )}

      {!googleAccessToken && !error && (
        <div className="mb-6 flex items-center gap-4 p-5 bg-primary-container/20 border border-primary/20 rounded-2xl">
          <div className="flex-1">
            <p className="font-sans font-medium text-on-surface text-sm">Connect your Google Account to see real events</p>
            <p className="text-xs text-on-surface-variant font-light mt-0.5">Your calendar stays private.</p>
          </div>
          <Button onClick={handleReconnect} size="sm" className="bg-primary text-on-primary hover:bg-primary/90 shrink-0">
            Connect Google
          </Button>
        </div>
      )}

      {showForm && googleAccessToken && (
        <Card className="mb-6 p-6 border border-outline-variant/30 bg-surface-hi rounded-2xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-xl text-text-ink">Book Event / Meeting</h2>
            <button onClick={() => setShowForm(false)} className="text-text-muted hover:text-text-ink transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleAddEvent} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[0.68rem] font-sans font-medium uppercase tracking-wider text-text-muted">Event Title *</label>
                <Input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="e.g. Doctor Appointment, Team Meeting" className="bg-surface-lo border-none" required />
              </div>
              <div className="space-y-1">
                <label className="text-[0.68rem] font-sans font-medium uppercase tracking-wider text-text-muted">Date *</label>
                <Input type="date" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} className="bg-surface-lo border-none" required />
              </div>
              <div className="space-y-1">
                <label className="text-[0.68rem] font-sans font-medium uppercase tracking-wider text-text-muted">All Day?</label>
                <label className="flex items-center gap-3 h-10 cursor-pointer">
                  <input type="checkbox" checked={form.allDay} onChange={e => setForm(f => ({...f, allDay: e.target.checked}))} className="w-4 h-4 accent-sage" />
                  <span className="text-sm font-sans text-text-ink">All day event</span>
                </label>
              </div>
              {!form.allDay && (
                <>
                  <div className="space-y-1">
                    <label className="text-[0.68rem] font-sans font-medium uppercase tracking-wider text-text-muted">Start Time</label>
                    <Input type="time" value={form.startTime} onChange={e => setForm(f => ({...f, startTime: e.target.value}))} className="bg-surface-lo border-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[0.68rem] font-sans font-medium uppercase tracking-wider text-text-muted">End Time</label>
                    <Input type="time" value={form.endTime} onChange={e => setForm(f => ({...f, endTime: e.target.value}))} className="bg-surface-lo border-none" />
                  </div>
                </>
              )}
              <div className="space-y-1">
                <label className="text-[0.68rem] font-sans font-medium uppercase tracking-wider text-text-muted flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</label>
                <Input value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} placeholder="e.g. Home, Office, Google Meet" className="bg-surface-lo border-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[0.68rem] font-sans font-medium uppercase tracking-wider text-text-muted flex items-center gap-1"><Users className="w-3 h-3" /> Attendees</label>
                <Input value={form.attendees} onChange={e => setForm(f => ({...f, attendees: e.target.value}))} placeholder="email1@gmail.com, email2@gmail.com" className="bg-surface-lo border-none" />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[0.68rem] font-sans font-medium uppercase tracking-wider text-text-muted flex items-center gap-1"><FileText className="w-3 h-3" /> Description</label>
                <Input value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Add notes or agenda…" className="bg-surface-lo border-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" disabled={createEvent.isPending || !form.title.trim()} className="bg-primary text-on-primary hover:bg-primary/90 px-8">
                {createEvent.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {createEvent.isPending ? 'Creating…' : 'Create Event'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {selectedEvent && (
        <Card className="mb-6 p-6 border border-outline-variant/30 bg-surface-hi rounded-2xl">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <h2 className="font-serif text-2xl text-text-ink">{selectedEvent.title}</h2>
              <p className="text-sm text-text-muted font-sans">
                {format(selectedEvent.start, 'EEEE, MMMM d · h:mm a')} – {format(selectedEvent.end, 'h:mm a')}
              </p>
              {selectedEvent.resource.location && (
                <p className="text-sm text-text-muted flex items-center gap-2"><MapPin className="w-3 h-3" />{selectedEvent.resource.location}</p>
              )}
              {selectedEvent.resource.description && (
                <p className="text-sm text-text-muted font-light">{selectedEvent.resource.description}</p>
              )}
              {(selectedEvent.resource.attendees?.length ?? 0) > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Users className="w-3 h-3 text-text-muted" />
                  {selectedEvent.resource.attendees!.map(a => (
                    <span key={a.email} className="text-xs bg-surface-lo px-2 py-1 rounded-full text-text-muted">{a.displayName || a.email}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button size="sm" variant="ghost" onClick={() => handleDeleteEvent(selectedEvent.id)}
                disabled={deleteEvent.isPending}
                className="text-red-500 hover:bg-red-50 hover:text-red-600">
                {deleteEvent.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </Button>
              <button onClick={() => setSelectedEvent(null)} className="text-text-muted hover:text-text-ink transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Card>
      )}

      <div ref={cardRef}>
        <Card className="bg-surface-hi border-none rounded-md p-6 h-[600px] relative">
          {isLoading && (
            <div className="absolute inset-0 bg-surface-hi/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-md">
              <div className="flex items-center gap-3 text-text-muted">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="font-sans text-sm">Loading your calendar…</span>
              </div>
            </div>
          )}
          <style>{`
            .rbc-calendar { font-family: 'Manrope', sans-serif; }
            .rbc-header { padding: 10px 0; font-weight: 500; color: #7A7C72; border-bottom: 1px solid #EFEEE0; }
            .rbc-today { background-color: #FBFAEE; }
            .rbc-time-view { border: none; }
            .rbc-time-header { border-bottom: 1px solid #EFEEE0; }
            .rbc-time-content { border-top: none; }
            .rbc-timeslot-group { border-bottom: 1px solid #F5F4E8; }
            .rbc-day-slot .rbc-time-slot { border-top: 1px solid #F5F4E8; }
            .rbc-event { padding: 0; }
            .rbc-toolbar button { color: #3D3F38; border: 1px solid #EFEEE0; border-radius: 4px; padding: 6px 12px; margin-right: 8px; font-family: 'Manrope', sans-serif; font-size: 0.875rem; transition: all 0.2s ease; }
            .rbc-toolbar button:hover { background-color: #F5F4E8; }
            .rbc-toolbar button.rbc-active { background-color: #7D8C7D; color: white; border-color: #7D8C7D; box-shadow: none; }
            .rbc-toolbar button:active, .rbc-toolbar button:focus { box-shadow: none; outline: none; }
          `}</style>
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            view={view as any}
            onView={newView => setView(newView)}
            date={date}
            onNavigate={newDate => setDate(newDate)}
            eventPropGetter={eventStyleGetter as any}
            views={['month', 'week', 'day']}
            onSelectEvent={ev => setSelectedEvent(ev as CalEvent)}
          />
        </Card>
      </div>
    </div>
  );
}
