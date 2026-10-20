export interface FitDataPoint {
  startTimeNanos: string;
  endTimeNanos: string;
  value: { intVal?: number; fpVal?: number }[];
}

export interface FitAggregateResult {
  steps: number;
  calories: number;
  activeMinutes: number;
  heartRateAvg: number;
  distance: number; // metres
}

const BASE = 'https://www.googleapis.com/fitness/v1/users/me';

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

function toNanos(date: Date): string {
  return String(date.getTime() * 1_000_000);
}

function extractValue(bucket: any, dataTypeName: string): number {
  const ds = bucket.dataset?.find((d: any) => d.dataSourceId?.includes(dataTypeName));
  if (!ds?.point?.length) return 0;
  const point = ds.point[0];
  return point.value?.[0]?.intVal ?? point.value?.[0]?.fpVal ?? 0;
}

export async function fetchFitAggregate(
  token: string,
  startDate: Date,
  endDate: Date
): Promise<FitAggregateResult> {
  const body = {
    aggregateBy: [
      { dataTypeName: 'com.google.step_count.delta' },
      { dataTypeName: 'com.google.calories.expended' },
      { dataTypeName: 'com.google.active_minutes' },
      { dataTypeName: 'com.google.heart_rate.summary' },
      { dataTypeName: 'com.google.distance.delta' },
    ],
    bucketByTime: { durationMillis: String(endDate.getTime() - startDate.getTime()) },
    startTimeMillis: String(startDate.getTime()),
    endTimeMillis: String(endDate.getTime()),
  };

  const data = await gFetch(`${BASE}/dataset:aggregate`, token, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const bucket = data?.bucket?.[0];
  if (!bucket) return { steps: 0, calories: 0, activeMinutes: 0, heartRateAvg: 0, distance: 0 };

  return {
    steps: extractValue(bucket, 'step_count'),
    calories: Math.round(extractValue(bucket, 'calories')),
    activeMinutes: Math.round(extractValue(bucket, 'active_minutes')),
    heartRateAvg: Math.round(extractValue(bucket, 'heart_rate')),
    distance: Math.round(extractValue(bucket, 'distance')),
  };
}

export interface FitDailyStats {
  date: string; // 'YYYY-MM-DD'
  steps: number;
  calories: number;
  activeMinutes: number;
}

export async function fetchFitWeekly(token: string): Promise<FitDailyStats[]> {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  const body = {
    aggregateBy: [
      { dataTypeName: 'com.google.step_count.delta' },
      { dataTypeName: 'com.google.calories.expended' },
      { dataTypeName: 'com.google.active_minutes' },
    ],
    bucketByTime: { durationMillis: '86400000' }, // 1 day in ms
    startTimeMillis: String(start.getTime()),
    endTimeMillis: String(end.getTime()),
  };

  const data = await gFetch(`${BASE}/dataset:aggregate`, token, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return (data?.bucket ?? []).map((bucket: any) => {
    const date = new Date(parseInt(bucket.startTimeMillis));
    return {
      date: date.toISOString().split('T')[0],
      steps: extractValue(bucket, 'step_count'),
      calories: Math.round(extractValue(bucket, 'calories')),
      activeMinutes: Math.round(extractValue(bucket, 'active_minutes')),
    };
  });
}
