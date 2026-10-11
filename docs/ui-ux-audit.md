# ANP Movers UI/UX audit

Completed 11 October 2026 against `01-final-ui-ux-audit.md`. The document was used as audit guidance; the existing approved design and the user's previous requirements were preserved.

## Improvements

- Restored the navigation menu trigger throughout the tablet/laptop range where desktop navigation is hidden. The header's displayed phone number now matches its actual call destination.
- Narrowed the hero text column at intermediate desktop widths to keep copy clear of the moving-photo gallery. Preserved the mobile truck, price-match wording, pricing CTA, inline quote form, and desktop gallery.
- Added an accessible darker gold text token for headings on light backgrounds; improved body-text contrast and aligned remaining key text with the navy brand colour.
- Enlarged carousel pagination tap targets while keeping the small visual dots. Combined near-duplicate final scroll positions so dots produce meaningful movements; mobile retains six positions.
- Matched pricing tab ARIA orientation and keyboard arrows to the stacked mobile or horizontal desktop layout.
- Replaced footer links targeting missing Blog/Team sections with existing Steps/Reviews destinations. Preserved Company/Services side-by-side on mobile and the ANP MOVERS wordmark. Moved the footer back-to-top control away from the fixed WhatsApp CTA.
- Removed the nonfunctional project-link appearance when a project has no destination. Made newsletter unavailability clear before users submit; removed the unsupported privacy-consent sentence.
- Added a skip link and shared visible keyboard focus treatment. Navigation and quote dialogs make background content inert while open and restore it on close.
- Made all six quote-progress icons fit mobile without horizontal scrolling; only the current step name is visually shown on small screens, while other names remain available to screen readers.
- Added autocomplete, input modes, required fields, associated error messages, error focus, selected-option state, and step-heading focus in the quote wizard. Mobile inputs use 16px text. Guarded against repeated submission and unavailable or malformed browser session storage.
- Fixed the 360px calendar button overflow and applied the site's navy/gold colours to the calendar's own theme root.
- Optimised the existing logo, hero gallery and service images with responsive WebP sources. Removed the unused Figtree font request and unnecessary italic/weight ranges.
- Deferred video loading until the quote section enters view; paused it offscreen, in hidden tabs, and under reduced motion. Retained a poster fallback. Paused the text marquee offscreen and added animation cleanup/reduced-motion handling.
- Prevented the loader from blocking the page without JavaScript; reduced motion bypasses it. Added missing description and basic Open Graph metadata using existing service wording, without inventing a location or domain.

## Validation

- Production build passes. Modified source files pass Prettier; Git whitespace checks pass.
- Local headless Chrome inspection at 1440, 1280, 1024, 768, 430, 390 and 360px, with section screenshots at desktop and mobile widths.
- No page-wide horizontal overflow, missing in-page anchor destinations, broken loaded images, browser exceptions or failed HTTP responses in the audit run.
- Pricing selection, FAQs, service/review pagination and tablet/mobile menu open-close-navigation checks pass at the tested widths.
- Quote checks pass: location and contact validation, focus handling, all six steps, mobile calendar fit, demo completion, desktop modal isolation, Escape dismissal, focus restoration, reduced-motion gallery/video behaviour, and the no-JavaScript loader fallback.
- No packages were added. No lint or standalone type-check scripts are configured; the production build does not certify a standalone TypeScript audit.
- Browser evidence is local in `node_modules/.cache/ui-audit/`, including `final.json`, `quick.json`, and screenshots. Safari, Firefox and physical iOS/Android devices were not tested; no Lighthouse score is claimed.

## Launch dependencies intentionally unchanged

1. **Quote delivery:** submission currently completes a browser-only demo; it does not deliver a request. A real destination/backend and delivery/error handling are needed before launch. The UI now states that no request was sent.
2. **Newsletter:** no subscription service is connected. The existing form reports that subscriptions are unavailable.
3. **Reviews:** existing reviews are explicitly labelled illustrative samples, as requested in the earlier design task. Replace with approved customer feedback before presenting them as genuine reviews.
4. **Business facts and content:** verify the existing `200+` statistic, founder attribution, project descriptions, price-match/no-hidden-fees claims and the +94 contact number for the intended Australian audience. No replacements were guessed. The About marketing paragraph, portfolio template paragraph, self-linking About CTA and similar packing FAQs still need the separately scoped content/SEO pass; the supplied audit asks to preserve final wording during the UI pass.
5. **Domain metadata:** a canonical URL and share-image URL need the real deployment domain and an approved image; neither was invented.

The UI improvements are complete; these dependencies mean this report is not a declaration that the website is ready to accept live enquiries.

## Files changed

- `src/styles/global.css`
- `src/layouts/BaseLayout.astro`
- `src/pages/index.astro`
- `src/components/layout/Header.astro`, `SidePanel.astro`, `Footer.astro`
- `src/components/sections/Hero.astro`, `HeroGallery.astro`, `WhoWeAre.astro`, `Services.astro`, `MovingProtection.astro`, `ProjectsPortfolio.astro`, `ProcessSteps.astro`, `FaqSection.astro`, `PricingPlans.astro`, `ReviewsSection.astro`, `RequestQuote.astro`
- `src/components/ui/ServiceCard.astro`, `SiteLoader.astro`
- `src/components/quote/QuoteModal.tsx`
- `src/lib/quote-session.ts`
- `src/scripts/animations/header-panel.ts`, `site-loader.ts`, `services.ts`, `text-marquee.ts`, `process-steps.ts`, `image-fill-text.ts`, and new `quote-video.ts`
- `src/scripts/reviews-carousel.ts`
- `docs/ui-ux-audit.md`
