import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from './auth/guards/not-authenticated.guard';
import { inject } from '@angular/core';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard';
import { isAdminGuard } from './auth/guards/is-admin.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [
      NotAuthenticatedGuard,
    ]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin-dashboard/admin-dashboard.routes'),

  },
  {
    path: '',
    loadChildren: () => import('./store-front/store-front.routes'),
    canActivate: [
      AuthenticatedGuard,
    ]
  }
];
