export type ProtectionFeature = {
  id: string;
  title: string;
  description: string;
  icon: "shield-check" | "truck" | "package-check" | "file-check";
};

// Make cover claims more specific only after the client verifies insurance credentials and policy terms.
export const protectionFeatures: ProtectionFeature[] = [
  {
    id: "existing-cover",
    title: "Check Your Existing Cover",
    description:
      "Your home or contents policy may include some moving-related cover. Check your policy or speak with your insurer before moving day.",
    icon: "shield-check",
  },
  {
    id: "transit-cover",
    title: "Ask About Transit Cover",
    description:
      "Find out what protection is available for belongings while they are being moved, including any limits, exclusions and excess.",
    icon: "truck",
  },
  {
    id: "careful-handling",
    title: "Careful Handling Matters",
    description:
      "Proper packing, moving equipment and careful handling help reduce the risk of damage during loading, transport and unloading.",
    icon: "package-check",
  },
  {
    id: "clear-inclusions",
    title: "Know What Is Included",
    description:
      "Before your move, understand what is covered, what is excluded and what to do if something goes wrong.",
    icon: "file-check",
  },
];
