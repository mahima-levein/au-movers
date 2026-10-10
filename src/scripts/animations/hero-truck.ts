import gsap from "gsap";

export function initHeroTruck() {
  const truck = document.querySelector<HTMLElement>(
    "#home-hero [data-hero-truck]",
  );
  if (!truck) return;
  const media = gsap.matchMedia();
  media.add(
    "(max-width: 620px) and (prefers-reduced-motion: no-preference)",
    () => {
      // One gentle arrival, followed by a subtle suspension bounce. Transform only.
      const arrival = gsap.fromTo(
        truck,
        { x: 22, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, delay: 0.2, ease: "power3.out" },
      );
      const idle = gsap.to(truck, {
        y: -3,
        rotation: -0.3,
        transformOrigin: "50% 85%",
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        paused: true,
      });
      const fees = document.querySelector<HTMLElement>(
        "#home-hero [data-hero-fees]",
      );
      const feesPulse = fees
        ? gsap.to(fees, {
            scale: 1.06,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            paused: true,
          })
        : null;
      let visible = false;
      const sync = () => {
        const paused = !visible || document.hidden;
        idle.paused(paused);
        feesPulse?.paused(paused);
      };
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        sync();
      });
      observer.observe(truck);
      document.addEventListener("visibilitychange", sync);
      return () => {
        arrival.kill();
        idle.kill();
        feesPulse?.kill();
        observer.disconnect();
        document.removeEventListener("visibilitychange", sync);
        gsap.set(truck, { clearProps: "transform,opacity" });
        if (fees) gsap.set(fees, { clearProps: "transform" });
      };
    },
  );
  document.addEventListener("astro:before-swap", () => media.revert(), {
    once: true,
  });
}
