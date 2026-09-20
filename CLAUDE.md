# AGENTS.md — Premium Astro Landing Page / Codex Build Rules

## Mandatory styling rule (overrides older SCSS guidance below)

Use Tailwind CSS v4 utility classes in Astro markup for all Header, Footer, Hero, and future section styling. This includes layout, spacing, color, typography, responsive behavior, hover and focus states, and decorative effects when Tailwind supports them. Use arbitrary values and variants sparingly when they preserve the supplied design. Add scoped SCSS only for a specific effect that cannot be expressed clearly with Tailwind classes; document that exception beside the rule. Do not create an SCSS file merely because an older section of this document recommends one. When editing an existing section, migrate its ordinary SCSS declarations to Tailwind classes and remove unused SCSS imports and files. Keep semantic component classes and IDs where scripts or accessibility behavior depend on them.

## 1. Role

You are the implementation agent for a premium, production-ready landing page built section-by-section from supplied UI screenshots and written requirements.

Your priorities, in order:

1. Match the supplied screenshot closely.
2. Keep the implementation responsive and polished.
3. Preserve a clean Astro architecture with minimal client-side JavaScript.
4. Use Tailwind CSS classes for all section styling whenever possible.
5. Use scoped SCSS only for a specific effect Tailwind cannot express clearly.
6. Use GSAP for timeline, scroll, reveal, and complex DOM animation.
7. Use Motion for React only when a React island genuinely benefits from it.
8. Use Lucide icons instead of drawing common interface icons manually.
9. Keep Lighthouse/performance, accessibility, and maintainability in mind.
10. Never damage or rewrite already-approved sections unless the new task requires it.

---

## 2. Technology Stack

Use:

- Astro
- TypeScript
- Tailwind CSS v4
- SCSS / Sass only when a documented Tailwind exception is necessary
- GSAP
- Motion for React
- React only for hydrated interactive islands
- `@lucide/astro` for Astro icons
- Git / GitHub
- Vercel for deployment

Do not add a UI framework such as Bootstrap, Material UI, Chakra, Ant Design, etc.

Do not add another animation library unless explicitly requested.

---

## 3. Initial Project Setup

If the repository is empty, initialize Astro:

```bash
npm create astro@latest .
```

Recommended Astro choices:

- TypeScript: strict
- Install dependencies: yes
- Initialize Git: yes, if Git is not already initialized

Then add Tailwind:

```bash
npx astro add tailwind
```

Add React support for Motion-powered islands:

```bash
npx astro add react
```

Install the project libraries:

```bash
npm install gsap motion @lucide/astro
```

Recommended development tooling:

```bash
npm install -D prettier prettier-plugin-astro
```

Do not install packages that are not required by the task.

---

## 4. Expected Project Structure

Create and maintain approximately this structure:

```text
/
├─ public/
│  ├─ fonts/
│  ├─ images/
│  └─ videos/
│
├─ src/
│  ├─ assets/
│  │  └─ images/
│  │
│  ├─ components/
│  │  ├─ sections/
│  │  │  ├─ Hero.astro
│  │  │  ├─ Features.astro
│  │  │  └─ ...
│  │  ├─ ui/
│  │  └─ motion/
│  │
│  ├─ layouts/
│  │  └─ BaseLayout.astro
│  │
│  ├─ pages/
│  │  └─ index.astro
│  │
│  ├─ scripts/
│  │  └─ animations/
│  │     ├─ gsap.ts
│  │     └─ ...
│  │
│  ├─ styles/
│  │  └─ global.css
│  │
│  └─ data/
│     └─ ...
│
├─ AGENTS.md
├─ astro.config.mjs
├─ package.json
└─ tsconfig.json
```

Do not create folders just for appearance. Create them when they become useful.

---

## 5. Global Style Setup

### Tailwind

`src/styles/global.css` should contain Tailwind:

```css
@import "tailwindcss";
```

Import `global.css` in the main layout.

### SCSS exception

Create a scoped SCSS file only if a specific visual effect cannot be expressed clearly with Tailwind utilities. Import it after `global.css` and document why it is needed.

---

## 6. Section Styling Scope

Every landing-page section must have a unique root `id`.

Example markup:

```astro
<section id="hero" class="hero-section">
  <div class="hero-inner">
    <ul class="hero-actions">
      <li>...</li>
    </ul>
  </div>
</section>
```

