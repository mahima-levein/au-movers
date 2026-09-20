import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initImageFillText() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  document
    .querySelectorAll<HTMLElement>("[data-image-fill-text]")
    .forEach((text) => {
      if (reducedMotion.matches) return;
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
}
