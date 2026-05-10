import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../../core/services/supabase-service';
import { Profile } from '../../../shared/interfaces/database.interface';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private supabase = inject(SupabaseService).client;

  async getProjectMembers(projectId: string): Promise<(Profile & { role: string })[]> {
    const { data, error } = await this.supabase
      .from('project_members')
      .select(`
        role,
        user_id,
        profiles:user_id (
          id,
          full_name,
          avatar_url,
          updated_at
        )
      `)
      .eq('project_id', projectId);

    if (error) {
      console.error('Error fetching members:', error);
      return [];
    }

    return (data as any[]).map((m) => ({
      ...(m.profiles as unknown as Profile),
      role: m.role
    }));
  }
}
