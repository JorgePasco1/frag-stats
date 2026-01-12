# Plan: Complete Portfolio Investment Planning Feature

## Problem
The current `/pip/portafolio/nuevo` page only collects basic plan metadata. Users need the complete investment planning workflow as shown in the Excel spreadsheet, including:
- Selecting investments from predefined options
- Adding custom investments
- Entering current portfolio holdings
- Planning 1-year investment allocation
- Risk distribution and diversification analysis

## Reference Data (from user's screenshots)

### Spreadsheet Structure: "Inversiones seleccionadas"
| Column | Description |
|--------|-------------|
| Inversión | Investment name (e.g., "CrowdFactoring, facturas A/B") |
| Plataforma | Platform (e.g., "Prestamype", "Tyba", "Alfin") |
| Subyacente | Underlying asset (Facturas, Bolsa, Plazo Fijo, Terreno) |
| Monto mínimo | Minimum amount (e.g., "S/.100 o $25") |
| Riesgo percibido | Risk level (Bajo, Medio, Alto, Muy Alto) |
| Permite reinversión | Yes/No |
| Rentabilidad esperada | Expected return (e.g., "12%", "18.4% - 25.51%") |
| Plazo de inversión | Investment term (e.g., "1-6 meses", "12 meses") |

### Spreadsheet Structure: "Plan de inversiones a mediano plazo"
**Header Section:**
- Perfil (e.g., Dinámico)
- Nivel de riesgo máximo (e.g., Alto)

**Portafolio actual (Current Portfolio):**
- Existing investments with: Inversión, Plataforma, Subyacente, Riesgo, Capital invertido

**Plan a 1 año:**
- CMI anual en bloque 2 (e.g., S/ 51,876)
- Inversión anual extra en bloque 2 (e.g., S/ 6,000)
- Efectivo disponible (e.g., S/ 3,435)
- Total a repartir (calculated)
- Investment table with: Inversión, Plataforma, Subyacente, Riesgo, Inversión actual, PLAN, Inversión planeada, Comentario

**Analysis Sections:**
- Distribución de riesgo (Risk Distribution)
- Diversificación (by Subyacente)
- Rentabilidad esperada (Expected Return weighted by allocation)

### Predefined Investment Options (from docx files)
1. Bonos
2. Depósito a plazo fijo
3. Factoring
4. Fondos mutuos
5. Fondos y fideicomisos
6. Notas estructuradas
7. Préstamos con Garantía Hipotecaria

## Solution Architecture

### Multi-Step Wizard Flow (4 Steps - Combined)
Implement a streamlined wizard at `/pip/portafolio/nuevo`:

```
Step 1: Plan Setup
├── Name, Currency, Dates (auto: 12 months from today)
├── Risk Profile (pre-filled from assessment, read-only)
├── CMI anual en bloque 2
├── Inversión anual extra en bloque 2
└── Efectivo disponible
    → Shows "Total a repartir" (calculated)

Step 2: Investment Selection & Allocation (Combined)
├── "Add Investment" button opens selector:
│   ├── Dropdown with predefined OPTIONS (from docx files)
│   ├── "Custom" option for user-defined investment
│   └── Auto-fills: platform, underlying, risk, return, term
├── Investment Table (like spreadsheet):
│   ├── Columns: Inversión, Plataforma, Subyacente, Riesgo,
│   │           Inversión actual, PLAN, Inversión planeada, Comentario
│   ├── User enters current amount (existing holdings)
│   ├── User enters planned amount (target allocation)
│   └── User can add comments/priority
├── Real-time summary bar:
│   ├── Total actual | Total planeado | Efectivo restante
│   └── Warning if over-allocated
└── Inline validation warnings

Step 3: Risk & Diversification Analysis
├── Risk Distribution Card (by risk level)
│   ├── Bar chart showing % at each risk level
│   └── Warnings if exceeding max risk profile
├── Diversification Card (by underlying)
│   ├── Pie/bar showing % per underlying
│   └── Warning if any underlying > 60%
├── Expected Return Card
│   └── Weighted average return calculation
└── Validation summary (pass/fail checklist)

Step 4: Review & Create
├── Plan Summary (name, dates, total objective)
├── Investment Summary Table (condensed)
├── Key Metrics (total invested, expected return, risk level)
└── Create Plan button
```

## Implementation Steps

### Phase 1: Predefined Investment Options Catalog

#### 1.1 Create investment options data file
**File:** `src/lib/pip/investment-options.ts`

```typescript
export const INVESTMENT_OPTIONS = [
  {
    id: "factoring",
    name: "Factoring",
    description: "Compra de facturas por cobrar",
    defaultPlatforms: ["Prestamype", "Facturedo", "Finsmart"],
    underlying: "Facturas",
    typicalRisk: "medio",
    typicalReturn: { min: 0.10, max: 0.15 },
    typicalTerm: "1-6 meses",
    allowsReinvestment: true,
    minAmount: { PEN: 100, USD: 25 },
  },
  {
    id: "deposito_plazo_fijo",
    name: "Depósito a Plazo Fijo",
    description: "Depósito bancario a plazo determinado",
    defaultPlatforms: ["Alfin", "Caja Arequipa", "BCP"],
    underlying: "Plazo Fijo",
    typicalRisk: "muy_bajo",
    typicalReturn: { min: 0.04, max: 0.07 },
    typicalTerm: "6-12 meses",
    allowsReinvestment: false,
    minAmount: { PEN: 100, USD: 100 },
  },
  {
    id: "fondos_mutuos",
    name: "Fondos Mutuos",
    description: "Inversión diversificada en bolsa",
    defaultPlatforms: ["Tyba", "Credicorp Capital", "BBVA"],
    underlying: "Bolsa USA",
    typicalRisk: "alto",
    typicalReturn: { min: 0.08, max: 0.25 },
    typicalTerm: "1-60 meses",
    allowsReinvestment: true,
    minAmount: { PEN: 100, USD: 50 },
  },
  // ... more options
  {
    id: "custom",
    name: "Inversión Personalizada",
    description: "Define tu propia inversión",
    defaultPlatforms: [],
    underlying: "",
    typicalRisk: "medio",
    typicalReturn: { min: 0, max: 0 },
    typicalTerm: "",
    allowsReinvestment: false,
    minAmount: { PEN: 0, USD: 0 },
  },
];

export const UNDERLYING_OPTIONS = [
  "Facturas",
  "Plazo Fijo",
  "Bolsa USA",
  "Bolsa Local",
  "Terreno",
  "Inmueble",
  "Bonos",
  "Notas",
  "Otro",
];
```

