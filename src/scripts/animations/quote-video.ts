export function initQuoteVideo() {
  const video = document.querySelector<HTMLVideoElement>(
    "#request-quote video",
  );
  const source = video?.querySelector<HTMLSourceElement>("source[data-src]");
  if (!video || !source) return;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let visible = false;

  function sync() {
    if (!visible || document.hidden || motion.matches) {
      video!.pause();
      return;
    }
    if (!source!.src) {
      source!.src = source!.dataset.src!;
      video!.load();
    }
    video!.play().catch(() => {}); // The poster remains visible if autoplay is unavailable.
  }
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  observer.observe(video);
  motion.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  document.addEventListener(
    "astro:before-swap",
    () => {
      observer.disconnect();
      video.pause();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    },
    { once: true },
  );
}
