# LBA Next.js App

This is a Next.js application for the Legends Basketball Association live draft board.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` - Next.js app router pages and layouts
- `src/components/` - React components
- `src/context/` - React context providers
- `src/services/` - API service functions
- `src/styles/` - Global styles and theme
- `public/` - Static assets

## Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GRAPHQL_URL=https://graphql.bodegacatsgc.gg/v1/graphql
NEXT_PUBLIC_HASURA_ADMIN_SECRET=your_hasura_admin_secret
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

**Note:** For Railway deployments, make sure to set these environment variables in your Railway project settings. The Clerk publishable key is required for the build to succeed.

## Build

To build for production:

```bash
npm run build
npm run start
```

## Deployment

This app is configured for Railway deployment. See `railway.toml` for configuration details.

