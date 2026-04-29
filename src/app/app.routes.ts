import { Routes } from '@angular/router';
import { AuthGuard } from '@app/shared/guards';

export const appRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('@app/auth/auth.routes').then(m => m.authRoutes),
  },
  {
    path: 'admin',
    loadChildren: () => import('@app/admin/admin.routes').then(m => m.adminRoutes),
  },
];