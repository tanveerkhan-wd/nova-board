import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth-service';
import { ButtonComponent } from '../../../../shared/components/button/button';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    RouterLink,
    ButtonComponent,
  ],
  templateUrl: './login-component.html',
  styleUrls: ['./login-component.scss'],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  remember = signal(false);
  error = signal<string | null>(null);
  loading = signal(false);

  async login() {
    if (!this.email() || !this.password()) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      await this.authService.signIn(this.email(), this.password());
      this.router.navigate(['/projects']);
    } catch (err: any) {
      this.error.set(err.message || 'Login failed. Please check your credentials.');
    } finally {
      this.loading.set(false);
    }
  }
}
