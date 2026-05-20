import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
  {
    path: 'servicos',
    loadComponent: () => import('./pages/servicos/servicos').then(m => m.Servicos)
  },
  {
    path: 'agendamento',
    loadComponent: () => import('./pages/agendamento/agendamento').then(m => m.Agendamento)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'privacidade',
    loadComponent: () => import('./pages/privacidade/privacidade').then(m => m.Privacidade)
  },
  { path: '**', redirectTo: 'home' }
];
