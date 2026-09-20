import gsap from "gsap";

export function initHeroGallery() {
  const gallery = document.querySelector<HTMLElement>("#home-hero");
  if (!gallery) return;

  const columns = [
    ...gallery.querySelectorAll<HTMLElement>("[data-hero-marquee]"),
  ];
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let tweens: gsap.core.Tween[] = [];
  let frame = 0;

  function rebuild() {
    tweens.forEach((tween) => tween.kill());
    tweens = [];

    for (const column of columns) {
      const track = column.querySelector<HTMLElement>(".hero-gallery-track");
      const firstSet = column.querySelector<HTMLElement>(".hero-gallery-set");
      if (!track || !firstSet) continue;
      gsap.set(track, { clearProps: "transform" });
      if (motion.matches) continue;

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
      tweens.push(
        gsap.fromTo(
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
          },
        ),
      );
    }
  }

  function scheduleRebuild() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(rebuild);
  }

  const observer = new ResizeObserver(scheduleRebuild);
  columns.forEach((column) =>
    observer.observe(column.querySelector(".hero-gallery-set")!),
  );
  motion.addEventListener("change", scheduleRebuild);
  scheduleRebuild();
}
