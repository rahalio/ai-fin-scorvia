/** Minimal stubs so generated domain services compile if imported later. */

import { apiFetch } from "./api-client";

export const apiClient = {
  get: <T,>(url: string, init?: RequestInit) =>
    apiFetch<T>(url.replace(/^\/orgs\/[^/]+/, ""), init),
  post: <T,>(url: string, init?: { body?: unknown; signal?: AbortSignal }) =>
    apiFetch<T>(url.replace(/^\/orgs\/[^/]+/, ""), {
      method: "POST",
      body: JSON.stringify(init?.body ?? {}),
      signal: init?.signal,
      idempotent: true,
    } as RequestInit & { idempotent?: boolean }),
};

export function makeService<T extends object>(service: T): T {
  return service;
}

export function getEffectiveOrgId(): string {
  return "tnt_demo";
}

export function validateApiResponse<T>(_schema: unknown, data: T): T {
  return data;
}

export function formatValidationError(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
