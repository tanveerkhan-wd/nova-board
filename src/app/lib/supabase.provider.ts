import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export const supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

export function provideSupabase() {
  return {
    provide: 'SUPABASE',
    useValue: supabase,
  };
}