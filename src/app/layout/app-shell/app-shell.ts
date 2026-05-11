import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { Sidenav } from '../sidenav/sidenav';

@Component({
  selector: 'app-app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    Sidenav,
  ],
  templateUrl: './app-shell.html',
  styleUrls: ['./app-shell.scss'],
})
export class AppShell {
  authService = inject(AuthService);
  router = inject(Router);

  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/login']);
  }
}
