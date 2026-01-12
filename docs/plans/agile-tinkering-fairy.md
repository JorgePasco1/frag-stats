# Emergency Fund (Fondo de Emergencia) Feature Plan

## Overview

Add Emergency Fund functionality as the first part of the "Savings" (Ahorros) section of the PGC. Users mark which fixed expenses are "vital" (GFV - Gastos Fijos Vitales), then configure their emergency fund parameters.

**Key Concept**: Emergency Fund = Vital Monthly Expenses × Target Months

---

## Phase 1: Database Schema Changes

**File:** `src/server/db/schema.ts`

### 1.1 Add `isVital` to fixedExpenses table
```typescript
isVital: d.boolean().notNull().default(false),
```

### 1.2 Add emergency fund fields to pgcs table
```typescript
emergencyFundCurrent: d.numeric({ precision: 10, scale: 2 }).default("0"),
emergencyFundTargetMonths: d.integer().default(6),
emergencyFundMonthsToBuild: d.integer().default(6),
```

### 1.3 Push schema changes
```bash
pnpm db:push
```

---

## Phase 2: API Router Changes

**File:** `src/server/api/routers/pgc.ts`

### 2.1 Update input schema
- Add `isVital: z.boolean().optional().default(false)` to fixedExpenses
- Add emergency fund fields to create mutation input

### 2.2 Update insert logic
- Include `isVital` when inserting fixedExpenses
- Include emergency fund fields when creating pgcs

---

## Phase 3: Update Form Components

### 3.1 Update LineItem type (both new and edit forms)
```typescript
type LineItem = {
  id: string;
  name: string;
  amount: string;
  category?: string;
  isVital?: boolean;  // NEW
};
```

### 3.2 Add checkbox in Fixed Expenses section
- Add a toggle/checkbox for each expense to mark as "Vital"
- Show a shield icon or badge when marked vital

### 3.3 Add Emergency Fund Card Section

**Location:** After "Gastos Fijos" section, before "Inversiones"

**Content:**
1. **Header**: "Fondo de Emergencia" with total GFV display
2. **Disabled state**: Show message "Marca tus gastos vitales primero" when no vital expenses
3. **When active, show:**
   - **Calculation Table** showing fund size for 3, 4, 5, 6, 9, 12 months
   - **Inputs:**
     - Fondo actual (current savings)
     - Meses a cubrir (target months, default 6)
     - Meses para construir (months to build, default 6)
   - **Calculated Results:**
     - Monto del Fondo (GFV × target months)
     - Restante (target - current)
     - Ahorro mensual requerido (remaining / months to build)
     - Cobertura actual (current / GFV in months)

---

## Phase 4: Update Detail View

**File:** `src/app/(dashboard)/pgc/page.tsx`

### 4.1 Mark vital expenses in Gastos Fijos section
- Add shield icon/badge for vital expenses
- Show subtotal of vital expenses (GFV)

### 4.2 Add Emergency Fund Card
- Display current fund amount
- Show target (GFV × months)
- Progress bar: current/target percentage
- Monthly contribution needed
- Coverage status (X.X months covered)

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/server/db/schema.ts` | Add isVital to fixedExpenses, add 3 emergency fund fields to pgcs |
| `src/server/api/routers/pgc.ts` | Update input schema and insert logic |
| `src/app/(dashboard)/pgc/new/page.tsx` | Add isVital toggle, emergency fund section |
| `src/app/(dashboard)/pgc/edit/page.tsx` | Same as new page |
| `src/app/(dashboard)/pgc/page.tsx` | Display vital badges, emergency fund status |

---

## UI Component: Emergency Fund Section

```
┌─────────────────────────────────────────────────────────────┐
│ Fondo de Emergencia                          GFV: 3,309 PEN │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Cálculo del Fondo              Construcción del Fondo      │
│  ┌──────────────────┐           ┌──────────────────────┐   │
│  │ Meses │  Tamaño  │           │ Fondo actual   [____]│   │
│  │   3   │   9,927  │           │ Meses a cubrir [_6__]│   │
│  │   4   │  13,236  │           │ Meses construir[_6__]│   │
│  │   5   │  16,545  │           ├──────────────────────┤   │
│  │   6   │  19,854  │ ◄─────    │ Monto objetivo 19,854│   │
│  │   9   │  29,781  │           │ Restante       13,854│   │
│  │  12   │  39,708  │           │ Ahorro mensual  2,309│   │
│  └──────────────────┘           └──────────────────────┘   │
│                                                             │
│  ▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░  30% (1.8 meses cubiertos)     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Calculations

```typescript
// Total vital expenses
const totalVitalExpenses = fixedExpenses
  .filter(e => e.isVital)
  .reduce((sum, e) => sum + parseFloat(e.amount), 0);

// Target fund amount
const targetFund = totalVitalExpenses * targetMonths;

// Remaining to save
const remaining = Math.max(0, targetFund - currentFund);

// Monthly contribution needed
const monthlyContribution = monthsToBuild > 0 ? remaining / monthsToBuild : 0;

// Current coverage in months
const currentCoverage = totalVitalExpenses > 0
  ? currentFund / totalVitalExpenses
  : 0;

// Progress percentage
const progressPercent = targetFund > 0 ? (currentFund / targetFund) * 100 : 0;
```

---

## Verification

1. Run `pnpm db:push` - verify schema updates
2. Run `pnpm typecheck` - no type errors
3. Run `pnpm check` - no linting errors
4. Test flow:
   - Create PGC with fixed expenses
   - Mark some as vital → GFV calculates
   - Configure emergency fund → monthly savings calculates
   - Edit existing PGC → values pre-populated
   - View detail page → progress displays correctly
