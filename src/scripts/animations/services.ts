import gsap from "gsap";

export function initServices() {
  const section = document.querySelector<HTMLElement>("#services");
  if (!section) return;

  const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  section
    .querySelectorAll<HTMLElement>("[data-service-card]")
    .forEach((card) => {
      const image = card.querySelector<HTMLElement>("[data-service-image]");
      const panel = card.querySelector<HTMLElement>("[data-service-panel]");
      const bubble = card.querySelector<HTMLElement>("[data-service-bubble]");
      const icon = card.querySelector<HTMLElement>("[data-service-icon]");
      const number = card.querySelector<HTMLElement>("[data-service-number]");
      const title = card.querySelector<HTMLElement>("[data-service-title]");
      const description = card.querySelector<HTMLElement>(
        "[data-service-description]",
      );
      if (
        !image ||
        !panel ||
        !bubble ||
        !icon ||
        !number ||
        !title ||
        !description
      )
        return;

      const panelHover = gsap.timeline({ paused: true });
      panelHover
        // A 96px circle scaled 10x covers the panel at every card breakpoint.
        .to(bubble, { scale: 10, duration: 0.6, ease: "power3.out" })
        .to(
          [icon, number, title, description],
          { color: "#1d2626", duration: 0.25 },
          0.2,
        );

      const blurPulse = gsap.timeline({ paused: true });
      blurPulse
        .to(image, { filter: "blur(8px)", duration: 0.25, ease: "power2.out" })
        .to(image, { filter: "blur(0px)", duration: 0.65, ease: "power2.out" });

      card.addEventListener("pointerenter", () => {
        if (!hover.matches) return;
        if (reducedMotion.matches) {
          panelHover.progress(1).pause();
          return;
        }
        panelHover.play();
        blurPulse.pause(0).restart();
      });

      card.addEventListener("pointerleave", () => {
        if (!hover.matches) return;
        blurPulse.pause(0);
        gsap.set(image, { filter: "blur(0px)" });
        if (reducedMotion.matches) panelHover.progress(0).pause();
        else panelHover.reverse();
      });
    });

  const slider = section.querySelector<HTMLElement>("[data-services-slider]");
  if (!slider) return;
  const originals = [
    ...slider.querySelectorAll<HTMLElement>('[data-service-set="original"]'),
  ];
  const firstCopy = slider.querySelector<HTMLElement>(
    '[data-service-set="duplicate"]',
  );
  const dots = [
    ...section.querySelectorAll<HTMLButtonElement>("[data-service-dot]"),
  ];
  if (originals.length < 2 || !firstCopy) return;

  let visible = false;
  let hovering = false;
  let interacting = false;
  let advanceTimer: ReturnType<typeof setTimeout> | undefined;
  let settleTimer: ReturnType<typeof setTimeout> | undefined;
  let resumeTimer: ReturnType<typeof setTimeout> | undefined;
  let scrollFrame = 0;

  function loopWidth() {
    return firstCopy!.offsetLeft - originals[0].offsetLeft;
  }

  function normalizePosition() {
    const width = loopWidth();
    if (width > 0 && slider!.scrollLeft >= width - 2) {
      slider!.scrollLeft -= width;
    }
  }

  function activeIndex() {
    const width = loopWidth();
    const normalized = width > 0 ? slider!.scrollLeft % width : 0;
    const start = originals[0].offsetLeft;
    return originals.reduce((nearest, card, index) => {
      const position = card.offsetLeft - start;
      const nearestPosition = originals[nearest].offsetLeft - start;
      const distance = Math.min(
        Math.abs(position - normalized),
        Math.abs(position + width - normalized),
      );
      const nearestDistance = Math.min(
        Math.abs(nearestPosition - normalized),
        Math.abs(nearestPosition + width - normalized),
      );
      return distance < nearestDistance ? index : nearest;
    }, 0);
  }

  function updateDots(index = activeIndex()) {
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === index;
      dot.setAttribute("aria-current", active ? "true" : "false");
      dot.classList.toggle("w-7", active);
      dot.classList.toggle("bg-[#f0c653]", active);
      dot.classList.toggle("w-2.5", !active);
      dot.classList.toggle("bg-white/35", !active);
    });
  }

  function canAdvance() {
    return (
      visible &&
      !hovering &&
      !interacting &&
      !reducedMotion.matches &&
      !document.hidden
    );
  }

  function pause() {
    clearTimeout(advanceTimer);
    clearTimeout(settleTimer);
  }

  function schedule() {
    pause();
    if (canAdvance()) advanceTimer = setTimeout(advance, 2800);
  }

  function advance() {
    if (!canAdvance()) return;
    normalizePosition();
    const start = originals[0].offsetLeft;
    const positions = [
      ...originals.map((card) => card.offsetLeft - start),
      loopWidth(),
    ];
    const current = positions.reduce(
      (nearest, position, index) =>
        Math.abs(position - slider!.scrollLeft) <
        Math.abs(positions[nearest] - slider!.scrollLeft)
          ? index
          : nearest,
      0,
    );
    const next = Math.min(current + 1, originals.length);
    slider!.scrollTo({ left: positions[next], behavior: "smooth" });
    settleTimer = setTimeout(() => {
      if (next === originals.length) normalizePosition();
      schedule();
    }, 850);
  }

  function pauseForInteraction() {
    interacting = true;
    pause();
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      interacting = false;
      normalizePosition();
      schedule();
    }, 5000);
  }

  slider.addEventListener("pointerenter", () => {
    if (!hover.matches) return;
    hovering = true;
    pause();
  });
  slider.addEventListener("pointerleave", () => {
    hovering = false;
    schedule();
  });
  slider.addEventListener("focusin", () => {
    hovering = true;
    pause();
  });
  slider.addEventListener("focusout", () => {
    hovering = false;
    schedule();
  });
  slider.addEventListener("pointerdown", pauseForInteraction);
  slider.addEventListener("wheel", pauseForInteraction, { passive: true });
  slider.addEventListener("keydown", pauseForInteraction);
  slider.addEventListener(
    "scroll",
    () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => updateDots());
    },
    { passive: true },
  );
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      pauseForInteraction();
      normalizePosition();
      updateDots(index);
      slider.scrollTo({
        left: originals[index].offsetLeft - originals[0].offsetLeft,
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
    });
  });
  reducedMotion.addEventListener("change", schedule);
  document.addEventListener("visibilitychange", schedule);

  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
      else pause();
    },
    { threshold: 0.2 },
  );
  observer.observe(slider);
}
