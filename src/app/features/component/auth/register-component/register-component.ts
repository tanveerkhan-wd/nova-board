import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth-service';

@Component({
  selector: 'app-register-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './register-component.html',
  styleUrl: './register-component.scss',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  fullName = signal('');
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  error = signal<string | null>(null);
  loading = signal(false);

  async register() {
    if (!this.fullName() || !this.email() || !this.password()) return;
    if (this.password() !== this.confirmPassword()) {
      this.error.set('Passwords do not match.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      await this.authService.signUp(this.email(), this.password(), this.fullName());
      // Supabase sends confirmation email by default → inform user
      alert('Registration successful! Check your email to confirm your account.');
      this.router.navigate(['/login']);
    } catch (err: any) {
      this.error.set(err.message || 'Registration failed. Try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
