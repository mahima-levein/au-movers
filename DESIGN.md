# DESIGN.md — ANP Movers Design Rules

Read this file alongside `AGENTS.md`. These rules describe the approved brand assets and color direction; `AGENTS.md` governs implementation and architecture.

## 1. Primary colors

| Role | Color | Tailwind utility |
| --- | --- | --- |
| Primary navy | `#142A51` | `text-brand-ink` |
| Primary gold | `#CA9B34` | `text-brand-gold` |

The tokens live in `src/styles/global.css` under Tailwind v4's `@theme`. Use these tokens for future brand styling rather than duplicating hex values.

## 2. Heading colors

- Apply this palette to `h1` through `h6`, including headings inside interactive components.
- Use navy for headings on light backgrounds and gold for emphasized heading text.
- Use gold for headings on dark backgrounds so they remain readable.
- For active FAQ items on a light gold background, use navy.
- Replace heading green `#203b3b` with navy and heading yellow `#f0c653` with gold. Consolidate similar existing heading shades into these tokens.
- Preserve the image-filled text treatment; its fallback text color uses navy.
- Heading animations must use the same palette.

## 3. Body text and existing surfaces

This update is limited to heading colors. Preserve existing `p`, `ul`, and `li` text colors, including inherited colors and interactive states. Existing buttons, backgrounds, borders, icons, and other non-heading text retain their current palette until a separate change is requested. Do not globally replace the old hex values: they still serve these existing styles.

## 4. Main logo

- The approved logo is `public/anp-logo.png`, served as `/anp-logo.png`.
- Reuse the supplied image in the header, footer, and navigation panel; do not recreate it using text or decorative shapes.
- Preserve its aspect ratio with automatic dimensions and `object-contain`.
- Use `alt="ANP Movers"` and a home link with an accessible label.
- On dark surfaces, place the original logo on a restrained white backing to preserve visibility of its navy artwork.
- Keep decorative brand text and the animated loading illustration unless separately asked to replace them.

## 5. Implementation and validation

- The quality cards in `#services` use primary navy surfaces, gold accents, and six unique cards. Their Call Now button uses gold with black text; Get in Touch uses white with black text. Preserve the rounded CTA style and visible keyboard focus.
- The floating call link stays at the bottom-left, with a navy background and gold Lucide phone icon. Its attention animation must respect reduced-motion preferences.

- Style components with Tailwind v4 utilities in Astro markup or existing React islands.
- Preserve current section layouts, typography sizes, spacing, behavior, and responsive breakpoints.
- Avoid new dependencies or hydration for branding changes.
- Check that paragraphs and list text remain unchanged and logos do not stretch or overflow.
- Run `npm run build` before completing changes. Run additional checks when defined in `package.json`.
