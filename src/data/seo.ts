import { faqs } from "./faqs";

export const homeTitle = "ANP MOVERS | Moving Services & Packing Plans";
export const homeDescription =
  "Explore ANP Movers residential and commercial moving and packing options. Compare Standard Pack and Careful Handling plans. Call 0451 004 235 to discuss your move.";

// Only publish absolute entity identifiers once the real production domain is known.
export function homeStructuredData(site: URL | undefined) {
  if (!site) return undefined;
  const url = site.href;
  const business = `${url}#organization`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": business,
        name: "ANP MOVERS",
        url,
        logo: new URL("/anp-logo.png", site).href,
        telephone: "+61451004235",
      },
      {
        "@type": "WebSite",
        "@id": `${url}#website`,
        url,
        name: "ANP MOVERS",
        inLanguage: "en-AU",
        publisher: { "@id": business },
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: homeTitle,
        description: homeDescription,
        inLanguage: "en-AU",
        isPartOf: { "@id": `${url}#website` },
        about: { "@id": business },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        isPartOf: { "@id": `${url}#webpage` },
        mainEntity: faqs.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };
}
