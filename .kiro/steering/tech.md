# Technology Stack

## Framework & Runtime
- **Next.js 15.1.3** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety and development experience
- **Node.js** - Runtime environment

## Styling & UI
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Tailwind Animate** - Animation utilities
- **Radix UI** - Headless UI components (navigation, slots)
- **Material-UI (MUI)** - Additional component library
- **Lucide React** - Icon library
- **Framer Motion** - Animation library
- **Class Variance Authority (CVA)** - Component variant management

## Development Tools
- **ESLint** - Code linting with Next.js config
- **PostCSS** - CSS processing
- **TypeScript strict mode** - Enhanced type checking

## Build Configuration
- TypeScript build errors are ignored in production (`ignoreBuildErrors: true`)
- Path aliases configured (`@/*` maps to root)
- Custom Tailwind theme with church branding colors
- Poppins font integration via Google Fonts

## Common Commands
```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Key Dependencies
- `clsx` + `tailwind-merge` - Conditional CSS class management
- `next/image` - Optimized image handling
- `next/font` - Font optimization