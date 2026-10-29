---
name: Academic Candor
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#44474e'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#465f88'
  primary: '#002046'
  on-primary: '#ffffff'
  primary-container: '#1b365d'
  on-primary-container: '#87a0cd'
  inverse-primary: '#aec7f7'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e4e2e2'
  on-secondary-container: '#646464'
  tertiary: '#321c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#4f2f00'
  on-tertiary-container: '#c6965e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aec7f7'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#2e476f'
  secondary-fixed: '#e4e2e2'
  secondary-fixed-dim: '#c8c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#ffddb9'
  tertiary-fixed-dim: '#f1bd81'
  on-tertiary-fixed: '#2b1700'
  on-tertiary-fixed-variant: '#623f0f'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  eyebrow:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 35px
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system delivers an anti-predatory, institutional verification experience for Indian students and their parents evaluating the University of East London (UEL) for Academic Year 2026/27. The visual environment communicates fiduciary responsibility, institutional gravity, and complete transparency. 

Key traits:
- **Radical Honesty:** Complete absence of conversion tricks, fake counters, artificial deadlines, manipulative badges, or high-pressure enrollment funnels.
- **Intergenerational Clarity:** High-contrast legibility tailored for family co-reading across varied screen fidelities, varying lighting conditions, and differing technical literacies.
- **Architectural Minimalism:** Functional, paper-like authority. Clean, unembellished white surfaces structured by deep institutional navy and disciplined typographic boundaries.

## Colors

The palette relies on strict chromatic austerity to signal integrity and institutional authenticity.

### Primary Palette
- **Primary Ink Navy (`#1B365D`):** The primary authority color. Used for prominent headings, key interactive states, formal eyebrows, institutional accents, and verified status marks.
- **Pure White (`#FFFFFF`):** The viewport canvas background for the mobile questionnaire, cards, and modal surfaces.
- **Desktop Surround Neutral (`#E5E5E5`):** Structural exterior viewport tone framing the phone viewport on widescreen viewports to emphasize the focused questionnaire canvas.

### Text & Tone Tokens
- **Text Primary (`#171717`):** Maximum contrast neutral for questions, primary responses, and critical terms.
- **Text Secondary (`#525252`):** Calm, readable neutral for contextual descriptors, tuition breakdowns, disclaimers, and parental guidance notes.
- **Selection Wash (`rgba(27, 54, 93, 0.08)`):** 8% tint of Primary Ink Navy used strictly for selected chip states, active card tiles, and option rows.
- **Hairline Border (`#E5E7EB`):** Unobtrusive architectural separation for default inputs, card borders, and dividers.
- **Critical Alert (`#991B1B`):** Reserved strictly for factual eligibility blockers, visa compliance warnings, and non-qualification notices. Never used for marketing urgency.

## Typography

The type hierarchy uses Inter to deliver clear, humanist legibility across dense financial disclosures, academic requirements, and questionnaire prompts.

### Typographic Rules
- **Eyebrows:** Displayed at 12px uppercase with 0.08em tracking in Ink Navy (`#1B365D`). Sets clear institutional context (e.g., `ACADEMIC YEAR 2026/27`, `SCHOLARSHIP CRITERIA 3 OF 5`).
- **Primary Headings (`headline-lg`):** Fixed at 28px with a 1.25 line-height (`35px`) at semibold weight. Questions must be direct, neutral, and readable without screen truncation.
- **Reading Comfort:** Body copy sits between 16px and 18px to prevent strain during family evaluations and ensure accessibility on mobile displays.
- **Numerical Candor:** Currency (INR ₹ / GBP £), percentages, and test cutoffs maintain standard tabular lining figures to avoid ambiguity in scholarship calculation displays.

## Layout & Spacing

### Device Frame & Canvas
- **Target Dimensions:** Centered around an iPhone reference standard of 390px × 844px.
- **Desktop Framing:** On displays wider than 480px, the application renders as a distinct, centered 390px (or max 420px) viewport set against the Desktop Surround (`#E5E5E5`), preserving the native mobile interaction model.
- **Safe Areas & Action Zone:** 
  - Top safe area reserved for minimal progress indicator and the institutional mark.
  - Bottom 80px dedicated to the persistent action bar (minimum 56px interactive height + system navigation inset).

