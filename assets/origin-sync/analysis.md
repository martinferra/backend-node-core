# Análisis de sincronización con repositorios de origen

## Repositorios de referencia usados
- `martinferra/node-mean-server-generics`
- `martinferra/angular-generics`
- `martinferra/mean-common-generics`
- `martinferra/plant-monitor` (no accesible desde este entorno; ver sección de casos no claros)

## Resultado de identificación de orígenes
- Archivos del repositorio actual con origen identificado: **109**
- Archivos del repositorio actual sin origen identificado: **131**
- Listas completas:
  - `assets/origin-sync/files-with-origin.json`
  - `assets/origin-sync/files-without-origin.json`

## Cambios aplicados en esta actualización
- `packages/backend-common/controllers/reports.controller.js`
  - Se aplicó el cambio de `node-mean-server-generics` para soportar `pageSetup` en generación de Excel.
    - Commit de origen: `31409663da4691020e21c4048db4a33193b1adba` (`Admitir configuración de página en Excel`).
  - Se aplicó el bugfix de `node-mean-server-generics` para reportes agrupados ZIP cuando los contenidos son paths temporales de archivos.
    - Commit de origen: `20b088604ba20d812c117718c8577c72305be82f` (`Bug, los reportes en grupo se toman como binarios cuando son paths a archivos temporales`).

## Criterios aplicados para decidir actualizaciones
1. **Aplicar cambios** cuando el commit de origen corrige un bug funcional genérico y el ajuste es compatible con la estructura actual del monorepo (imports/paths).
2. **No aplicar automáticamente** cambios donde la diferencia es sólo por relocalización de módulos (`@app/*`, `@martinferra/*`, rutas relativas distintas).
3. **No aplicar en este pase** cambios con divergencia funcional amplia sin evidencia suficiente de compatibilidad directa con este repositorio.
4. **Priorizar cambios trazables a commits con intención explícita de fix/mejora funcional** en los repositorios de origen.

