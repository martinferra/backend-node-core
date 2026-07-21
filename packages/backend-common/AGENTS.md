# backend-common Agent Instructions (Neutral)

This document is the source of truth for any coding agent (GitHub Copilot, Codex, Cursor, Claude Code, etc.) working on `backend-node-core/packages/backend-common`.

## 1) Purpose

These instructions have two goals:

- Guide safe changes inside this package (`backend-common`).
- Guide creation or modification of a `backend-custom` package that uses this package as its base.

## 2) Scope and Responsibilities

`backend-common` is shared infrastructure. It should provide reusable backend primitives and avoid domain-specific business logic.

Primary responsibilities:

- `models/`: model registration and model resolution infrastructure (`modelFactory`).
- `routes/`: generic authenticated CRUD router generation (`getRouterByModel`).
- `controllers/`: shared CRUD controller behavior.
- `middleware/`, `config/`, `commonFunctions.js`, `reports/`: cross-cutting backend utilities.

Non-goals:

- App-specific domain rules.
- Project-specific route wiring.
- Hardcoded environment/project assumptions.

## 3) Rules for Changes in backend-common

When modifying this package, follow these rules:

1. Keep APIs stable
- Treat exported members from `index.js` and current folder modules as public contracts.
- Avoid breaking signatures for `models.modelFactory`, `routes.routerFactory`, and controller factories.
- If a breaking change is unavoidable, document migration impact in the PR/change summary.

2. Preserve discriminator behavior
- Do not bypass `modelFactory.registerModelSchema(...)` and `modelFactory.getModel(name, discriminator)` flows.
- Keep multi-tenant/discriminator naming and model creation behavior backward compatible.

3. Preserve security/auth defaults
- `routes/router.factory.js` enforces JWT auth in base routers.
- Do not remove or weaken auth middleware unless explicitly requested.

4. Keep core generic
- Do not add project-specific entities, constants, filters, or terminology in `backend-common`.
- Put domain-specific logic in consuming `backend-custom` packages.

5. Keep validations and persistence concerns separated
- Joi request schema logic belongs in consumer packages (usually `backend-custom/schemas`).
- Mongoose model schemas belong in consumer packages (usually `backend-custom/models`) and are registered through `modelFactory`.

6. Keep changes minimal
- Prefer small, focused edits.
- Avoid unrelated refactors while touching shared infrastructure.

## 4) How backend-custom Should Use backend-common

Use this package as a base layer, following this structure pattern (as seen in this repository):

- `backend-custom/models/*.model.js`: define Mongoose schemas and register with `modelFactory.registerModelSchema(...)`.
- `backend-custom/schemas/*.schema.js`: define Joi request validation schemas.
- `backend-custom/routes/*.route.js`: build routers with `getRouterByModel(...)`, and optionally pass custom wrappers/middleware/hooks.
- `backend-custom/controllers/*.controller.js`: domain-specific behavior used by route wrappers.
- `backend-custom/reports/*`: custom reports.
- `backend-custom/required.js`: central bootstrap that requires models/reports to force registration.
- `backend-custom/custom-modules.js`: list route modules to expose.
- `backend-custom/index.js`: exports `getRoutes()` from `custom-modules`.

Expected integration flow:

1. Model files register schemas in `modelFactory`.
2. `required.js` loads those files during startup.
3. Route files call `getRouterByModel(modelName, joiSchema, customRoutes?)`.
4. App startup consumes `backend-custom/index.js` and mounts returned routes.

## 5) Custom Route Extension Pattern

When `backend-custom` needs behavior beyond default CRUD:

- Use `customRoutes` hooks in `getRouterByModel(...)`:
  - `setCustomRoutes(router)`
  - `findPreMiddleware`, `savePreMiddleware`, etc.
  - wrapper callbacks like `saveWrapperCb`
- Keep custom logic in `backend-custom` routes/controllers; do not move it into `backend-common` unless it is truly generic and reusable.

## 6) Configuration and Secrets

- Never hardcode secrets.
- Do not read `process.env` directly in business logic.
- Use shared config packages/modules with validation.

## 7) Validation Expectations for Agents

After changes:

- Run the relevant build/test/lint checks available in the workspace or package.
- If full validation is not possible, clearly report what was not executed and why.

## 8) Reference Contract for Consumer Packages

Custom packages should include their own `AGENTS.md` and explicitly reference this file as their base contract for backend-common usage.

Reference target:

- `backend-node-core/packages/backend-common/AGENTS.md`

Suggested snippet for a consumer package `AGENTS.md`:

- "For backend infrastructure conventions, use `backend-node-core/packages/backend-common/AGENTS.md` as the base contract. This package adds only domain-specific rules on top."

## 9) Change Scope Rules

- Do not revert unrelated local changes.
- Do not run destructive git operations unless explicitly requested.
- Keep style and formatting consistent with existing files.