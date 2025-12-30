# Style Guide

> **Configuration**: Mira style · Stone base · Emerald accent · JetBrains Mono · No radius · Lucide icons
>
> Based on [shadcn/ui](https://ui.shadcn.com) with Tailwind CSS v4

---

## Quick Start

```bash
# Font (choose one)
pnpm add @fontsource-variable/jetbrains-mono
# or Google Fonts link in HTML:
# <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap" rel="stylesheet">

# Icons
pnpm add lucide-react
```

---

## Design Philosophy

**Mira Style**: Compact and dense. Built for information-rich interfaces where screen real estate matters. Pairs naturally with monospace typography.

| Principle | Implementation |
|-----------|----------------|
| Density | Reduced padding, tighter spacing |
| Sharpness | `border-radius: 0` on all elements |
| Warmth | Stone grays (slight warm undertone) |
| Clarity | Emerald accents for actions/focus |
| Technical | JetBrains Mono throughout |

---

## Color Palette

### Stone (Base/Neutral)

Warm gray with subtle yellow-brown undertones.

| Shade | HSL | OKLCH | Hex | Use |
|-------|-----|-------|-----|-----|
| 50 | `60 9.1% 97.8%` | `oklch(0.98 0.00 106)` | `#fafaf9` | Backgrounds (light) |
| 100 | `60 4.8% 95.9%` | `oklch(0.97 0.00 106)` | `#f5f5f4` | Subtle backgrounds |
| 200 | `20 5.9% 90%` | `oklch(0.92 0.00 49)` | `#e7e5e4` | Borders, dividers |
| 300 | `24 5.7% 82.9%` | `oklch(0.87 0.00 56)` | `#d6d3d1` | Disabled states |
| 400 | `24 5.4% 63.9%` | `oklch(0.72 0.01 56)` | `#a8a29e` | Placeholder text |
| 500 | `25 5.3% 44.7%` | `oklch(0.55 0.01 58)` | `#78716c` | Secondary text |
| 600 | `33.3 5.5% 32.4%` | `oklch(0.44 0.01 74)` | `#57534e` | Body text (dark) |
| 700 | `30 6.3% 25.1%` | `oklch(0.37 0.01 68)` | `#44403c` | Headings (dark) |
| 800 | `12 6.5% 15.1%` | `oklch(0.27 0.01 34)` | `#292524` | Backgrounds (dark) |
| 900 | `24 9.8% 10%` | `oklch(0.22 0.01 56)` | `#1c1917` | Deep backgrounds |
| 950 | `20 14.3% 4.1%` | `oklch(0.15 0.00 49)` | `#0c0a09` | True dark |

### Emerald (Accent/Primary)

Vibrant green for primary actions, success states, and focus indicators.

| Shade | HSL | OKLCH | Hex | Use |
|-------|-----|-------|-----|-----|
| 50 | `151.8 81% 95.9%` | `oklch(0.979 0.021 166)` | `#ecfdf5` | Success bg (light) |
| 100 | `149.3 80.4% 90%` | `oklch(0.95 0.052 163)` | `#d0fae5` | Hover states |
| 200 | `152.4 76% 80.4%` | `oklch(0.905 0.093 164)` | `#a4f4cf` | Light accents |
| 300 | `156.2 71.6% 66.9%` | `oklch(0.845 0.143 165)` | `#5ee9b5` | Decorative |
| 400 | `158.1 64.4% 51.6%` | `oklch(0.765 0.177 163)` | `#00d492` | Interactive (hover) |
| 500 | `160.1 84.1% 39.4%` | `oklch(0.696 0.17 162)` | `#00bc7d` | **Primary actions** |
| 600 | `161.4 93.5% 30.4%` | `oklch(0.596 0.145 163)` | `#009966` | Primary (pressed) |
| 700 | `162.9 93.5% 24.3%` | `oklch(0.508 0.118 166)` | `#007a55` | Dark mode primary |
| 800 | `163.1 88.1% 19.8%` | `oklch(0.432 0.095 167)` | `#006045` | Deep accent |
| 900 | `164.2 85.7% 16.5%` | `oklch(0.378 0.077 169)` | `#004f3b` | Borders (dark) |
| 950 | `165.7 91.3% 9%` | `oklch(0.262 0.051 173)` | `#002c22` | Darkest accent |

---

## CSS Variables

### Tailwind CSS v4 (OKLCH)

```css
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap');

@theme inline {
  --font-sans: "JetBrains Mono", ui-monospace, monospace;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --radius: 0;
  --radius-sm: 0;
  --radius-md: 0;
  --radius-lg: 0;
  --radius-xl: 0;
}

@layer base {
  :root {
    /* Stone base - Light mode */
    --background: oklch(0.98 0.00 106);
    --foreground: oklch(0.15 0.00 49);

    --card: oklch(0.98 0.00 106);
    --card-foreground: oklch(0.15 0.00 49);

    --popover: oklch(0.98 0.00 106);
    --popover-foreground: oklch(0.15 0.00 49);

    /* Emerald primary */
    --primary: oklch(0.696 0.17 162);
    --primary-foreground: oklch(0.98 0.00 106);

    --secondary: oklch(0.92 0.00 49);
    --secondary-foreground: oklch(0.22 0.01 56);

    --muted: oklch(0.92 0.00 49);
    --muted-foreground: oklch(0.55 0.01 58);

    --accent: oklch(0.905 0.093 164);
    --accent-foreground: oklch(0.22 0.01 56);

    --destructive: oklch(0.577 0.245 27.325);
    --destructive-foreground: oklch(0.98 0.00 106);

    --border: oklch(0.87 0.00 56);
    --input: oklch(0.87 0.00 56);
    --ring: oklch(0.696 0.17 162);

    /* Chart colors */
    --chart-1: oklch(0.696 0.17 162);
    --chart-2: oklch(0.596 0.145 163);
    --chart-3: oklch(0.508 0.118 166);
    --chart-4: oklch(0.765 0.177 163);
    --chart-5: oklch(0.845 0.143 165);
  }

  .dark {
    /* Stone base - Dark mode */
    --background: oklch(0.15 0.00 49);
    --foreground: oklch(0.98 0.00 106);

    --card: oklch(0.22 0.01 56);
    --card-foreground: oklch(0.98 0.00 106);

    --popover: oklch(0.22 0.01 56);
    --popover-foreground: oklch(0.98 0.00 106);

    /* Emerald primary (adjusted for dark) */
    --primary: oklch(0.696 0.17 162);
    --primary-foreground: oklch(0.15 0.00 49);

    --secondary: oklch(0.27 0.01 34);
    --secondary-foreground: oklch(0.98 0.00 106);

    --muted: oklch(0.27 0.01 34);
    --muted-foreground: oklch(0.72 0.01 56);

    --accent: oklch(0.378 0.077 169);
    --accent-foreground: oklch(0.98 0.00 106);

    --destructive: oklch(0.577 0.245 27.325);
    --destructive-foreground: oklch(0.98 0.00 106);

    --border: oklch(0.37 0.01 68);
    --input: oklch(0.37 0.01 68);
    --ring: oklch(0.696 0.17 162);

    /* Chart colors - dark mode */
    --chart-1: oklch(0.765 0.177 163);
    --chart-2: oklch(0.696 0.17 162);
    --chart-3: oklch(0.596 0.145 163);
    --chart-4: oklch(0.845 0.143 165);
    --chart-5: oklch(0.508 0.118 166);
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

### Tailwind CSS v3 (HSL)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100..800&display=swap');

@layer base {
  :root {
    /* Stone base - Light mode */
    --background: 60 9.1% 97.8%;
    --foreground: 20 14.3% 4.1%;

    --card: 60 9.1% 97.8%;
    --card-foreground: 20 14.3% 4.1%;

    --popover: 60 9.1% 97.8%;
    --popover-foreground: 20 14.3% 4.1%;

    /* Emerald primary */
    --primary: 160.1 84.1% 39.4%;
    --primary-foreground: 60 9.1% 97.8%;

    --secondary: 20 5.9% 90%;
    --secondary-foreground: 24 9.8% 10%;

    --muted: 20 5.9% 90%;
    --muted-foreground: 25 5.3% 44.7%;

    --accent: 152.4 76% 80.4%;
    --accent-foreground: 24 9.8% 10%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 60 9.1% 97.8%;

    --border: 24 5.7% 82.9%;
    --input: 24 5.7% 82.9%;
    --ring: 160.1 84.1% 39.4%;

    --radius: 0;
  }

  .dark {
    /* Stone base - Dark mode */
    --background: 20 14.3% 4.1%;
    --foreground: 60 9.1% 97.8%;

    --card: 24 9.8% 10%;
    --card-foreground: 60 9.1% 97.8%;

    --popover: 24 9.8% 10%;
    --popover-foreground: 60 9.1% 97.8%;

    /* Emerald primary */
    --primary: 160.1 84.1% 39.4%;
    --primary-foreground: 20 14.3% 4.1%;

    --secondary: 12 6.5% 15.1%;
    --secondary-foreground: 60 9.1% 97.8%;

    --muted: 12 6.5% 15.1%;
    --muted-foreground: 24 5.4% 63.9%;

    --accent: 164.2 85.7% 16.5%;
    --accent-foreground: 60 9.1% 97.8%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 60 9.1% 97.8%;

    --border: 30 6.3% 25.1%;
    --input: 30 6.3% 25.1%;
    --ring: 160.1 84.1% 39.4%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: "JetBrains Mono", ui-monospace, monospace;
  }
}
```

---

## Typography

### Font: JetBrains Mono

A typeface designed for developers. Increased height for better readability, distinctive letter shapes, and programming ligatures.

```css
font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
```

### Scale (Mira - Compact)

| Name | Size | Line Height | Weight | Use |
|------|------|-------------|--------|-----|
| `xs` | 11px / 0.6875rem | 1.4 | 400 | Labels, captions |
| `sm` | 12px / 0.75rem | 1.5 | 400 | Secondary text, metadata |
| `base` | 13px / 0.8125rem | 1.5 | 400 | Body text |
| `lg` | 14px / 0.875rem | 1.5 | 500 | Emphasis, subheadings |
| `xl` | 16px / 1rem | 1.4 | 600 | Section headings |
| `2xl` | 18px / 1.125rem | 1.3 | 600 | Page headings |
| `3xl` | 22px / 1.375rem | 1.2 | 700 | Hero text |

### Tailwind Typography Config

```js
// tailwind.config.js (v3)
module.exports = {
  theme: {
    fontFamily: {
      sans: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
    },
    fontSize: {
      xs: ['0.6875rem', { lineHeight: '1.4' }],
      sm: ['0.75rem', { lineHeight: '1.5' }],
      base: ['0.8125rem', { lineHeight: '1.5' }],
      lg: ['0.875rem', { lineHeight: '1.5' }],
      xl: ['1rem', { lineHeight: '1.4' }],
      '2xl': ['1.125rem', { lineHeight: '1.3' }],
      '3xl': ['1.375rem', { lineHeight: '1.2' }],
    },
  },
}
```

---

## Spacing (Mira - Compact)

Dense spacing for information-rich interfaces.

| Token | Value | Use |
|-------|-------|-----|
| `0.5` | 2px | Micro gaps |
| `1` | 4px | Inline spacing, icon gaps |
| `1.5` | 6px | Tight component padding |
| `2` | 8px | Default component padding |
| `3` | 12px | Section gaps |
| `4` | 16px | Card padding |
| `6` | 24px | Section padding |
| `8` | 32px | Large gaps |

### Component Spacing Guidelines

```
Button padding:    px-2 py-1     (8px 4px)
Input padding:     px-2 py-1.5   (8px 6px)
Card padding:      p-3           (12px)
Modal padding:     p-4           (16px)
Section gap:       gap-3         (12px)
Form field gap:    gap-2         (8px)
```

---

## Border Radius

**None**. Sharp corners throughout for a technical, precise aesthetic.

```css
--radius: 0;
--radius-sm: 0;
--radius-md: 0;
--radius-lg: 0;
--radius-xl: 0;
```

All components use `rounded-none` or no border-radius styling.

---

## Shadows

Minimal shadows. The Mira style relies on borders and background contrast rather than elevation.

```css
/* Subtle shadow for popovers/dropdowns only */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);

/* Dark mode - even more subtle */
.dark {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.4);
}
```

---

## Icons

### Library: Lucide React

```bash
pnpm add lucide-react
```

### Usage

```tsx
import { Check, X, ChevronDown, Settings, User } from "lucide-react"

// Default size for Mira style
<Check className="h-3.5 w-3.5" />

// In buttons
<Button>
  <Settings className="h-3.5 w-3.5 mr-1.5" />
  Settings
</Button>
```

### Size Guidelines

| Context | Size | Class |
|---------|------|-------|
| Inline with text | 14px | `h-3.5 w-3.5` |
| Button icon | 14px | `h-3.5 w-3.5` |
| Standalone | 16px | `h-4 w-4` |
| Large/Hero | 20px | `h-5 w-5` |

---

## Component Patterns

### Button

```tsx
// Primary
<button className="inline-flex items-center justify-center px-2 py-1 text-sm font-medium bg-primary text-primary-foreground hover:bg-emerald-600 active:bg-emerald-700 border-0 rounded-none transition-colors disabled:opacity-50 disabled:pointer-events-none">
  Button
</button>

// Secondary
<button className="inline-flex items-center justify-center px-2 py-1 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-stone-300 dark:hover:bg-stone-700 border border-border rounded-none transition-colors">
  Button
</button>

// Outline
<button className="inline-flex items-center justify-center px-2 py-1 text-sm font-medium bg-transparent text-foreground hover:bg-accent border border-border rounded-none transition-colors">
  Button
</button>

// Ghost
<button className="inline-flex items-center justify-center px-2 py-1 text-sm font-medium bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground rounded-none transition-colors">
  Button
</button>

// Destructive
<button className="inline-flex items-center justify-center px-2 py-1 text-sm font-medium bg-destructive text-destructive-foreground hover:bg-red-600 rounded-none transition-colors">
  Delete
</button>
```

### Input

```tsx
<input
  type="text"
  className="flex h-8 w-full px-2 py-1.5 text-sm bg-background text-foreground border border-input rounded-none placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
  placeholder="Enter text..."
/>
```

### Select

```tsx
<select className="flex h-8 w-full px-2 py-1.5 text-sm bg-background text-foreground border border-input rounded-none focus:outline-none focus:ring-1 focus:ring-ring appearance-none cursor-pointer">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### Card

```tsx
<div className="bg-card text-card-foreground border border-border rounded-none p-3">
  <h3 className="text-lg font-semibold mb-2">Card Title</h3>
  <p className="text-sm text-muted-foreground">Card content goes here.</p>
</div>
```

### Badge

```tsx
// Default
<span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-none">
  Badge
</span>

// Primary
<span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-none">
  New
</span>

// Outline
<span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium bg-transparent text-foreground border border-border rounded-none">
  Draft
</span>
```

### Table

```tsx
<table className="w-full text-sm">
  <thead>
    <tr className="border-b border-border">
      <th className="h-8 px-2 text-left font-medium text-muted-foreground">Header</th>
      <th className="h-8 px-2 text-left font-medium text-muted-foreground">Header</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      <td className="h-8 px-2">Cell</td>
      <td className="h-8 px-2">Cell</td>
    </tr>
  </tbody>
</table>
```

### Form Field

```tsx
<div className="space-y-1.5">
  <label className="text-xs font-medium text-foreground">
    Label
  </label>
  <input
    type="text"
    className="flex h-8 w-full px-2 py-1.5 text-sm bg-background border border-input rounded-none placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
  />
  <p className="text-xs text-muted-foreground">
    Helper text goes here.
  </p>
</div>
```

### Alert

```tsx
// Default
<div className="flex gap-2 p-3 border border-border bg-background text-foreground rounded-none">
  <Info className="h-4 w-4 mt-0.5 shrink-0" />
  <div>
    <h5 className="text-sm font-medium">Heads up!</h5>
    <p className="text-xs text-muted-foreground mt-0.5">Alert message here.</p>
  </div>
</div>

// Success (using emerald)
<div className="flex gap-2 p-3 border border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-100 rounded-none">
  <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
  <div>
    <h5 className="text-sm font-medium">Success!</h5>
    <p className="text-xs opacity-80 mt-0.5">Operation completed.</p>
  </div>
</div>

// Destructive
<div className="flex gap-2 p-3 border border-red-500/50 bg-red-50 dark:bg-red-950/50 text-red-900 dark:text-red-100 rounded-none">
  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
  <div>
    <h5 className="text-sm font-medium">Error</h5>
    <p className="text-xs opacity-80 mt-0.5">Something went wrong.</p>
  </div>
</div>
```

---

## Dark Mode

### Implementation

```tsx
// Toggle class on <html> element
document.documentElement.classList.toggle('dark')

// Or with next-themes
import { ThemeProvider } from 'next-themes'

<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>
```

### Color Token Mapping

| Token | Light | Dark |
|-------|-------|------|
| `background` | Stone 50 | Stone 950 |
| `foreground` | Stone 950 | Stone 50 |
| `card` | Stone 50 | Stone 900 |
| `muted` | Stone 200 | Stone 800 |
| `border` | Stone 300 | Stone 700 |
| `primary` | Emerald 500 | Emerald 500 |
| `accent` | Emerald 200 | Emerald 900 |

---

## Usage with AI

When prompting Claude or other LLMs, include this context:

```
Use my style guide:
- Mira style: compact, dense, sharp corners (radius: 0)
- Stone grays for neutrals (warm undertone)
- Emerald for primary/accent colors
- JetBrains Mono font throughout
- Lucide icons, 14px default size
- Tight spacing: px-2 py-1 for buttons, p-3 for cards
- Minimal shadows, rely on borders for definition
```

---

## Tailwind Config (Complete)

### v4

```js
// tailwind.config.ts (if needed alongside CSS)
export default {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0',
        sm: '0',
        md: '0',
        lg: '0',
        xl: '0',
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
    },
  },
}
```

---

## File Checklist

When setting up a new project:

- [ ] Install JetBrains Mono font
- [ ] Install lucide-react icons
- [ ] Copy CSS variables to globals.css
- [ ] Update tailwind.config with theme extensions
- [ ] Set `border-radius` overrides to 0
- [ ] Configure dark mode (`class` strategy)
- [ ] Copy component patterns as needed

---

## Sources

- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [shadcn/ui Colors](https://ui.shadcn.com/colors)
- [Tailwind CSS Colors](https://tailwindcss.com/docs/colors)
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/)
- [Lucide Icons](https://lucide.dev/)
