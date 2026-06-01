import { Routes } from '@angular/router';
import { AppComponent } from '@martinferra/frontend-custom';

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