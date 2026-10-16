# SEO and answer-engine readiness

## Production configuration

The user confirmed `https://anpmovers.au` as the production domain. This is the default in `astro.config.mjs`; an optional `SITE_URL` environment variable can override it for a domain migration. See `.env.example`. Rebuild after a domain change. Do not use a preview URL as the production domain.

The official `@astrojs/sitemap` integration generates `/sitemap-index.xml` and `/sitemap-0.xml`. `/robots.txt` advertises the sitemap when the domain is configured. Draft legal pages and the 404 page are excluded. Legal pages remain `noindex, follow` until approved; remove both their noindex flag and sitemap exclusion when approved.

## Implemented

- Descriptive homepage title/description, per-page legal metadata, Australian English document language.
- Canonical URLs without tracking queries, Open Graph/Twitter metadata and existing branded logo share image, favicons and theme colour.
- Linked Organization, WebSite, WebPage and FAQPage JSON-LD on the homepage. FAQ answers come from the same data as the visible accordion; no invented address, service suburbs, review ratings or business hours.
- All FAQ answers appear in static HTML and remain readable without JavaScript. JavaScript progressively enables the existing accordion animation.
- Replaced duplicated FAQ subject and placeholder About/portfolio prose with relevant moving information. Existing design and approved hero copy remain.
- Useful 404 page; crawlable footer legal links and contact links retained.

## Confirm before launch

- Real service suburbs/cities, business address or service-area setup, legal entity/ABN, public email, hours and verified profile URLs. Add supported local-business details only after confirmation. Current Organization schema deliberately avoids incomplete LocalBusiness rich-result claims.
- Verify the existing `200+` customer statistic, founder attribution, project descriptions, price-match/no-hidden-fee conditions and exact pricing basis/GST. Do not present sample reviews as real testimonials; they are not included in review/rating schema.
- Connect the quote form and newsletter to real delivery before relying on these for leads. Current quote widget is a browser/demo flow; phone and WhatsApp are actual contact options.
- Approve the draft legal pages before indexing them.
- Configure production HTTPS, preferred-host redirects, and ensure arbitrary missing URLs return HTTP 404 rather than a 200 homepage fallback. Redirect any replaced legacy URLs individually if such URLs exist.
- Verify ownership in Google Search Console and Bing Webmaster Tools; submit `/sitemap-index.xml`, inspect the live homepage, check indexing and validate structured data. Access to these accounts is needed for submission.
- Check deployed Core Web Vitals/PageSpeed on mobile. A local production build is not evidence of a perfect Lighthouse score or live search indexing.

## AEO limits and references

Clear, visible answers and consistent business facts help machine understanding. No AI-specific schema, keyword stuffing, hidden answers, fake ratings or speculative `llms.txt` claims were added. Google says normal SEO practices apply to its AI features; no inclusion or ranking is guaranteed. FAQ rich results are generally restricted to authoritative government/health sites, so a moving site's FAQ markup should not be promised a rich result.

- [Astro sitemap integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [Google AI features and websites](https://developers.google.com/search/docs/appearance/ai-features)
- [Google FAQ rich-result changes](https://developers.google.com/search/blog/2023/08/howto-faq-changes)

## Copy review

Edited content is in `WhoWeAre.astro`, `ProjectsPortfolio.astro` and `data/faqs.ts`. Changes remove template filler, make the quote question distinct, and avoid implying automatic acceptance of specialist heavy items. Existing numerical claims and attributed content were preserved and listed above for verification.

## Validation completed

`npm run build` passes with the confirmed domain and generates the Astro sitemap index, homepage sitemap and robots endpoint. `npm run check:seo` passes: all four pages have one H1 and required metadata; the JSON-LD parses; all four FAQ answers match static HTML; contact data uses the confirmed Australian number; draft/error pages are noindex and excluded from the sitemap. These checks inspect the production output locally, not live Google indexing or a Rich Results Test submission.
