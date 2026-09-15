export function validateApiResponse<T>(_schema: unknown, data: T): T {
  return data;
}

export function formatValidationError(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
