import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { setAccessToken } from "@/services/shared/infrastructure";

const NAV = [
  { to: "/", label: "Projects", end: true },
  { to: "/automl", label: "AutoML" },
  { to: "/evaluations", label: "Evaluation gates" },
  { to: "/promotions", label: "Promotions" },
  { to: "/policy", label: "Policy mapping" },
  { to: "/scoring", label: "Production scoring" },
  { to: "/referrals", label: "Referral queues" },
  { to: "/monitoring", label: "Monitoring" },
  { to: "/audits", label: "Audit exports" },
  { to: "/access", label: "Access" },
];

export function AppShell() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="border-r border-[rgba(184,115,51,0.18)] bg-[rgba(28,25,22,0.55)] px-4 py-6">
        <div className="mb-8">
          <div className="brand-mark text-2xl">Scorvia</div>
          <p className="mt-1 text-xs text-[rgba(232,228,223,0.5)]">
            Credit model foundry
          </p>
        </div>
        <div className="poc-bleed mb-4">PoC environments labelled — never share prod scoring endpoints.</div>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-[var(--radius-sm)] px-3 py-2 text-sm no-underline transition-colors ${
                  isActive
                    ? "bg-[rgba(184,115,51,0.18)] text-[var(--color-ink)] font-medium"
                    : "text-[rgba(232,228,223,0.7)] hover:bg-[rgba(184,115,51,0.08)]"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          className="btn mt-10 w-full"
          type="button"
          onClick={() => {
            setAccessToken(null);
            navigate("/login");
          }}
        >
          Sign out
        </button>
      </aside>
      <main className="px-8 py-7">
        <Outlet />
      </main>
    </div>
  );
}
