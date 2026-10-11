# Legal pages — client review

Drafts created for `/terms-and-conditions` and `/privacy-policy`. They are marked as drafts with an unconfirmed last-updated date and `noindex, follow`. No legal links were added to the landing-page footer, following the user's request to connect the pages later. Remove draft notices/noindex only after approval; update the text whenever integrations change.

## Confirm before publication

- Legal business name, ABN, address and contracting entity; confirm the existing +94 77 416 6098 phone for an Australian service and provide a privacy email.
- Actual services, service areas and relevant Australian state/territory. Confirm whether interstate, storage and specialist moves are offered.
- Quote acceptance, booking confirmation and the documents forming the service agreement.
- Pricing scope, GST treatment, deposits, payment methods/deadlines and agreed extra-work process.
- Restricted goods, customer preparation and specialist handling policies.
- Rescheduling, cancellation, refunds, claims/complaints process, liability and verified insurance terms. Australian legal review must preserve non-excludable consumer rights and assess unfair terms.
- Whether utility preferences are used outside the website; identify any referral partners, consent and disclosures.
- Real hosting provider, deployed scripts, analytics/cookies, email, CRM, payment and subcontractor integrations; inspect the deployed site as well as source code.
- Business security controls, access/correction process, retention and deletion rules, overseas recipients and processing countries.
- Applicability of the Privacy Act 1988/APPs, children's-information practices and privacy complaints process.
- Any AI or automated decision systems outside this repository. OAIC guidance describes new APP 1.7–1.9 transparency obligations commencing 10 December 2026 for relevant APP entities and decisions; obtain advice on applicability before launch. [OAIC APP 1 guidance](https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines/chapter-1-app-1-open-and-transparent-management-of-personal-information).
- Approved policy dates, canonical deployment domain and client/Australian lawyer sign-off.

## Actual data-flow findings

- `src/components/quote/QuoteModal.tsx` collects name, email, phone, pickup/destination, property type, move size, date and utility preference. It adds a submission timestamp and only logs completion data in the browser console; no quote API, staff email, server record or CRM delivery is configured.
- `src/lib/quote-session.ts` uses `sessionStorage`, key `anp-movers:quote-session`, for answers and progress. Reset clears/replaces widget state; it does not erase prior console output. Browser session restore/duplication can preserve state.
- The older `QuoteForm.tsx` is not mounted on the current landing page and also uses console-only demo submission.
- The footer newsletter accepts an email field and shows an unavailable message. No mailing integration is configured.
- Google Fonts requests load Jost from Google's servers. WhatsApp links navigate to an external messaging service. Source inspection found no configured analytics, advertising pixel, application cookie setter, payment provider or utility referral API.
- A Vercel package is installed, but its adapter is commented out. This does not verify a deployed host, server region or real provider logs/cookies. Deployment and off-site business processes remain unverified.
- No AI or automated consequential decision integration was found. Form validation is not an approved determination of the business's wider automated-decision practices.

## Drafting references

Consumer-rights wording was checked against [ACCC consumer contract guidance](https://www.accc.gov.au/consumers/buying-products-and-services/contracts) and [ACCC business/unfair contract guidance](https://www.accc.gov.au/business/selling-products-and-services/contracts). Privacy scope was checked against [OAIC APP 1 policy guidance](https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines/chapter-1-app-1-open-and-transparent-management-of-personal-information) and [the Australian Privacy Principles](https://www.oaic.gov.au/privacy/australian-privacy-principles/read-the-australian-privacy-principles). These drafts are not a legal opinion or a reviewed booking contract.

## Implementation

- Two separate Astro routes using a shared `LegalPageLayout.astro`, the existing header/footer, brand tokens, static content and native mobile contents disclosure.
- Existing header/footer anchors return to the corresponding home-page sections when viewed from another route. Homepage destinations and styling are unchanged.
- Legal pages omit the landing loader, floating CTA and quote React island. The existing navigation behaviour is reused; no new animation, React island or package was added.
- Each page has a unique title/description, one main heading, local contents anchors, an existing phone link and a link to the other legal page. Canonical/social URLs render only when a real `Astro.site` is configured.

## Validation

- Production build passes and generates both direct routes.
- Browser checks at 360, 390, 768 and 1440 pixels found no horizontal overflow, missing contents targets or runtime/network errors.
- Each page has one H1, no hydrated React islands, working mobile contents disclosure and homepage destinations in the shared navigation.
- Desktop and mobile screenshots were visually reviewed.

