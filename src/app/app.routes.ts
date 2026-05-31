import { Routes } from '@angular/router';
import { AuthGuard } from '@martinferra/frontend-common/shared/guards';

export const appRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('@martinferra/frontend-common/auth/auth.routes').then(m => m.authRoutes),
  },
  {
    path: 'admin',
    loadChildren: () => import('@martinferra/frontend-common/admin/admin.routes').then(m => m.adminRoutes),
  },
];