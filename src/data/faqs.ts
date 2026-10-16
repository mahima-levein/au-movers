export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    id: "booking-date",
    question: "How early should I book my moving date?",
    answer:
      "Booking early helps secure your preferred moving date, especially during weekends and peak moving periods.",
  },
  {
    id: "packing-services",
    question: "Should I pack myself or pay for packing services?",
    answer:
      "You can pack your own belongings, or choose professional packing support for a faster and more carefully organized move.",
  },
  {
    id: "large-items",
    question: "Can you move large items like pianos or safes?",
    answer:
      "Contact ANP Movers before booking a piano, safe or other heavy item. Tell us the item size, stairs and access details so we can discuss whether suitable equipment and handling can be arranged.",
  },
  {
    id: "self-pack-or-movers",
    question: "What details should I provide when discussing a moving quote?",
    answer:
      "Provide your pickup and destination, property type and size, preferred moving date, access details and packing needs. Call 0451 004 235 or use WhatsApp to discuss availability and pricing with ANP Movers.",
  },
];
