# @scorvia/openapi-core

OpenAPI 3.1 contracts for Scorvia.

| Domain | Spec |
|--------|------|
| identity | `src/identity.yaml` (`/v0`) |
| projects | `src/projects.yaml` |
| automl | `src/automl.yaml` |
| evaluations | `src/evaluations.yaml` |
| promotions | `src/promotions.yaml` |
| policy | `src/policy.yaml` |
| scoring | `src/scoring.yaml` |
| referrals | `src/referrals.yaml` |
| monitoring | `src/monitoring.yaml` |
| audits | `src/audits.yaml` |

```bash
pnpm lint:domains
pnpm bundle:domains
```

Bundled output under `src/.bundled/` is gitignored.
