export interface GContact {
  resourceName: string;
  etag?: string;
  names?: { displayName: string; givenName?: string; familyName?: string }[];
  emailAddresses?: { value: string; type?: string }[];
  phoneNumbers?: { value: string; type?: string }[];
  photos?: { url: string; default?: boolean }[];
  birthdays?: { date?: { year?: number; month: number; day: number }; text?: string }[];
  organizations?: { name?: string; title?: string }[];
  addresses?: { formattedValue?: string; type?: string }[];
}

export interface ParsedContact {
  id: string;
  displayName: string;
  givenName: string;
  familyName: string;
  email: string;
  phone: string;
  photoUrl: string;
  birthday: string;
  organization: string;
  title: string;
}

const BASE = 'https://people.googleapis.com/v1';
const PERSON_FIELDS = 'names,emailAddresses,phoneNumbers,photos,birthdays,organizations,addresses';

async function gFetch(url: string, token: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.error?.message || `HTTP ${res.status}`), { status: res.status });
  return data;
}

function parseContact(c: GContact): ParsedContact {
  const name = c.names?.[0];
  const email = c.emailAddresses?.[0]?.value ?? '';
  const phone = c.phoneNumbers?.[0]?.value ?? '';
  const photo = c.photos?.find((p) => !p.default)?.url ?? c.photos?.[0]?.url ?? '';
  const bday = c.birthdays?.[0];
  const birthday = bday?.text ?? (bday?.date ? `${bday.date.month}/${bday.date.day}` : '');
  const org = c.organizations?.[0];
  return {
    id: c.resourceName,
    displayName: name?.displayName ?? '',
    givenName: name?.givenName ?? '',
    familyName: name?.familyName ?? '',
    email,
    phone,
    photoUrl: photo,
    birthday,
    organization: org?.name ?? '',
    title: org?.title ?? '',
  };
}

export async function listContacts(
  token: string,
  pageSize = 100
): Promise<ParsedContact[]> {
  const params = new URLSearchParams({
    personFields: PERSON_FIELDS,
    pageSize: String(pageSize),
    sortOrder: 'FIRST_NAME_ASCENDING',
  });
  const data = await gFetch(`${BASE}/people/me/connections?${params}`, token);
  return (data?.connections ?? []).map(parseContact);
}

export async function getContact(token: string, resourceName: string): Promise<ParsedContact> {
  const data = await gFetch(`${BASE}/${resourceName}?personFields=${PERSON_FIELDS}`, token);
  return parseContact(data);
}

export async function searchContacts(token: string, query: string): Promise<ParsedContact[]> {
  const params = new URLSearchParams({ query, readMask: PERSON_FIELDS, pageSize: '20' });
  const data = await gFetch(`${BASE}/people:searchContacts?${params}`, token);
  return (data?.results ?? []).map((r: any) => parseContact(r.person));
}
