import type { QuoteSession } from "../types/quote";

const KEY = "anp-movers:quote-session";

export function createInitialQuoteSession(): QuoteSession {
  return {
    version: 1,
    currentStep: 0,
    highestReachedStep: 0,
    completed: false,
    data: {
      fromLocation: "",
      toLocation: "",
      propertyType: null,
      moveSize: null,
      moveDate: null,
      utilitySetup: null,
      fullName: "",
      email: "",
      phone: "",
    },
  };
}

export function loadQuoteSession(): QuoteSession {
  if (typeof sessionStorage === "undefined") return createInitialQuoteSession();
  try {
    const saved = JSON.parse(
      sessionStorage.getItem(KEY) ?? "null",
    ) as QuoteSession | null;
    const initial = createInitialQuoteSession();
    if (
      saved?.version !== 1 ||
      !saved.data ||
      !Number.isInteger(saved.currentStep) ||
      saved.currentStep < 0 ||
      saved.currentStep > 5 ||
      !Number.isInteger(saved.highestReachedStep) ||
      saved.highestReachedStep < saved.currentStep ||
      saved.highestReachedStep > 5 ||
      typeof saved.completed !== "boolean" ||
      !["fromLocation", "toLocation", "fullName", "email", "phone"].every(
        (key) => typeof saved.data[key as keyof typeof saved.data] === "string",
      ) ||
      ![null, "house", "apartment", "office", "few-items"].includes(
        saved.data.propertyType,
      ) ||
      !["moveSize", "moveDate"].every(
        (key) =>
          saved.data[key as keyof typeof saved.data] === null ||
          typeof saved.data[key as keyof typeof saved.data] === "string",
      ) ||
      ![null, "electricity-gas", "electricity", "gas", "skip"].includes(
        saved.data.utilitySetup,
      ) ||
      (saved.currentStep >= 2 && !saved.data.propertyType)
    )
      return initial;
    return saved;
  } catch {
    return createInitialQuoteSession();
  }
}

export function saveQuoteSession(session: QuoteSession) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    // The form remains usable when browser storage is unavailable.
  }
}

export function clearQuoteSession() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // Resetting in-memory form state still works when storage is unavailable.
  }
}
