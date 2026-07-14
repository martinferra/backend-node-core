# Análisis de sincronización con repositorios de origen

## Repositorios de referencia usados
- `martinferra/node-mean-server-generics`
- `martinferra/angular-generics`
- `martinferra/mean-common-generics`
- `martinferra/plant-monitor`

## Resultado de identificación de orígenes
- Archivos del repositorio actual con origen identificado: **192**
- Archivos del repositorio actual sin origen identificado: **51**
- Distribución de coincidencias por repositorio de origen (best-match):
  - `angular-generics`: **84**
  - `mean-common-generics`: **3**
  - `node-mean-server-generics`: **18**
  - `plant-monitor`: **87**
- Listas completas:
  - `assets/origin-sync/files-with-origin.json`
  - `assets/origin-sync/files-without-origin.json`

## Criterio de matching usado en esta iteración
- Se volvió a correr el análisis incluyendo `plant-monitor`.
- Para evitar falsos positivos por coincidencia de ruta/nombre, se usó score ponderado: `0.2 * similitud_de_ruta + 0.8 * similitud_de_contenido` en archivos de texto.
- Umbral mínimo para aceptar coincidencia: **0.55**.
- El score de contenido se incluye en `files-with-origin.json` para auditar cada match.

## Cambios aplicados en esta actualización de sincronización
- No se aplicaron cambios funcionales nuevos de código en esta iteración.
- Se mantiene la sincronización previa en `packages/backend-common/controllers/reports.controller.js`:
  - Soporte de `pageSetup` (origen `node-mean-server-generics`, commit `31409663da4691020e21c4048db4a33193b1adba`).
  - Fix de ZIP con paths temporales (origen `node-mean-server-generics`, commit `20b088604ba20d812c117718c8577c72305be82f`).

