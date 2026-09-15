import { FormEvent, useEffect, useState } from "react";
import { scorviaApi } from "@/services/shared/infrastructure";

const DEFAULT_BANDS = [
  { minPd: 0, maxPd: 0.05, decision: "grant", pricingBand: "A" },
  { minPd: 0.05, maxPd: 0.15, decision: "refer", pricingBand: "B" },
  { minPd: 0.15, maxPd: 1, decision: "deny", pricingBand: "C" },
];

export function PolicyPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [name, setName] = useState("Consumer PD bands v1");
  const [sim, setSim] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const res = await scorviaApi.listPolicyMaps();
      setItems(res.data?.items ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    }
  }

  useEffect(() => { void load(); }, []);

  async function create(e: FormEvent) {
    e.preventDefault();
    try {
      await scorviaApi.createPolicyMap({ name, bands: DEFAULT_BANDS, referralRequired: true });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    }
  }

  async function publish(id: string) {
    await scorviaApi.publishPolicyMap(id);
    await load();
  }

  async function simulate(id: string) {
    const res = await scorviaApi.simulatePolicyMap(id, [0.02, 0.08, 0.09, 0.22, 0.31]);
    setSim(res.data);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl display">Policy mapping</h1>
        <p className="text-sm text-[rgba(232,228,223,0.55)] mt-1">
          PD bands → grant / refer / deny. Policy owns the decision, not the model alone.
        </p>
      </header>
      {error ? <div className="poc-bleed">{error}</div> : null}

      <form className="panel p-5 flex gap-3 items-end" onSubmit={create}>
        <label className="text-xs grow">
          Map name
          <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <button className="btn btn-primary" type="submit">Create map</button>
      </form>

      <div className="panel p-4">
        <div className="text-xs opacity-60 mb-2">Default bands</div>
        <div className="flex gap-2 flex-wrap">
          {DEFAULT_BANDS.map((b) => (
            <span key={b.decision} className="chip chip-steel" style={{ borderColor: "rgba(76,110,245,0.45)", color: "#c5d0ff" }}>
              {b.minPd}–{b.maxPd}: {b.decision}
            </span>
          ))}
        </div>
      </div>

      <div className="panel overflow-auto">
        <table className="table">
          <thead><tr><th>Name</th><th>Status</th><th>Version</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map((p) => (
              <tr key={String(p.id)}>
                <td>{String(p.name)}</td>
                <td><span className="chip chip-steel">{String(p.status)}</span></td>
                <td className="mono">{String(p.version ?? 1)}</td>
                <td className="space-x-2">
                  <button className="btn" type="button" onClick={() => publish(String(p.id))}>Publish</button>
                  <button className="btn" type="button" onClick={() => simulate(String(p.id))}>Simulate mix</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sim ? (
        <div className="panel p-4 text-sm">
          Simulated mix — grant {String(sim.grantCount)} · refer {String(sim.referCount)} · deny {String(sim.denyCount)}
        </div>
      ) : null}
    </div>
  );
}
