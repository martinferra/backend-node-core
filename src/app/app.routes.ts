import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '@app/shared/guards';

export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
 {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
 },
  {
    path: 'auth',
    loadChildren: () => import('@app/auth/auth.routes').then(m => m.authRoutes),
  },
  {
    path: 'admin',
    loadChildren: () => import('@app/admin/admin.routes').then(m => m.adminRoutes),
  },
];