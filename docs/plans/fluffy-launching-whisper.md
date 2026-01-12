# Flujo Consciente - Implementation Plan

---

## IMMEDIATE NEXT STEP: Clerk + Neon Setup

### Step A: Neon Database Connection

**In Neon Console (console.neon.tech):**
1. Go to your project dashboard
2. Click on "Connection Details" or look for "Connection String"
3. Copy the **PostgreSQL connection string** (looks like: `postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`)

**In this project:**
- Paste the connection string in `.env` file as `DATABASE_URL`

### Step B: Clerk Authentication

**In Clerk Dashboard (dashboard.clerk.com):**
1. Create a new application (or use existing)
2. Go to "API Keys" section
3. Copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_`)
   - `CLERK_SECRET_KEY` (starts with `sk_`)

**In this project:**
- Add both keys to `.env` file:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

### Step C: Implementation (after you provide the keys)
1. Install Clerk: `pnpm add @clerk/nextjs`
2. Configure ClerkProvider in layout
3. Create auth middleware
4. Create sign-in/sign-up pages
5. Test database connection

---

## Project Overview

**Concept**: A personal finance budgeting app based on the "Bolsillos Llenos" philosophy - NOT a granular expense tracker, but a budget allocation tool that helps users distribute their income consciously.

### Two Pillars
1. **PGC (Plan de Gasto Consciente)** - Conscious Spending Plan (MVP focus)
2. **PIP (Plan de Inversiones Pasivas)** - Passive Investment Plan (future)

### Core Philosophy
- Set up budget allocations once, adjust as needed
- Track income and allocations, NOT individual expenses
- "Gasto Sin Culpa" (guilt-free spending) is the untracked remainder

---

## Technical Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 15 (App Router) - already configured |
| API | tRPC v11 - already configured |
| Database | Neon (PostgreSQL) + Drizzle ORM - already configured |
| Auth | Clerk (to be added) |
| UI | shadcn/ui + Tailwind CSS v4 |
| Validation | Zod |
| Language | TypeScript (strict) |
| i18n | next-intl (Spanish first, English later) |

---

## Requirements Summary

- **Currency**: Multi-currency (PEN primary)
- **Allocations**: Fixed amounts with calculated percentages vs targets
- **Data entry**: Manual only (no bank sync)
- **Users**: Single user per account
- **Time periods**: Monthly + Annual views
- **Themes**: Light + Dark mode
- **Responsive**: Web-first (mobile later)

---

## Phase 1: Project Configuration & Infrastructure

### 1.1 Authentication - Clerk Setup
- Install `@clerk/nextjs`
- Configure Clerk provider in `src/app/layout.tsx`
- Create sign-in/sign-up pages
- Add middleware for protected routes
- Update tRPC context to include user session

**Files to modify/create:**
- `src/app/layout.tsx` - Add ClerkProvider
- `src/middleware.ts` - Create Clerk middleware
- `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`
- `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`
- `src/server/api/trpc.ts` - Add auth context

### 1.2 UI Components - shadcn/ui Setup
- Initialize shadcn/ui with Tailwind CSS v4
- Configure dark/light theme support
- Install core components: button, card, input, form, dialog, etc.

**Files to create:**
- `src/components/ui/*` - shadcn components
- `src/lib/utils.ts` - cn utility
- `src/components/theme-provider.tsx`
- `src/components/theme-toggle.tsx`

### 1.3 Internationalization (i18n)
- Install `next-intl`
- Set up Spanish as default, English as secondary
- Configure message files

**Files to create:**
- `src/i18n.ts`
- `messages/es.json`
- `messages/en.json`
- `src/middleware.ts` - Update with i18n

### 1.4 Database - Neon Configuration
- Update `.env` with Neon connection string
- Design and implement schema

---

## Phase 2: Database Schema Design

### Core Tables

```
users (synced from Clerk)
├── id (clerk user id)
├── email
├── currency (default: USD)
├── created_at
└── updated_at

income_sources
├── id
├── user_id
├── name (e.g., "Salario", "Freelance")
├── amount
├── currency
├── is_active
└── created_at

monthly_budgets
├── id
├── user_id
├── year
├── month
├── total_income
├── currency
├── created_at
└── updated_at

fixed_expenses (itemized list)
├── id
├── user_id
├── name (e.g., "Alquiler", "Servicios")
├── amount
├── currency
├── is_active
├── order
└── created_at

budget_allocations
├── id
├── monthly_budget_id
├── category (enum: GASTOS_FIJOS, AHORROS, INVERSIONES)
├── target_percentage
├── actual_amount
└── notes

savings_goals (qualitative for now)
├── id
├── user_id
├── name
├── description
├── priority
├── is_active
└── created_at
```

**File to modify:**
- `src/server/db/schema.ts`

---

## Phase 3: Core Features (MVP - PGC)

### 3.1 Onboarding Flow
1. Welcome screen explaining the PGC concept
2. Income setup (add income sources)
3. Fixed expenses itemization
4. Ahorros (savings) target percentage
5. CMI (investment capacity) calculation
6. Review and confirm

**Pages:**
- `src/app/(dashboard)/onboarding/page.tsx`
- `src/app/(dashboard)/onboarding/income/page.tsx`
- `src/app/(dashboard)/onboarding/expenses/page.tsx`
- `src/app/(dashboard)/onboarding/savings/page.tsx`
- `src/app/(dashboard)/onboarding/investment/page.tsx`
- `src/app/(dashboard)/onboarding/review/page.tsx`

### 3.2 Landing Page (Public)
Simple landing page for unauthenticated users:
- Brief explanation of the PGC concept
- Sign-in / Sign-up buttons
- Simple, clean design

**Page:**
- `src/app/page.tsx` - Public landing

### 3.3 Dashboard
- **Both Pillars Summary** view
- Current month's PGC breakdown:
  - Total Income
  - Gastos Fijos (with % of income)
  - Ahorros (with % of income)
  - CMI - Capacidad Mensual de Inversión (with % of income)
  - Gasto Sin Culpa (remainder)
- PIP placeholder (future)
- Monthly/Annual toggle

**Pages:**
- `src/app/(dashboard)/page.tsx` - Main dashboard
- `src/app/(dashboard)/layout.tsx` - Dashboard layout with nav

### 3.4 Settings/Configuration
- Edit income sources
- Edit fixed expenses
- Adjust target percentages
- Currency preference
- Theme preference
- Language preference

**Pages:**
- `src/app/(dashboard)/settings/page.tsx`
- `src/app/(dashboard)/settings/income/page.tsx`
- `src/app/(dashboard)/settings/expenses/page.tsx`
- `src/app/(dashboard)/settings/allocations/page.tsx`

### 3.5 Monthly Management
- View/create monthly budgets
- See historical months
- Annual summary view

**Pages:**
- `src/app/(dashboard)/budget/page.tsx`
- `src/app/(dashboard)/budget/[year]/[month]/page.tsx`
- `src/app/(dashboard)/budget/annual/page.tsx`

---

## Phase 4: API Routes (tRPC)

### Routers to Create

```
src/server/api/routers/
├── user.ts          - User settings, preferences
├── income.ts        - Income sources CRUD
├── expenses.ts      - Fixed expenses CRUD
├── budget.ts        - Monthly budgets, allocations
├── goals.ts         - Savings goals CRUD
└── dashboard.ts     - Aggregated dashboard data
```

**File to modify:**
- `src/server/api/root.ts` - Register new routers

---

## Phase 5: Configuration Files to Create

### 5.1 AI/Development Configuration

**CLAUDE.md** (project context for AI assistants)
- Project overview and philosophy
- Tech stack summary
- File structure conventions
- Naming conventions
- Database schema overview
- Common commands

**Agent files** (in `.claude/` directory)
- `agents/feature-agent.md` - For implementing new features
- `agents/bug-fix-agent.md` - For debugging
- `agents/review-agent.md` - For code review

**Commands** (in `.claude/commands/`)
- `new-component.md` - Create new UI component
- `new-router.md` - Create new tRPC router
- `db-migrate.md` - Database migration workflow

### 5.2 Documentation

- `docs/DATABASE.md` - Schema documentation
- `docs/COMPONENTS.md` - Component conventions
- `docs/FOLDER-STRUCTURE.md` - Project structure guide
- `docs/API.md` - tRPC router documentation

### 5.3 Environment

- `.env.example` - Update with all required variables:
  - `DATABASE_URL` (Neon)
  - `CLERK_SECRET_KEY`
  - `CLERK_PUBLISHABLE_KEY`
  - `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
  - `NEXT_PUBLIC_CLERK_SIGN_UP_URL`

---

## Implementation Order

### Step 1: Infrastructure Setup
1. Install and configure Clerk
2. Install and configure shadcn/ui with dark mode
3. Set up next-intl for i18n
4. Create basic layout structure

### Step 2: Database Schema
1. Design and implement full schema in Drizzle
2. Run migrations
3. Document schema

### Step 3: Core tRPC Routes
1. User router
2. Income router
3. Expenses router
4. Budget router

### Step 4: UI Implementation
1. Onboarding flow
2. Dashboard
3. Settings pages
4. Budget management pages

### Step 5: Configuration Files
1. CLAUDE.md
2. Agent files
3. Command files
4. Documentation

---

## Key UI Components to Build

- `BudgetCard` - Display allocation with amount and percentage
- `IncomeSourceForm` - Add/edit income source
- `FixedExpenseList` - Manage itemized expenses
- `AllocationChart` - Visual breakdown of budget
- `MonthSelector` - Navigate between months
- `PillarSummary` - PGC/PIP summary card

---

## Notes

- **No expense tracking**: This is intentional - the philosophy is about conscious allocation, not tracking every purchase
- **Allocation Order** (user defines these in sequence):
  1. `Gastos Fijos` (itemized fixed expenses)
  2. `Metas de Ahorro` (savings goals, including emergency fund)
  3. `Inversión` (CMI - monthly investment capacity)
  4. `Gasto Sin Culpa` = **automatically calculated** as remainder
- **Formula**: `Gasto Sin Culpa = Income - Gastos Fijos - Ahorros - Inversión`
- **PIP (Pillar 2)**: Deferred to future development - will include 1-year investment planning with expected returns
- **Reference**: User has existing spreadsheets implementing this system - will share screenshots as features are built

---

## File Structure (Target)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx (dashboard)
│   │   ├── onboarding/
│   │   ├── budget/
│   │   └── settings/
│   ├── api/trpc/[trpc]/route.ts
│   ├── layout.tsx
│   └── page.tsx (landing/redirect)
├── components/
│   ├── ui/ (shadcn)
│   ├── dashboard/
│   ├── budget/
│   └── forms/
├── i18n/
│   └── messages/
├── lib/
│   └── utils.ts
├── server/
│   ├── api/
│   │   ├── routers/
│   │   ├── root.ts
│   │   └── trpc.ts
│   └── db/
│       ├── index.ts
│       └── schema.ts
└── trpc/
```
