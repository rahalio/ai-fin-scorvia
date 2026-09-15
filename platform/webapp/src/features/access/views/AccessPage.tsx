import { useEffect, useState } from "react";
import { scorviaApi } from "@/services/shared/infrastructure";

export function AccessPage() {
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    scorviaApi.listUsers()
      .then((r) => setUsers(r.data?.items ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed"));
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl display">Access</h1>
        <p className="text-sm text-[rgba(232,228,223,0.55)] mt-1">Tenant operators and API keys.</p>
      </header>
      {error ? <div className="poc-bleed">{error}</div> : null}
      <div className="panel overflow-auto">
        <table className="table">
          <thead><tr><th>Email</th><th>Role</th><th>Status</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={String(u.userId ?? u.id)}>
                <td>{String(u.email ?? "—")}</td>
                <td>{String(u.role ?? "—")}</td>
                <td>{String(u.status ?? "—")}</td>
              </tr>
            ))}
            {!users.length ? <tr><td colSpan={3} className="opacity-50 py-6 text-center">No users listed (API key session).</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
