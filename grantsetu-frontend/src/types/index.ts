export interface Grant {
  id: number;
  slug: string;
  agency: string;
  scheme_name: string | null;
  title: string;
  summary: string | null;
  description: string | null;
  deadline: string | null;
  deadline_text: string | null;
  budget_min: number | null;
  budget_max: number | null;
  duration_months: number | null;
  subject_areas: string[];
  career_stages: string[];
  institution_types: string[];
  eligibility_summary: string | null;
  age_limit: number | null;
  url: string;
  notification_url: string | null;
  call_url: string | null;
  apply_url: string | null;
  pdf_url: string | null;
  portal_name: string | null;
  source_type: string;
  status: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface GrantListItem {
  id: number;
  slug: string;
  agency: string;
  scheme_name: string | null;
  title: string;
  summary: string | null;
  deadline: string | null;
  deadline_text: string | null;
  budget_min: number | null;
  budget_max: number | null;
  duration_months: number | null;
  subject_areas: string[];
  career_stages: string[];
  status: string;
  is_featured: boolean;
  url: string;
  notification_url: string | null;
  call_url: string | null;
  apply_url: string | null;
  pdf_url: string | null;
  portal_name: string | null;
  created_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface AgencyCount {
  agency: string;
  count: number;
}

export interface GrantFilters {
  agency?: string[];
  status?: string;
  career_stage?: string;
  subject_area?: string;
  deadline?: string;
  budget_min?: number;
  budget_max?: number;
  search?: string;
  sort?: string;
  page?: number;
  per_page?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  image_url: string | null;
  institution: string | null;
  department: string | null;
  designation: string | null;
  career_stage: string | null;
  subject_areas: string[];
  institution_type: string | null;
  state: string | null;
  research_keywords: string[];
  date_of_birth: string | null;
  preferred_agencies: string[];
  onboarding_completed: boolean;
  alert_enabled: boolean;
  alert_frequency: string;
  alert_agencies: string[];
  is_admin: boolean;
  created_at: string;
}

export interface UserUpdate {
  name?: string;
  institution?: string;
  department?: string;
  designation?: string;
  career_stage?: string;
  subject_areas?: string[];
  institution_type?: string;
  state?: string;
  research_keywords?: string[];
  date_of_birth?: string;
  preferred_agencies?: string[];
  onboarding_completed?: boolean;
  alert_enabled?: boolean;
  alert_frequency?: string;
  alert_agencies?: string[];
}
