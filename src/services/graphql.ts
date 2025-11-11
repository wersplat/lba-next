import { apolloClient } from '@/lib/apollo-client';
import { gql } from '@apollo/client';

/**
 * GraphQL service layer for Hasura GraphQL API
 * 
 * This service provides helper functions for common GraphQL operations.
 * Use Apollo Client hooks (useQuery, useMutation) in React components for reactive data fetching.
 * Use these functions for imperative queries or server-side operations.
 */

/**
 * Execute a GraphQL query
 */
export async function executeQuery<T = any>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  try {
    const { data } = await apolloClient.query({
      query: gql(query),
      variables,
      fetchPolicy: 'network-only',
    });

    return data as T;
  } catch (error) {
    console.error('GraphQL query error:', error);
    throw error;
  }
}

/**
 * Execute a GraphQL mutation
 */
export async function executeMutation<T = any>(
  mutation: string,
  variables?: Record<string, any>
): Promise<T> {
  try {
    const { data } = await apolloClient.mutate({
      mutation: gql(mutation),
      variables,
    });

    return data as T;
  } catch (error) {
    console.error('GraphQL mutation error:', error);
    throw error;
  }
}

/**
 * Example query: Get players
 * This is a template that can be customized based on your needs
 */
export const GET_PLAYERS_QUERY = gql`
  query GetPlayers($limit: Int, $offset: Int) {
    players(limit: $limit, offset: $offset) {
      id
      gamertag
      position
      currentTeamName
      created_at
    }
  }
`;

/**
 * Example query: Get draft picks
 */
export const GET_DRAFT_PICKS_QUERY = gql`
  query GetDraftPicks($limit: Int, $offset: Int) {
    draft_picks(limit: $limit, offset: $offset, order_by: { pick_number: asc }) {
      id
      pick_number
      player_id
      team_id
      created_at
    }
  }
`;

/**
 * Example query: Get draft pool
 */
export const GET_DRAFT_POOL_QUERY = gql`
  query GetDraftPool($league_id: uuid) {
    draft_pool(where: { league_id: { _eq: $league_id }, status: { _eq: "available" } }) {
      id
      player_id
      league_id
      status
      created_at
      player {
        id
        gamertag
        position
        currentTeamName
      }
    }
  }
`;

/**
 * GraphQL API object - mirrors the structure of Supabase services
 * Add specific query/mutation functions here as needed
 */
export const graphqlApi = {
  /**
   * Execute a custom query
   */
  query: executeQuery,

  /**
   * Execute a custom mutation
   */
  mutate: executeMutation,
};

