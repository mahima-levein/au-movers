import gsap from "gsap";

export function initHeroGallery() {
  const gallery = document.querySelector<HTMLElement>("#home-hero");
  if (!gallery) return;

  const columns = [
    ...gallery.querySelectorAll<HTMLElement>("[data-hero-marquee]"),
  ];
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const tweens = new Map<HTMLElement, gsap.core.Tween>();
  let visible = false;
  let disposed = false;
  let frame = 0;

  function syncPlayback() {
    tweens.forEach((tween) => tween.paused(!visible || document.hidden));
  }

  function rebuild() {
    if (disposed) return;

    for (const column of columns) {
      const track = column.querySelector<HTMLElement>(".hero-gallery-track");
      const firstSet = column.querySelector<HTMLElement>(".hero-gallery-set");
      if (!track || !firstSet) continue;
      const previous = tweens.get(column);
      const progress = previous?.progress() ?? 0;
      previous?.kill();
      tweens.delete(column);
      // Hidden desktop/mobile variants must not create running animation layers.
      if (motion.matches || !column.clientWidth || !column.clientHeight) {
        gsap.set(track, { clearProps: "transform,willChange" });
        continue;
      }

      const horizontal = column.dataset.marqueeAxis === "x";
      const trackStyle = getComputedStyle(track);
      const gap =
        parseFloat(horizontal ? trackStyle.columnGap : trackStyle.rowGap) || 0;
      const bounds = firstSet.getBoundingClientRect();
      const distance = (horizontal ? bounds.width : bounds.height) + gap;
      if (!distance) continue;
      const towardStart = ["up", "left"].includes(
        column.dataset.heroMarquee ?? "",
      );
      track.style.willChange = "transform";
      tweens.set(
        column,
        gsap
          .fromTo(
            track,
            horizontal
              ? { x: towardStart ? 0 : -distance }
              : { y: towardStart ? 0 : -distance },
            {
              ...(horizontal
                ? { x: towardStart ? -distance : 0 }
                : { y: towardStart ? -distance : 0 }),
              duration: distance / 32,
              ease: "none",
              repeat: -1,
              force3D: true,
              paused: true,
            },
          )
          .progress(progress),
      );
    }
    syncPlayback();
  }

  function scheduleRebuild() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(rebuild);
  }

  const observer = new ResizeObserver(scheduleRebuild);
  columns.forEach((column) => {
    const set = column.querySelector(".hero-gallery-set");
    if (set) observer.observe(set);
  });
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncPlayback();
  });
  visibilityObserver.observe(gallery);
  document.addEventListener("visibilitychange", syncPlayback);
  motion.addEventListener("change", scheduleRebuild);
  scheduleRebuild();

  document.addEventListener(
    "astro:before-swap",
    () => {
      disposed = true;
      cancelAnimationFrame(frame);
      tweens.forEach((tween) => tween.kill());
      tweens.clear();
      observer.disconnect();
      visibilityObserver.disconnect();
      motion.removeEventListener("change", scheduleRebuild);
      document.removeEventListener("visibilitychange", syncPlayback);
    },
    { once: true },
  );
}