### Phase 2: Multi-Step Wizard Components

#### 2.1 Main wizard container
**File:** `src/app/(dashboard)/pip/portafolio/nuevo/page.tsx` (update)

- Add wizard state management
- Step navigation
- Data persistence between steps

#### 2.2 Step components (4 steps)
**Files:**
- `src/components/pip/portfolio-wizard/StepPlanSetup.tsx` - Plan basics + financial capacity
- `src/components/pip/portfolio-wizard/StepInvestments.tsx` - Investment selection & allocation
- `src/components/pip/portfolio-wizard/StepAnalysis.tsx` - Risk & diversification analysis
- `src/components/pip/portfolio-wizard/StepReview.tsx` - Final review & create

#### 2.3 Investment selector component
**File:** `src/components/pip/InvestmentSelector.tsx`

- Dropdown with predefined options
- "Custom" option that reveals full form
- Auto-fills fields based on selection
- User can override any field

#### 2.4 Investment table component
**File:** `src/components/pip/InvestmentTable.tsx`

- Displays investments in table format
- Inline editing for amounts
- Delete/reorder functionality
- Totals row

#### 2.5 Analysis components
**Files:**
- `src/components/pip/RiskDistributionCard.tsx` - Shows risk breakdown
- `src/components/pip/DiversificationCard.tsx` - Shows underlying breakdown
- `src/components/pip/ExpectedReturnCard.tsx` - Shows weighted return

### Phase 3: API Enhancements

#### 3.1 Bulk investment creation
**File:** `src/server/api/routers/portfolio.ts` (update)

Add endpoint to create plan with all investments in one transaction:
```typescript
createPlanWithInvestments: protectedProcedure
  .input(z.object({
    plan: planSchema,
    investments: z.array(investmentSchema),
  }))
  .mutation(...)
```

### Phase 4: Form State Management

#### 4.1 Wizard state hook
**File:** `src/components/pip/portfolio-wizard/usePortfolioWizard.ts`

- Manages all wizard state
- Handles step navigation
- Validates each step
- Persists to localStorage (optional)
- Calculates derived values (totals, distributions)

## Critical Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/pip/investment-options.ts` | Create | Predefined investment catalog (7 types + custom) |
| `src/app/(dashboard)/pip/portafolio/nuevo/page.tsx` | Rewrite | Multi-step wizard container |
| `src/app/(dashboard)/pip/portafolio/nuevo/PortfolioPlanForm.tsx` | Delete | Replace with wizard |
| `src/components/pip/portfolio-wizard/PortfolioWizard.tsx` | Create | Main wizard component |
| `src/components/pip/portfolio-wizard/usePortfolioWizard.ts` | Create | State management hook |
| `src/components/pip/portfolio-wizard/WizardNavigation.tsx` | Create | Step indicator + nav buttons |
| `src/components/pip/portfolio-wizard/StepPlanSetup.tsx` | Create | Step 1: Plan + financial capacity |
| `src/components/pip/portfolio-wizard/StepInvestments.tsx` | Create | Step 2: Add/edit investments |
| `src/components/pip/portfolio-wizard/StepAnalysis.tsx` | Create | Step 3: Risk/diversification |
| `src/components/pip/portfolio-wizard/StepReview.tsx` | Create | Step 4: Final review |
| `src/components/pip/InvestmentSelector.tsx` | Create | Dropdown + custom form dialog |
| `src/components/pip/InvestmentTable.tsx` | Create | Editable investment list |
| `src/components/pip/RiskDistributionCard.tsx` | Create | Risk breakdown visualization |
| `src/components/pip/DiversificationCard.tsx` | Create | Underlying breakdown |
| `src/components/pip/ExpectedReturnCard.tsx` | Create | Weighted return display |
| `src/server/api/routers/portfolio.ts` | Update | Add createPlanWithInvestments |

## Verification

1. Navigate to `/pip/portafolio/nuevo` (requires risk assessment)
2. **Step 1 - Plan Setup:**
   - Verify risk profile is pre-filled from assessment
   - Enter name, CMI anual, extra investment, efectivo
   - Verify "Total a repartir" calculates correctly
3. **Step 2 - Investments:**
   - Add investment from predefined dropdown (e.g., Factoring)
   - Verify fields auto-populate
   - Add custom investment with manual fields
   - Enter current + planned amounts
   - Verify totals update in real-time
   - Add comment to an investment
4. **Step 3 - Analysis:**
   - Verify risk distribution shows correct percentages
   - Verify diversification by underlying is calculated
   - Verify expected return matches weighted average
   - Check validation warnings appear if over-allocated or risk exceeded
5. **Step 4 - Review:**
   - Verify all data displayed correctly
   - Click "Create Plan"
6. **Post-creation:**
   - Verify redirect to `/pip/portafolio`
   - Verify plan shows with all investments
   - Verify totals and metrics match what was entered
