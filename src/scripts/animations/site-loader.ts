import gsap from "gsap";

export function initSiteLoader() {
  const loader = document.querySelector<HTMLElement>("[data-site-loader]");
  if (!loader) return;

  const truck = loader.querySelector<HTMLElement>("[data-loader-truck]");
  const letters = loader.querySelectorAll<HTMLElement>("[data-loader-letter]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const previousOverflow = document.body.style.overflow;

  document.body.style.overflow = "hidden";
  document.body.setAttribute("aria-busy", "true");

  function finish() {
    document.body.style.overflow = previousOverflow;
    document.body.removeAttribute("aria-busy");
    loader.remove();
  }

  if (reducedMotion.matches) {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.2,
      delay: 0.35,
      onComplete: finish,
    });
    return;
  }

  const timeline = gsap.timeline({ onComplete: finish });
  timeline
    .fromTo(
      truck,
      { opacity: 0, scale: 0.92, y: 12 },
      { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: "power3.out" },
    )
    .fromTo(
      letters,
      { opacity: 0, y: 20, rotateX: -70 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.48,
        stagger: 0.055,
        ease: "back.out(1.8)",
      },
      0.28,
    )
    .to(truck, { y: -5, duration: 0.32, ease: "power2.inOut" }, 1.15)
    .to(truck, { y: 0, duration: 0.32, ease: "power2.inOut" })
    .to({}, { duration: 0.35 })
    .to(loader, {
      yPercent: -100,
      duration: 0.72,
      ease: "power4.inOut",
    });
}
