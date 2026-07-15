# mean-core — Copilot Instructions

## Overview

mean-core is a backend-first core framework used as a **git submodule** in application repositories. It provides shared backend infrastructure (authentication, user management, model/router factories, configuration) and serves whichever frontend distribution is selected by configuration (`MEAN_FRONTEND`, currently `angular` or `react`).

---

## Technology Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20.11.1 |
| Backend framework | Express 4 |
| Database | MongoDB via Mongoose 8 |
| Auth | JWT (`express-jwt`, `jsonwebtoken`, Passport) |
| Validation | Joi (env vars + request schemas) |
| Frontend integration | Static frontend serving selected by `MEAN_FRONTEND` |
| Angular support | Available via `packages/frontend-common` and/or consuming repo frontend workspace |
| Dev server | BrowserSync |
| Package management | npm workspaces |

---

## Repository Structure

```
mean-core/                          ← submodule root (this repo)
├── packages/
│   ├── backend-common/             ← backend library (@martinferra/backend-common)
│   │   ├── config/                 ← server-side services (email, websockets, subscriptions)
│   │   ├── controllers/            ← auth, user, reports, shared-config controllers + controller.factory.js
│   │   ├── middleware/             ← require-admin.js
│   │   ├── models/                 ← user.model.js, registration-req.model.js + model.factory.js
│   │   ├── reports/                ← reports-definitions.js
│   │   ├── routes/                 ← router.factory.js
│   │   ├── schemas/                ← user.schema.js, registration-req.schema.js (Joi)
│   │   ├── commonFunctions.js      ← applyMongooseTypesRecursive, applyObjectIdRecursive, fetch
│   │   └── index.js                ← public API of the package
│   ├── common/                     ← isomorphic utilities (@martinferra/common)
│   │   ├── commonFunctions.js      ← applyRecursive, regex helpers
│   │   └── index.js
│   ├── config/                     ← centralised config (@martinferra/config)
│   │   └── config.js               ← loads .env with Joi, exports typed config object
│   └── frontend-common/            ← frontend-common package sources synced from frontend-common repo
│       └── src/                    ← Angular app/library code (reference frontend package)
├── server/
│   ├── index.js                    ← entry point (listens on port, inits server processes)
│   ├── required.js                 ← bootstraps mongoose + loads @martinferra/backend-custom
│   ├── config/
│   │   ├── express.js              ← Express app setup (middleware, static serving, routes)
│   │   ├── mongoose.js             ← Mongoose connection
│   │   ├── passport.js             ← JWT Passport strategy
│   │   └── swagger.json            ← Swagger spec
│   └── routes/
│       └── index.route.js          ← mounts all routes (core + custom)
├── assets/
├── .env.example                    ← template for required environment variables
├── nodemon.json                    ← backend watch configuration
└── package.json                    ← npm workspace member; scripts: serve/start/start:debug/start:bs
```

---

## Core Design Patterns

### 1. Model Factory

All Mongoose models are registered through `modelFactory` instead of calling `mongoose.model()` directly. This enables discriminator-based multi-tenancy.

```js
// Registering a schema
const modelFactory = require('@martinferra/backend-common').models.modelFactory;
modelFactory.registerModelSchema('MyEntity', myMongooseSchema);

// Retrieving a model (optionally with a discriminator)
const MyEntity = modelFactory.getModel('MyEntity', req.params.discriminator);
```

- Register in the `models/<entity>.model.js` file.
- Load (require) the model file in the custom package's `required.js` so it is registered at startup.
- Discriminators allow per-user or per-tenant model isolation — the discriminator value is typically set from `req.params.discriminator` or `req.user._id`.

### 2. Router Factory

Standard CRUD routes are generated automatically with `getRouterByModel`. This mounts:

| Endpoint | Method | Description |
|---|---|---|
| `/find/:discriminator?` | POST | Query documents |
| `/findWithPagination/:discriminator?` | POST | Paginated query |
| `/findOne/:discriminator?` | POST | Single document |
| `/findById/:discriminator?` | POST | By ID |
| `/save/:discriminator?` | POST | Insert or update |
| `/removeById/:discriminator?` | POST | Delete |
| `/count/:discriminator?` | POST | Count documents |