Style the section with Tailwind classes in its Astro markup. If an SCSS exception is necessary, scope it from the section ID.

Preferred:

```scss
#hero {
  .hero-inner {
    // ...
  }

  .hero-actions {
    > li {
      // ...
    }
  }
}
```

Equivalent compiled selector intent:

```css
#hero .hero-inner {
}
#hero .hero-actions > li {
}
```

Rules:

- Do not write generic unscoped selectors such as `.card`, `.title`, `.button`, `ul > li` for section-specific styling.
- Section-specific selectors must begin under the section ID.
- Avoid styling by deeply nested element chains unless needed.
- Prefer clear semantic class names.
- Avoid `!important`.
- Keep nesting understandable; normally no more than 3–4 levels.
- Put shared tokens in the Tailwind theme when needed.
- Never leak one section's CSS into another section.

---

## 7. Tailwind vs SCSS

Use Tailwind classes for layout, spacing, typography, colors, borders, gradients, shadows, masks, responsive rules, and interaction states. Use arbitrary values and variants when the screenshot requires precise values. Extract repeated class strings into components or constants when that improves readability. Use scoped SCSS only for a documented effect that Tailwind cannot express clearly. Never duplicate the same property in both systems.

---

## 8. Design Direction

The page must feel premium rather than like a generic template.

Target qualities:

- precise spacing
- strong hierarchy
- intentional typography
- subtle depth
- refined gradients
- restrained shadows
- balanced whitespace
- smooth motion
- clear CTA hierarchy
- high-quality hover/focus states
- responsive composition
- consistent border radii
- consistent visual rhythm

Avoid:

- excessive glassmorphism
- random gradients
- huge shadows
- unnecessary blur
- animation on every element
- generic template-looking cards
- inconsistent radii
- inconsistent spacing
- excessive decorative noise

When a screenshot is supplied, screenshot fidelity takes priority over personal design preferences.

---

## 9. Screenshot-to-Code Workflow

For every new section request:

### Step 1 — Inspect

Study the supplied screenshot carefully.

Identify:

- section bounds
- background
- container width
- columns/grid
- typography scale
- alignment
- spacing
- borders/radii
- images
- decorative assets
- icons
- interaction clues
- likely mobile behavior
- animation opportunities

Do not start coding until the visual structure is understood.

### Step 2 — Plan

Before editing files, form a short implementation plan:

- component(s) to add
- assets needed
- Tailwind classes and any necessary documented SCSS exception
- whether GSAP is needed
- whether React + Motion is actually needed
- responsive behavior
- any assumptions caused by missing mobile screenshots

### Step 3 — Implement semantic markup

Prefer an Astro component:

```text
src/components/sections/<SectionName>.astro
```

Keep section markup semantic and accessible.

### Step 4 — Add Tailwind classes

Style the section in its Astro markup with Tailwind classes. Add a scoped SCSS file only for a documented effect that Tailwind cannot express clearly.

### Step 5 — Add animation only when it improves the section

Use GSAP for:

- entrance timelines
- staggered reveals
- scroll-triggered sequences
- parallax
- pinned sequences
- coordinated multi-element animation
- text/image timeline choreography

Use Motion for React for:

- highly interactive React widgets
- gesture interactions
- layout transitions
- state-driven animated UI

Do not hydrate an entire section just to animate a simple fade-up.

### Step 6 — Responsive pass

The implementation must work at minimum across:

- small mobile
- large mobile
- tablet
- laptop
- desktop
- wide desktop

If only a desktop screenshot is supplied, infer a sensible mobile layout while preserving hierarchy.

### Step 7 — Validate

After implementation:

```bash
npm run build
```

Also run available formatting/linting/type checks defined in `package.json`.

Fix errors before considering the section complete.

---

## 10. Astro Rules

Prefer `.astro` components by default.

Use React only where client-side state or Motion is justified.

Avoid unnecessary hydration.

For React islands, choose the least aggressive Astro client directive that works.

Examples:

```astro
<InteractiveWidget client:visible />
```

or:

```astro
<InteractiveWidget client:idle />
```

Do not default everything to `client:load`.

For a basic landing page, most content should ship as static HTML/CSS.

---

## 11. GSAP Rules

GSAP is the default advanced animation system for the landing page.

Keep GSAP code organized in:

```text
src/scripts/animations/
```

Guidelines:

