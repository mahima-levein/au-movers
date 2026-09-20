import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";

type QuoteFormData = {
  name: string;
  email: string;
  moveType: string;
  from: string;
  to: string;
  movingDate: string;
};

type FieldName = keyof QuoteFormData;
type FormErrors = Partial<Record<FieldName, string>>;

const initialData: QuoteFormData = {
  name: "",
  email: "",
  moveType: "",
  from: "",
  to: "",
  movingDate: "",
};

const fields: {
  name: FieldName;
  label: string;
  type?: string;
  placeholder?: string;
}[] = [
  { name: "name", label: "Your Name", placeholder: "Your Name" },
  {
    name: "email",
    label: "Your Email",
    type: "email",
    placeholder: "Your Email",
  },
  { name: "moveType", label: "Move Type" },
  { name: "from", label: "From", placeholder: "From" },
  { name: "to", label: "To", placeholder: "To" },
  { name: "movingDate", label: "Moving Date", type: "date" },
];

const moveTypes = [
  "Residential Moving",
  "Commercial Moving",
  "Local Moving",
  "Long-Distance Moving",
  "Packing & Unpacking",
];

const controlClass =
  "h-12 w-full rounded-xl border border-[#d9d8d6] bg-white px-4 text-sm text-[#203b3b] outline-none transition-colors placeholder:text-[#9a9ea0] focus:border-[#203b3b] focus:ring-2 focus:ring-[#203b3b]/15 aria-invalid:border-red-600 aria-invalid:focus:ring-red-600/15";

function validate(data: QuoteFormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!data.moveType) errors.moveType = "Please select a move type.";
  if (!data.from.trim()) errors.from = "Please enter your starting location.";
  if (!data.to.trim()) errors.to = "Please enter your destination.";
  if (!data.movingDate) errors.movingDate = "Please select a moving date.";
  return errors;
}

async function submitQuoteRequest(
  payload: QuoteFormData & { submittedAt: string },
) {
  console.log("Quote request payload:", payload);
  await new Promise((resolve) => setTimeout(resolve, 450));
}

export default function QuoteForm() {
  const [formData, setFormData] = useState<QuoteFormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function updateField(name: FieldName, value: string) {
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSubmitted(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validate(formData);
    setErrors(nextErrors);
    setSubmitted(false);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await submitQuoteRequest({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        from: formData.from.trim(),
        to: formData.to.trim(),
        submittedAt: new Date().toISOString(),
      });
      setFormData(initialData);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-9 sm:mt-10" noValidate onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-x-3 gap-y-3 text-left md:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => {
          const id = `quote-${field.name}`;
          const errorId = `${id}-error`;
          const commonProps = {
            id,
            name: field.name,
            value: formData[field.name],
            required: true,
            "aria-invalid": Boolean(errors[field.name]) as boolean,
            "aria-describedby": errors[field.name] ? errorId : undefined,
            className: controlClass,
          };

          return (
            <div key={field.name}>
              <label className="sr-only" htmlFor={id}>
                {field.label}
              </label>
              {field.name === "moveType" ? (
                <select
                  {...commonProps}
                  onChange={(event) =>
                    updateField(field.name, event.target.value)
                  }
                >
                  <option value="">Select Move Type</option>
                  {moveTypes.map((moveType) => (
                    <option key={moveType} value={moveType}>
                      {moveType}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  {...commonProps}
                  type={field.type ?? "text"}
                  placeholder={field.placeholder}
                  onChange={(event) =>
                    updateField(field.name, event.target.value)
                  }
                />
              )}
              {errors[field.name] && (
                <p id={errorId} className="mt-1 text-xs text-red-700">
                  {errors[field.name]}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 inline-flex min-h-[50px] cursor-pointer items-center gap-3 rounded-full bg-[#f0c653] py-1 pr-[5px] pl-6 text-sm font-semibold text-[#263735] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e6b83b] focus-visible:outline-2 focus-visible:outline-[#203b3b] focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Submit Request"}
        <span className="grid size-10 place-items-center rounded-full bg-[#fffdf8]">
          <ArrowRight size={19} strokeWidth={1.7} aria-hidden="true" />
        </span>
      </button>
      {submitted && (
        <p role="status" className="mt-3 text-sm text-[#203b3b]">
          Demo request captured in this browser. No request was sent.
        </p>
      )}
    </form>
  );
}
