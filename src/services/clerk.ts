import { supabase } from '../lib/supabase';

/**
 * Clerk User from FDW
 */
export type ClerkUser = {
  id: string;
  external_id: string | null;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at: string | null;
  updated_at: string | null;
  attrs: Record<string, any> | null;
};

/**
 * Clerk Organization from FDW
 */
export type ClerkOrganization = {
  id: string;
  name: string | null;
  slug: string | null;
  created_at: string | null;
  updated_at: string | null;
  attrs: Record<string, any> | null;
};

/**
 * Clerk Organization Membership from FDW
 */
export type ClerkOrganizationMembership = {
  id: string;
  role: string | null;
  role_name: string | null;
  created_at: string | null;
  updated_at: string | null;
  attrs: Record<string, any> | null;
};

/**
 * Service for querying Clerk FDW tables via Supabase
 */
export const clerkApi = {
  /**
   * Get a Clerk user by ID
   */
  getUserById: async (userId: string): Promise<ClerkUser | null> => {
    try {
      const { data, error } = await supabase
        .from('clerk.users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching Clerk user:', error);
        return null;
      }

      return data as ClerkUser;
    } catch (err) {
      console.error('Exception fetching Clerk user:', err);
      return null;
    }
  },

  /**
   * Get a Clerk organization by ID
   */
  getOrganizationById: async (orgId: string): Promise<ClerkOrganization | null> => {
    try {
      const { data, error } = await supabase
        .from('clerk.organizations')
        .select('*')
        .eq('id', orgId)
        .single();

      if (error) {
        console.error('Error fetching Clerk organization:', error);
        return null;
      }

      return data as ClerkOrganization;
    } catch (err) {
      console.error('Exception fetching Clerk organization:', err);
      return null;
    }
  },

  /**
   * Get a Clerk organization by slug
   */
  getOrganizationBySlug: async (slug: string): Promise<ClerkOrganization | null> => {
    try {
      const { data, error } = await supabase
        .from('clerk.organizations')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching Clerk organization by slug:', error);
        return null;
      }

      return data as ClerkOrganization;
    } catch (err) {
      console.error('Exception fetching Clerk organization by slug:', err);
      return null;
    }
  },

  /**
   * Get organization memberships for a user
   * Note: This queries the FDW table directly. The attrs JSONB may contain user_id and organization_id
   */
  getUserOrganizationMemberships: async (userId: string): Promise<ClerkOrganizationMembership[]> => {
    try {
      // Note: The organization_memberships table structure may require filtering by attrs JSONB
      // Adjust this query based on the actual FDW table structure
      const { data, error } = await supabase
        .from('clerk.organization_memberships')
        .select('*')
        .contains('attrs', { user_id: userId });

      if (error) {
        console.error('Error fetching user organization memberships:', error);
        return [];
      }

      return (data || []) as ClerkOrganizationMembership[];
    } catch (err) {
      console.error('Exception fetching user organization memberships:', err);
      return [];
    }
  },

  /**
   * Get all memberships for an organization
   */
  getOrganizationMemberships: async (orgId: string): Promise<ClerkOrganizationMembership[]> => {
    try {
      // Note: Adjust this query based on the actual FDW table structure
      const { data, error } = await supabase
        .from('clerk.organization_memberships')
        .select('*')
        .contains('attrs', { organization_id: orgId });

      if (error) {
        console.error('Error fetching organization memberships:', error);
        return [];
      }

      return (data || []) as ClerkOrganizationMembership[];
    } catch (err) {
      console.error('Exception fetching organization memberships:', err);
      return [];
    }
  },

  /**
   * Join leagues_info with Clerk organizations
   * Returns league info with populated Clerk organization data
   */
  getLeagueWithOrganization: async (leagueId: string) => {
    try {
      // First get the league info
      const { data: league, error: leagueError } = await supabase
        .from('leagues_info')
        .select('*')
        .eq('id', leagueId)
        .single();

      if (leagueError || !league) {
        console.error('Error fetching league:', leagueError);
        return null;
      }

      // If league has org_id, fetch the Clerk organization
      let organization: ClerkOrganization | null = null;
      if (league.org_id) {
        organization = await clerkApi.getOrganizationById(league.org_id);
      }

      return {
        ...league,
        clerk_organization: organization,
      };
    } catch (err) {
      console.error('Exception fetching league with organization:', err);
      return null;
    }
  },
};

