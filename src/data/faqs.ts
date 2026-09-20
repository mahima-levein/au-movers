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
      "Large and heavy items can be handled when the correct equipment, access planning, and moving team are arranged in advance.",
  },
  {
    id: "self-pack-or-movers",
    question: "Should I pack my belongings myself or let the movers do it?",
    answer:
      "That depends on your time, budget, and the level of protection you want for fragile or valuable items.",
  },
];
