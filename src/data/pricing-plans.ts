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
    price: "$130",
    suffix: "/ visit",
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
    name: "Shrink Wrap",
    subtitle: "A covered finish for furniture and larger belongings",
    price: "$699",
    suffix: "/ visit",
    featured: true,
    badge: "Black Wrap",
    features: [
      { label: "Black shrink wrap covering", available: true },
      { label: "Furniture surfaces covered", available: true },
      { label: "Contents concealed by opaque wrap", available: true },
      { label: "Wrapping needs discussed before your move", available: true },
    ],
    ctaLabel: "Select Plan",
    href: "tel:+94774166098",
  },
];
