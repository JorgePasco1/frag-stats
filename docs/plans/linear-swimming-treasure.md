# PIP (Plan de Inversiones Pasivas) Implementation Plan

## Overview

This plan covers two major deliverables:
1. **Documentation**: Create comprehensive PIP documentation in `/docs/pip/` subfolder
2. **Risk Calculator**: Build the "Calculadora de Perfil de Riesgo" feature

---

## Part 1: Documentation Structure

### Create `/docs/pip/` subfolder with the following files:

#### 1. `docs/pip/README.md` - PIP Overview
- What is PIP (Plan de Inversiones Pasivas)
- Core philosophy: Investing to accumulate real estate for passive income
- Four guiding principles:
  1. Consistency over chasing returns
  2. Accumulate capital for real estate
  3. Passivity and simplicity
  4. Long-term focus
- Connection between PGC and PIP (CMI - Capacidad Mensual de Inversión)

#### 2. `docs/pip/BLOQUES.md` - Investment Blocks
- **Bloque 1: Bolsa Pasiva** (Long-term stock market)
  - SPY ETF, DCA strategy, Buy & Hold
  - Current implementation status (already built)
- **Bloque 2: Inversiones a Mediano Plazo** (Medium-term investments)
  - 1-5 year horizon
  - Investment alternatives in Peru
  - Risk evaluation framework
- **Bloque 3: Inmuebles** (Real estate)
  - Rental income generation
  - Future development

#### 3. `docs/pip/ETAPAS.md` - Life Stages
- Age-based CMI split table:
  | Age Range | Bolsa (Bloque 1) | MP (Bloque 2) |
  |-----------|------------------|---------------|
  | 20-40     | 50%              | 50%           |
  | 40-50     | 40%              | 60%           |
  | 50-55     | 30%              | 70%           |
  | 55-60     | 20%              | 80%           |
  | 60+       | 0%               | 100%          |

#### 4. `docs/pip/EVALUACION_RIESGO.md` - Risk Evaluation Framework
- Four-phase evaluation process
- Risk assessment questions (4 categories):
  1. Return generation
  2. Loss exposure
  3. Guarantees
  4. Formal structure
- Platform filter criteria
- Risk levels: Muy Bajo, Bajo, Medio, Alto, Muy Alto

#### 5. `docs/pip/PERFIL_RIESGO.md` - Risk Profile Calculator
- Five dimensions evaluated:
  1. Current financial situation
  2. Prior investment experience
  3. Understanding of investment risk
  4. Emotional profile
  5. Investment timeline
- Profile types and max risk levels:
  - Conservador (0-12 pts): Muy Bajo, Bajo
  - Moderado (13-21 pts): Medio or lower
  - Dinámico (22-29 pts): Alto or lower
  - Agresivo (30-36 pts): Any risk level

#### 6. `docs/pip/PORTAFOLIO.md` - Portfolio Management
- Annual investment planning
- Portfolio model examples
- Diversification rules (max 60% same underlying)
- Risk allocation rules
- Tax considerations (2nd category income)

---

## Part 2: Risk Profile Calculator Feature

### Database Schema

Create new table `risk_profile_assessments`:
```typescript
export const riskProfileAssessments = createTable(
  "risk_profile_assessment",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d.varchar({ length: 256 }).notNull(),
    // Question answers (A, B, or C)
    q1PgcImplemented: d.varchar({ length: 1 }).notNull(),
    q2AnnualInvestment: d.varchar({ length: 1 }).notNull(),
    q3PriorExperience: d.varchar({ length: 1 }).notNull(),
    q4LostMoney: d.varchar({ length: 1 }).notNull(),
    q5CompoundInterest: d.varchar({ length: 1 }).notNull(),
    q6FsdMeaning: d.varchar({ length: 1 }).notNull(),
    q7MortgageRate: d.varchar({ length: 1 }).notNull(),
    q8MarketDrop: d.varchar({ length: 1 }).notNull(),
    q9TrendInvesting: d.varchar({ length: 1 }).notNull(),
    q10RiskPreference: d.varchar({ length: 1 }).notNull(),
    // Calculated results
    totalScore: d.integer().notNull(),
    profile: d.varchar({ length: 20 }).notNull(), // conservador, moderado, dinamico, agresivo
    maxRiskLevel: d.varchar({ length: 20 }).notNull(), // muy_bajo, bajo, medio, alto, muy_alto
    createdAt: d.timestamp({ withTimezone: true }).$defaultFn(() => new Date()).notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("risk_profile_user_idx").on(t.userId)],
);
```