```js
const { getRouterByModel } = require('@martinferra/backend-common').routes.routerFactory;
const myEntitySchema = require('../schemas/my-entity.schema'); // Joi schema

const myEntityRouter = getRouterByModel(
  'MyEntity',         // model name (matches modelFactory registration)
  myEntitySchema,     // Joi validation schema
  { setCustomRoutes } // optional: function that receives the router to add extra routes
);
```

All routes generated by the factory require JWT authentication (Passport `jwt` strategy).

### 3. Dual Schema Convention

Each entity has **two separate schema files**:

| File | Purpose | Technology |
|---|---|---|
| `models/<entity>.model.js` | Mongoose schema + model registration | Mongoose (`mongoose.Schema`) |
| `schemas/<entity>.schema.js` | Request payload validation | Joi (`Joi.object(...)`) |

The Mongoose schema is used for persistence; the Joi schema is passed to `getRouterByModel` and applied to the request body before saving.

### 4. Config Package

Environment variables are loaded once in `@martinferra/config` using Joi for validation. The `.env` file must sit at the repository root (three levels above `packages/config/config.js`).

```js
const config = require('@martinferra/config');
// config.port, config.mongo.host, config.jwtSecret, config.env, …
```

Never read `process.env` directly in application code — always import from `@martinferra/config` or from the custom config module.

### 5. Frontend — DataService Abstract Class

When using the Angular frontend, entity services extend `DataService` from `@martinferra/frontend-common`. This class wires HTTP calls, `class-transformer` serialization, and instance methods (`save()`, `remove()`) onto entity class instances automatically.

### 6. Frontend Serving Strategy

Frontend runtime is selected in `@martinferra/config` through `MEAN_FRONTEND` and used by `server/config/express.js`.

- `MEAN_FRONTEND=angular`: serve `../../../dist/`
- `MEAN_FRONTEND=react`: serve `../../../node_modules/material-dashboard-react/dist`

Express mounts static files from the selected dist and returns `index.html` for non-API routes.

The backend remains framework-agnostic as long as frontend output is built to the expected dist path.

---

## Consuming Project Structure

A project that uses mean-core as a git submodule must follow this structure:

```
<project-root>/
├── mean-core/                      ← git submodule (this repo)
├── backend-custom/                 ← domain-specific backend logic
│   ├── index.js                    ← exports { getRoutes }
│   ├── required.js                 ← requires all model files and report definitions
│   ├── custom-modules.js           ← imports models + exports { routes: [...] }
│   ├── config/
│   │   └── custom-config.js        ← project-specific env vars validated with Joi
│   ├── controllers/
│   │   └── <entity>.controller.js  ← custom controller functions
│   ├── models/
│   │   └── <entity>.model.js       ← Mongoose schema + modelFactory.registerModelSchema(...)
│   ├── routes/
│   │   └── <entity>.route.js       ← getRouterByModel(...) + optional custom routes
│   ├── schemas/
│   │   └── <entity>.schema.js      ← Joi validation schema for request payloads
│   └── reports/
│       └── reports-definitions.js  ← custom report definitions
├── frontend-common/                ← frontend app workspace (Angular in current implementations)
│   ├── angular.json
│   ├── package.json
│   └── src/
├── frontend-custom/                ← optional domain-specific frontend library/extensions
│   ├── package.json                ← name: "@martinferra/frontend-custom"
│   ├── ng-package.json
│   ├── tsconfig.lib.json
│   └── src/
├── package.json                    ← root package.json declaring npm workspaces
├── frontend-common/angular.json    ← Angular workspace config (when Angular frontend is used)
├── tsconfig.json                   ← root TypeScript config
└── .env                            ← environment variables (never committed)
```

### backend-custom/index.js

```js
const customModules = require('./custom-modules');
require('./required');

function getRoutes() {
  return customModules.routes;
}

module.exports = { getRoutes };
```

### backend-custom/required.js

```js
require('./reports/reports-definitions');
require('./models/entity-a.model');
require('./models/entity-b.model');
// … all model files
```

### backend-custom/custom-modules.js