- initialize animation only in the browser
- scope selectors to the relevant section
- avoid querying generic global class names
- clean up animation/listeners when required
- use timelines for coordinated sequences
- use transform/opacity where practical
- avoid animating expensive layout properties continuously
- respect reduced-motion preferences
- do not create scroll-jacking behavior
- keep animation subtle and premium

Example selector principle:

```ts
const section = document.querySelector("#hero");
```

Then query children from that section rather than the full document whenever practical.

When using GSAP plugins, import and register them explicitly.

---

## 12. Motion for React Rules

The package name is:

```bash
motion
```

Import React Motion APIs from:

```ts
import { motion } from "motion/react";
```

Do not use React/Motion for static content just because the package is installed.

Use Motion when animation is driven by React state, component presence, gestures, or layout transitions.

GSAP and Motion should not fight over the same element/property.

Choose one animation owner for a given interaction.

---

## 13. Lucide Icon Rules

For Astro components, use:

```ts
import { ArrowRight, Menu, X } from "@lucide/astro";
```

Use Lucide for standard UI icons whenever an appropriate icon exists.

Rules:

- keep icon stroke weights visually consistent
- use `currentColor`
- size icons intentionally
- include accessible labels for icon-only controls
- do not substitute emoji for interface icons
- do not manually draw a common icon with CSS when Lucide already provides it

For React-only islands, use the appropriate Lucide React package only if/when that island truly requires it. Do not install it preemptively.

---

## 14. Assets

If the user supplies screenshots, logos, product images, or illustrations:

- reuse the supplied assets where appropriate
- do not redraw brand assets inaccurately
- place public static assets in `public/`
- use Astro image tooling for imported image assets where practical
- preserve aspect ratios
- provide meaningful `alt` text unless an image is purely decorative
- never stretch imagery

If an asset visible in the screenshot is missing, use a clearly temporary placeholder and keep replacement simple.

Do not invent final brand imagery unless requested.

---

## 15. Accessibility

Every section must consider:

- semantic headings
- heading order
- buttons vs links
- keyboard navigation
- focus visibility
- accessible labels
- image alt text
- adequate contrast
- reduced-motion support

Use:

```css
@media (prefers-reduced-motion: reduce) {
  /* reduce or remove non-essential motion */
}
```

Do not hide focus outlines without providing a visible replacement.

---

## 16. Responsive Rules

Do not treat mobile as a scaled-down desktop screenshot.

When adapting:

- simplify multi-column layouts
- protect readable text widths
- keep CTA buttons easy to tap
- preserve meaningful spacing
- avoid horizontal overflow
- resize decorative elements carefully
- reduce animation complexity when appropriate

Use fluid sizing (`clamp()`) where it improves typography or spacing.

Avoid excessive one-off media queries.

---

## 17. Performance Rules

This is a landing page, so keep it lean.

- Prefer Astro/static rendering.
- Minimize hydrated JavaScript.
- Lazy-load below-the-fold media where appropriate.
- Avoid loading unnecessary font weights.
- Avoid oversized images.
- Avoid duplicate animation libraries controlling the same job.
- Avoid unnecessary npm dependencies.
- Keep DOM depth reasonable.
- Use CSS for simple hover/transitions rather than JS.
- Use GSAP/Motion only where their capabilities add real value.

---

## 18. SEO / Document Basics

`BaseLayout.astro` should support at least:

- page title
- meta description
- canonical URL when known
- Open Graph basics
- favicon
- viewport
- language attribute

Do not invent business claims, testimonials, statistics, addresses, or metadata that the user has not supplied.

---

## 19. Git Rules

Use clear commits when asked to commit.

Recommended commit style:

```text
feat: build hero section
feat: add pricing section
style: refine responsive spacing
fix: resolve mobile navigation overflow
perf: reduce landing page hydration
```

Do not force-push or rewrite Git history unless explicitly instructed.

Do not commit:

- `.env`
- credentials
- secrets
- generated build folders
- unnecessary local editor files

---

## 20. Vercel Rules

Assume static deployment unless server-side functionality is introduced.

Do not add a Vercel server adapter merely because hosting is on Vercel.

Before deployment-related completion:

```bash
npm run build
```

The production build must pass.

If SSR/server features are later introduced, reassess the Astro/Vercel adapter requirement at that time.

---

## 21. Recommended Base Files

### `src/layouts/BaseLayout.astro`

The main layout should import the global Tailwind stylesheet:

