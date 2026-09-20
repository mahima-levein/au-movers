import { useEffect, useRef, useState } from "react";
import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";
import {
  Building2,
  CalendarDays,
  Check,
  CircleCheck,
  House,
  MapPin,
  Navigation,
  Package,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import {
  propertyOptions,
  sizeOptions,
  utilityOptions,
} from "../../data/quote-options";
import {
  clearQuoteSession,
  createInitialQuoteSession,
  loadQuoteSession,
  saveQuoteSession,
} from "../../lib/quote-session";
import type {
  PropertyType,
  QuoteData,
  QuoteSession,
  UtilitySetup,
} from "../../types/quote";

const steps = [
  ["Location", MapPin],
  ["Property", House],
  ["Size", Package],
  ["Date", CalendarDays],
  ["Utilities", Zap],
  ["Contact", UserRound],
] as const;

const fieldClass =
  "h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 text-sm text-[#203b3b] outline-none focus:border-[#203b3b] focus:ring-2 focus:ring-[#203b3b]/15";

function isoDate(date: Date) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
}

function displayValue(value: string | null) {
  if (!value) return "Pending";
  return value
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function QuoteModal() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<QuoteSession>(
    createInitialQuoteSession,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [months, setMonths] = useState(2);
  const [ready, setReady] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setSession(loadQuoteSession());
    const resize = () => setMonths(window.innerWidth < 720 ? 1 : 2);
    const show = (event: Event) => {
      triggerRef.current =
        (event as CustomEvent).detail?.trigger ?? document.activeElement;
      setSession(loadQuoteSession());
      setOpen(true);
    };
    const click = (event: MouseEvent) => {
      const trigger = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-open-quote]",
      );
      if (!trigger) return;
      event.preventDefault();
      triggerRef.current = trigger;
      setSession(loadQuoteSession());
      setOpen(true);
    };
    setReady(true);
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("anp:open-quote", show);
    document.addEventListener("click", click);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("anp:open-quote", show);
      document.removeEventListener("click", click);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => dialogRef.current?.focus());
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = [
          ...dialogRef.current.querySelectorAll<HTMLElement>(
            'button, input, [href], select, [tabindex]:not([tabindex="-1"])',
          ),
        ].filter((item) => !item.hasAttribute("disabled"));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable.at(-1)!;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", keydown);
    };
  }, [open]);

  useEffect(() => {
    if (ready && typeof sessionStorage !== "undefined")
      saveQuoteSession(session);
  }, [ready, session]);

  function close() {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function updateData(update: Partial<QuoteData>) {
    setSession((current) => ({
      ...current,
      data: { ...current.data, ...update },
    }));
  }

  function goToStep(step: number) {
    if (step <= session.highestReachedStep)
      setSession((current) => ({ ...current, currentStep: step }));
  }

  function advance(step: number) {
    setSession((current) => ({
      ...current,
      currentStep: step,
      highestReachedStep: Math.max(current.highestReachedStep, step),
    }));
  }

  function choose(update: Partial<QuoteData>, next: number) {
    updateData(update);
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 180;
    window.setTimeout(() => advance(next), delay);
  }

  function chooseProperty(value: PropertyType) {
    const changed = data.propertyType !== value;
    setSession((current) => ({
      ...current,
      data: {
        ...current.data,
        propertyType: value,
        moveSize: changed ? null : current.data.moveSize,
      },
      highestReachedStep: changed ? 2 : current.highestReachedStep,
    }));
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 180;
    window.setTimeout(() => advance(2), delay);
  }

  function reset() {
    if (!window.confirm("Start over and clear this quote?")) return;
    clearQuoteSession();
    setErrors({});
    setSession(createInitialQuoteSession());
  }

  function nextLocation() {
    const nextErrors: Record<string, string> = {};
    if (!session.data.fromLocation.trim())
      nextErrors.fromLocation = "Enter a pickup location.";
    if (!session.data.toLocation.trim())
      nextErrors.toLocation = "Enter a destination.";
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) advance(1);
  }

  async function submit() {
    const { fullName, email, phone } = session.data;
    const nextErrors: Record<string, string> = {};
    if (!fullName.trim()) nextErrors.fullName = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      nextErrors.email = "Enter a valid email.";
    if (phone.replace(/\D/g, "").length < 9)
      nextErrors.phone = "Enter a valid Australian phone number.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    console.log("ANP Movers quote request:", {
      ...session.data,
      phone: phone.replace(/\s/g, ""),
      submittedAt: new Date().toISOString(),
    });
    setSession((current) => ({ ...current, completed: true }));
    setSubmitting(false);
  }

  if (!open) return null;

  const data = session.data;
  const selectedDate = data.moveDate
    ? new Date(`${data.moveDate}T00:00:00`)
    : undefined;
  const contactDone = Boolean(
    data.fullName &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
    data.phone.replace(/\D/g, "").length >= 9,
  );
  const summary = [
    ["Pickup From", data.fromLocation, 0, MapPin],
    ["Delivery To", data.toLocation, 0, Navigation],
    ["Property Type", data.propertyType, 1, House],
    ["Move Size", data.moveSize, 2, Package],
    ["Move Date", data.moveDate, 3, CalendarDays],
    ["Utility Setup", data.utilitySetup, 4, Zap],
    ["Contact Details", contactDone ? data.fullName : null, 5, UserRound],
  ] as const;
  const progress = Math.round(
    (summary.filter((item) => item[1]).length / summary.length) * 100,
  );

  const optionCards = (
    options: { value: string; title: string; description?: string }[],
    selected: string | null,
    onSelect: (value: string) => void,
  ) => (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={`relative min-h-28 rounded-2xl border p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#f0c653] hover:shadow-md ${selected === option.value ? "border-[#f0c653] bg-[#f0c653]/15" : "border-neutral-200 bg-white"}`}
        >
          {selected === option.value && (
            <Check
              className="absolute top-3 right-3 text-[#203b3b]"
              size={18}
            />
          )}
          <strong className="block text-[#203b3b]">{option.title}</strong>
          {option.description && (
            <span className="mt-1 block text-sm text-neutral-500">
              {option.description}
            </span>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/55 p-2 backdrop-blur-sm sm:p-4"
      onMouseDown={(event) => event.target === event.currentTarget && close()}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-modal-title"
        className="max-h-[calc(100dvh-16px)] w-full max-w-[1180px] overflow-y-auto rounded-2xl bg-[#faf8f5] shadow-2xl outline-none sm:max-h-[92dvh] sm:rounded-[28px]"
      >
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-neutral-200 bg-[#faf8f5]/95 px-4 py-3 backdrop-blur sm:px-7">
          <div>
            <span className="text-xs font-semibold tracking-widest text-[#f0b92f] uppercase">
              ANP Movers
            </span>
            <h2
              id="quote-modal-title"
              className="text-lg font-semibold text-[#203b3b]"
            >
              Get Your Free Moving Quote
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close quote modal"
            className="grid size-10 place-items-center rounded-full bg-white text-[#203b3b] hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-[#f0c653]"
          >
            <X size={20} />
          </button>
        </header>

        {session.completed ? (
          <div className="grid min-h-[520px] place-items-center p-6 text-center">
            <div>
              <span className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                <CircleCheck size={42} />
              </span>
              <h3 className="mt-6 text-4xl font-semibold text-[#203b3b]">
                Thank You!
              </h3>
              <p className="mx-auto mt-3 max-w-md text-neutral-600">
                Your quote details are ready in this demo.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <button
                  onClick={close}
                  className="rounded-full border border-neutral-300 px-6 py-3 font-semibold text-[#203b3b]"
                >
                  Close
                </button>
                <button
                  onClick={reset}
                  className="rounded-full bg-[#f0c653] px-6 py-3 font-semibold text-[#203b3b]"
                >
                  Start New Quote
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-7">
            <nav className="overflow-x-auto pb-2" aria-label="Quote progress">
              <ol className="relative mx-auto flex min-w-[560px] max-w-4xl items-start justify-between">
                <li
                  className="pointer-events-none absolute top-5 right-[8.333%] left-[8.333%] h-0.5 -translate-y-1/2 overflow-hidden bg-neutral-200"
                  aria-hidden="true"
                >
                  <span
                    className="block h-full bg-emerald-600 transition-[width] duration-300 motion-reduce:transition-none"
                    style={{
                      width: `${(session.currentStep / (steps.length - 1)) * 100}%`,
                    }}
                  />
                </li>
                {steps.map(([label, Icon], index) => {
                  const reached = index <= session.highestReachedStep;
                  const completed = index < session.currentStep;
                  return (
                    <li
                      key={label}
                      className="relative z-10 flex flex-1 flex-col items-center"
                    >
                      <button
                        type="button"
                        disabled={!reached}
                        onClick={() => goToStep(index)}
                        className="group flex flex-col items-center gap-1.5 disabled:cursor-not-allowed"
                      >
                        <span
                          className={`grid size-10 place-items-center rounded-full border ${completed ? "border-emerald-600 bg-emerald-600 text-white" : index === session.currentStep ? "border-[#f0c653] bg-[#f0c653] text-[#203b3b]" : "border-neutral-300 bg-white text-neutral-400"}`}
                        >
                          {completed ? <Check size={18} /> : <Icon size={18} />}
                        </span>
                        <span
                          className={`text-[11px] font-semibold sm:text-xs ${completed ? "text-emerald-700" : index === session.currentStep ? "text-[#203b3b]" : "text-neutral-400"}`}
                        >
                          {label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <main className="mx-auto mt-5 max-w-4xl rounded-3xl bg-white p-5 shadow-sm sm:p-8">
              {session.currentStep === 0 && (
                <>
                  <h3 className="text-2xl font-semibold text-[#203b3b]">
                    Get a Free Moving Quote
                  </h3>
                  <p className="mt-1 text-sm text-neutral-500">
                    Tell us where you’re moving from and where you’re moving to.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {[
                      ["fromLocation", "Moving From"],
                      ["toLocation", "Moving To"],
                    ].map(([key, label]) => (
                      <label
                        key={key}
                        className="text-sm font-semibold text-[#203b3b]"
                      >
                        {label} *
                        <span className="relative mt-2 block">
                          <MapPin
                            className="absolute top-3.5 left-3 text-neutral-400"
                            size={18}
                          />
                          <input
                            value={data[key as "fromLocation" | "toLocation"]}
                            onChange={(event) => {
                              updateData({ [key]: event.target.value });
                              setErrors({});
                            }}
                            className={`${fieldClass} pl-10`}
                            placeholder={label}
                            aria-invalid={Boolean(errors[key])}
                          />
                        </span>
                        {errors[key] && (
                          <span className="mt-1 block text-xs text-red-600">
                            {errors[key]}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                  <button
                    onClick={nextLocation}
                    className="mt-6 rounded-full bg-[#f0c653] px-7 py-3 font-semibold text-[#203b3b]"
                  >
                    Next
                  </button>
                </>
              )}
              {session.currentStep === 1 && (
                <>
                  <h3 className="text-2xl font-semibold text-[#203b3b]">
                    What type of property?
                  </h3>
                  <p className="mt-1 mb-6 text-sm text-neutral-500">
                    Select the property you’re moving from.
                  </p>
                  {optionCards(propertyOptions, data.propertyType, (value) => {
                    chooseProperty(value as PropertyType);
                  })}
                </>
              )}
              {session.currentStep === 2 && data.propertyType && (
                <>
                  <h3 className="text-2xl font-semibold text-[#203b3b]">
                    Size of your move?
                  </h3>
                  <p className="mt-1 mb-6 text-sm text-neutral-500">
                    Help us match the right truck and team.
                  </p>
                  {optionCards(
                    sizeOptions[data.propertyType],
                    data.moveSize,
                    (value) => choose({ moveSize: value }, 3),
                  )}
                </>
              )}
              {session.currentStep === 3 && (
                <>
                  <h3 className="text-2xl font-semibold text-[#203b3b]">
                    When are you moving?
                  </h3>
                  <p className="mt-1 mb-4 text-sm text-neutral-500">
                    Pick your preferred moving date.
                  </p>
                  <div className="overflow-hidden rounded-2xl border border-neutral-200 p-2 [--rdp-accent-color:#203b3b] [--rdp-accent-background-color:#f0c653] sm:p-4">
                    <DayPicker
                      className="w-full"
                      styles={{
                        root: { width: "100%" },
                        months: {
                          display: "grid",
                          gridTemplateColumns: `repeat(${months}, minmax(0, 1fr))`,
                          width: "100%",
                          maxWidth: "none",
                          gap: months === 1 ? "0" : "clamp(1.5rem, 5vw, 4rem)",
                        },
                        month: { width: "100%", minWidth: 0 },
                        month_grid: { width: "100%", tableLayout: "fixed" },
                        day: { width: "auto" },
                      }}
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) =>
                        date && choose({ moveDate: isoDate(date) }, 4)
                      }
                      disabled={{ before: new Date() }}
                      numberOfMonths={months}
                    />
                  </div>
                </>
              )}
              {session.currentStep === 4 && (
                <>
                  <h3 className="text-2xl font-semibold text-[#203b3b]">
                    Electricity, Gas & Internet
                  </h3>
                  <p className="mt-1 mb-6 text-sm text-neutral-500">
                    Record any utility setup preference for your new property.
                  </p>
                  {optionCards(utilityOptions, data.utilitySetup, (value) =>
                    choose({ utilitySetup: value as UtilitySetup }, 5),
                  )}
                </>
              )}
              {session.currentStep === 5 && (
                <>
                  <h3 className="text-2xl font-semibold text-[#203b3b]">
                    Almost there!
                  </h3>
                  <p className="mt-1 text-sm text-neutral-500">
                    Add your contact details so we can prepare your moving
                    request.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {[
                      ["fullName", "Full Name", "text"],
                      ["email", "Email Address", "email"],
                      ["phone", "Phone Number", "tel"],
                    ].map(([key, label, type]) => (
                      <label
                        key={key}
                        className="text-sm font-semibold text-[#203b3b]"
                      >
                        {label} *
                        <input
                          type={type}
                          value={data[key as "fullName" | "email" | "phone"]}
                          onChange={(event) => {
                            updateData({ [key]: event.target.value });
                            setErrors({});
                          }}
                          className={`${fieldClass} mt-2`}
                          placeholder={key === "phone" ? "04XX XXX XXX" : label}
                          aria-invalid={Boolean(errors[key])}
                        />
                        {errors[key] && (
                          <span className="mt-1 block text-xs text-red-600">
                            {errors[key]}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={submit}
                    className="mt-6 rounded-full bg-[#f0c653] px-7 py-3 font-semibold text-[#203b3b] disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Submit Request"}
                  </button>
                </>
              )}
            </main>

            <section
              className="mx-auto mt-5 max-w-7xl rounded-3xl bg-[#203b3b] p-5 text-white sm:p-7 hidden lg:block"
              aria-labelledby="move-summary-heading"
            >
              <div className="flex items-center justify-between">
                <h3 id="move-summary-heading" className="text-lg font-semibold">
                  Move Summary
                </h3>
                <span className="font-semibold text-[#f0c653]">
                  {progress}%
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-[#f0c653] transition-[width] duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {summary.map(([label, value, step, Icon]) => (
                  <div key={label} className="rounded-2xl bg-white/8 p-3">
                    <div className="flex items-center gap-2 text-xs text-white/65">
                      <Icon size={14} />
                      {label}
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <strong className="truncate text-sm capitalize">
                        {displayValue(value)}
                      </strong>
                      {value && step <= session.highestReachedStep && (
                        <button
                          onClick={() => goToStep(step)}
                          className="text-xs text-[#f0c653] underline"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between gap-4">
                <p className="text-xs text-white/60">
                  Your information is handled securely.
                </p>
                <button
                  onClick={reset}
                  className="text-xs font-semibold text-white/75 underline hover:text-white"
                >
                  Start Over
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
