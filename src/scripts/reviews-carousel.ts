export function initReviewsCarousel() {
  const section = document.querySelector<HTMLElement>("#customer-reviews");
  const slider = section?.querySelector<HTMLElement>("[data-reviews-slider]");
  if (!section || !slider) return;
  const cards = [
    ...section.querySelectorAll<HTMLElement>("[data-review-card]"),
  ];
  const dots = [
    ...section.querySelectorAll<HTMLButtonElement>("[data-review-dot]"),
  ];
  const controls = section.querySelector<HTMLElement>(
    "[data-reviews-controls]",
  );
  const playback = section.querySelector<HTMLButtonElement>(
    "[data-review-playback]",
  );
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const listeners = new AbortController();
  const options = { signal: listeners.signal };
  let stops: number[] = [];
  let active = 0;
  let visible = false;
  let hovered = false;
  let touching = false;
  let paused = false;
  let frame = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;

  function schedule() {
    clearTimeout(timer);
    if (
      stops.length < 2 ||
      !visible ||
      hovered ||
      touching ||
      paused ||
      motion.matches ||
      document.hidden ||
      section!.contains(document.activeElement)
    )
      return;
    timer = setTimeout(() => goTo((active + 1) % stops.length), 5000);
  }
  function updateDots() {
    active = stops.reduce(
      (nearest, stop, index) =>
        Math.abs(stop - slider!.scrollLeft) <
        Math.abs(stops[nearest] - slider!.scrollLeft)
          ? index
          : nearest,
      0,
    );
    dots.forEach((dot, index) =>
      dot.setAttribute("aria-current", String(index === active)),
    );
  }
  function goTo(index: number) {
    slider!.scrollTo({
      left: stops[index] ?? 0,
      behavior: motion.matches ? "auto" : "smooth",
    });
    schedule();
  }
  function measure() {
    const maxScroll = Math.max(0, slider!.scrollWidth - slider!.clientWidth);
    const padding = parseFloat(getComputedStyle(slider!).paddingLeft) || 0;
    stops = cards
      .map((card) =>
        Math.min(
          maxScroll,
          Math.max(
            0,
            card.getBoundingClientRect().left -
              slider!.getBoundingClientRect().left +
              slider!.scrollLeft -
              padding,
          ),
        ),
      )
      .filter(
        (stop, index, positions) =>
          index === 0 || stop - positions[index - 1] > 1,
      );
    dots.forEach((dot, index) => {
      dot.hidden = index >= stops.length;
      dot.setAttribute(
        "aria-label",
        `Go to review position ${index + 1} of ${stops.length}`,
      );
    });
    if (controls) controls.hidden = stops.length < 2;
    updateDots();
    syncPlayback();
  }
  function syncPlayback() {
    if (playback) {
      playback.hidden = motion.matches;
      playback.setAttribute("aria-pressed", String(paused));
      playback.setAttribute(
        "aria-label",
        paused
          ? "Resume automatic review scrolling"
          : "Pause automatic review scrolling",
      );
    }
    schedule();
  }
  dots.forEach((dot, index) =>
    dot.addEventListener("click", () => goTo(index), options),
  );
  playback?.addEventListener(
    "click",
    () => {
      paused = !paused;
      syncPlayback();
    },
    options,
  );
  slider.addEventListener(
    "scroll",
    () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateDots);
      schedule();
    },
    { ...options, passive: true },
  );
  section.addEventListener(
    "pointerenter",
    (event) => {
      if (event.pointerType === "mouse") {
        hovered = true;
        schedule();
      }
    },
    options,
  );
  section.addEventListener(
    "pointerleave",
    () => {
      hovered = false;
      schedule();
    },
    options,
  );
  slider.addEventListener(
    "pointerdown",
    () => {
      touching = true;
      schedule();
    },
    options,
  );
  window.addEventListener(
    "pointerup",
    () => {
      touching = false;
      schedule();
    },
    options,
  );
  window.addEventListener(
    "pointercancel",
    () => {
      touching = false;
      schedule();
    },
    options,
  );
  section.addEventListener("focusin", schedule, options);
  section.addEventListener("focusout", () => queueMicrotask(schedule), options);
  document.addEventListener("visibilitychange", schedule, options);
  motion.addEventListener("change", syncPlayback, options);
  const resize = new ResizeObserver(measure);
  resize.observe(slider);
  cards.forEach((card) => resize.observe(card));
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    schedule();
  });
  visibility.observe(section);
  measure();
  document.addEventListener(
    "astro:before-swap",
    () => {
      listeners.abort();
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
    },
    { once: true },
  );
}
