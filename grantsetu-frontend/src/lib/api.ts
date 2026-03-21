import { API_URL } from "./constants";
import type { Grant, GrantListItem, PaginatedResponse, AgencyCount, GrantFilters, User, UserUpdate } from "@/types";

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

async function authFetchAPI<T>(path: string, token: string, options?: RequestInit): Promise<T> {
  return fetchAPI<T>(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
}

// --- Public endpoints ---

export async function fetchGrants(
  filters: GrantFilters = {}
): Promise<PaginatedResponse<GrantListItem>> {
  const params = new URLSearchParams();

  if (filters.agency?.length) {
    filters.agency.forEach((a) => params.append("agency", a));
  }
  if (filters.status) params.set("status", filters.status);
  if (filters.career_stage) params.set("career_stage", filters.career_stage);
  if (filters.subject_area) params.set("subject_area", filters.subject_area);
  if (filters.deadline) params.set("deadline", filters.deadline);
  if (filters.budget_min) params.set("budget_min", String(filters.budget_min));
  if (filters.budget_max) params.set("budget_max", String(filters.budget_max));
  if (filters.search) params.set("search", filters.search);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.per_page) params.set("per_page", String(filters.per_page));

  const query = params.toString();
  return fetchAPI<PaginatedResponse<GrantListItem>>(
    `/api/v1/grants${query ? `?${query}` : ""}`
  );
}

export async function fetchGrant(slug: string): Promise<Grant> {
  return fetchAPI<Grant>(`/api/v1/grants/${slug}`);
}

export async function fetchAgencies(): Promise<AgencyCount[]> {
  return fetchAPI<AgencyCount[]>("/api/v1/grants/agencies");
}

// --- Authenticated endpoints ---

export async function fetchCurrentUser(token: string): Promise<User> {
  return authFetchAPI<User>("/api/v1/users/me", token);
}

export async function updateProfile(token: string, data: UserUpdate): Promise<User> {
  return authFetchAPI<User>("/api/v1/users/me", token, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function fetchRecommendedGrants(token: string): Promise<GrantListItem[]> {
  return authFetchAPI<GrantListItem[]>("/api/v1/grants/recommended", token);
}

export async function fetchSavedGrants(token: string): Promise<GrantListItem[]> {
  return authFetchAPI<GrantListItem[]>("/api/v1/users/grants/saved", token);
}

export async function saveGrant(token: string, grantId: number): Promise<void> {
  await authFetchAPI<{ status: string }>(`/api/v1/users/grants/${grantId}/save`, token, {
    method: "POST",
  });
}

export async function unsaveGrant(token: string, grantId: number): Promise<void> {
  await authFetchAPI<{ status: string }>(`/api/v1/users/grants/${grantId}/save`, token, {
    method: "DELETE",
  });
}
