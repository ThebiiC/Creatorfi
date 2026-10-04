import { Routes } from '@angular/router';
import { guestGuard, managerGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/auth/login-page').then((module) => module.LoginPage),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/auth/register-page').then((module) => module.RegisterPage),
  },
  {
    path: '',
    canActivate: [managerGuard],
    loadComponent: () => import('./pages/management/management-page').then((module) => module.ManagementPage),
  },
  {
    path: 'creator',
    canActivate: [managerGuard],
    loadComponent: () => import('./pages/creator/creator-page').then((module) => module.CreatorPage),
  },
];
