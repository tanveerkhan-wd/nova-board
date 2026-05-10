import { Injectable, signal, inject } from '@angular/core';
import { from, map, catchError, Observable, tap } from 'rxjs';
import { SupabaseService } from '../../../core/services/supabase-service';
import { Task, TaskStatus } from '../../../shared/interfaces/database.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private supabase = inject(SupabaseService).client;
  
  private tasksSignal = signal<Task[]>([]);
  public tasks = this.tasksSignal.asReadonly();

  async loadTasks(projectId: string) {
    const { data, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error loading tasks:', error);
      return;
    }

    this.tasksSignal.set(data as Task[]);
    
    // Subscribe to realtime updates
    this.supabase
      .channel(`project-tasks-${projectId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tasks',
        filter: `project_id=eq.${projectId}`
      }, (payload) => {
        this.handleRealtimePayload(payload);
      })
      .subscribe();
  }

  private handleRealtimePayload(payload: any) {
    const eventType = payload.eventType;
    const newTask = payload.new as Task;
    const oldTask = payload.old as Task;

    this.tasksSignal.update(tasks => {
      switch (eventType) {
        case 'INSERT':
          return [...tasks, newTask].sort((a, b) => a.position - b.position);
        case 'UPDATE':
          return tasks.map(t => t.id === newTask.id ? newTask : t).sort((a, b) => a.position - b.position);
        case 'DELETE':
          return tasks.filter(t => t.id !== oldTask.id);
        default:
          return tasks;
      }
    });
  }

  async updateTaskPosition(taskId: string, newPosition: number, newStatus?: TaskStatus) {
    const updates: Partial<Task> = { position: newPosition };
    if (newStatus) updates.status = newStatus;

    const { error } = await this.supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId);

    if (error) {
      console.error('Error updating task position:', error);
      throw error;
    }
  }

  async updateTask(taskId: string, updates: Partial<Task>) {
    const { error } = await this.supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId);

    if (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await this.supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }
    return data as Task;
  }
}
