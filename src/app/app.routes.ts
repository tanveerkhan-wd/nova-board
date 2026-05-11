import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login-component/login-component';
import { RegisterComponent } from './features/auth/components/register-component/register-component';
import { authGuard, guestGuard } from './core/guards/auth-guard';
import { AppShell } from './layout/app-shell/app-shell';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },

  {
    path: '',
    component: AppShell,
    canActivateChild: [authGuard],
    children: [
      { path: 'projects', loadComponent: () => import('./features/projects/components/project-component/project-component').then(m => m.ProjectComponent) },
      { path: 'projects/:id', loadComponent: () => import('./features/board/components/kanban-board/kanban-board').then(m => m.KanbanBoardComponent) },
      { path: '', redirectTo: 'projects', pathMatch: 'full' },
    ]
  },

  { path: '**', redirectTo: 'projects' },
];
