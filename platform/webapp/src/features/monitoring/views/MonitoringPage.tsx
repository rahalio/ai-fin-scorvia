import { FormEvent, useEffect, useState } from "react";
import { scorviaApi } from "@/services/shared/infrastructure";

export function MonitoringPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [deploymentId, setDeploymentId] = useState("dep_demo");
  const [incidentType, setIncidentType] = useState("drift");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await scorviaApi.listIncidents();
      setItems(res.data?.items ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    }
  }

  useEffect(() => { void load(); }, []);

  async function open(e: FormEvent) {
    e.preventDefault();
    try {
      await scorviaApi.openIncident({ deploymentId, incidentType, detail: "Threshold breach" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Open failed");
    }
  }

  async function dispose(id: string) {
    await scorviaApi.disposeIncident(id, { status: "closed", disposition: "Reviewed — rollback optional" });
    await load();
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl display">Monitoring incidents</h1>
        <p className="text-sm text-[rgba(232,228,223,0.55)] mt-1">
          Drift, performance, and override spikes open mandatory review (BR-8).
        </p>
      </header>
      {error ? <div className="poc-bleed">{error}</div> : null}

      <form className="panel p-5 flex flex-wrap gap-3 items-end" onSubmit={open}>
        <label className="text-xs">
          Deployment
          <input className="input mt-1" value={deploymentId} onChange={(e) => setDeploymentId(e.target.value)} />
        </label>
        <label className="text-xs">
          Type
          <select className="input mt-1" value={incidentType} onChange={(e) => setIncidentType(e.target.value)}>
            <option value="drift">drift</option>
            <option value="performance">performance</option>
            <option value="overrideSpike">overrideSpike</option>
          </select>
        </label>
        <button className="btn btn-primary" type="submit">Open incident</button>
      </form>

      <div className="panel overflow-auto">
        <table className="table">
          <thead><tr><th>Id</th><th>Type</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {items.map((i) => (
              <tr key={String(i.id)}>
                <td className="mono text-xs">{String(i.id)}</td>
                <td><span className="chip chip-poc">{String(i.incidentType)}</span></td>
                <td>{String(i.status)}</td>
                <td>
                  {i.status !== "closed" ? (
                    <button className="btn" type="button" onClick={() => dispose(String(i.id))}>Dispose</button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
