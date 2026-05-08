import { Routes } from '@angular/router';
import { LoginComponent } from './features/component/auth/login-component/login-component';
import { DashboardComponent } from './features/component/dashboard/dashboard-component/dashboard-component';
import { authGuard } from './core/guards/auth-guard';
import { RegisterComponent } from './features/component/auth/register-component/register-component';
import { AppShell } from './layout/app-shell/app-shell';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: '',
    component: AppShell,
    canActivateChild: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'projects', loadComponent: () => import('./features/component/project-component/project-component').then(m => m.ProjectComponent) },
      // Later: { path: 'projects', loadChildren: ... }
    ]
  },

  { path: '**', redirectTo: 'dashboard' },
];
