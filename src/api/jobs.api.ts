import type {
  HourlyJobStat,
  Job,
  JobsResponse,
  JobStats,
} from '@/types/job';

const API_URL = import.meta.env.VITE_API_URL;

export interface JobQuery {
  search?: string;
  source?: string;
  hours?: number;

  page?: number;
  limit?: number;
}

function buildQuery(query: JobQuery) {
  const params = new URLSearchParams();

  if (query.search) {
    params.set('search', query.search);
  }

  if (query.source && query.source !== 'all') {
    params.set('source', query.source);
  }

  if (query.hours) {
    params.set('hours', String(query.hours));
  }

  params.set('page', String(query.page ?? 1));
  params.set('limit', String(query.limit ?? 50));

  return params.toString();
}
export async function getJobSources(): Promise<string[]> {
  const response = await fetch(
    `${API_URL}/jobs/sources`,
  )

  if (!response.ok) {
    throw new Error(
      'Cannot load job sources',
    )
  }

  return response.json()
}
export async function getJobs(
  query: JobQuery = {},
): Promise<JobsResponse> {
  const response = await fetch(
    `${API_URL}/jobs?${buildQuery(query)}`,
  );

  if (!response.ok) {
    throw new Error('Cannot load jobs');
  }

  return response.json();
}

export async function getJob(id: string): Promise<Job> {
  const response = await fetch(`${API_URL}/jobs/${id}`);

  if (!response.ok) {
    throw new Error('Job not found');
  }

  return response.json();
}

export async function getJobStats(): Promise<JobStats> {
  const response = await fetch(
    `${API_URL}/jobs/stats/summary`,
  );

  if (!response.ok) {
    throw new Error('Cannot load statistics');
  }

  return response.json();
}

export async function getHourlyStats(
  hours = 24,
): Promise<HourlyJobStat[]> {
  const response = await fetch(
    `${API_URL}/jobs/stats/new-by-hour?hours=${hours}`,
  );

  if (!response.ok) {
    throw new Error('Cannot load hourly statistics');
  }

  return response.json();
}