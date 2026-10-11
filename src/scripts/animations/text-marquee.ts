import gsap from "gsap";

export function initTextMarquee() {
  document
    .querySelectorAll<HTMLElement>("[data-text-marquee]")
    .forEach((marquee) => {
      const track = marquee.querySelector<HTMLElement>("[data-marquee-track]");
      const firstSet = marquee.querySelector<HTMLElement>("[data-marquee-set]");
      if (!track || !firstSet) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
      let tween: gsap.core.Tween | undefined;
      let frame = 0;
      let visible = false;
      const syncPlayback = () => tween?.paused(!visible || document.hidden);

      function rebuild() {
        const progress = tween?.progress() ?? 0;
        tween?.kill();
        tween = undefined;
        gsap.set(track, { x: 0 });
        if (reducedMotion.matches) return;

        const distance = firstSet.getBoundingClientRect().width;
        if (!distance) return;
        tween = gsap.fromTo(
          track,
          { x: 0 },
          {
            x: -distance,
            duration: distance / 80,
            ease: "none",
            repeat: -1,
          },
        );
        tween.progress(progress);
        syncPlayback();
      }

      function scheduleRebuild() {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(rebuild);
      }

      const observer = new ResizeObserver(scheduleRebuild);
      observer.observe(firstSet);
      const visibility = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        syncPlayback();
      });
      visibility.observe(marquee);
      document.addEventListener("visibilitychange", syncPlayback);
      reducedMotion.addEventListener("change", scheduleRebuild);
      scheduleRebuild();
      document.addEventListener(
        "astro:before-swap",
        () => {
          cancelAnimationFrame(frame);
          tween?.kill();
          observer.disconnect();
          visibility.disconnect();
          reducedMotion.removeEventListener("change", scheduleRebuild);
          document.removeEventListener("visibilitychange", syncPlayback);
        },
        { once: true },
      );
    });
}