### Scoring Logic

Each question maps to a score based on answer (A, B, C):

| Q# | Question | A | B | C | Notes |
|----|----------|---|---|---|-------|
| 1  | PGC implementado y revisado | 3 | 2 | 0 | A=revisado, B=no revisado, C=no listo |
| 2  | Rango inversión anual | 3 | 2 | 1 | A=>20k, B=5k-20k, C=<5k |
| 3  | Experiencia previa | 3 | 2 | 0 | A=experiencia, B=poca, C=ninguna |
| 4  | Perdido dinero invirtiendo | 3 | 2 | 1 | A=>10%, B=<10%, C=nunca |
| 5  | Conocimiento interés compuesto | 0 | 0 | 3 | C=Más de S/1300 (correcto) |
| 6  | Significado de FSD | 0 | 3 | 0 | B=Fondo Seguro Depósitos (correcto) |
| 7  | Tasa crédito hipotecario | 3 | 2 | 0 | B=8-12% (correcto en Perú) |
| 8  | Reacción si cae 30% | 1 | 2 | 3 | A=vender, B=mantener, C=comprar más |
| 9  | Inversión en tendencias | 1 | 3 | 0 | A=sí invertí, B=no/inadecuadas, C=no sabía |
| 10 | Preferencia riesgo | 3 | 2 | 1 | A=alto riesgo, B=medio, C=garantizado |

**Profile Determination:**
- 0-12: Conservador → Max risk: Bajo
- 13-21: Moderado → Max risk: Medio
- 22-29: Dinámico → Max risk: Alto
- 30-36: Agresivo → Max risk: Muy Alto

### Components to Build

1. **`src/lib/pip/risk-calculator.ts`** - Scoring logic and profile determination
2. **`src/lib/pip/types.ts`** - TypeScript types for risk assessment
3. **`src/server/api/routers/risk-profile.ts`** - tRPC router with:
   - `create` - Save new assessment
   - `getCurrent` - Get user's latest profile
   - `getHistory` - Get all assessments
4. **`src/components/pip/RiskCalculatorForm.tsx`** - Multi-step quiz form
5. **`src/components/pip/RiskProfileResult.tsx`** - Results display with profile badge
6. **`src/app/(dashboard)/pip/perfil-riesgo/page.tsx`** - Calculator page
7. **`src/app/(dashboard)/pip/perfil-riesgo/resultado/page.tsx`** - Results page

### UI Flow (Multi-Step Wizard)

1. **Start Page** (`/pip/perfil-riesgo`)
   - Instructions explaining the 5 dimensions
   - "Comenzar" button to start quiz

2. **Quiz Steps** (10 questions, one per page)
   - Progress indicator (e.g., "Pregunta 3 de 10")
   - Question text with explanation if needed
   - 3 radio button options (A, B, C)
   - "Siguiente" button (disabled until answer selected)
   - "Anterior" button to go back

3. **Review Step** (optional)
   - Summary of all answers before submitting
   - Option to change any answer

4. **Results Page** (`/pip/perfil-riesgo/resultado`)
   - Profile type with color-coded badge:
     - Conservador: Blue
     - Moderado: Yellow/Amber
     - Dinámico: Orange
     - Agresivo: Red
   - Total score (e.g., "25/36 puntos")
   - Max risk level recommendation
   - Profile description
   - "Ver alternativas de inversión" CTA

---

## Files to Create/Modify

### New Files

```
docs/pip/
├── README.md
├── BLOQUES.md
├── ETAPAS.md
├── EVALUACION_RIESGO.md
├── PERFIL_RIESGO.md
└── PORTAFOLIO.md

src/lib/pip/
├── index.ts
├── types.ts
└── risk-calculator.ts

src/components/pip/
├── RiskCalculatorWizard.tsx    # Main wizard container with state management
├── RiskQuestionStep.tsx        # Individual question step component
├── RiskWizardProgress.tsx      # Progress indicator (Pregunta X de 10)
├── RiskProfileResult.tsx       # Results display component
├── RiskProfileBadge.tsx        # Color-coded profile badge
└── RiskReviewStep.tsx          # Review answers before submit

src/app/(dashboard)/pip/
├── perfil-riesgo/
│   ├── page.tsx
│   └── resultado/
│       └── page.tsx
```

### Modified Files

- `src/server/db/schema.ts` - Add `riskProfileAssessments` table
- `src/server/api/routers/index.ts` or `root.ts` - Register risk-profile router
- `src/components/dashboard/Sidebar.tsx` - Add "Perfil de Riesgo" link under PIP section

