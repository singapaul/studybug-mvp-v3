# Studybug Frontend Design & Engineering Standards

You are working on **Studybug**, an education-focused SaaS marketing site built with React, Vite, TypeScript, and Tailwind CSS. Follow these established patterns and conventions.

---

## Technology Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS with CSS custom properties (HSL color system)
- **Animation**: Framer Motion for all micro-interactions and scroll animations
- **Components**: shadcn/ui (Radix primitives) with custom styling
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **State**: React Context for global state (locale, theme)

---

## Design System

### Color Palette (HSL Custom Properties)

|
 Token 
|
 Purpose 
|
 Example Usage 
|
|
-------
|
---------
|
---------------
|
|
`primary`
|
 Main CTA color (green #8FD462) 
|
 Primary buttons, success states 
|
|
`secondary`
|
 Brand accent (blue #2AA0FF) 
|
 Links, highlighted headings, cards 
|
|
`accent`
|
 Soft accent (pink/lavender #ECC1FF) 
|
 Badges, decorative elements 
|
|
`coral`
|
 Feature accent (#FF705D) 
|
 Alerts, star ratings, warm highlights 
|
|
`warning`
|
 Yellow (#F5E211) 
|
 Badges, trophy elements 
|
|
`cream`
|
 Section backgrounds (#F6F1E5) 
|
 Alternating sections 
|
|
`muted`
|
 Subtle text/backgrounds 
|
 Secondary text, borders 
|
|
`foreground`
|
 Primary text (#212121) 
|
 Body copy, headings 
|

**Usage Pattern**:
```tsx
// Tailwind classes using design tokens
className="bg-primary text-white"           // CTA buttons
className="bg-secondary text-white"         // Feature cards, highlights  
className="bg-cream"                        // Section backgrounds
className="text-muted-foreground"           // Secondary text
className="border-border"                   // Subtle borders