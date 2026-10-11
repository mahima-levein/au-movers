import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initProcessSteps() {
  const section = document.querySelector<HTMLElement>("#process-steps");
  if (!section) return;

  const steps = section.querySelectorAll<HTMLElement>("[data-process-step]");
  if (!steps.length) return;

  const motion = gsap.matchMedia();
  motion.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.from(steps, {
      opacity: 0,
      y: 16,
      duration: 0.7,
      stagger: 0.08,
      ease: "power3.out",
      clearProps: "all",
      scrollTrigger: {
        trigger: section,
        start: "top 72%",
        once: true,
      },
    });
  });
  document.addEventListener("astro:before-swap", () => motion.revert(), {
    once: true,
  });
}
