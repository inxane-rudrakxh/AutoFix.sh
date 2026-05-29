/**
 * API service layer for AutoFix.sh.
 *
 * All backend calls go through this module.
 * When VITE_API_URL is not set, functions gracefully throw
 * and hooks fall back to mock data.
 */

import type {
  Deployment,
  DeploymentDetail,
  Repository,
  Fix,
  FixDetail,
  DashboardMetrics,
  LogLine,
  PaginatedResponse,
} from "@/types";

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

// ─── Base fetcher ──────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!BASE_URL) throw new Error("VITE_API_URL not configured");

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${body || res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// ─── Deployments ───────────────────────────────────────────────────────────

export const deploymentsApi = {
  list: (page = 1, pageSize = 20) =>
    apiFetch<PaginatedResponse<Deployment>>(`/api/deployments?page=${page}&page_size=${pageSize}`),

  get: (id: string) => apiFetch<DeploymentDetail>(`/api/deployments/${id}`),
};

// ─── Repositories ──────────────────────────────────────────────────────────

export const repositoriesApi = {
  list: () => apiFetch<Repository[]>("/api/repositories"),
};

// ─── Fixes ─────────────────────────────────────────────────────────────────

export const fixesApi = {
  list: () => apiFetch<FixDetail[]>("/api/fixes"),
  get: (id: string) => apiFetch<FixDetail>(`/api/fixes/${id}`),
};

// ─── Dashboard ─────────────────────────────────────────────────────────────

export const dashboardApi = {
  metrics: () => apiFetch<DashboardMetrics>("/api/dashboard/metrics"),
};

// ─── Logs ──────────────────────────────────────────────────────────────────

export const logsApi = {
  list: (runId?: string) => {
    const qs = runId ? `?run_id=${runId}` : "";
    return apiFetch<LogLine[]>(`/api/logs${qs}`);
  },

  /** Returns an EventSource for streaming logs over SSE */
  stream: (runId: string): EventSource => {
    if (!BASE_URL) throw new Error("VITE_API_URL not configured");
    return new EventSource(`${BASE_URL}/api/logs/${runId}/stream`);
  },
};

// ─── Agent Events (SSE) ────────────────────────────────────────────────────

export const eventsApi = {
  stream: (): EventSource => {
    if (!BASE_URL) throw new Error("VITE_API_URL not configured");
    return new EventSource(`${BASE_URL}/api/events`);
  },
};

// ─── Settings ──────────────────────────────────────────────────────────────

export const settingsApi = {
  status: () => apiFetch<any>("/api/settings/status"),
  update: (data: any) =>
    apiFetch<any>("/api/settings", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
