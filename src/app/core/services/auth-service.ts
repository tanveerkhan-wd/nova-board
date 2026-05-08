import { inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase-service';
import { User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase = inject(SupabaseService).client;

  user = signal<User | null>(null);

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    // Listen to auth changes (realtime!)
    this.supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      this.user.set(currentUser);
      this.userSubject.next(currentUser);
    });

    // Initial check
    this.supabase.auth.getSession().then(({ data }) => {
      this.user.set(data.session?.user ?? null);
      this.userSubject.next(data.session?.user ?? null);
    });
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    await this.supabase.auth.signOut();
  }

  get isAuthenticated() {
    return !!this.user();
  }
}
