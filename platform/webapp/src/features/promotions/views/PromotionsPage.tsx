import { FormEvent, useEffect, useState } from "react";
import { scorviaApi } from "@/services/shared/infrastructure";

export function PromotionsPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [candidateId, setCandidateId] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await scorviaApi.listPromotions();
      setItems(res.data?.items ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    }
  }

  useEffect(() => { void load(); }, []);

  async function request(e: FormEvent) {
    e.preventDefault();
    try {
      await scorviaApi.requestPromotion(candidateId, {
        interpretabilityUri: "https://artefacts.scorvia.local/pack/latest",
        notes: "Ready for steel gate review",
        monitoringPlanUri: "https://artefacts.scorvia.local/monitoring/plan",
      });
      setCandidateId("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    }
  }

  async function decide(id: string, decision: string) {
    try {
      await scorviaApi.decidePromotion(id, { decision, rationale: `Operator ${decision}` });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Decide failed");
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl display">Promotion desk</h1>
        <p className="text-sm text-[rgba(232,228,223,0.55)] mt-1">
          Declared gates before any grant/deny drive. Waivers are attributable.
        </p>
      </header>
      {error ? <div className="poc-bleed">{error}</div> : null}

      <form className="panel p-5 flex gap-3 items-end" onSubmit={request}>
        <label className="text-xs grow">
          Candidate id
          <input className="input mt-1 mono" value={candidateId} onChange={(e) => setCandidateId(e.target.value)} required />
        </label>
        <button className="btn btn-primary" type="submit">Request promotion</button>
      </form>

      <div className="panel overflow-auto">
        <table className="table">
          <thead><tr><th>Id</th><th>Status</th><th>Interpretability</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map((p) => (
              <tr key={String(p.id)}>
                <td className="mono text-xs">{String(p.id)}</td>
                <td><span className="chip chip-steel">{String(p.status)}</span></td>
                <td>{p.interpretabilityAttached || p.interpretabilityUri ? "yes" : "no"}</td>
                <td className="space-x-2">
                  <button className="btn" type="button" onClick={() => decide(String(p.id), "approve")}>Approve</button>
                  <button className="btn" type="button" onClick={() => decide(String(p.id), "reject")}>Reject</button>
                  <button className="btn" type="button" onClick={() => decide(String(p.id), "waive")}>Waive</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
