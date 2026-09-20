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

// Reference pricing and feature copy from the supplied design; replace with final plan details.
const referenceFeatures: PricingFeature[] = [
  { label: "Unlimited Pages", available: true },
  { label: "Full Access to the Library", available: true },
  { label: "Advanced analytics", available: true },
  { label: "Complete Documentation", available: true },
  { label: "Core Analytics Tools", available: false },
  { label: "24/7 Free Support", available: false },
  { label: "Customer care point", available: false },
  { label: "Cloud Storage Backup", available: true },
];

export const pricingPlans: PricingPlan[] = [
  {
    id: "basic-move",
    name: "Basic Move",
    subtitle: "Perfect for small apartments",
    price: "$130",
    suffix: "/ visit",
    features: referenceFeatures,
    ctaLabel: "Select Plan",
    href: "tel:+94774166098",
  },
  {
    id: "premium-move",
    name: "Premium Move",
    subtitle: "Large homes & long-distance",
    price: "$699",
    suffix: "/ visit",
    featured: true,
    badge: "Most Popular",
    features: referenceFeatures,
    ctaLabel: "Select Plan",
    href: "tel:+94774166098",
  },
];
