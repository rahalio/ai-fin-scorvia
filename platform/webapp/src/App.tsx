import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/chrome/AppShell";
import { LoginPage } from "@/features/auth/views/LoginPage";
import { ProjectsPage } from "@/features/projects/views/ProjectsPage";
import { AutoMLPage } from "@/features/automl/views/AutoMLPage";
import { EvaluationsPage } from "@/features/evaluations/views/EvaluationsPage";
import { PromotionsPage } from "@/features/promotions/views/PromotionsPage";
import { PolicyPage } from "@/features/policy/views/PolicyPage";
import { ScoringPage } from "@/features/scoring/views/ScoringPage";
import { ReferralsPage } from "@/features/referrals/views/ReferralsPage";
import { MonitoringPage } from "@/features/monitoring/views/MonitoringPage";
import { AuditsPage } from "@/features/audits/views/AuditsPage";
import { AccessPage } from "@/features/access/views/AccessPage";
import { getAccessToken } from "@/services/shared/infrastructure";

function RequireAuth({ children }: { children: React.ReactNode }) {
  if (!getAccessToken()) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route index element={<ProjectsPage />} />
        <Route path="automl" element={<AutoMLPage />} />
        <Route path="evaluations" element={<EvaluationsPage />} />
        <Route path="promotions" element={<PromotionsPage />} />
        <Route path="policy" element={<PolicyPage />} />
        <Route path="scoring" element={<ScoringPage />} />
        <Route path="referrals" element={<ReferralsPage />} />
        <Route path="monitoring" element={<MonitoringPage />} />
        <Route path="audits" element={<AuditsPage />} />
        <Route path="access" element={<AccessPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
