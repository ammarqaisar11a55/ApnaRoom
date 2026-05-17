# ApnaRoom Frontend Theme

This document captures the current visual theme used across the frontend.

## 1) Design System Base

- **Framework:** React + Tailwind CSS v4 (`@import "tailwindcss";`)
- **Theme tokens location:** `src/index.css` inside `@theme`
- **Style approach:** Tailwind utility classes with reusable component classes in `@layer components`

## 2) Core Color Palette

### Primary brand tokens

- `primary-50`: `#f0f4f8`
- `primary-100`: `#e2e8f0`
- `primary-500`: `#2563eb`
- `primary-600`: `#1e40af`
- `primary-700`: `#1e3a5f`
- `primary-800`: `#0f2744`

### Supporting colors used in UI

- Blues: `blue-50`, `blue-100`, `blue-200`, `blue-300`, `blue-400`, `blue-500`, `blue-600`, `blue-700`
- Grays / slate: `gray-*`, `slate-*`
- Semantic accents: `red-*` (errors), `amber-500`/`emerald-500` (password strength), `yellow-400` (rating stars)

### Common gradients

- Primary CTA gradient: `from-primary-700 to-blue-500`
- Section gradient backgrounds: white/blue blends (`from-white to-blue-50`, `from-blue-50 to-white`)
- Dark overlay gradient: `from-primary-800 ... to-blue-700/70`

## 3) Typography

- **Display font:** `"Outfit", sans-serif` (`--font-display`)
- **Body font:** `"Inter", sans-serif` (`--font-body`)
- **Usage pattern:**
  - Headings/brand: `font-display`, `font-bold`/`font-black`
  - Body and helper text: default body font with `text-slate-*` / `text-gray-*`

## 4) Shape, Spacing, and Elevation

### Border radius tokens

- `--radius-sm`: `8px`
- `--radius-md`: `14px`
- `--radius-lg`: `22px`
- `--radius-xl`: `32px`

### Common radius classes in components

- `rounded-xl` for inputs/buttons
- `rounded-2xl` for cards/panels
- `rounded-3xl` for auth container
- `rounded-full` for pills and circular elements

### Shadow tokens

- `--shadow-sm`: `0 2px 8px rgb(30 58 95 / 0.06)`
- `--shadow-card`: `0 4px 24px rgb(30 58 95 / 0.08)`
- `--shadow-lg`: `0 12px 40px rgb(30 58 95 / 0.12)`

## 5) Reusable Component Classes (from `src/index.css`)

- `.section-header`: centered section header layout
- `.section-tag`: rounded pill tag (`blue-50` bg + `blue-600` text)
- `.section-title`: large display heading (`text-primary-700`)
- `.section-subtitle`: muted supportive copy (`text-gray-600`)
- `.btn-primary`: gradient-filled rounded CTA button
- `.btn-outline`: bordered primary outline button

## 6) Key UI Patterns

- **Navigation:** frosted/light glass nav (`bg-white/80` or `bg-white/95`, blur + subtle border/shadow)
- **Cards:** white backgrounds with soft borders and `shadow-card`, lift on hover
- **Forms:** `rounded-xl` fields, left icons, blue focus rings (`focus:ring-blue-100`)
- **Auth layout:** split-screen with dark brand panel and light form panel
- **Stats blocks:** bordered mini cards using primary text accents
- **Buttons:** strong primary blues, gradient fills, `active:scale-95` interaction

## 7) Motion and Interaction

- Floating background blobs via `blobFloat` keyframes
- Reveal-on-scroll animation using `.reveal` + `.reveal.in-view` (`slideInUp`)
- Frequent hover transitions (`hover:shadow-lg`, slight translate/scale, color shifts)

## 8) Brand Tone (Visual Direction)

- **Clean + trustworthy:** white surfaces, soft borders, controlled shadows
- **Student-focused + energetic:** vibrant blues, gradients, rounded friendly shapes
- **Modern + accessible:** strong contrast on primary actions with readable neutral text
