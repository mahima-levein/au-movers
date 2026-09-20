import type { ImageMetadata } from "astro";
import bannerImage1 from "../assets/banner-image-1.jpg";
import bannerImage2 from "../assets/banner-image-2.jpg";
import bannerImage3 from "../assets/banner-image-3.jpg";
import bannerImage4 from "../assets/banner-image-4.jpg";

export type ProjectItem = {
  id: string;
  title: string;
  description: string;
  image: ImageMetadata;
  tags: string[];
  href?: string;
};

// These project summaries are reference copy until real case studies are supplied.
export const projects: ProjectItem[] = [
  {
    id: "residential-home-move",
    title: "Complete Residential Home Move",
    description:
      "A complete household relocation handled with careful planning, packing, transport, and delivery.",
    image: bannerImage1,
    tags: ["Moving", "Residential"],
  },
  {
    id: "office-relocation",
    title: "Full Office Relocation Project Solutions",
    description:
      "A coordinated commercial move designed to reduce downtime and keep operations organized.",
    image: bannerImage2,
    tags: ["Moving", "Commercial"],
  },
  {
    id: "long-distance-household",
    title: "Long-Distance Household Move",
    description:
      "A carefully managed long-distance relocation with secure handling from pickup to delivery.",
    image: bannerImage3,
    tags: ["Moving", "Residential"],
  },
  {
    id: "apartment-house-moving",
    title: "Apartment-to-House Moving Service",
    description:
      "A smooth move into a new home with packing, transport, and placement support.",
    image: bannerImage4,
    tags: ["Moving", "Residential"],
  },
];
