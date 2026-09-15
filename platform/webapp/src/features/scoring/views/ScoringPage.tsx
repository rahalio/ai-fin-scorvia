import { FormEvent, useEffect, useState } from "react";
import { scorviaApi } from "@/services/shared/infrastructure";

export function ScoringPage() {
  const [deployments, setDeployments] = useState<Record<string, unknown>[]>([]);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [applicationId, setApplicationId] = useState("app_demo_001");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    scorviaApi.listDeployments().then((r) => setDeployments(r.data?.items ?? [])).catch((e) => setError(String(e.message || e)));
  }, []);

  async function score(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await scorviaApi.score({
        applicationId,
        features: { utilization: 0.42, delinquency_12m: 1 },
      });
      setResult(res.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Score failed");
    }
  }

  const hasPoc = deployments.some((d) => d.environment === "poc" && d.active);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl display">Production scoring</h1>
        <p className="text-sm text-[rgba(232,228,223,0.55)] mt-1">
          Approved models only. PoC endpoints must not bleed into LOS.
        </p>
      </header>
      {hasPoc ? <div className="poc-bleed">PoC deployment still active — verify LOS points at production only (BR-10).</div> : null}
      {error ? <div className="poc-bleed">{error}</div> : null}

      <div className="panel overflow-auto">
        <table className="table">
          <thead><tr><th>Deployment</th><th>Env</th><th>Active</th><th>Model</th></tr></thead>
          <tbody>
            {deployments.map((d) => (
              <tr key={String(d.id)}>
                <td className="mono text-xs">{String(d.id)}</td>
                <td><span className={d.environment === "production" ? "chip chip-prod" : "chip chip-poc"}>{String(d.environment)}</span></td>
                <td>{String(d.active)}</td>
                <td className="mono text-xs">{String(d.modelId ?? "—")}</td>
              </tr>
            ))}
            {!deployments.length ? <tr><td colSpan={4} className="opacity-50 py-6 text-center">No deployments yet.</td></tr> : null}
          </tbody>
        </table>
      </div>

      <form className="panel p-5 flex gap-3 items-end" onSubmit={score}>
        <label className="text-xs grow">
          Application id
          <input className="input mt-1" value={applicationId} onChange={(e) => setApplicationId(e.target.value)} />
        </label>
        <button className="btn btn-primary" type="submit">Score</button>
      </form>

      {result ? (
        <div className="panel p-5 space-y-2">
          <div className="text-sm">PD <span className="mono text-[var(--color-pd-blue)]">{String(result.pd)}</span></div>
          <div className="text-sm">Decision <span className="chip chip-copper">{String(result.decision)}</span></div>
          <div className="text-xs opacity-60">{String(result.explanation ?? "")}</div>
        </div>
      ) : null}
    </div>
  );
}
