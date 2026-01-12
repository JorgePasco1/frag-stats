# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Frag Stats** is a Next.js 14 application for logging fragrance usage and viewing statistics. Built with the T3 Stack, featuring end-to-end type safety with tRPC, PostgreSQL database via Drizzle ORM, and Clerk authentication.

## Development Commands

### Setup
```bash
# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env
# Then populate .env with your secrets (see Environment Variables section)

# Start local PostgreSQL database (Docker)
./start-database.sh

# Push database schema
yarn db:push
```

### Development
```bash
# Start development server with Turbopack
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Lint code
yarn lint
```

### Database Operations
```bash
# Generate migrations
yarn db:generate

# Run migrations
yarn db:migrate

# Push schema changes directly to DB (dev only)
yarn db:push

# Open Drizzle Studio (database GUI)
yarn db:studio
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **API**: tRPC v11 for type-safe API
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Clerk
- **Styling**: Tailwind CSS + Shadcn UI
- **Forms**: React Hook Form + Zod
- **State**: React Query (via tRPC)
- **AI**: OpenAI API for note summaries

### Directory Structure
```
src/
├── app/                  # Next.js App Router (pages + RSC)
│   ├── fragrances/      # Fragrance management
│   ├── logs/            # Usage log tracking
│   ├── stats/           # Statistics dashboard
│   └── _components/     # Shared app components
├── server/
│   ├── api/
│   │   ├── routers/     # tRPC routers (4 main routers)
│   │   ├── root.ts      # Root router aggregation
│   │   └── trpc.ts      # tRPC config + procedures
│   └── db/
│       ├── schema.ts    # Drizzle schema
│       └── index.ts     # DB connection
├── trpc/
│   ├── react.tsx        # Client tRPC provider
│   ├── server.ts        # Server RSC utilities
│   └── query-client.ts  # React Query config
├── components/ui/       # Shadcn UI library
├── lib/                 # Utility functions
├── types/               # TypeScript types
└── middleware.ts        # Clerk auth middleware
```

### Data Flow Patterns

**Server Components (RSC)**:
```typescript
// Use api from ~/trpc/server
import { api } from "~/trpc/server";

const data = await api.userFragrances.getAll({ orderBy: "name" });
```

**Client Components**:
```typescript
// Use api from ~/trpc/react with hooks
"use client";
import { api } from "~/trpc/react";

const { data } = api.userFragrances.getLogOptions.useQuery();
const { mutate } = api.userFragranceLogs.createUserFragranceLog.useMutation({
  onSuccess: () => router.refresh(), // Revalidate RSC data
});
```

### Database Schema

**Core Tables**:
1. **fragrances** - Global fragrance catalog (name, house, notes, accords)
2. **userFragrances** - User's collection with acquisition/disposal tracking
3. **userFragranceLogs** - Daily usage logs (enjoyment, sprays, context)
4. **fragranceNoteSummaries** - AI-generated summaries of user notes

**Key Relationships**:
- `userFragrances.fragranceId` → `fragrances.id`
- `userFragranceLogs.userFragranceId` → `userFragrances.id`
- All tables scoped by `userId` (from Clerk)

**Important Constraints**:
- Unique constraint on `userFragrances(userId, fragranceId, isDecant)` - users can have both full bottle and decant of same fragrance
- Check constraint on `userFragranceLogs.enjoyment` (1-10 range)
- Drizzle plugin enforces WHERE clauses on UPDATE/DELETE operations

### tRPC Routers

1. **userFragrances** - Manage user's fragrance collection
   - `getAll()`, `getLogOptions()`, `create()`, `registerGone()`

2. **userFragranceLogs** - Usage log CRUD
   - `createUserFragranceLog()`, `updateUserFragranceLog()`, `getFragranceLog()`, `getAllUserFragranceLogs()`

3. **userFragranceStats** - Statistics and AI summaries
   - `getUserFragranceStats()`, `regenerateNoteSummary()`

4. **fragrances** - Global fragrance data
   - `getFragranceName()`, `loadFragranceDataFromFragrantica()` (stubbed)

### Authentication

- **Middleware** (`src/middleware.ts`): Protects all routes except `/sign-in` and `/sign-up`
- **tRPC Context**: `currentUserId` extracted from `auth()` in all procedures
- **Procedures**: Use `privateProcedure` for authenticated routes (checks `currentUserId`)

### Environment Variables

Required in `.env`:
```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/fragrance-logs"

# Clerk Auth
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."

# OpenAI (for AI summaries)
OPENAI_API_KEY="sk-..."
```

Schema validation in `src/env.js` using `@t3-oss/env-nextjs`.

## Important Patterns

### Type Safety
- Use `RouterInputs` and `RouterOutputs` from `~/types/UserFragrance.types.ts` for inferring tRPC types
- All API routes are fully type-safe from DB → API → Client

### Forms
- Use `react-hook-form` with `@hookform/resolvers/zod` for validation
- Form state typically managed in custom hooks (e.g., `useNewLogFormSubmission.ts`)
- Integrate with Shadcn form components

### Data Mutations
- Always call `router.refresh()` in `onSuccess` callbacks to revalidate RSC data
- Use React Query's `useMutation` hook through tRPC's `.useMutation()`

### Path Aliases
- Use `~/*` to reference `src/*` (configured in `tsconfig.json`)

### ESLint Rules
- Drizzle plugin enforces WHERE clauses on UPDATE/DELETE operations
- TypeScript strict mode with type-checked linting
- Prefer type imports with inline syntax

### Image Optimization
Next.js configured to allow images from: `fimgs.net`, `scentlover.shop`, `utfs.io`, `mauriciocarbajal.com`, `b4k8j3lxxc.ufs.sh`
