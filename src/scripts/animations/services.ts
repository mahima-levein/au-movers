import gsap from "gsap";
export function initServices() {
  const section = document.querySelector<HTMLElement>("#services");
  if (!section) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
  const cards = [
    ...section.querySelectorAll<HTMLElement>("[data-service-card]"),
  ];
  cards.forEach((card) => {
    const image = card.querySelector<HTMLElement>("[data-service-image]");
    if (!image) return;
    const animate = (active: boolean) =>
      gsap.to(image, {
        scale: active && !reducedMotion.matches ? 1.04 : 1,
        duration: reducedMotion.matches ? 0 : 0.5,
        ease: "power2.out",
        overwrite: true,
      });
    card.addEventListener("pointerenter", () => {
      if (hover.matches) animate(true);
    });
    card.addEventListener("pointerleave", () =>
      animate(card.contains(document.activeElement)),
    );
    card.addEventListener("focusin", () => animate(true));
    card.addEventListener("focusout", (event) => {
      if (!card.contains(event.relatedTarget as Node | null)) animate(false);
    });
    reducedMotion.addEventListener("change", () => animate(false));
  });
  const slider = section.querySelector<HTMLElement>("[data-services-slider]");
  const dots = [
    ...section.querySelectorAll<HTMLButtonElement>("[data-service-dot]"),
  ];
  if (!slider || !cards.length) return;
  const position = (card: HTMLElement) =>
    card.getBoundingClientRect().left -
    slider.getBoundingClientRect().left +
    slider.scrollLeft;
  let stops: number[] = [];
  const updateDots = () => {
    const index = stops.reduce(
      (nearest, stop, index) =>
        Math.abs(stop - slider.scrollLeft) <
        Math.abs(stops[nearest] - slider.scrollLeft)
          ? index
          : nearest,
      0,
    );
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === index;
      dot.setAttribute("aria-current", active ? "true" : "false");
      dot.classList.toggle("w-7", active);
      dot.classList.toggle("bg-brand-gold", active);
      dot.classList.toggle("w-2.5", !active);
      dot.classList.toggle("bg-white/35", !active);
    });
  };
  const updateStops = () => {
    const maxScroll = Math.max(0, slider.scrollWidth - slider.clientWidth);
    // Several cards can share the final clamped position when multiple cards fit.
    stops = cards
      .map((card) => Math.min(maxScroll, Math.max(0, position(card))))
      .filter(
        (stop, index, positions) =>
          index === 0 || stop - positions[index - 1] > 1,
      );
    dots.forEach((dot, index) => {
      dot.hidden = index >= stops.length;
      dot.setAttribute(
        "aria-label",
        `Show moving qualities, position ${index + 1} of ${stops.length}`,
      );
    });
    updateDots();
  };
  let frame = 0;
  slider.addEventListener(
    "scroll",
    () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateDots);
    },
    { passive: true },
  );
  dots.forEach((dot, index) =>
    dot.addEventListener("click", () =>
      slider.scrollTo({
        left: stops[index] ?? 0,
        behavior: reducedMotion.matches ? "auto" : "smooth",
      }),
    ),
  );
  const observer = new ResizeObserver(updateStops);
  observer.observe(slider);
  cards.forEach((card) => observer.observe(card));
  updateStops();
}
