import { createContext } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { useUser } from '@clerk/nextjs';

type ClerkUser = ReturnType<typeof useUser>['user'];

interface IAuthContext {
  user: ClerkUser;
  signOut: () => Promise<void>;
  loading: boolean;
  supabase: SupabaseClient;
}

export type AuthContextType = IAuthContext;

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
