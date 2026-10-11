import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initImageFillText() {
  const motion = gsap.matchMedia();
  motion.add("(prefers-reduced-motion: no-preference)", () => {
    document
      .querySelectorAll<HTMLElement>("[data-image-fill-text]")
      .forEach((text) => {
        gsap.fromTo(
          text,
          { "--image-y": "20%" },
          {
            "--image-y": "80%",
            ease: "none",
            scrollTrigger: {
              trigger: text,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          },
        );
      });
  });
  document.addEventListener("astro:before-swap", () => motion.revert(), {
    once: true,
  });
}
