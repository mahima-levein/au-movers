import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initProcessSteps() {
  const section = document.querySelector<HTMLElement>("#process-steps");
  if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return;

  const steps = section.querySelectorAll<HTMLElement>("[data-process-step]");
  if (!steps.length) return;

  gsap.from(steps, {
    opacity: 0,
    y: 32,
    duration: 0.7,
    stagger: 0.18,
    ease: "power3.out",
    clearProps: "all",
    scrollTrigger: {
      trigger: section,
      start: "top 72%",
      once: true,
    },
  });
}