## Coincidencias con diferencias (best-match)
Se detectaron **73** archivos con diferencias frente a su origen identificado.
- `../frontend-common/src/lib/auth/auth-components-utils.service.ts` ↔ `angular-generics/app/auth/auth-components-utils.service.ts` (score 0.939, content 0.999, diff +1/-1)
- `../frontend-common/src/lib/basic-autocompleted-input/basic-autocompleted-input.component.html` ↔ `angular-generics/app/basic-autocompleted-input/basic-autocompleted-input.component.html` (score 0.815, content 0.817, diff +64/-54)
- `../frontend-common/src/lib/basic-autocompleted-input/basic-autocompleted-input.component.ts` ↔ `angular-generics/app/basic-autocompleted-input/basic-autocompleted-input.component.ts` (score 0.786, content 0.782, diff +129/-202)
- `../frontend-common/src/lib/basic-list-editor/basic-list-editor.component.ts` ↔ `angular-generics/app/basic-list-editor/basic-list-editor.component.ts` (score 0.836, content 0.857, diff +50/-36)
- `../frontend-common/src/lib/check-cards-group/check-cards-group.component.html` ↔ `angular-generics/app/check-cards-group/check-cards-group.component.html` (score 0.618, content 0.583, diff +14/-9)
- `../frontend-common/src/lib/check-cards-group/check-cards-group.component.ts` ↔ `angular-generics/app/check-cards-group/check-cards-group.component.ts` (score 0.914, content 0.955, diff +17/-19)
- `../frontend-common/src/lib/confirmation-dialog/confirmation-dialog.component.html` ↔ `angular-generics/app/confirmation-dialog/confirmation-dialog.component.html` (score 0.86, content 0.882, diff +3/-5)
- `../frontend-common/src/lib/confirmation-dialog/confirmation-dialog.component.ts` ↔ `angular-generics/app/confirmation-dialog/confirmation-dialog.component.ts` (score 0.8, content 0.808, diff +9/-17)
- `../frontend-common/src/lib/downloads-list/downloads-list.component.html` ↔ `angular-generics/app/downloads-list/downloads-list.component.html` (score 0.593, content 0.557, diff +24/-16)
- `../frontend-common/src/lib/downloads-list/downloads-list.component.ts` ↔ `angular-generics/app/downloads-list/downloads-list.component.ts` (score 0.861, content 0.895, diff +27/-19)
- `../frontend-common/src/lib/dynamic-container/dynamic-container.directive.ts` ↔ `angular-generics/app/dynamic-container/dynamic-container.directive.ts` (score 0.773, content 0.779, diff +3/-4)
- `../frontend-common/src/lib/expansion-list-editor/editorContainer.directive.ts` ↔ `angular-generics/app/expansion-list-editor/editorContainer.directive.ts` (score 0.904, content 0.94, diff +2/-1)
- `../frontend-common/src/lib/expansion-list-editor/expansion-list-editor.component.html` ↔ `angular-generics/app/expansion-list-editor/expansion-list-editor.component.html` (score 0.577, content 0.525, diff +81/-68)
- `../frontend-common/src/lib/expansion-list-editor/expansion-list-editor.component.ts` ↔ `angular-generics/app/expansion-list-editor/expansion-list-editor.component.ts` (score 0.898, content 0.928, diff +133/-100)
- `../frontend-common/src/lib/filters/filter-handler/filter-handler.component.ts` ↔ `angular-generics/app/filters/filter-handler/filter-handler.component.ts` (score 0.734, content 0.728, diff +10/-6)
- `../frontend-common/src/lib/models/data.service.ts` ↔ `angular-generics/models/data.service.ts` (score 0.907, content 0.991, diff +5/-11)
- `../frontend-common/src/lib/models/registration-req/registration-req.model.ts` ↔ `angular-generics/models/registration-req/registration-req.model.ts` (score 0.846, content 0.871, diff +1/-3)
- `../frontend-common/src/lib/ms-to-time-str.pipe.ts` ↔ `angular-generics/app/ms-to-time-str.pipe.ts` (score 0.879, content 0.951, diff +7/-4)
- `../frontend-common/src/lib/multi-slider/multi-slider.component.ts` ↔ `angular-generics/app/multi-slider/multi-slider.component.ts` (score 0.892, content 0.938, diff +110/-90)
- `../frontend-common/src/lib/registration-req/registration-req-list/registration-req-list.component.html` ↔ `angular-generics/app/registration-req/registration-req-list/registration-req-list.component.html` (score 0.947, content 0.978, diff +2/-2)
- `../frontend-common/src/lib/registration-req/registration-req-list/registration-req-list.component.ts` ↔ `angular-generics/app/registration-req/registration-req-list/registration-req-list.component.ts` (score 0.938, content 0.967, diff +10/-9)
- `../frontend-common/src/lib/reports/async-tasks.service.ts` ↔ `angular-generics/reports/async-tasks.service.ts` (score 0.881, content 0.939, diff +8/-8)
- `../frontend-common/src/lib/reports/reports.service.ts` ↔ `angular-generics/reports/reports.service.ts` (score 0.92, content 0.997, diff +1/-1)
- `../frontend-common/src/lib/services/backgroundTasks/background-tasks.service.ts` ↔ `angular-generics/app/services/backgroundTasks/background-tasks.service.ts` (score 0.951, content 0.997, diff +1/-1)
- `../frontend-common/src/lib/static-html.directive.ts` ↔ `angular-generics/app/static-html.directive.ts` (score 0.907, content 0.981, diff +5/-5)
- `../frontend-common/src/lib/tasks-drop-down-viewer/tasks-drop-down-viewer.component.html` ↔ `angular-generics/app/tasks-drop-down-viewer/tasks-drop-down-viewer.component.html` (score 0.643, content 0.607, diff +23/-16)
- `../frontend-common/src/lib/tasks-drop-down-viewer/tasks-drop-down-viewer.component.ts` ↔ `angular-generics/app/tasks-drop-down-viewer/tasks-drop-down-viewer.component.ts` (score 0.85, content 0.867, diff +34/-20)
- `../frontend-common/src/lib/users/user-list/user-list.component.html` ↔ `angular-generics/app/users/user-list/user-list.component.html` (score 0.906, content 0.953, diff +5/-3)
- `../frontend-common/src/lib/users/user-list/user-list.component.ts` ↔ `angular-generics/app/users/user-list/user-list.component.ts` (score 0.903, content 0.952, diff +11/-10)
- `../frontend-common/src/lib/users/user-new-edit/user-new-edit.component.html` ↔ `angular-generics/app/users/user-new-edit/user-new-edit.component.html` (score 0.798, content 0.809, diff +38/-32)
- `../frontend-common/src/lib/users/user-new-edit/user-new-edit.component.ts` ↔ `angular-generics/app/users/user-new-edit/user-new-edit.component.ts` (score 0.924, content 0.969, diff +25/-12)
- `packages/backend-common/commonFunctions.js` ↔ `node-mean-server-generics/commonFunctions.js` (score 0.914, content 0.992, diff +1/-1)
- `packages/backend-common/config/websockets.js` ↔ `node-mean-server-generics/config/websockets.js` (score 0.869, content 0.93, diff +3/-7)
- `packages/backend-common/controllers/controller.factory.js` ↔ `node-mean-server-generics/controllers/controller.factory.js` (score 0.945, content 0.998, diff +1/-1)
- `packages/backend-common/controllers/reports.controller.js` ↔ `node-mean-server-generics/controllers/reports.controller.js` (score 0.896, content 0.937, diff +22/-13)
- `packages/backend-common/controllers/shared-config.controller.js` ↔ `node-mean-server-generics/controllers/shared-config.controller.js` (score 0.912, content 0.948, diff +1/-1)
- `packages/backend-common/models/model.factory.js` ↔ `node-mean-server-generics/models/model.factory.js` (score 0.913, content 0.977, diff +1/-2)
- `packages/backend-common/models/registration-req.model.js` ↔ `node-mean-server-generics/models/registration-req.model.js` (score 0.926, content 0.976, diff +1/-1)
- `server/config/memory-usage.js` ↔ `node-mean-server-generics/config/memory-usage.js` (score 0.848, content 0.844, diff +2/-2)
- `server/controllers/shared-config.controller.js` ↔ `node-mean-server-generics/controllers/shared-config.controller.js` (score 0.942, content 0.948, diff +1/-1)
- `server/routes/file-download.route.js` ↔ `node-mean-server-generics/routes/file-download.route.js` (score 0.952, content 0.966, diff +1/-1)
- `server/routes/registration-req.route.js` ↔ `node-mean-server-generics/routes/registration-req.route.js` (score 0.667, content 0.609, diff +2/-2)
- `.gitignore` ↔ `plant-monitor/.gitignore` (score 0.956, content 0.945, diff +7/-0)
- `.vscode/launch.json` ↔ `plant-monitor/.vscode/launch.json` (score 0.662, content 0.578, diff +22/-5)
- `assets/dataload/customParserFunctions.js` ↔ `plant-monitor/assets/dataload/customParserFunctions.js` (score 0.978, content 0.972, diff +2/-2)
- `packages/backend-common/controllers/auth.controller.js` ↔ `plant-monitor/server/controllers/auth.controller.js` (score 0.91, content 0.957, diff +1/-1)
- `packages/backend-common/controllers/user.controller.js` ↔ `plant-monitor/server/controllers/user.controller.js` (score 0.774, content 0.786, diff +14/-0)
- `packages/backend-common/models/user.model.js` ↔ `plant-monitor/server/models/user.model.js` (score 0.925, content 0.994, diff +1/-1)
- `packages/backend-common/schemas/user.schema.js` ↔ `plant-monitor/server/schemas/user.schema.js` (score 0.925, content 0.989, diff +1/-1)
- `../frontend-common/src/lib/admin/admin.component.ts` ↔ `plant-monitor/src/app/admin/admin.component.ts` (score 0.9, content 0.962, diff +0/-1)
- `../frontend-common/src/lib/auth/login/login.component.html` ↔ `plant-monitor/src/app/auth/login/login.component.html` (score 0.784, content 0.805, diff +33/-26)
- `../frontend-common/src/lib/auth/login/login.component.ts` ↔ `plant-monitor/src/app/auth/login/login.component.ts` (score 0.762, content 0.781, diff +20/-30)
- `../frontend-common/src/lib/auth/register/register.component.html` ↔ `plant-monitor/src/app/auth/register/register.component.html` (score 0.874, content 0.91, diff +33/-26)
- `../frontend-common/src/lib/header/header.component.html` ↔ `plant-monitor/src/app/header/header.component.html` (score 0.671, content 0.669, diff +16/-14)
- `../frontend-common/src/lib/header/header.component.spec.ts` ↔ `plant-monitor/src/app/header/header.component.spec.ts` (score 0.93, content 0.988, diff +7/-5)
- `../frontend-common/src/lib/header/header.component.ts` ↔ `plant-monitor/src/app/header/header.component.ts` (score 0.623, content 0.612, diff +15/-17)
- `../frontend-common/src/lib/interceptors/header.interceptor.ts` ↔ `plant-monitor/src/app/interceptors/header.interceptor.ts` (score 0.942, content 0.999, diff +0/-0)
- `../frontend-common/src/lib/interceptors/http-error.interceptor.ts` ↔ `plant-monitor/src/app/interceptors/http-error.interceptor.ts` (score 0.875, content 0.911, diff +2/-5)
- `../frontend-common/src/lib/shared/services/auth/auth.service.ts` ↔ `plant-monitor/src/app/shared/services/auth/auth.service.ts` (score 0.943, content 0.997, diff +1/-1)
- `server/config/express.js` ↔ `plant-monitor/server/config/express.js` (score 0.775, content 0.718, diff +14/-9)
- `server/config/mongoose.js` ↔ `plant-monitor/server/config/mongoose.js` (score 0.944, content 0.93, diff +2/-2)
- `server/config/passport.js` ↔ `plant-monitor/server/config/passport.js` (score 0.974, content 0.968, diff +2/-2)
- `server/config/swagger.json` ↔ `plant-monitor/server/config/swagger.json` (score 0.898, content 0.873, diff +95/-88)
- `server/index.js` ↔ `plant-monitor/server/index.js` (score 0.912, content 0.889, diff +2/-4)
- `server/routes/auth.route.js` ↔ `plant-monitor/server/routes/auth.route.js` (score 0.882, content 0.852, diff +4/-4)
- `src/app/app.config.ts` ↔ `plant-monitor/src/app/app.config.ts` (score 0.739, content 0.674, diff +5/-15)
- `src/app/app.routes.ts` ↔ `plant-monitor/src/app/app.routes.ts` (score 0.575, content 0.469, diff +3/-30)
- `src/assets/logo.png` ↔ `plant-monitor/src/assets/logo.png` (score 1.0, content 0.0, diff +64/-133)
- `src/favicon.ico` ↔ `plant-monitor/src/favicon.ico` (score 1.0, content 0.0, diff +52/-1)
- `src/index.html` ↔ `plant-monitor/src/index.html` (score 0.918, content 0.898, diff +10/-2)
- `src/main.ts` ↔ `plant-monitor/src/main.ts` (score 0.937, content 0.921, diff +3/-3)
- `src/styles.scss` ↔ `plant-monitor/src/styles.scss` (score 0.756, content 0.695, diff +63/-4)
- `tsconfig.app.json` ↔ `plant-monitor/tsconfig.app.json` (score 0.882, content 0.852, diff +8/-3)

## Casos no claros / pendientes
- En `plant-monitor` hay coincidencias con módulos de aplicación y de infraestructura; su aplicabilidad como "rutina genérica" requiere validación manual por contexto funcional.
- Los archivos listados en `files-without-origin.json` quedan como pendientes de revisión manual para confirmar origen o autoría local.

