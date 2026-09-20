import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initWhoWeAre() {
  const section = document.querySelector<HTMLElement>("#who-we-are");
  if (!section) return;

  const trustText = section.querySelector<HTMLElement>("[data-trust-text]");
  const trolley = section.querySelector<HTMLElement>("[data-moving-trolley]");
  const motion = gsap.matchMedia();

  motion.add("(prefers-reduced-motion: no-preference)", () => {
    if (trustText) {
      gsap.fromTo(
        trustText,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        },
      );
    }

    if (trolley) {
      const drift = gsap.fromTo(
        trolley,
        { x: -12 },
        {
          x: 12,
          duration: 2.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          paused: true,
        },
      );
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => drift.play(),
        onEnterBack: () => drift.play(),
        onLeave: () => drift.pause(),
        onLeaveBack: () => drift.pause(),
      });
    }
  });
}
