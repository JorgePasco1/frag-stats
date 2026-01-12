# Plan: Improve PIP Section Visual Hierarchy with Indentation

## Problem
The PIP section sub-items have identical styling to top-level nav items, making it unclear they belong under PIP as a group.

## File to Modify
- `src/components/dashboard/Sidebar.tsx` (lines 59-94)

---

## Implementation

Add left padding (`pl-5`) to PIP sub-items instead of the current `pl-3` (via `px-3`). This creates a 20px indent that signals hierarchy.

### Changes to Make

**Lines 64-72** (Bolsa Pasiva link):
```diff
- className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
+ className={`flex items-center gap-2 rounded-lg py-2 pl-5 pr-3 text-sm transition ${
```

**Lines 74-82** (Perfil de Riesgo link):
```diff
- className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
+ className={`flex items-center gap-2 rounded-lg py-2 pl-5 pr-3 text-sm transition ${
```

**Lines 84-92** (Portafolio link):
```diff
- className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
+ className={`flex items-center gap-2 rounded-lg py-2 pl-5 pr-3 text-sm transition ${
```

---

## Verification
1. Run `pnpm dev`
2. Navigate to dashboard sidebar
3. Verify PIP sub-items are visually indented under the PIP label
4. Test hover and active states still work correctly
5. Test in both light and dark modes
