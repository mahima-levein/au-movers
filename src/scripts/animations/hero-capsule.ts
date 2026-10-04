import gsap from "gsap";

export function initHeroCapsule() {
  const capsule = document.querySelector<HTMLButtonElement>(
    "#home-hero [data-hero-capsule]",
  );
  if (!capsule) return;
  const images = [
    ...capsule.querySelectorAll<HTMLImageElement>("[data-capsule-image]"),
  ];
  if (images.length < 2) return;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let current = 0;
  let visible = false;
  let paused = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let transition: gsap.core.Timeline | undefined;
  let disposed = false;

  function stop() {
    clearTimeout(timer);
    transition?.kill();
    transition = undefined;
    gsap.set(images, { opacity: 0, xPercent: 0, scale: 1, zIndex: 0 });
    gsap.set(images[current], { opacity: 1 });
  }

  function schedule() {
    clearTimeout(timer);
    if (
      !disposed &&
      visible &&
      !paused &&
      !motion.matches &&
      !document.hidden
    ) {
      timer = setTimeout(advance, 3200);
    }
  }

  async function advance() {
    const next = (current + 1) % images.length;
    try {
      await images[next].decode();
    } catch {
      schedule();
      return;
    }
    if (disposed || !visible || paused || motion.matches || document.hidden)
      return;
    const outgoing = images[current];
    const incoming = images[next];
    current = next;
    gsap.set(incoming, { opacity: 0, xPercent: 18, scale: 1.12, zIndex: 1 });
    transition = gsap
      .timeline({
        onComplete: () => {
          stop();
          schedule();
        },
      })
      .to(
        outgoing,
        {
          opacity: 0,
          xPercent: -12,
          scale: 1.04,
          duration: 0.85,
          ease: "power2.inOut",
        },
        0,
      )
      .to(
        incoming,
        {
          opacity: 1,
          xPercent: 0,
          scale: 1,
          duration: 0.85,
          ease: "power2.inOut",
        },
        0,
      );
  }

  function sync() {
    stop();
    capsule!.disabled = motion.matches;
    capsule!.setAttribute(
      "aria-label",
      motion.matches
        ? "Moving image"
        : paused
          ? "Resume rotating moving images"
          : "Pause rotating moving images",
    );
    capsule!.setAttribute("aria-pressed", String(paused));
    schedule();
  }
  const toggle = () => {
    paused = !paused;
    sync();
  };
  capsule.addEventListener("click", toggle);
  motion.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  observer.observe(capsule);
  sync();

  document.addEventListener(
    "astro:before-swap",
    () => {
      disposed = true;
      stop();
      observer.disconnect();
      capsule.removeEventListener("click", toggle);
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    },
    { once: true },
  );
}
