import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase-service';
import { TaskComment } from '../../../shared/interfaces/database.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private supabase = inject(SupabaseService).client;

  async getComments(taskId: string): Promise<TaskComment[]> {
    const { data, error } = await this.supabase
      .from('task_comments')
      .select(`
        *,
        profiles:user_id (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
    return data as any[];
  }

  async createComment(taskId: string, userId: string, content: string): Promise<TaskComment> {
    const { data, error } = await this.supabase
      .from('task_comments')
      .insert({ task_id: taskId, user_id: userId, content })
      .select()
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
    return data as TaskComment;
  }

  subscribeToComments(taskId: string, callback: (payload: any) => void) {
    return this.supabase
      .channel(`task-comments-${taskId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'task_comments',
        filter: `task_id=eq.${taskId}`
      }, callback)
      .subscribe();
  }
}
