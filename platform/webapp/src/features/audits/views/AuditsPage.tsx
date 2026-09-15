import { FormEvent, useEffect, useState } from "react";
import { scorviaApi } from "@/services/shared/infrastructure";

export function AuditsPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await scorviaApi.listAuditExports();
      setItems(res.data?.items ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    }
  }

  useEffect(() => { void load(); }, []);

  async function create(e: FormEvent) {
    e.preventDefault();
    const to = new Date();
    const from = new Date(to.getTime() - 30 * 24 * 3600 * 1000);
    try {
      await scorviaApi.createAuditExport({
        periodFrom: from.toISOString(),
        periodTo: to.toISOString(),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl display">Audit exports</h1>
        <p className="text-sm text-[rgba(232,228,223,0.55)] mt-1">
          Who approved, which gates passed, which waivers — period evidence (BR-11).
        </p>
      </header>
      {error ? <div className="poc-bleed">{error}</div> : null}
      <form onSubmit={create}>
        <button className="btn btn-primary" type="submit">Generate 30-day export</button>
      </form>
      <div className="panel overflow-auto">
        <table className="table">
          <thead><tr><th>Id</th><th>Status</th><th>Period</th><th>Download</th></tr></thead>
          <tbody>
            {items.map((a) => (
              <tr key={String(a.id)}>
                <td className="mono text-xs">{String(a.id)}</td>
                <td><span className="chip chip-steel">{String(a.status)}</span></td>
                <td className="text-xs opacity-70">{String(a.periodFrom)} → {String(a.periodTo)}</td>
                <td className="text-xs">{a.downloadUri ? <a className="text-[var(--color-copper)]" href={String(a.downloadUri)}>Download</a> : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
