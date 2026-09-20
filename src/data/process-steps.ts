export type ProcessStep = {
  number: string;
  label: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    label: "Step",
    title: "Request a Free Quote",
    description: "Tell us about your move and get a fast, accurate estimate.",
  },
  {
    number: "02",
    label: "Step",
    title: "We Pack & Prepare",
    description:
      "Our team carefully packs your belongings and gets everything ready.",
  },
  {
    number: "03",
    label: "Step",
    title: "We Move Your Items Safely",
    description: "We transport your items securely to your new destination.",
  },
  {
    number: "04",
    label: "Step",
    title: "Unload & Set Up",
    description: "We help with unpacking and furniture placement as needed.",
  },
];
