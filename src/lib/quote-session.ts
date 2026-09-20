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
    return saved?.version === 1 ? saved : createInitialQuoteSession();
  } catch {
    return createInitialQuoteSession();
  }
}

export function saveQuoteSession(session: QuoteSession) {
  sessionStorage.setItem(KEY, JSON.stringify(session));
}

export function clearQuoteSession() {
  sessionStorage.removeItem(KEY);
}
