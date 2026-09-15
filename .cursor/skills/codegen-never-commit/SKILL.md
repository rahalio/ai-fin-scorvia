---
name: codegen-never-commit
description: >-
  Never commit or push .codegen (local zero-codegen tool). Use when staging,
  committing, creating PRs, or reviewing git status in this repo.
---

# Never commit `.codegen`

## Rule

`.codegen/` (and loose `codegen/` / `**/zero_codegen/` trees) must **never** be committed or pushed to GitHub.

- Listed in `.gitignore` as a safeguard.
- Contains the local Python `zero_codegen` package and absolute-path merged config.
- Product contracts live in `packages/openapi-core/src/` and **are** committed.
- Bundled OpenAPI under `packages/openapi-core/src/.bundled/` is also gitignored.

## Agent checklist

1. Before `git add` / commit: confirm `.codegen` is not staged (`git status`).
2. Never `git add -f .codegen` or amend commits to include it.
3. After copying the scaffold, keep `.codegen` on disk for `pnpm codegen:*` / `PYTHONPATH=.codegen/codegen/src`.
4. Document for clones: obtain `.codegen` from the zero-apps codegen scaffold (or equivalent), then `pnpm codegen:paths`.

## Related

- `.cursor/rules/codegen-never-commit.mdc`
- `ddd-codegen` skill for generate commands
