import { useEffect, useState } from "react";
import { scorviaApi } from "@/services/shared/infrastructure";

export function ReferralsPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await scorviaApi.listReferrals("open");
      setItems(res.data?.items ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    }
  }

  useEffect(() => { void load(); }, []);

  async function resolve(id: string, decision: "grant" | "deny") {
    try {
      await scorviaApi.resolveReferral(id, { decision, reasonCode: decision === "grant" ? "OPS_GRANT" : "OPS_DENY" });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Resolve failed");
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl display">Referral queues</h1>
        <p className="text-sm text-[rgba(232,228,223,0.55)] mt-1">
          Borderline scores prioritised by expected loss — no full autopilot (BR-7).
        </p>
      </header>
      {error ? <div className="poc-bleed">{error}</div> : null}
      <div className="panel overflow-auto">
        <table className="table">
          <thead><tr><th>Application</th><th>PD</th><th>Loss impact</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {items.map((r) => (
              <tr key={String(r.id)}>
                <td className="mono text-xs">{String(r.applicationId)}</td>
                <td className="mono">{String(r.pd ?? "—")}</td>
                <td className="mono">{String(r.expectedLossImpact ?? "—")}</td>
                <td><span className="chip chip-steel">{String(r.status)}</span></td>
                <td className="space-x-2">
                  <button className="btn" type="button" onClick={() => resolve(String(r.id), "grant")}>Grant</button>
                  <button className="btn" type="button" onClick={() => resolve(String(r.id), "deny")}>Deny</button>
                </td>
              </tr>
            ))}
            {!items.length ? <tr><td colSpan={5} className="opacity-50 py-8 text-center">Queue empty — straight-through within policy.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