---

## Verification Plan

1. **Documentation**: Review all markdown files render correctly
2. **Database**: Run `pnpm db:push` to create new table
3. **Calculator Logic**:
   - Test with score 10 → Conservador
   - Test with score 15 → Moderado
   - Test with score 25 → Dinámico
   - Test with score 32 → Agresivo
4. **UI Flow**:
   - Navigate to `/pip/perfil-riesgo`
   - Complete all 10 questions
   - Verify correct profile is shown
   - Check profile is saved to database
5. **Existing Feature**: Ensure `/pip/bolsa` still works correctly

---

## Bug Fixes Required

The implementation has been completed but has the following bugs that need to be fixed:

### Bug 1: Type Mismatch - Database vs TypeScript Types (CRITICAL)

**File:** `src/app/(dashboard)/pip/perfil-riesgo/resultado/page.tsx` (line 37)

**Problem:** The database schema defines `profile` and `maxRiskLevel` as `varchar` (strings), but `RiskProfileAssessment` interface expects strongly-typed literals (`RiskProfile` and `RiskLevel`). When Drizzle returns data, it infers `string`, not the union types.

**Fix:** Update the tRPC router `getCurrent` to cast the database result:

```typescript
// In src/server/api/routers/risk-profile.ts
getCurrent: protectedProcedure.query(async ({ ctx }) => {
  const result = await ctx.db.query.riskProfileAssessments.findFirst({
    where: eq(riskProfileAssessments.userId, ctx.auth.userId),
    orderBy: [desc(riskProfileAssessments.createdAt)],
  });

  if (!result) return null;

  // Cast varchar fields to proper types
  return {
    ...result,
    profile: result.profile as RiskProfile,
    maxRiskLevel: result.maxRiskLevel as RiskLevel,
    // Cast answer fields too
    q1PgcImplemented: result.q1PgcImplemented as AnswerOption,
    // ... all 10 question fields
  };
}),
```

---

### Bug 2: Implicit `any` Type in Score Calculation (CRITICAL)

**File:** `src/lib/pip/risk-calculator.ts` (line 190)

**Problem:** `Object.entries()` loses type information, so `answer` becomes `any`.

**Fix:** Cast `answer` to `AnswerOption`:

```typescript
export function calculateScore(answers: RiskAssessmentAnswers): number {
  let total = 0;
  for (const [questionKey, answer] of Object.entries(answers)) {
    const key = questionKey as keyof RiskAssessmentAnswers;
    total += SCORING_MATRIX[key][answer as AnswerOption];  // Add cast
  }
  return total;
}
```

---

### Bug 3: Unused Variable (LOW)

**File:** `src/components/pip/RiskCalculatorWizard.tsx` (line 26)

**Problem:** Variable `questionKey` is defined but never used.

**Fix:** Remove the unused line:
```typescript
// DELETE this line:
const questionKey = `q${currentQuestion!.id}PgcImplemented` as keyof RiskAssessmentAnswers;
```

---

### Bug 4: Linting - CSS Class Sorting (LOW)

**Files:**
- `src/app/(dashboard)/pip/perfil-riesgo/page.tsx`
- `src/app/(dashboard)/pip/perfil-riesgo/resultado/page.tsx`

**Fix:** Run `pnpm check --write` to auto-fix CSS class ordering.

---

### Bug 5: Linting - Import Order (LOW)

**File:** `src/app/(dashboard)/pip/perfil-riesgo/page.tsx`

**Fix:** Run `pnpm check --write` to auto-fix import ordering.

---

## Files to Modify for Bug Fixes

| File | Change |
|------|--------|
| `src/server/api/routers/risk-profile.ts` | Add type casting to `getCurrent` and `getHistory` return values |
| `src/lib/pip/risk-calculator.ts` | Cast `answer` to `AnswerOption` in `calculateScore` |
| `src/components/pip/RiskCalculatorWizard.tsx` | Remove unused `questionKey` variable |
| Multiple files | Run `pnpm check --write` for linting fixes |

---

## Verification After Bug Fixes

1. Run `pnpm typecheck` - should pass with no errors
2. Run `pnpm check` - should pass with no warnings
3. Run `pnpm dev` and test:
   - Navigate to `/pip/perfil-riesgo`
   - Complete the 10-question quiz
   - Verify redirect to `/pip/perfil-riesgo/resultado`
   - Verify profile badge and score display correctly