## Coincidencias revisadas con diferencias (sin aplicar por ahora)
Se detectaron **45** archivos con diferencias frente al origen identificado. Los casos no aplicados en este pase quedaron pendientes de análisis funcional específico por módulo.
- `packages/backend-common/commonFunctions.js` ↔ `node-mean-server-generics/commonFunctions.js` (similitud 0.992, diff +1/-1)
- `packages/backend-common/config/email.js` ↔ `node-mean-server-generics/config/email.js` (similitud 0.556, diff +31/-88)
- `packages/backend-common/config/websockets.js` ↔ `node-mean-server-generics/config/websockets.js` (similitud 0.93, diff +3/-7)
- `packages/backend-common/controllers/controller.factory.js` ↔ `node-mean-server-generics/controllers/controller.factory.js` (similitud 0.998, diff +1/-1)
- `packages/backend-common/controllers/shared-config.controller.js` ↔ `node-mean-server-generics/controllers/shared-config.controller.js` (similitud 0.948, diff +1/-1)
- `packages/backend-common/models/model.factory.js` ↔ `node-mean-server-generics/models/model.factory.js` (similitud 0.977, diff +1/-2)
- `packages/backend-common/models/registration-req.model.js` ↔ `node-mean-server-generics/models/registration-req.model.js` (similitud 0.976, diff +1/-1)
- `packages/frontend-common/src/lib/auth/auth-components-utils.service.ts` ↔ `angular-generics/app/auth/auth-components-utils.service.ts` (similitud 0.999, diff +1/-1)
- `packages/frontend-common/src/lib/basic-autocompleted-input/basic-autocompleted-input.component.html` ↔ `angular-generics/app/basic-autocompleted-input/basic-autocompleted-input.component.html` (similitud 0.817, diff +64/-54)
- `packages/frontend-common/src/lib/basic-autocompleted-input/basic-autocompleted-input.component.ts` ↔ `angular-generics/app/basic-autocompleted-input/basic-autocompleted-input.component.ts` (similitud 0.8, diff +129/-202)
- `packages/frontend-common/src/lib/basic-list-editor/basic-list-editor.component.html` ↔ `angular-generics/app/basic-list-editor/basic-list-editor.component.html` (similitud 0.759, diff +4/-2)
- `packages/frontend-common/src/lib/basic-list-editor/basic-list-editor.component.ts` ↔ `angular-generics/app/basic-list-editor/basic-list-editor.component.ts` (similitud 0.857, diff +50/-36)
- `packages/frontend-common/src/lib/check-cards-group/check-cards-group.component.html` ↔ `angular-generics/app/check-cards-group/check-cards-group.component.html` (similitud 0.759, diff +14/-9)
- `packages/frontend-common/src/lib/check-cards-group/check-cards-group.component.ts` ↔ `angular-generics/app/check-cards-group/check-cards-group.component.ts` (similitud 0.955, diff +17/-19)
- `packages/frontend-common/src/lib/confirmation-dialog/confirmation-dialog.component.html` ↔ `angular-generics/app/confirmation-dialog/confirmation-dialog.component.html` (similitud 0.882, diff +3/-5)
- `packages/frontend-common/src/lib/confirmation-dialog/confirmation-dialog.component.scss` ↔ `angular-generics/app/confirmation-dialog/confirmation-dialog.component.scss` (similitud 0.772, diff +0/-12)
- `packages/frontend-common/src/lib/confirmation-dialog/confirmation-dialog.component.ts` ↔ `angular-generics/app/confirmation-dialog/confirmation-dialog.component.ts` (similitud 0.808, diff +9/-17)
- `packages/frontend-common/src/lib/downloads-list/downloads-list.component.html` ↔ `angular-generics/app/downloads-list/downloads-list.component.html` (similitud 0.736, diff +24/-16)
- `packages/frontend-common/src/lib/downloads-list/downloads-list.component.ts` ↔ `angular-generics/app/downloads-list/downloads-list.component.ts` (similitud 0.895, diff +27/-19)
- `packages/frontend-common/src/lib/dynamic-container/dynamic-container.directive.ts` ↔ `angular-generics/app/dynamic-container/dynamic-container.directive.ts` (similitud 0.779, diff +3/-4)
- `packages/frontend-common/src/lib/expansion-list-editor/editorContainer.directive.ts` ↔ `angular-generics/app/expansion-list-editor/editorContainer.directive.ts` (similitud 0.94, diff +2/-1)
- `packages/frontend-common/src/lib/expansion-list-editor/expansion-list-editor.component.html` ↔ `angular-generics/app/expansion-list-editor/expansion-list-editor.component.html` (similitud 0.784, diff +81/-68)
- `packages/frontend-common/src/lib/expansion-list-editor/expansion-list-editor.component.ts` ↔ `angular-generics/app/expansion-list-editor/expansion-list-editor.component.ts` (similitud 0.928, diff +133/-100)
- `packages/frontend-common/src/lib/filters/filter-handler/filter-handler.component.ts` ↔ `angular-generics/app/filters/filter-handler/filter-handler.component.ts` (similitud 0.759, diff +10/-6)
- `packages/frontend-common/src/lib/models/data.service.ts` ↔ `angular-generics/models/data.service.ts` (similitud 0.991, diff +5/-11)
- `packages/frontend-common/src/lib/models/registration-req/registration-req.model.ts` ↔ `angular-generics/models/registration-req/registration-req.model.ts` (similitud 0.871, diff +1/-3)
- `packages/frontend-common/src/lib/ms-to-time-str.pipe.ts` ↔ `angular-generics/app/ms-to-time-str.pipe.ts` (similitud 0.951, diff +7/-4)
- `packages/frontend-common/src/lib/multi-slider/multi-slider.component.ts` ↔ `angular-generics/app/multi-slider/multi-slider.component.ts` (similitud 0.938, diff +110/-90)
- `packages/frontend-common/src/lib/registration-req/registration-req-list/registration-req-list.component.html` ↔ `angular-generics/app/registration-req/registration-req-list/registration-req-list.component.html` (similitud 0.978, diff +2/-2)
- `packages/frontend-common/src/lib/registration-req/registration-req-list/registration-req-list.component.ts` ↔ `angular-generics/app/registration-req/registration-req-list/registration-req-list.component.ts` (similitud 0.967, diff +10/-9)
- `packages/frontend-common/src/lib/reports/async-tasks.service.ts` ↔ `angular-generics/reports/async-tasks.service.ts` (similitud 0.939, diff +8/-8)
- `packages/frontend-common/src/lib/reports/reports.service.ts` ↔ `angular-generics/reports/reports.service.ts` (similitud 0.997, diff +1/-1)
- `packages/frontend-common/src/lib/services/backgroundTasks/background-tasks.service.ts` ↔ `angular-generics/app/services/backgroundTasks/background-tasks.service.ts` (similitud 0.997, diff +1/-1)
- `packages/frontend-common/src/lib/static-html.directive.ts` ↔ `angular-generics/app/static-html.directive.ts` (similitud 0.981, diff +5/-5)
- `packages/frontend-common/src/lib/tasks-drop-down-viewer/tasks-drop-down-viewer.component.html` ↔ `angular-generics/app/tasks-drop-down-viewer/tasks-drop-down-viewer.component.html` (similitud 0.79, diff +23/-16)
- `packages/frontend-common/src/lib/tasks-drop-down-viewer/tasks-drop-down-viewer.component.ts` ↔ `angular-generics/app/tasks-drop-down-viewer/tasks-drop-down-viewer.component.ts` (similitud 0.867, diff +34/-20)
- `packages/frontend-common/src/lib/users/user-list/user-list.component.html` ↔ `angular-generics/app/users/user-list/user-list.component.html` (similitud 0.953, diff +5/-3)
- `packages/frontend-common/src/lib/users/user-list/user-list.component.ts` ↔ `angular-generics/app/users/user-list/user-list.component.ts` (similitud 0.952, diff +11/-10)
- `packages/frontend-common/src/lib/users/user-new-edit/user-new-edit.component.html` ↔ `angular-generics/app/users/user-new-edit/user-new-edit.component.html` (similitud 0.809, diff +38/-32)
- `packages/frontend-common/src/lib/users/user-new-edit/user-new-edit.component.ts` ↔ `angular-generics/app/users/user-new-edit/user-new-edit.component.ts` (similitud 0.969, diff +25/-12)
- `server/config/memory-usage.js` ↔ `node-mean-server-generics/config/memory-usage.js` (similitud 0.863, diff +2/-2)
- `server/controllers/shared-config.controller.js` ↔ `node-mean-server-generics/controllers/shared-config.controller.js` (similitud 0.948, diff +1/-1)
- `server/routes/file-download.route.js` ↔ `node-mean-server-generics/routes/file-download.route.js` (similitud 0.966, diff +1/-1)
- `server/routes/registration-req.route.js` ↔ `node-mean-server-generics/routes/registration-req.route.js` (similitud 0.901, diff +2/-2)

## Casos no claros / pendientes
- No se pudo incorporar `martinferra/plant-monitor` en este entorno para búsqueda automática de coincidencias, por lo que cualquier rutina genérica proveniente de ese repo requiere validación manual adicional.
- Archivos sin origen identificado (`assets/origin-sync/files-without-origin.json`) pueden corresponder a:
  - Código propio de integración de `mean-core`
  - Adaptaciones estructurales del monorepo
  - Archivos potencialmente derivados de `plant-monitor` que no se pudieron contrastar en forma automática
