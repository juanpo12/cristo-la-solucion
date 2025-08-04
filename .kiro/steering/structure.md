# Project Structure

## Directory Organization

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── grupos/            # Groups page
│   ├── tienda/            # Store page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── *.tsx             # Feature components
├── lib/                  # Utilities and helpers
│   ├── hooks/            # Custom React hooks
│   └── utils.ts          # Utility functions
├── public/               # Static assets
└── .kiro/                # Kiro configuration
```

## Component Architecture

### UI Components (`components/ui/`)
- Reusable, styled components using CVA patterns
- Follow Radix UI + Tailwind CSS approach
- Export both component and variant functions
- Use `cn()` utility for class merging

### Feature Components (`components/`)
- Page-specific components (header, hero, footer, etc.)
- Use "use client" directive when needed for interactivity
- Follow consistent naming: PascalCase for components
- Export as named exports

## Coding Conventions

### File Naming
- Components: `PascalCase.tsx` (e.g., `Header.tsx`)
- Pages: `page.tsx` (App Router convention)
- Utilities: `kebab-case.ts` (e.g., `utils.ts`)

### Import Patterns
- Use `@/` path alias for imports from root
- Group imports: React, Next.js, external libs, internal components
- Use `type` imports for TypeScript types

### Component Structure
```tsx
"use client" // Only when needed

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function ComponentName() {
  // Component logic
  return (
    <div className="classes">
      {/* JSX */}
    </div>
  )
}
```

### Styling Approach
- Tailwind CSS utility classes
- Custom church color palette: `church-electric`, `church-navy`, `church-vibrant`
- Responsive design: mobile-first approach
- Use `cn()` for conditional classes

## Asset Management
- Images stored in `public/` directory
- Use Next.js `Image` component for optimization
- Church logos and branding assets available
- Book covers and ministry photos included