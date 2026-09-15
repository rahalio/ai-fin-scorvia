import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { scorviaApi } from "@/services/shared/infrastructure";

type Project = Record<string, unknown>;

export function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [population, setPopulation] = useState("consumer");
  const [environment, setEnvironment] = useState<"poc" | "production">("poc");
  const [imbalanceRatio, setImbalanceRatio] = useState("0.08");

  async function load() {
    try {
      const res = await scorviaApi.listProjects();
      setItems(res.data?.items ?? []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load projects");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    try {
      await scorviaApi.createProject({
        name,
        population,
        environment,
        imbalanceRatio: Number(imbalanceRatio),
      });
      setName("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl display">Credit projects</h1>
        <p className="text-sm text-[rgba(232,228,223,0.55)] mt-1">
          Register purpose, population, and imbalance profile before furnace heat.
        </p>
      </header>

      {error ? <div className="poc-bleed">{error}</div> : null}

      <form className="panel p-5 grid gap-3 md:grid-cols-4 items-end" onSubmit={onCreate}>
        <label className="text-xs">
          Name
          <input className="input mt-1" required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="text-xs">
          Population
          <input className="input mt-1" value={population} onChange={(e) => setPopulation(e.target.value)} />
        </label>
        <label className="text-xs">
          Environment
          <select className="input mt-1" value={environment} onChange={(e) => setEnvironment(e.target.value as "poc" | "production")}>
            <option value="poc">PoC</option>
            <option value="production">Production</option>
          </select>
        </label>
        <label className="text-xs">
          Imbalance ratio
          <input className="input mt-1" value={imbalanceRatio} onChange={(e) => setImbalanceRatio(e.target.value)} />
        </label>
        <button className="btn btn-primary md:col-span-4 w-fit" type="submit">Create project</button>
      </form>

      <div className="panel overflow-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Env</th>
              <th>Population</th>
              <th>Imbalance</th>
              <th>Id</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={String(p.id)}>
                <td>
                  <Link className="text-[var(--color-copper)]" to={`/automl?projectId=${p.id}`}>
                    {String(p.name ?? "—")}
                  </Link>
                </td>
                <td>
                  <span className={p.environment === "production" ? "chip chip-prod" : "chip chip-poc"}>
                    {String(p.environment ?? "poc")}
                  </span>
                </td>
                <td>{String(p.population ?? "—")}</td>
                <td className="mono">{String(p.imbalanceRatio ?? "—")}</td>
                <td className="mono text-xs opacity-60">{String(p.id)}</td>
              </tr>
            ))}
            {!items.length ? (
              <tr>
                <td colSpan={5} className="opacity-50 py-8 text-center">
                  No projects yet — create the first credit modelling registry entry.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
