import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'https://graphql.bodegacatsgc.gg/v1/graphql',
  headers: {
    ...(process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET && {
      'x-hasura-admin-secret': process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
    }),
    ...(process.env.NEXT_PUBLIC_HASURA_ACCESS_KEY && {
      'x-hasura-access-key': process.env.NEXT_PUBLIC_HASURA_ACCESS_KEY,
    }),
  },
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
});

