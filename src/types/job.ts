export interface Job {
  id: string;

  source: string;
  externalId: string;

  title: string;
  company: string | null;

  location: string | null;
  salaryText: string | null;

  description: string | null;

  requirements: string[];
  technologies: string[];

  jobUrl: string;

  postedAt: string | null;

  discoveredAt: string;
  lastSeenAt: string;

  createdAt: string;
  updatedAt: string;

  isActive: boolean;
}

export interface JobStats {
  newToday: number;
  lastHour: number;
  active: number;
  sources: number;
}

export interface HourlyJobStat {
  hour: string;
  count: number;
}

export interface JobsResponse {
  items: Job[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}