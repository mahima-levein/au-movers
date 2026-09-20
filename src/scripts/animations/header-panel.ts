import gsap from "gsap";

export function initHeaderPanel() {
  const trigger = document.querySelector<HTMLButtonElement>(
    "#site-header .header-menu",
  );
  const root = document.querySelector<HTMLElement>("#site-side-panel");
  if (!trigger || !root) return;

  const surface = root.querySelector<HTMLElement>(".panel-surface")!;
  const backdrop = root.querySelector<HTMLElement>(".panel-backdrop")!;
  const closeButton = root.querySelector<HTMLButtonElement>(".panel-close")!;
  const links = root.querySelectorAll<HTMLAnchorElement>("a");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let isOpen = false;
  let lastFocus: HTMLElement | null = null;

  const timeline = gsap.timeline({
    paused: true,
    onReverseComplete: finishClose,
  });
  timeline
    .fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3 })
    .fromTo(
      surface,
      { xPercent: 100 },
      { xPercent: 0, duration: 0.48, ease: "power3.out" },
      0,
    )
    .fromTo(
      root.querySelectorAll(".panel-links li"),
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.27, stagger: 0.035 },
      0.17,
    )
    .fromTo(
      root.querySelector(".panel-actions"),
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.24 },
      0.32,
    );

  function finishClose() {
    root!.hidden = true;
    document.body.style.overflow = "";
    lastFocus?.focus();
  }

  function open() {
    if (isOpen) return;
    isOpen = true;
    lastFocus = document.activeElement as HTMLElement;
    root!.hidden = false;
    trigger!.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    if (reducedMotion.matches) {
      timeline.progress(1).pause();
    } else {
      timeline.play(0);
    }
    closeButton.focus();
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    trigger!.setAttribute("aria-expanded", "false");
    if (reducedMotion.matches) {
      timeline.progress(0).pause();
      finishClose();
    } else {
      timeline.reverse();
    }
  }

  trigger.addEventListener("click", open);
  closeButton.addEventListener("click", close);
  backdrop.addEventListener("click", close);
  links.forEach((link) => link.addEventListener("click", close));
  document.addEventListener("keydown", (event) => {
    if (!isOpen) return;
    if (event.key === "Escape") close();
    if (event.key !== "Tab") return;
    const focusable = [closeButton, ...links];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}
