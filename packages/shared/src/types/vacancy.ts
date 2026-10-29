export type JobSource = 'djinni' | 'jobico';

export interface Vacancy {
  id: string;
  source: JobSource;
  externalId: string;
  title: string;
  company?: string;
  description: string;
  url: string;
  skills: string[];
  createdAt: string;
}

export interface MarketProfile {
  specialization: string;
  level: string;
  requiredSkills: string[];
  commonSkills: string[];
}

export interface AnalyticsSummary {
  totalVacancies: number;
  topSkills: Array<{ skill: string; count: number; percentage: number }>;
  lastUpdated: string;
}
