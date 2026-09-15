import { FormEvent, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { scorviaApi } from "@/services/shared/infrastructure";

export function AutoMLPage() {
  const [params] = useSearchParams();
  const [projects, setProjects] = useState<Record<string, unknown>[]>([]);
  const [projectId, setProjectId] = useState(params.get("projectId") || "");
  const [runs, setRuns] = useState<Record<string, unknown>[]>([]);
  const [runId, setRunId] = useState("");
  const [candidates, setCandidates] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    scorviaApi.listProjects().then((r) => {
      const items = r.data?.items ?? [];
      setProjects(items);
      if (!projectId && items[0]?.id) setProjectId(String(items[0].id));
    }).catch((e) => setError(String(e.message || e)));
  }, []);

  useEffect(() => {
    if (!projectId) return;
    scorviaApi.listAutoMLRuns(projectId).then((r) => setRuns(r.data?.items ?? [])).catch((e) => setError(String(e.message || e)));
  }, [projectId]);

  useEffect(() => {
    if (!runId) return;
    scorviaApi.listCandidates(runId).then((r) => setCandidates(r.data?.items ?? [])).catch((e) => setError(String(e.message || e)));
  }, [runId]);

  async function startRun(e: FormEvent) {
    e.preventDefault();
    if (!projectId) return;
    try {
      const res = await scorviaApi.startAutoMLRun(projectId, { maxCandidates: 12, searchBudgetMinutes: 30 });
      const id = String(res.data?.id ?? "");
      setRunId(id);
      const list = await scorviaApi.listAutoMLRuns(projectId);
      setRuns(list.data?.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Start failed");
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl display">AutoML runs</h1>
        <p className="text-sm text-[rgba(232,228,223,0.55)] mt-1">
          Pipeline search with retained lineage — not an accuracy-sorted promotion board.
        </p>
      </header>
      {error ? <div className="poc-bleed">{error}</div> : null}

      <form className="panel p-5 flex flex-wrap gap-3 items-end" onSubmit={startRun}>
        <label className="text-xs min-w-[220px]">
          Project
          <select className="input mt-1" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            <option value="">Select…</option>
            {projects.map((p) => (
              <option key={String(p.id)} value={String(p.id)}>{String(p.name)}</option>
            ))}
          </select>
        </label>
        <button className="btn btn-primary" type="submit" disabled={!projectId}>Start run</button>
      </form>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="panel overflow-auto">
          <div className="px-4 py-3 border-b border-[rgba(232,228,223,0.08)] font-medium">Runs</div>
          <table className="table">
            <thead><tr><th>Id</th><th>Status</th><th>Candidates</th></tr></thead>
            <tbody>
              {runs.map((r) => (
                <tr key={String(r.id)} className="cursor-pointer" onClick={() => setRunId(String(r.id))}>
                  <td className="mono text-xs text-[var(--color-copper)]">{String(r.id)}</td>
                  <td><span className="chip chip-copper">{String(r.status ?? "—")}</span></td>
                  <td>{String(r.candidateCount ?? "—")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel overflow-auto">
          <div className="px-4 py-3 border-b border-[rgba(232,228,223,0.08)] font-medium">
            Candidate leaderboard <span className="text-xs opacity-50">(minority-class metrics first)</span>
          </div>
          <table className="table">
            <thead><tr><th>Algorithm</th><th>PR</th><th>Recall</th><th></th></tr></thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={String(c.id)}>
                  <td>{String(c.algorithm ?? "—")}</td>
                  <td className="mono">{String(c.aucPr ?? "—")}</td>
                  <td className="mono">{String(c.minorityRecall ?? "—")}</td>
                  <td>
                    <Link className="text-[var(--color-copper)] text-sm" to={`/evaluations?candidateId=${c.id}`}>
                      Evaluate
                    </Link>
                  </td>
                </tr>
              ))}
              {!candidates.length ? (
                <tr><td colSpan={4} className="opacity-50 py-6 text-center">Select a run to inspect lineage.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
