/**
 * Shared API client — envelope-aware, Bearer + API-key auth.
 */

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || ""
);

const TOKEN_KEY = "scorvia.accessToken";
const API_KEY_KEY = "scorvia.apiKey";

export type Envelope<T> = {
  data: T;
  meta?: { correlationId?: string; requestId?: string; generatedAt?: string; timestamp?: string };
};

export type ListData<T> = {
  items: T[];
  nextCursor?: string;
};

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getApiKey(): string {
  return (
    localStorage.getItem(API_KEY_KEY) ||
    import.meta.env.VITE_API_KEY ||
    "scorvia_demo_local_dev_key"
  );
}

export function setApiKey(key: string) {
  localStorage.setItem(API_KEY_KEY, key);
}

function idempotencyKey(): string {
  return `idem_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { idempotent?: boolean },
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-API-Key": getApiKey(),
    ...(init?.headers as Record<string, string> | undefined),
  };
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (init?.idempotent || (init?.method && init.method !== "GET")) {
    headers["Idempotency-Key"] = idempotencyKey();
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const scorviaApi = {
  health: () => apiFetch<{ status?: string }>("/health"),

  login: (email: string, password: string) =>
    apiFetch<
      Envelope<{
        accessToken: string;
        refreshToken?: string;
        operator?: { displayName?: string; email?: string; role?: string };
      }>
    >("/v0/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      idempotent: true,
    }),

  me: () =>
    apiFetch<
      Envelope<{
        operator: { displayName?: string; email?: string; role?: string };
        tenant?: { displayNameEn?: string };
      }>
    >("/v0/auth/me"),

  listUsers: () =>
    apiFetch<Envelope<ListData<Record<string, unknown>>>>(
      "/v0/tenants/me/users",
    ),

  listProjects: () =>
    apiFetch<Envelope<ListData<Record<string, unknown>>>>("/v1/projects"),

  createProject: (body: Record<string, unknown>) =>
    apiFetch<Envelope<Record<string, unknown>>>("/v1/projects", {
      method: "POST",
      body: JSON.stringify(body),
      idempotent: true,
    }),

  getProject: (id: string) =>
    apiFetch<Envelope<Record<string, unknown>>>(`/v1/projects/${id}`),

  attachDataset: (projectId: string, body: Record<string, unknown>) =>
    apiFetch<Envelope<Record<string, unknown>>>(
      `/v1/projects/${projectId}/datasets`,
      { method: "POST", body: JSON.stringify(body), idempotent: true },
    ),

  listAutoMLRuns: (projectId: string) =>
    apiFetch<Envelope<ListData<Record<string, unknown>>>>(
      `/v1/projects/${projectId}/automl-runs`,
    ),

  startAutoMLRun: (projectId: string, body: Record<string, unknown> = {}) =>
    apiFetch<Envelope<Record<string, unknown>>>(
      `/v1/projects/${projectId}/automl-runs`,
      { method: "POST", body: JSON.stringify(body), idempotent: true },
    ),

  listCandidates: (runId: string) =>
    apiFetch<Envelope<ListData<Record<string, unknown>>>>(
      `/v1/automl-runs/${runId}/candidates`,
    ),

  getCandidate: (id: string) =>
    apiFetch<Envelope<Record<string, unknown>>>(`/v1/candidates/${id}`),

  runEvaluation: (candidateId: string, body: Record<string, unknown> = {}) =>
    apiFetch<Envelope<Record<string, unknown>>>(
      `/v1/candidates/${candidateId}/evaluations`,
      { method: "POST", body: JSON.stringify(body), idempotent: true },
    ),

  listEvaluations: (candidateId: string) =>
    apiFetch<Envelope<ListData<Record<string, unknown>>>>(
      `/v1/candidates/${candidateId}/evaluations`,
    ),

  attachInterpretability: (candidateId: string, body: Record<string, unknown>) =>
    apiFetch<Envelope<Record<string, unknown>>>(
      `/v1/candidates/${candidateId}/interpretability-packs`,
      { method: "POST", body: JSON.stringify(body), idempotent: true },
    ),

  listPromotions: () =>
    apiFetch<Envelope<ListData<Record<string, unknown>>>>("/v1/promotions"),

  requestPromotion: (candidateId: string, body: Record<string, unknown>) =>
    apiFetch<Envelope<Record<string, unknown>>>(
      `/v1/candidates/${candidateId}/promotions`,
      { method: "POST", body: JSON.stringify(body), idempotent: true },
    ),

  decidePromotion: (promotionId: string, body: Record<string, unknown>) =>
    apiFetch<Envelope<Record<string, unknown>>>(
      `/v1/promotions/${promotionId}/decide`,
      { method: "POST", body: JSON.stringify(body), idempotent: true },
    ),

  listPolicyMaps: () =>
    apiFetch<Envelope<ListData<Record<string, unknown>>>>("/v1/policy-maps"),

  createPolicyMap: (body: Record<string, unknown>) =>
    apiFetch<Envelope<Record<string, unknown>>>("/v1/policy-maps", {
      method: "POST",
      body: JSON.stringify(body),
      idempotent: true,
    }),

  publishPolicyMap: (id: string) =>
    apiFetch<Envelope<Record<string, unknown>>>(
      `/v1/policy-maps/${id}/publish`,
      { method: "POST", idempotent: true },
    ),

  simulatePolicyMap: (id: string, pdValues: number[]) =>
    apiFetch<Envelope<Record<string, unknown>>>(
      `/v1/policy-maps/${id}/simulate`,
      {
        method: "POST",
        body: JSON.stringify({ pdValues }),
        idempotent: true,
      },
    ),

  listDeployments: () =>
    apiFetch<Envelope<ListData<Record<string, unknown>>>>(
      "/v1/scoring/deployments",
    ),

  score: (body: Record<string, unknown>) =>
    apiFetch<Envelope<Record<string, unknown>>>("/v1/scoring/score", {
      method: "POST",
      body: JSON.stringify(body),
      idempotent: true,
    }),

  listReferrals: (status?: string) => {
    const q = new URLSearchParams({ limit: "50" });
    if (status) q.set("status", status);
    return apiFetch<Envelope<ListData<Record<string, unknown>>>>(
      `/v1/referrals?${q}`,
    );
  },

  resolveReferral: (id: string, body: Record<string, unknown>) =>
    apiFetch<Envelope<Record<string, unknown>>>(
      `/v1/referrals/${id}/resolve`,
      { method: "POST", body: JSON.stringify(body), idempotent: true },
    ),

  listIncidents: () =>
    apiFetch<Envelope<ListData<Record<string, unknown>>>>(
      "/v1/monitoring/incidents",
    ),

  openIncident: (body: Record<string, unknown>) =>
    apiFetch<Envelope<Record<string, unknown>>>("/v1/monitoring/incidents", {
      method: "POST",
      body: JSON.stringify(body),
      idempotent: true,
    }),

  disposeIncident: (id: string, body: Record<string, unknown>) =>
    apiFetch<Envelope<Record<string, unknown>>>(
      `/v1/monitoring/incidents/${id}/dispose`,
      { method: "POST", body: JSON.stringify(body), idempotent: true },
    ),

  listAuditExports: () =>
    apiFetch<Envelope<ListData<Record<string, unknown>>>>("/v1/audits/exports"),

  createAuditExport: (body: Record<string, unknown>) =>
    apiFetch<Envelope<Record<string, unknown>>>("/v1/audits/exports", {
      method: "POST",
      body: JSON.stringify(body),
      idempotent: true,
    }),
};