### Spacing Scale
- `margin` (1.25rem / 20px): Outer page margin padding within the mobile canvas.
- `gutter` (1rem / 16px): Gap separating side-by-side metric tiles or multi-column option cards.
- Content elements follow an 8pt vertical rhythm, pairing related titles and subtitles with `space-xs` (4px) or `space-sm` (8px), while questionnaire option groups maintain `space-md` (16px) separation.

## Elevation & Depth

This system avoids heavy drop shadows, blurred neomorphic extrusions, and decorative float styling. Depth is conveyed strictly through architectural layering and border delineation.

### Elevation Principles
- **Base Canvas:** Flat Pure White (`#FFFFFF`).
- **Surface Elevation (Cards & Tiles):** Resting cards use a flat Pure White background bounded by a crisp 1px solid hairline (`#E5E7EB`). 
- **Active / Selected Surface:** Background switches to Selection Wash (`rgba(27, 54, 93, 0.08)`) with a 1.5px solid Ink Navy (`#1B365D`) border.
- **Floating Controls:** The sticky bottom CTA bar rests on a Pure White backing supported by a 1px solid hairline border at its top boundary (`#E5E7EB`), accompanied by an ultra-subtle ambient grounding shadow: `0px -4px 12px rgba(0, 0, 0, 0.04)`.

## Shapes

The interface balances institutional structure with modern digital ergonomics using a unified 14px corner radius across interactive touch targets.

### Radius Specifications
- **Inputs, Buttons, and Selection Chips:** Explicitly set to `14px` (`border-radius: 14px`). This softens the questionnaire without compromising its serious, official nature.
- **Card Containers:** Container cards and comparison boxes use `14px` or `16px` to maintain visual consistency with nested selection rows.
- **Badges and Indicators:** Informational chips maintain the uniform 14px radius, avoiding full pill shapes to maintain a structured document feel.

## Components

### 1. Primary Action Button (Fixed Bottom CTA)
- **Geometry:** Full-width within viewport margins; minimum height strictly 56px; border radius 14px.
- **Colors:** Solid Ink Navy (`#1B365D`) background, Pure White (`#FFFFFF`) bold label, no decorative drop shadows.
- **Interaction:** Tap/active scale is 0.98. Disabled state uses `#E5E7EB` background with `#525252` text; never hides criteria requirements when disabled.
- **Positioning:** Fixed to the screen bottom, floating over an anchored white container panel with safe-area padding.

### 2. Selection Chips & Questionnaire Tiles
- **Default State:** White background, 1px border (`#E5E7EB`), 16px vertical/horizontal interior padding, 14px border radius. Text primary (`#171717`).
- **Selected State:** Selection wash background (`rgba(27, 54, 93, 0.08)`), 1.5px border (`#1B365D`), text `#1B365D` with semibold weight.
- **Typography:** Clear, bold primary label paired with an optional 14px secondary explanation line in `#525252`.

### 3. Input Fields
- **Geometry:** Minimum height 52px; border radius 14px; 16px horizontal text inset.
- **Default Border:** 1px hairline (`#E5E7EB`). 
- **Focus State:** 1.5px border in Ink Navy (`#1B365D`) with zero generic glow rings.
- **Labels & Support:** Labels sit permanently above the field in 14px semibold `#171717`. Assistive text (e.g., standard fee conversion notes) sits below in 12px `#525252`.

### 4. Verification & Criteria Cards
- Used to break down scholarship eligibility percentages, living cost expectations, and document requirements.
- White surface, 1px hairline border, 16px padding.
- Includes a top eyebrow badge (12px uppercase Ink Navy) defining regulatory accuracy under the UK Visas and Immigration (UKVI) or UEL standards.

### 5. Progress Indicator
- Minimalist, segmented thin horizontal progress bar (2px height) positioned at the very top of the mobile screen.
- Active segments render in Ink Navy (`#1B365D`); pending segments render in `#E5E7EB`.
- Avoids gamified percentage wheels or congratulatory animations.

### 6. Anti-Scam Verification Notice
- A dedicated, high-contrast disclosure block styled with a light 1px border, containing an institutional lock icon and explicit disclaimer: "UEL will never ask for visa deposits via unofficial UPI or personal agent accounts."