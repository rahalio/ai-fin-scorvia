# Codegen guide

## Modes

| Mode | When | Action |
|------|------|--------|
| **A — New domain** | First time a domain YAML has no layers | Full multi-layer `generate --domain X` |
| **B — YAML edit** | Domain already scaffolded | Bundle → `--layers core` → handwrite platform |

## Commands

```bash
pnpm codegen:paths
pnpm lint:openapi
pnpm bundle:openapi
pnpm codegen:core
pnpm codegen:identity   # full identity scaffold (starter)
```

Config: `.codegen/.zero-codegen-merged.json`  
Tool: `PYTHONPATH=.codegen/codegen/src python3 -m zero_codegen.cli.main`

`.codegen/` is **local-only** and must never be committed (see `codegen-never-commit` skill). Obtain it from the zero-apps codegen scaffold when cloning.

## OpenAPI sample shape

- `packages/openapi-core/src/common/` — envelopes, problem, security, parameters, primitives
- `packages/openapi-core/src/{domain}.yaml` — one file per domain
- `.codegen/openapi-examples/` — teaching specs (not wired to Redocly)

## Shared vs product

| Shared (keep) | Product (add) |
|---------------|---------------|
| `_shared` dirs, middleware, messaging | Domain YAML + generated trees |
| Identity domain (`/v0`) | projects, automl, evaluations, promotions, policy, scoring, referrals, monitoring, audits (`/v1`) |
| Envelope + Problem contracts | Domain-specific schemas |

## Related skills

- `ddd-platform` — architecture & anti-drift
- `ddd-codegen` — pipeline commands
- `ddd-identity` — auth blueprint
- `codegen-never-commit` — never push `.codegen`
