import { FormEvent, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { scorviaApi } from "@/services/shared/infrastructure";

export function EvaluationsPage() {
  const [params] = useSearchParams();
  const [candidateId, setCandidateId] = useState(params.get("candidateId") || "");
  const [report, setReport] = useState<Record<string, unknown> | null>(null);
  const [pack, setPack] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [artefactUri, setArtefactUri] = useState("https://artefacts.scorvia.local/pack/latest");

  async function runEval(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await scorviaApi.runEvaluation(candidateId, {
        includeRegimeTests: true,
        requireImbalanceMetrics: true,
        includeBiasChecks: true,
      });
      setReport(res.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evaluation failed");
    }
  }

  async function attachPack(e: FormEvent) {
    e.preventDefault();
    try {
      const res = await scorviaApi.attachInterpretability(candidateId, {
        artefactUri,
        narrative: "Coefficient + SHAP pack for validator review",
        adverseActionFactors: ["utilization", "delinquency"],
      });
      setPack(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pack attach failed");
    }
  }

  const passed = Boolean(report?.passed);
  const imbalance = Boolean(report?.imbalanceAware);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl display">Evaluation gates</h1>
        <p className="text-sm text-[rgba(232,228,223,0.55)] mt-1">
          Accuracy alone cannot pass. Regime, imbalance, and interpretability required.
        </p>
      </header>
      {error ? <div className="poc-bleed">{error}</div> : null}

      <form className="panel p-5 flex flex-wrap gap-3 items-end" onSubmit={runEval}>
        <label className="text-xs min-w-[280px] grow">
          Candidate id
          <input className="input mt-1 mono" value={candidateId} onChange={(e) => setCandidateId(e.target.value)} required />
        </label>
        <button className="btn btn-gate" type="submit">Run suite</button>
      </form>

      {report ? (
        <div className="panel p-5 space-y-4">
          <div className="flex items-center gap-3">
            <span className={passed ? "chip chip-prod" : "chip chip-poc"}>{passed ? "PASSED" : "FAILED"}</span>
            <span className="chip chip-steel">imbalance-aware: {String(imbalance)}</span>
            <span className="chip chip-steel">regime: {String(report.regimeTestsPassed)}</span>
            <span className="chip chip-steel">bias: {String(report.biasCheckPassed)}</span>
          </div>
          <div className="gate-bar"><span style={{ width: passed ? "100%" : "35%" }} /></div>
          {!imbalance ? <div className="poc-bleed">Accuracy-only submission auto-fail (BR-2).</div> : null}
        </div>
      ) : null}

      <form className="panel p-5 space-y-3" onSubmit={attachPack}>
        <h2 className="text-lg">Interpretability pack</h2>
        <label className="text-xs block">
          Artefact URI
          <input className="input mt-1" value={artefactUri} onChange={(e) => setArtefactUri(e.target.value)} />
        </label>
        <button className="btn btn-primary" type="submit" disabled={!candidateId}>Attach pack</button>
        {pack ? <p className="text-sm text-[var(--color-ok)]">Pack attached: <span className="mono">{String(pack.id)}</span></p> : null}
      </form>
    </div>
  );
}