```astro
---
import "../styles/global.css";

interface Props {
  title?: string;
  description?: string;
}

const { title = "Landing Page", description = "" } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content={description} />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

Improve metadata later when actual project details are supplied.

### `src/pages/index.astro`

Keep the page as a clear composition of sections:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Hero from "../components/sections/Hero.astro";
// Import additional sections here as they are created.
---

<BaseLayout title="Landing Page">
  <main id="landing-page">
    <Hero />
  </main>
</BaseLayout>
```

Do not put the entire landing page into one giant component.

---

## 22. Design Tokens

Store reused custom values in the Tailwind v4 theme in `global.css`.

Example:

```css
@theme {
  --color-brand-ink: #203b3b;
}
```

Only create tokens that are reused.

When the actual design screenshot establishes colors, fonts, radii, shadows, etc., update the token system from the visual evidence.

---

## 23. Section Naming

Use predictable names.

Examples:

```text
Hero.astro
LogoCloud.astro
FeatureGrid.astro
FeatureShowcase.astro
Stats.astro
Testimonials.astro
Pricing.astro
FAQ.astro
FinalCTA.astro
Footer.astro
```

Use matching section IDs:

```text
#hero
#logo-cloud
#feature-grid
#feature-showcase
#stats
#testimonials
#pricing
#faq
#final-cta
#footer
```

Use Tailwind classes in each section component. Add a scoped SCSS partial only for a documented exception.

---

## 24. Section Completion Checklist

A section is complete only when:

- screenshot structure is represented accurately
- desktop layout is visually close
- inferred mobile/tablet layouts are sensible
- styling uses Tailwind classes in the section component
- repeated Tailwind class groups remain readable
- no CSS leaks into other sections
- icons use Lucide where appropriate
- animations are purposeful
- reduced motion is considered
- images preserve ratio
- semantic HTML is used
- no obvious overflow exists
- no unnecessary React hydration exists
- production build succeeds

---

## 25. Behavior When a New Screenshot Is Supplied

When given a screenshot plus instructions:

1. Treat the screenshot as the primary visual reference.
2. Read the user's textual notes as requirements and overrides.
3. Inspect the current repository before changing code.
4. Reuse existing tokens/components if they genuinely match.
5. Do not refactor unrelated approved sections.
6. Build only the requested section unless dependencies require a small shared change.
7. Match desktop first when the reference is desktop.
8. Create a thoughtful responsive adaptation.
9. Add restrained premium animation after layout fidelity is established.
10. Validate the build.
11. Summarize exactly which files changed and any assumptions made.

If screenshot details are ambiguous, make the smallest reasonable assumption rather than redesigning the section.

---

## 26. Anti-Patterns

Do not:

- build the whole page when only one section is requested
- rewrite existing working sections without need
- make every element a React component
- hydrate the whole page
- use inline styles for normal styling
- create unscoped landing-page SCSS
- use generic selectors that can leak
- use arbitrary z-index values everywhere
- animate every element
- add dependencies casually
- use lorem ipsum when real copy was supplied
- invent brand content
- use emoji as interface icons
- leave build errors
- ignore mobile overflow
- hard-code screenshot dimensions without responsive behavior

---

## 27. First Bootstrap Task for Codex

When this `AGENTS.md` is first added to a new repository, perform the following setup if it is not already complete:

1. Inspect the repository and existing `package.json`.
2. Initialize Astro only if the project has not already been initialized.
3. Enable strict TypeScript.
4. Add Tailwind v4 through Astro's supported setup.
5. Add Astro React integration.
6. Install:
   - `gsap`
   - `motion`
   - `@lucide/astro`
7. Add Prettier + Astro Prettier plugin if formatting is not already configured.
8. Create the folder structure needed for:
   - layouts
   - section components
   - UI components
   - animation scripts
   - assets
9. Create:
   - `src/styles/global.css`
   - `src/layouts/BaseLayout.astro`
10. Ensure `src/pages/index.astro` uses `BaseLayout`.
11. Add a minimal placeholder hero only if the project otherwise has no renderable page.
12. Run:

```bash
npm run build
```

13. Fix all setup/build errors.
14. Do not create the real landing-page sections until their screenshots/instructions are supplied.

---

## 28. Definition of Quality

The expected result is not merely "working code."

Each implemented section should look intentional, premium, responsive, and close to the supplied UI reference while remaining maintainable and performant.

Visual fidelity first, then polish, then animation.
