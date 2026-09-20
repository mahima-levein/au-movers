export type PropertyType = "house" | "apartment" | "office" | "few-items";
export type UtilitySetup = "electricity-gas" | "electricity" | "gas" | "skip";

export type QuoteData = {
  fromLocation: string;
  toLocation: string;
  propertyType: PropertyType | null;
  moveSize: string | null;
  moveDate: string | null;
  utilitySetup: UtilitySetup | null;
  fullName: string;
  email: string;
  phone: string;
};

export type QuoteSession = {
  version: 1;
  currentStep: number;
  highestReachedStep: number;
  data: QuoteData;
  completed: boolean;
};
