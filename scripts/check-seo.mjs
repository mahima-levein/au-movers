import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(`dist/${path}`, "utf8");
const home = await read("index.html");
const canonical = home.match(/<link rel="canonical" href="([^"]+)"/);
assert.ok(canonical, "Homepage canonical is missing");
const origin = new URL(canonical[1]).origin;
assert.equal(canonical[1], `${origin}/`);
for (const path of [
  "index.html",
  "privacy-policy/index.html",
  "terms-and-conditions/index.html",
  "404.html",
]) {
  const html = await read(path);
  assert.equal(
    (html.match(/<h1\b/g) || []).length,
    1,
    `${path}: exactly one H1 required`,
  );
  for (const marker of [
    'name="description"',
    'property="og:title"',
    'property="og:description"',
    'property="og:image"',
    'name="twitter:card"',
    'lang="en-AU"',
  ])
    assert.ok(html.includes(marker), `${path}: missing ${marker}`);
  if (path !== "index.html")
    assert.ok(
      html.includes('content="noindex, follow"'),
      `${path}: draft/error must be noindex`,
    );
}
const scripts = [
  ...home.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  ),
];
assert.equal(scripts.length, 1);
const graph = JSON.parse(scripts[0][1])["@graph"];
const organization = graph.find((node) => node["@type"] === "Organization");
assert.equal(organization.telephone, "+61451004235");
assert.equal(organization.url, `${origin}/`);
const faq = graph.find((node) => node["@type"] === "FAQPage");
assert.equal(faq.mainEntity.length, 4);
const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;/g, '"');
const visibleText = decode(
  home
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " "),
);
for (const item of faq.mainEntity) {
  assert.ok(visibleText.includes(item.name), "FAQ question must match HTML");
  assert.ok(
    visibleText.includes(item.acceptedAnswer.text),
    "FAQ answer must match HTML",
  );
}
assert.ok(
  !JSON.stringify(graph).includes("AggregateRating"),
  "Sample reviews must not become ratings schema",
);
const sitemap = await read("sitemap-0.xml");
assert.ok(sitemap.includes(`<loc>${origin}/</loc>`));
for (const route of ["privacy-policy", "terms-and-conditions", "404"])
  assert.ok(!sitemap.includes(route), `${route} must not be in sitemap`);
assert.ok(
  (await read("sitemap-index.xml")).includes(`${origin}/sitemap-0.xml`),
);
assert.ok(
  (await read("robots.txt")).includes(`Sitemap: ${origin}/sitemap-index.xml`),
);
console.log(
  "SEO checks passed: metadata, headings, canonical domain, JSON-LD, visible FAQ parity, robots and sitemap exclusions.",
);
