import type { ImageMetadata } from "astro";
import image1 from "../assets/h-1.jpg";
import image2 from "../assets/h-2.jpg";
import image3 from "../assets/h-3.jpg";
import image4 from "../assets/h-4.jpg";
import image5 from "../assets/h-5.jpg";
import image6 from "../assets/h-6.jpg";
export type ServiceIcon =
  "preparation" | "safety" | "packing" | "planning" | "communication" | "care";
export type ServiceItem = {
  id: string;
  number: string;
  title: string;
  description: string;
  image: ImageMetadata;
  icon: ServiceIcon;
};
export const services: ServiceItem[] = [
  {
    id: "preparation",
    number: "01",
    title: "Moving Day Preparation",
    description:
      "Set aside essentials and prepare your belongings for a smoother moving day.",
    image: image6,
    icon: "preparation",
  },
  {
    id: "safety",
    number: "02",
    title: "Safety at Every Step",
    description:
      "Discuss safe handling, loading and transport for your belongings.",
    image: image2,
    icon: "safety",
  },
  {
    id: "packing",
    number: "03",
    title: "Careful Packing",
    description:
      "Plan the packing and protection your furniture and fragile items need.",
    image: image5,
    icon: "packing",
  },
  {
    id: "planning",
    number: "04",
    title: "Thoughtful Move Planning",
    description:
      "Talk through access, timing and the details that matter for your move.",
    image: image1,
    icon: "planning",
  },
  {
    id: "communication",
    number: "05",
    title: "Clear Communication",
    description:
      "Get in touch with questions and discuss what to expect on moving day.",
    image: image4,
    icon: "communication",
  },
  {
    id: "care",
    number: "06",
    title: "Care for Your Space",
    description:
      "Let us know about delicate surfaces, tight corners and special handling needs.",
    image: image3,
    icon: "care",
  },
];
