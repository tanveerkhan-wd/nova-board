import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { Sidenav } from '../sidenav/sidenav';
import { ButtonComponent } from '../../shared/components/button/button';

@Component({
  selector: 'app-app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    Sidenav,
    ButtonComponent,
  ],
  templateUrl: './app-shell.html',
  styleUrls: ['./app-shell.scss'],
})
export class AppShell {
  authService = inject(AuthService);
  router = inject(Router);

  sidenavVisible = signal(true);

  toggleSidenav() {
    this.sidenavVisible.update(v => !v);
  }

  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/login']);
  }
}
