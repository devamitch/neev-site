export interface GCalEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime?: string; date?: string; timeZone?: string };
  end: { dateTime?: string; date?: string; timeZone?: string };
  attendees?: { email: string; displayName?: string; responseStatus?: string }[];
  htmlLink?: string;
  colorId?: string;
  status?: string;
}

export interface CreateEventInput {
  summary: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
  attendees?: string[]; // email addresses
  allDay?: boolean;
}

const BASE = 'https://www.googleapis.com/calendar/v3';

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

export async function fetchCalendarEvents(token: string, timeMin: Date, timeMax: Date): Promise<GCalEvent[]> {
  const params = new URLSearchParams({
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '250',
  });
  const data = await gFetch(`${BASE}/calendars/primary/events?${params}`, token);
  return data?.items ?? [];
}

export async function createCalendarEvent(token: string, input: CreateEventInput): Promise<GCalEvent> {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const body: any = {
    summary: input.summary,
    ...(input.description && { description: input.description }),
    ...(input.location && { location: input.location }),
    ...(input.attendees?.length && { attendees: input.attendees.map(email => ({ email })) }),
  };
  if (input.allDay) {
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    body.start = { date: fmt(input.start) };
    body.end = { date: fmt(input.end) };
  } else {
    body.start = { dateTime: input.start.toISOString(), timeZone: tz };
    body.end = { dateTime: input.end.toISOString(), timeZone: tz };
  }
  return gFetch(`${BASE}/calendars/primary/events`, token, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function deleteCalendarEvent(token: string, eventId: string): Promise<void> {
  await gFetch(`${BASE}/calendars/primary/events/${eventId}`, token, { method: 'DELETE' });
}

export async function updateCalendarEvent(token: string, eventId: string, input: Partial<CreateEventInput>): Promise<GCalEvent> {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const body: any = {};
  if (input.summary) body.summary = input.summary;
  if (input.description) body.description = input.description;
  if (input.location) body.location = input.location;
  if (input.start) body.start = { dateTime: input.start.toISOString(), timeZone: tz };
  if (input.end) body.end = { dateTime: input.end.toISOString(), timeZone: tz };
  if (input.attendees) body.attendees = input.attendees.map(email => ({ email }));
  return gFetch(`${BASE}/calendars/primary/events/${eventId}`, token, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}
