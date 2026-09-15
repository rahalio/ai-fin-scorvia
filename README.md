# Scorvia

Governed AutoML credit-decision factory: promote consumer and SME scoring models only when they clear interpretability, regime-stability, class-imbalance, and production-readiness gates.

Product specs: [PRODUCT.md](./PRODUCT.md) · [USER_STORIES.md](./USER_STORIES.md) · [WEBAPP.md](./WEBAPP.md)

## Layout

```
packages/openapi-core  →  packages/core  →  platform/services  →  platform/adapters  →  platform/api-server
         ↑ OpenAPI source of truth                              ports↑        impl↑              HTTP↑
platform/webapp        →  Vite console (operator UI)
```

Package scope: **`@scorvia/*`**

## Quick start

```bash
pnpm install
pnpm lint:openapi && pnpm bundle:openapi
pnpm codegen:paths
pnpm build
pnpm dev:api
# Health: curl http://127.0.0.1:4000/health
# Demo key: X-API-Key: scorvia_demo_local_dev_key
```

Optional Dynamo Local:

```bash
docker compose up -d
TABLE_NAME=scorvia-core-local AWS_ENDPOINT_URL=http://localhost:8000 node scripts/ensure-dynamo-table.mjs
```

## Codegen

OpenAPI lives under `packages/openapi-core/src/` (one YAML per domain). The local generator tree is `.codegen/` and **must never be committed or pushed** — see `.cursor/rules/codegen-never-commit.mdc`. Clones that need to regenerate layers must obtain the generator separately (or copy from the zero-apps codegen scaffold) into `.codegen/`.

```bash
pnpm codegen:paths          # rewrite absolute paths in local merged config
pnpm lint:openapi && pnpm bundle:openapi
# Mode A (new domain): full multi-layer generate for that domain
# Mode B (YAML edit): regenerate core only, handwrite below
pnpm codegen:core
```

## Agent skills

`.cursor/skills/{ddd-platform,ddd-codegen,ddd-identity,codegen-never-commit}/`
