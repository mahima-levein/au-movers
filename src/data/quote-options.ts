import type { PropertyType, UtilitySetup } from "../types/quote";

export const propertyOptions: {
  value: PropertyType;
  title: string;
  description: string;
}[] = [
  { value: "house", title: "House", description: "Detached / townhouse" },
  {
    value: "apartment",
    title: "Apartment",
    description: "Unit / flat / condo",
  },
  { value: "office", title: "Office", description: "Commercial space" },
  {
    value: "few-items",
    title: "Few Items",
    description: "Small move / few items",
  },
];

export const sizeOptions: Record<
  PropertyType,
  { value: string; title: string; description?: string }[]
> = {
  house: ["1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4+ Bedrooms"].map(
    (title, index) => ({ value: `Bedroom-${index + 1}`, title }),
  ),
  apartment: ["Studio", "1 Bedroom", "2 Bedrooms", "3+ Bedrooms"].map(
    (title, index) => ({ value: `${title
  .replace(/[0-9+\-*/]/g, "")
  .trim()
  .replace(/\s+/g, "-")
  .toLowerCase()}-${index + 1}`, title }),
  ),
  office: [
    { value: "small-office", title: "Small Office", description: "1–5 desks" },
    {
      value: "medium-office",
      title: "Medium Office",
      description: "6–20 desks",
    },
    { value: "large-office", title: "Large Office", description: "20+ desks" },
    { value: "warehouse", title: "Warehouse", description: "Full fitout" },
  ],
  "few-items": ["1–3 Items", "4–6 Items", "7–10 Items", "10+ Items"].map(
    (title, index) => ({ value: `items-${index + 1}`, title }),
  ),
};

export const utilityOptions: { value: UtilitySetup; title: string }[] = [
  { value: "electricity-gas", title: "Electricity & Gas" },
  { value: "electricity", title: "Electricity Only" },
  { value: "gas", title: "Gas Only" },
  { value: "skip", title: "Skip for now" },
];
