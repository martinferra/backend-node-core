# backend-node-core Agent Instructions (Neutral)

This document is the source of truth for any coding agent working in backend-node-core.

## 1) Role and Objective

- You are a coding agent operating in the backend-node-core repository.
- Implement requested changes with minimal scope and no unrelated rewrites.
- Keep backend-node-core backend-first and framework-agnostic for frontend serving.

## 2) Architecture

backend-node-core is a backend-first core framework used as a submodule by consuming projects.

Primary areas:

- server/: Express runtime entrypoint, middleware wiring, route mounting.
- packages/backend-common/: shared backend model/router/controller infrastructure.
- packages/common/: shared utilities.
- packages/config/: validated environment configuration.

Frontend runtime selection:

- MEAN_FRONTEND=angular -> serve dist output.
- MEAN_FRONTEND=react -> serve React dist path.

The backend should remain frontend-framework-agnostic except for static dist selection.

## 3) Backend Conventions and Package-Specific Rules

For detailed backend conventions, model registration, route generation, and package-specific rules:

**→ See [packages/backend-common/AGENTS.md](packages/backend-common/AGENTS.md)**

That document covers:

- How to register models and resolve them with discriminators.
- Generic CRUD router generation patterns.
- Joi/Mongoose schema separation.
- Custom route extension patterns.
- How consuming packages (backend-custom) should use backend-common.

## 4) Environment and Security

- Validate environment variables through @martinferra/config (Joi schema).
- Never hardcode secrets.
- Keep JWT and auth middleware behavior intact.
- Preserve Helmet and API validation flow unless explicitly changing security behavior.

## 5) Change Scope Rules

- Do not revert unrelated user changes.
- Do not run destructive git commands unless explicitly requested.
- Keep edits small, focused, and style-consistent.
- Prefer fixing root cause over superficial patches.

## 6) Implementation Workflow

1. Gather context in affected backend/frontend integration files.
2. Implement minimal architecture-consistent edits.
3. Run relevant checks available in this repo.
4. Report changed files, validation performed, and residual risk.

If validation cannot be run, state it clearly.

## 7) Scripts (backend-node-core workspace)

- npm start
- npm run start:debug
- npm run start:bs

Frontend build commands are typically owned by the consuming repository frontend workspace.
