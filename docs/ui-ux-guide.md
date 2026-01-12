# UI/UX Style Guide - Frag Stats

This document defines the UI/UX patterns, component usage guidelines, and design standards for the Frag Stats application. Following these guidelines ensures consistency across the application and provides a cohesive user experience.

## Table of Contents

1. [Design System Overview](#design-system-overview)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Component Patterns](#component-patterns)
6. [Form Patterns](#form-patterns)
7. [Loading States](#loading-states)
8. [Empty States](#empty-states)
9. [Error States](#error-states)
10. [Chart Standards](#chart-standards)
11. [Layout Conventions](#layout-conventions)
12. [Accessibility Standards](#accessibility-standards)

---

## Design System Overview

### Technology Stack

- **Component Library**: Shadcn UI (built on Radix UI primitives)
- **Styling**: Tailwind CSS with custom CSS variables
- **Forms**: React Hook Form with Zod validation
- **Icons**: Radix Icons (`@radix-ui/react-icons`) and Lucide React
- **Charts**: Recharts with custom Shadcn chart wrapper
- **Notifications**: Sonner toast notifications
- **Theme**: Dark mode by default via `next-themes`

### File Organization

```
src/
├── components/ui/          # Shadcn UI library components
├── components/skeletons/   # Page-level loading skeletons
├── components/             # Shared components (ErrorDisplay, etc.)
├── app/_components/        # Shared app-specific components
└── app/[route]/_components # Route-specific components
```

---

## Color System

### CSS Variables

The application uses HSL-based CSS variables for theming. All colors should reference these variables rather than hardcoded values.

#### Semantic Colors

| Variable | Light Mode | Dark Mode | Usage |
|----------|-----------|-----------|-------|
| `--background` | White (0 0% 100%) | Deep blue (222.2 84% 4.9%) | Page backgrounds |
| `--foreground` | Dark blue (222.2 84% 4.9%) | Light gray (210 40% 98%) | Primary text |
| `--card` | White | Deep blue | Card backgrounds |
| `--card-foreground` | Dark blue | Light gray | Card text |
| `--primary` | Dark blue (222.2 47.4% 11.2%) | Light gray (210 40% 98%) | Primary actions |
| `--secondary` | Light gray (210 40% 96.1%) | Dark slate (217.2 32.6% 17.5%) | Secondary elements |
| `--muted` | Light gray | Dark slate | Subtle backgrounds |
| `--muted-foreground` | Gray (215.4 16.3% 46.9%) | Light slate (215 20.2% 65.1%) | Secondary text |
| `--destructive` | Red (0 84.2% 60.2%) | Dark red (0 62.8% 30.6%) | Destructive actions |
| `--border` | Light border | Dark border | Element borders |
| `--input` | Light input | Dark input | Form input borders |
| `--ring` | Focus ring | Focus ring | Focus indicators |

#### Chart Colors

Used for data visualization consistency:

| Variable | Light Mode | Dark Mode | Recommended Use |
|----------|-----------|-----------|-----------------|
| `--chart-1` | Orange (12 76% 61%) | Blue (220 70% 50%) | Primary data series |
| `--chart-2` | Teal (173 58% 39%) | Green (160 60% 45%) | Secondary data series |
| `--chart-3` | Dark teal (197 37% 24%) | Orange (30 80% 55%) | Tertiary data series |
| `--chart-4` | Yellow (43 74% 66%) | Purple (280 65% 60%) | Fourth data series |
| `--chart-5` | Orange (27 87% 67%) | Pink (340 75% 55%) | Fifth data series |

### Color Usage Guidelines

```tsx
// CORRECT: Use semantic color classes
<div className="bg-background text-foreground" />
<p className="text-muted-foreground" />
<span className="text-destructive" />

// INCORRECT: Avoid hardcoded colors
<div className="bg-gray-900 text-white" />
```

**Exception**: The application currently uses some legacy slate colors in the layout (`bg-slate-700`, `bg-slate-800`, `bg-slate-900`). New components should prefer the semantic color system.

---

## Typography

### Font Family

The application uses Geist Sans as the primary font family:

```css
font-family: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
```

### Heading Hierarchy

| Element | Tailwind Classes | Usage |
|---------|-----------------|-------|
| Page Title (h1) | `text-2xl font-bold` or `text-3xl font-bold` | Main page headings |
| Section Title | `text-xl font-bold` or `text-lg font-semibold` | Section headings |
| Card Title | `text-sm font-medium` | Inside CardHeader |
| Subsection | `text-sm font-semibold` | Table sections, sub-areas |
| Body Text | `text-sm` | Default content |
| Small Text | `text-xs` | Timestamps, metadata |

### Typography Examples

```tsx
// Page title
<h1 className="text-3xl font-bold">Stats Dashboard</h1>

// Card title (using Shadcn)
<CardTitle className="text-sm font-medium">Wears in Period</CardTitle>

// Stat value
<div className="text-3xl font-bold">42</div>

// Secondary stat value (text-heavy content)
<div className="text-lg font-semibold">{data.mostUsedFragrance}</div>

// Muted/secondary text
<p className="text-sm text-muted-foreground">No data available</p>

// Metadata
<div className="text-xs text-slate-500">Started at {time}</div>
```

---

## Spacing System

### Tailwind Spacing Scale

Use Tailwind's default spacing scale consistently:

| Token | Value | Common Usage |
|-------|-------|--------------|
| `gap-1` / `space-y-1` | 0.25rem (4px) | Tight element grouping |
| `gap-2` / `space-y-2` | 0.5rem (8px) | Form field spacing |
| `gap-4` / `space-y-4` | 1rem (16px) | Standard component spacing |
| `gap-6` / `space-y-6` | 1.5rem (24px) | Section spacing |
| `gap-8` | 2rem (32px) | Large component gaps |
| `p-4` | 1rem | Standard padding |
| `p-6` | 1.5rem | Card padding (default) |
| `p-8` | 2rem | Page-level padding |

### Spacing Patterns

```tsx
// Form field vertical spacing
<form className="flex flex-col gap-4">

// Card grid spacing
<div className="grid gap-4 md:grid-cols-3">

// Section spacing
<div className="space-y-4">

// Page padding
<div className="p-8">
```

---

## Component Patterns

### Buttons

#### Variants

| Variant | Usage | Example |
|---------|-------|---------|
| `default` | Primary actions, form submissions | "Save", "Submit", "Add new" |
| `destructive` | Delete/remove actions | "Delete", "Remove" |
| `outline` | Secondary actions, form triggers | Date picker trigger |
| `ghost` | Subtle actions, navigation | Collapsible triggers |
| `link` | Text-like links | Inline navigation |

#### Button Sizes

| Size | Height | Usage |
|------|--------|-------|
| `sm` | h-8 (32px) | Compact areas, inline buttons |
| `default` | h-9 (36px) | Standard form buttons |
| `lg` | h-10 (40px) | Prominent actions |
| `icon` | h-9 w-9 | Icon-only buttons |

#### Loading State Pattern

**Standard pattern for form submission buttons:**

```tsx
<Button type="submit" disabled={isPending}>
  {isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
  {isPending ? "Saving..." : "Save"}
</Button>
```

Key requirements:
1. Always disable the button during submission (`disabled={isPending}`)
2. Show a spinning icon (`ReloadIcon` with `animate-spin`)
3. Change button text to indicate action in progress ("Saving...", "Submitting...")
4. Use consistent icon spacing (`mr-2 h-4 w-4`)

**Icon import:**
```tsx
import { ReloadIcon } from "@radix-ui/react-icons";
```

### Cards

#### Standard Card Structure

```tsx
<Card>
  <CardHeader>
    <CardTitle className="text-sm font-medium">Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

#### Card Padding

- `CardHeader`: `p-6` (default)
- `CardContent`: `p-6 pt-0` (default)
- Custom padding: Override with className

#### Card Variants

1. **Stat Card**: Small title, large value
```tsx
<Card>
  <CardHeader>
    <CardTitle className="text-sm font-medium">Metric Name</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold">{value}</div>
  </CardContent>
</Card>
```

2. **Content Card**: Standard content container
```tsx
<Card>
  <CardHeader>
    <CardTitle>Section Title</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Multiple items with vertical spacing */}
  </CardContent>
</Card>
```

3. **Chart Card**: Contains data visualization
```tsx
<Card>
  <CardHeader>
    <CardTitle>Chart Title</CardTitle>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      {/* Chart content */}
    </ChartContainer>
  </CardContent>
</Card>
```

### Dialogs/Modals

#### Standard Dialog Pattern

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Brief description of the dialog purpose
      </DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

Key patterns:
- Use `asChild` on `DialogTrigger` to use custom button
- Add `max-h-[80vh] overflow-y-auto` for scrollable content
- Always include `DialogHeader`, `DialogTitle`, and `DialogDescription`

### Dropdown Menus

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    {/* Trigger element */}
  </DropdownMenuTrigger>
  <DropdownMenuContent side="top">
    <DropdownMenuItem>
      <Link href="/path">Menu Item</Link>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## Form Patterns

### Form Structure

All forms use React Hook Form with Zod validation and Shadcn form components:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "~/components/ui/form";

const formSchema = z.object({
  fieldName: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

function MyForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldName: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Form fields */}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

### Reusable Form Input Components

The application provides reusable form input components in `src/app/_components/`:

#### TextInput

```tsx
import { TextInput } from "~/app/_components/TextInput";

<TextInput
  form={form}
  fieldName="name"
  label="Name"
  placeholder="Enter name"
/>
```

#### NumericInput

```tsx
import { NumericInput } from "~/app/_components/NumericInput";

<NumericInput
  form={form}
  fieldName="price"
  label="Price"
  numericType="float" // or "integer"
/>
```

#### SelectDropdown

```tsx
import { SelectDropdown } from "~/app/_components/SelectDropdown";

<SelectDropdown
  form={form}
  fieldName="category"
  label="Category"
  options={["option1", "option2", "option3"]}
/>
```

#### LogDatePicker

```tsx
import { LogDatePicker } from "~/app/_components/LogDatePicker";

<LogDatePicker
  form={form}
  fieldName="date"
  label="Select Date"
/>
```

### Form Field Pattern

```tsx
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Label</FormLabel>
      <FormControl>
        <Input {...field} placeholder="Placeholder" />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Checkbox in Form

```tsx
<FormField
  control={form.control}
  name="isChecked"
  render={({ field }) => (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>Checkbox Label</FormLabel>
      </div>
    </FormItem>
  )}
/>
```

### Form Submission with tRPC

```tsx
const { mutate: submitForm, isPending } = api.router.mutation.useMutation({
  onSuccess: () => {
    toast.success("Success message");
    router.push("/redirect-path");
    // or router.refresh() to revalidate RSC data
  },
  onError: (error) => {
    toast.error("Error title", {
      description: error.message || "Please try again.",
    });
  },
});
```

---

## Loading States

### Page-Level Loading (Skeletons)

Each page has a corresponding `loading.tsx` file using skeleton components:

```tsx
// src/app/[route]/loading.tsx
import { PageSkeleton } from "~/components/skeletons";

export default function Loading() {
  return <PageSkeleton />;
}
```

### Skeleton Component Pattern

```tsx
import { Skeleton } from "~/components/ui/skeleton";

// Text skeleton
<Skeleton className="h-4 w-32" />

// Large value skeleton
<Skeleton className="h-8 w-24" />

// Chart skeleton
<Skeleton className="h-[400px] w-full" />

// Card skeleton
<Card>
  <CardHeader>
    <Skeleton className="h-4 w-32" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-8 w-24" />
  </CardContent>
</Card>
```

### Component-Level Loading

For client components fetching data:

```tsx
const { data, isLoading } = api.router.query.useQuery();

if (isLoading) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Section Title</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}
```

### Form Loading State

```tsx
if (isLoading) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
```

### Inline Loading Pattern

Use `animate-pulse` with `bg-muted` for inline loading states:

```tsx
<div className="h-4 w-32 animate-pulse rounded bg-muted" />
```

---

## Empty States

### Standard Empty State Pattern

```tsx
if (!data || data.length === 0) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Section Title</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-[400px] items-center justify-center text-muted-foreground">
          No data available for this period
        </div>
      </CardContent>
    </Card>
  );
}
```

### Empty State Guidelines

1. Maintain consistent container height with loaded state
2. Center the message both horizontally and vertically
3. Use `text-muted-foreground` for the message
4. Keep messages concise and informative
5. Consider adding a call-to-action when appropriate

### Empty Table State

```tsx
{data.length === 0 ? (
  <div className="text-sm text-muted-foreground">
    No items found
  </div>
) : (
  <Table>
    {/* Table content */}
  </Table>
)}
```

---

## Error States

### Error Boundary Component

The application uses a reusable `ErrorDisplay` component for error boundaries:

```tsx
// src/app/[route]/error.tsx
"use client";

import { ErrorDisplay } from "~/components/ErrorDisplay";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorDisplay
      error={error}
      reset={reset}
      title="Failed to load [resource]"
    />
  );
}
```

### ErrorDisplay Structure

The error display includes:
- Destructive-colored alert icon
- Customizable title
- Error message
- Error digest (if available)
- "Try again" button (calls `reset()`)
- "Go home" link

### Toast Notifications

For inline error feedback during mutations:

```tsx
import { toast } from "sonner";

// Success
toast.success("Fragrance added to your collection");

// Error
toast.error("Failed to add fragrance", {
  description: error.message || "Please try again.",
});
```

---

## Chart Standards

### Chart Configuration

All charts use the Shadcn chart wrapper with Recharts:

```tsx
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";

const chartConfig = {
  dataKey: {
    label: "Display Label",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;
```

### Standard Bar Chart Pattern

```tsx
<ChartContainer config={chartConfig}>
  <BarChart
    accessibilityLayer
    data={chartData}
    layout="vertical" // or omit for horizontal
    margin={{ left: 100 }}
  >
    <YAxis
      dataKey="name"
      type="category"
      tickLine={false}
      tickMargin={10}
      axisLine={false}
      width={90}
      tick={{ fontSize: 11 }}
    />
    <XAxis dataKey="value" type="number" hide />
    <ChartTooltip
      cursor={false}
      content={<ChartTooltipContent hideLabel />}
    />
    <Bar dataKey="value" fill="var(--color-value)" radius={5} />
  </BarChart>
</ChartContainer>
```

### Chart Height Standards

| Chart Type | Height |
|-----------|--------|
| Large chart (Most Used, Use Case) | `h-[400px]` |
| Small chart (Context charts) | `h-[250px]` |
| Discovery tables area | `h-[300px]` |

### Chart Color Assignment

- `--chart-1`: Primary data series (Most Used Fragrances)
- `--chart-2`: Secondary data series (Use Case Distribution)
- `--chart-3`: Tertiary data series (Context charts)

### Bar Styling

- Border radius: `radius={5}` for larger bars, `radius={8}` for smaller bars
- Tooltip: Always use `cursor={false}` and `<ChartTooltipContent hideLabel />`

---

## Layout Conventions

### Page Layout Pattern

```tsx
<div className="flex w-full flex-col gap-6 p-8">
  <div className="flex items-center justify-between">
    <h1 className="text-3xl font-bold">Page Title</h1>
    {/* Optional controls */}
  </div>
  {/* Page content */}
</div>
```

### Grid Patterns

#### Stats Grid (3 columns)
```tsx
<div className="grid gap-4 md:grid-cols-3">
  {/* 3 cards */}
</div>
```

#### Two-Column Grid
```tsx
<div className="grid gap-6 md:grid-cols-2">
  {/* 2 cards */}
</div>
```

#### Responsive Card Grid (Fragrances)
```tsx
<div className="flex w-full flex-wrap justify-center gap-8">
  {/* Cards */}
</div>
```

### Centered Content Layout

```tsx
<div className="flex h-fit min-h-full w-full flex-col items-center gap-6 p-4">
  <h1 className="text-2xl font-bold">Title</h1>
  {/* Content */}
</div>
```

### Responsive Breakpoints

- `sm`: 640px
- `md`: 768px (primary breakpoint for layout changes)
- `lg`: 1024px
- `xl`: 1280px

---

## Accessibility Standards

### Semantic HTML

1. Use proper heading hierarchy (h1 > h2 > h3)
2. Use semantic elements (`<nav>`, `<main>`, `<section>`)
3. Use `<button>` for actions, `<a>` for navigation

### ARIA Labels

```tsx
// Screen reader only text
<span className="sr-only">Close</span>

// Dialog close button (handled by Shadcn)
<DialogPrimitive.Close className="...">
  <Cross2Icon className="h-4 w-4" />
  <span className="sr-only">Close</span>
</DialogPrimitive.Close>
```

### Focus Indicators

All interactive elements have visible focus states:

```tsx
// Button focus (from Shadcn)
"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"

// Input focus (from Shadcn)
"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
```

### Keyboard Navigation

- All interactive elements are focusable
- Dialogs trap focus within the modal
- Dropdowns support arrow key navigation (via Radix)
- Forms support Tab navigation

### Chart Accessibility

```tsx
<BarChart accessibilityLayer data={data}>
  {/* Always include accessibilityLayer prop */}
</BarChart>
```

### Color Contrast

- Text on background: Meets WCAG AA (4.5:1)
- `text-muted-foreground` on backgrounds: Verified for readability
- Error states use `text-destructive` with sufficient contrast

---

## Quick Reference

### Common Imports

```tsx
// Shadcn Components
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";

// Form utilities
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Icons
import { ReloadIcon, CalendarIcon, CaretSortIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Star, AlertCircle, RefreshCw, Home } from "lucide-react";

// Toast
import { toast } from "sonner";

// App components
import { TextInput } from "~/app/_components/TextInput";
import { NumericInput } from "~/app/_components/NumericInput";
import { SelectDropdown } from "~/app/_components/SelectDropdown";
import { LogDatePicker } from "~/app/_components/LogDatePicker";

// tRPC
import { api } from "~/trpc/react";
```

### Form Submission Button Template

```tsx
<Button type="submit" disabled={isPending}>
  {isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
  {isPending ? "Saving..." : "Save"}
</Button>
```

### Loading Skeleton Template

```tsx
// Card with loading
<Card>
  <CardHeader>
    <Skeleton className="h-4 w-32" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-8 w-24" />
  </CardContent>
</Card>

// Form field loading
<div className="space-y-2">
  <Skeleton className="h-4 w-24" />
  <Skeleton className="h-10 w-full" />
</div>
```

### Empty State Template

```tsx
<div className="flex h-[HEIGHT] items-center justify-center text-muted-foreground">
  No data available
</div>
```

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-12 | 1.0.0 | Initial documentation |

---

## Contributing

When adding new UI patterns:

1. Follow existing patterns documented here
2. Update this guide with any new patterns
3. Ensure accessibility compliance
4. Test in both light and dark modes (if applicable)
5. Verify responsive behavior