```js
require('./models/entity-a.model');
require('./models/entity-b.model');

module.exports = {
  routes: [
    { name: 'entity-a', module: require('./routes/entity-a.route') },
    { name: 'entity-b', module: require('./routes/entity-b.route') },
  ]
};
```

### npm workspaces (root package.json)

```json
{
  "workspaces": [
    "mean-core",
    "mean-core/packages/backend-common",
    "mean-core/packages/common",
    "mean-core/packages/config",
    "frontend-common",
    "backend-custom",
    "frontend-custom"
  ]
}
```

### angular.json (key entries)

- Located at `frontend-common/angular.json` in consuming repos that use Angular.
- Main app project `root`: `"."`, `sourceRoot`: `"src"`
- `outputPath`: `"../dist"`
- Builder: `@angular-builders/custom-webpack:browser`
- Styles can be sourced from `../frontend-custom/src/styles.scss`.
- The library project `@martinferra/frontend-custom` is typically mapped from `../frontend-custom`.

---

## Environment Variables

Required variables (see `mean-core/.env.example`):

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | No | `development` \| `production` (default: `development`) |
| `SERVER_PORT` | No | Port for the Express server (default: `4040`) |
| `JWT_SECRET` | **Yes** | Secret for signing JWT tokens |
| `MONGO_HOST` | **Yes** | MongoDB connection string (e.g., `mongodb://localhost/mydb`) |
| `MONGO_PORT` | No | MongoDB port (default: `27017`) |
| `MONGOOSE_DEBUG` | No | Log Mongoose queries (default: `true` in development) |
| `MEAN_FRONTEND` | No | Frontend type, use `angular` (default: `angular`) |
| `TIMEZONE_OFFSET` | No | Offset in minutes |
| `ALLOW_USER_REGISTRATION` | No | Enables public user registration (default: `false`) |

Custom projects may add their own variables and validate them via Joi in `backend-custom/config/custom-config.js`, following the same pattern as `@martinferra/config`.

---

## Coding Standards

### General

- **CommonJS** (`require`/`module.exports`) for all backend Node.js code.
- **TypeScript** with standalone component API for all Angular frontend code.
- File names use **kebab-case** (e.g., `product-family.model.js`, `cost-center.route.js`).
- Class names and Angular component selectors use **PascalCase** / Angular naming conventions.

### Backend

- Always wrap route handlers with `express-async-handler` (`asyncHandler`) to propagate async errors.
- Never read `process.env` directly — use `@martinferra/config` or the custom config module.
- Always register Mongoose schemas through `modelFactory.registerModelSchema`, never call `mongoose.model()` directly.
- Use `modelFactory.getModel(name, req.params.discriminator)` inside controllers and routes to resolve the correct model.
- Separate persistence concerns (Mongoose schema in `models/`) from validation concerns (Joi schema in `schemas/`).
- Admin-only routes should use the `require-admin` middleware from `@martinferra/backend-common`.

### Frontend

- Use Angular **standalone components** — do not use NgModules.
- Extend `DataService` for all entity-level HTTP services.
- Use `class-transformer` decorators (`@Type`, `@Transform`) on entity classes to handle serialization.
- Route modules use lazy loading via `loadChildren` with inline arrow functions.
- Interceptors are registered functionally in `app.config.ts` via `withInterceptors`.
- Use Angular Material components for all UI elements.
- Browser tab title is owned by the consuming frontend (`frontend-custom`), not by mean-core static HTML.

### Security

- JWT tokens must be validated on every API request via the Passport `jwt` strategy (applied automatically by `getBaseRouter` in `router.factory.js`).
- Helmet is configured in `server/config/express.js` for standard HTTP security headers.
- Never store secrets in source code — always use environment variables.
- Joi validation is applied to all incoming request payloads before they reach the database layer.

---

## Scripts

Run from the **mean-core workspace root**:

| Script | Description |
|---|---|
| `npm start` | Start the Express server |
| `npm run start:debug` | Start the server with nodemon + inspector |
| `npm run start:bs` | Start BrowserSync (proxies the Express server with live reload) |

Frontend build scripts (`build:dev`, `build:prod`, etc.) are owned by the consuming frontend workspace (for example, `frontend-common`).
