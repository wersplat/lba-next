'use client'

import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs';
import { AuthContext } from './context';
import { supabase } from '../../lib/supabase';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, isLoaded: userLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerkAuth();
  const router = useRouter();

  const signOut = useCallback(async () => {
    try {
      await clerkSignOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }, [clerkSignOut, router]);

  const value = useMemo(() => ({
    user,
    signOut,
    loading: !userLoaded,
    supabase,
  }), [user, signOut, userLoaded]);

  return (
    <AuthContext.Provider value={value}>
      {userLoaded && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
