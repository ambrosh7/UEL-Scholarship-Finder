# DESIGN SYSTEM: UEL Fit & Scholarship Finder (2026/27)
*Mobile-First Decision Architecture for Indian Students & Families*

---

## 1. Brand & Philosophy
- **Anti-Scam & Radical Honesty**: Eliminates education consultancy tropes (zero countdowns, zero artificial urgency, zero fake scholarship guarantees, no "98% placement record" theatre).
- **Format**: Designed strictly as a WhatsApp-era single-column phone tool (390×844) presented within a neutral `#E5E5E5` desktop surround frame.
- **Audience**: 17–22 year old Indian high school/college students tapping through from social media (Instagram reels / WhatsApp shares) and their decision-maker parents.

---

## 2. Color Tokens
| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| `color-ink-navy` | `#1B365D` | Primary buttons, active borders, brand wordmark, key accents |
| `color-navy-wash` | `rgba(27, 54, 93, 0.08)` | Selected chip background, subtle focus highlight |
| `color-page` | `#FFFFFF` | Full-bleed phone surface background |
| `color-surround`| `#E5E5E5` | Desktop viewport canvas surround & subtle dividing lines |
| `color-text-main` | `#171717` | High contrast primary reading text |
| `color-text-muted`| `#525252` | Secondary body, field captions, helper notes |
| `color-honesty` | `#1B365D` | Disclaimers & warnings (treated with confidence, never error red) |
| `color-border` | `#E5E5E5` | Default 1.5–2px input and chip container borders |

*Strictly Prohibited*: Countdown red, scarcity gold, neon badges, purple gradients, glassmorphism.

---

## 3. Typography Hierarchy
- **Font Stack**: Humanist sans-serif (`Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`)
- **Eyebrow**: `12px` / `uppercase` / `letter-spacing: 0.08em` / `font-semibold` / `#1B365D`
- **H1 (Screen Title)**: `28px` / `line-height: 1.25` / `font-semibold` / `#171717` (One core idea per screen)
- **H2 / Section Title**: `20px` / `line-height: 1.35` / `font-semibold` / `#171717`
- **Body Text**: `16px–18px` / `line-height: 1.5` / `#171717` (Minimum 16px to prevent iOS auto-zoom on inputs)
- **Caption / Honesty Line**: `13px–14px` / `line-height: 1.4` / `#525252`

---

## 4. Layout & Spacing Rules
- **Viewport Canvas**: Centered container max-width `390px`, min-height `844px`, wrapped in full desktop preview surround (`#E5E5E5`).
- **Safe Area & Padding**: `px-5` (20px) horizontal content margin; `pt-4` header; `pb-28` to ensure scrollable body never collides with fixed bottom bar.
- **Pinned Bottom CTA**: Pinned bottom container (`fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto p-4 bg-white/95 border-t border-[#E5E5E5] backdrop-blur-sm`). Min-height 56px per CTA button.
- **Radii**: `rounded-xl` to `rounded-2xl` (12px–16px) on choice chips, buttons, and inputs.

---

## 5. Reusable Component Inventory
1. **`PhoneShell`**: Max 390px centered container with iOS-style status bar, crisp border, and drop shadow on grey canvas.
2. **`AppEyebrow`**: "UEL FIT & SCHOLARSHIP FINDER • ACADEMIC YEAR 2026/27"
3. **`ScreenTitle`**: Bold H1 anchored at top of main scroll body.
4. **`HonestyLine`**: Plain text disclaimer explicitly stating "This is not an offer" or "UEL decides any place and amount."
5. **`PinnedCta`**: 56px height, full-width Navy `#1B365D`, 18px medium text. Disabled state at `opacity-40`.
6. **`PinnedSecondary`**: 56px outline navy button for dual-action screens (e.g., Parent share vs. Adviser chat).
7. **`WizardHeader`**: 44px hit-target back chevron, 4px progress track, and step count (e.g., "3 of 6").
8. **`ChoiceList`**: Stacked 56px+ hit-target rows with radio check indicators, selected navy border + 8% wash.
9. **`Field`**: 56px input with 18px font and static `+91` Indian mobile prefix container.
10. **`CheckRow`**: 20px custom checkbox with wrapping consent copy, 56px min tap zone.
11. **`CostStack`**: Itemized fee breakdown in GBP + RBI snapshot INR (explicitly labelled with date and non-live disclaimer), with visible `[PLACEHOLDER]` flags for living and visa costs.
12. **`ScholarshipBlock`**: Bold £500–£5,000 range box with instantaneous inline honesty disclaimer.
13. **`ResultsArticle`**: Strict narrative architecture: Headline → Program & Docklands Campus → Scholarship → Cost Breakdown → Real London Living Context → Next Steps.
14. **`ParentArticle`**: High-trust, low-clutter, cost-transparent summary designed for Indian parent WhatsApp forwarding.
