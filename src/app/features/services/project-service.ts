import { Injectable, signal } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, from, switchMap, map, catchError } from 'rxjs';
import { Project } from '../interfaces/projectInterface';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private supabase = inject(SupabaseClient) as SupabaseClient; // From provider
  public projects = signal<Project[]>([]); // Reactive cache
  projects$ = toObservable(this.projects); // For components

  constructor() {
    this.loadProjects(); // Auto-load on init
  }

  loadProjects(): void {
    from(this.supabase.from('projects').select('*').order('created_at', { ascending: false }))
      .pipe(
        map(({ data, error }) => {
          if (error) throw error;
          return data as Project[];
        }),
        catchError(err => { console.error('Load error:', err); throw err; })
      )
      .subscribe(projects => this.projects.set(projects));
  }

  // READ: Get one by ID
  getProject(id: string): Observable<Project | null> {
    return from(this.supabase.from('projects').select('*').eq('id', id).single()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Project;
      }),
      catchError(err => { console.error('Get error:', err); return []; })
    );
  }

  // CREATE: Add new project
  createProject(project: Omit<Project, 'id' | 'created_at'>): Observable<Project> {
    return from(this.supabase.from('projects').insert(project).select().single()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        const newProject = data as Project;
        this.projects.update(prev => [...prev, newProject]); // Update cache
        return newProject;
      }),
      catchError(err => { console.error('Create error:', err); throw err; })
    );
  }

  // UPDATE: Patch existing
  updateProject(id: string, updates: Partial<Project>): Observable<Project> {
    return from(this.supabase.from('projects').update(updates).eq('id', id).select().single()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        const updated = data as Project;
        this.projects.update(prev => prev.map(p => p.id === id ? updated : p)); // Update cache
        return updated;
      }),
      catchError(err => { console.error('Update error:', err); throw err; })
    );
  }

  // DELETE: Remove by ID
  deleteProject(id: string): Observable<void> {
    return from(this.supabase.from('projects').delete().eq('id', id)).pipe(
      map(({ error }) => {
        if (error) throw error;
        this.projects.update(prev => prev.filter(p => p.id !== id)); // Update cache
      }),
      map(() => undefined), // Return void
      catchError(err => { console.error('Delete error:', err); throw err; })
    );
  }

}
