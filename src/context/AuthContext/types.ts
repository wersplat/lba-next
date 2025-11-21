import type { SupabaseClient } from '@supabase/supabase-js';
import type { useUser } from '@clerk/nextjs';

type ClerkUser = ReturnType<typeof useUser>['user'];

export interface AuthContextType {
  user: ClerkUser;
  signOut: () => Promise<void>;
  loading: boolean;
  supabase: SupabaseClient;
}
