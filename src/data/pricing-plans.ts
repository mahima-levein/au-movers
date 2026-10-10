export type PricingFeature = {
  label: string;
  available: boolean;
};

export type PricingPlan = {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  suffix: string;
  featured?: boolean;
  badge?: string;
  features: PricingFeature[];
  ctaLabel: string;
  href: string;
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "basic-packing",
    name: "Standard Pack",
    subtitle: "Simple wrapping for your everyday moving needs",
    price: "$120",
    suffix: "AUD / visit",
    features: [
      { label: "Basic furniture wrapping", available: true },
      { label: "Surface protection", available: true },
      { label: "Items prepared for loading", available: true },
      { label: "Packing needs discussed before your move", available: true },
    ],
    ctaLabel: "Select Plan",
    href: "tel:+94774166098",
  },
  {
    id: "black-shrink-wrap-packing",
    name: "Careful Handling & Packing",
    subtitle: "Thoughtful packing and careful handling for your belongings",
    price: "$130",
    suffix: "AUD / visit",
    featured: true,
    badge: "Recommended",
    features: [
      { label: "Black shrink wrap covering", available: true },
      { label: "Furniture surfaces covered", available: true },
      { label: "Careful handling during loading", available: true },
      { label: "Wrapping needs discussed before your move", available: true },
    ],
    ctaLabel: "Select Plan",
    href: "tel:+94774166098",
  },
  {
    id: "custom-plan",
    name: "More Options, Lower Prices",
    subtitle:
      "Tell us what you need so we can discuss a plan that fits your budget",
    price: "Get a Quote",
    suffix: "",
    features: [
      { label: "Residential or commercial moves", available: true },
      { label: "Flexible packing options", available: true },
      { label: "A plan for your moving needs", available: true },
      { label: "Discuss options to suit your budget", available: true },
    ],
    ctaLabel: "Discuss Your Move",
    href: "tel:+94774166098",
  },
];
