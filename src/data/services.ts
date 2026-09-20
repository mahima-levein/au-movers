import type { ImageMetadata } from "astro";
import commercialImage from "../assets/vertical-g2.jpg";
import furnitureImage from "../assets/vertical-g3.jpg";
import localImage from "../assets/vertical-g1.jpg";
import longDistanceImage from "../assets/vertical-g6.jpg";
import packingImage from "../assets/vertical-g5.jpg";

export type ServiceIcon =
  "building" | "package" | "map-pin" | "truck" | "package-check";

export type ServiceItem = {
  id: string;
  number: string;
  title: string;
  description: string;
  image: ImageMetadata;
  icon: ServiceIcon;
  href?: string;
};

export const services: ServiceItem[] = [
  {
    id: "commercial-moving",
    number: "02",
    title: "Commercial Moving",
    description: "Moving support for offices and commercial spaces.",
    image: commercialImage,
    icon: "building",
  },
  {
    id: "furniture-disassembly",
    number: "03",
    title: "Furniture Disassembly",
    description: "Help with taking furniture apart before a move.",
    image: furnitureImage,
    icon: "package",
  },
  {
    id: "local-moving",
    number: "04",
    title: "Local Moving",
    description: "Moving support for shorter journeys nearby.",
    image: localImage,
    icon: "map-pin",
  },
  {
    id: "long-distance-moving",
    number: "05",
    title: "Long-Distance Moving",
    description: "Planning and transport for moves over longer distances.",
    image: longDistanceImage,
    icon: "truck",
  },
  {
    id: "packing-unpacking",
    number: "06",
    title: "Packing & Unpacking",
    description: "Support with packing boxes and settling in after a move.",
    image: packingImage,
    icon: "package-check",
  },
];
