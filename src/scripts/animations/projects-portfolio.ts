import gsap from "gsap";

export function initProjectsPortfolio() {
  const section = document.querySelector<HTMLElement>("#projects-portfolio");
  const row = section?.querySelector<HTMLElement>("[data-projects-row]");
  const track = section?.querySelector<HTMLElement>("[data-projects-track]");
  if (!section || !row || !track) return;

  const cards = [
    ...section.querySelectorAll<HTMLElement>("[data-project-card]"),
  ];
  const panels = [
    ...section.querySelectorAll<HTMLElement>("[data-project-panel]"),
  ];
  const details = [
    ...section.querySelectorAll<HTMLElement>("[data-project-details]"),
  ];
  const backgrounds = [
    ...section.querySelectorAll<HTMLElement>("[data-project-background]"),
  ];
  const triggers = [
    ...section.querySelectorAll<HTMLButtonElement>("[data-project-trigger]"),
  ];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = 0;

  function setActiveProject(index: number) {
    if (index === activeIndex || !cards[index]) return;
    const previous = activeIndex;
    activeIndex = index;

    cards.forEach((card, cardIndex) => {
      card.dataset.active = String(cardIndex === index);
      triggers[cardIndex].setAttribute(
        "aria-expanded",
        String(cardIndex === index),
      );
    });
    details[previous].inert = true;
    details[index].inert = false;

    gsap.killTweensOf([
      ...backgrounds,
      panels[previous],
      panels[index],
      details[previous],
      details[index],
    ]);

    if (reducedMotion.matches) {
      backgrounds.forEach((background, backgroundIndex) =>
        gsap.set(background, { opacity: backgroundIndex === index ? 1 : 0 }),
      );
      gsap.set(panels[previous], {
        backgroundColor: "rgba(0, 0, 0, 0)",
        borderColor: "transparent",
      });
      gsap.set(panels[index], {
        backgroundColor: "rgba(0, 0, 0, 0.55)",
        borderColor: "rgba(255, 255, 255, 0.1)",
      });
      gsap.set(details[previous], { height: 0, opacity: 0, y: 0 });
      gsap.set(details[index], { height: "auto", opacity: 1, y: 0 });
      return;
    }

    backgrounds.forEach((background, backgroundIndex) =>
      gsap.to(background, {
        opacity: backgroundIndex === index ? 1 : 0,
        duration: 0.58,
        ease: "power2.out",
        overwrite: true,
      }),
    );
    gsap.to(panels[previous], {
      backgroundColor: "rgba(0, 0, 0, 0)",
      borderColor: "rgba(255, 255, 255, 0)",
      duration: 0.35,
    });
    gsap.to(panels[index], {
      backgroundColor: "rgba(0, 0, 0, 0.55)",
      borderColor: "rgba(255, 255, 255, 0.1)",
      duration: 0.42,
    });
    gsap.to(details[previous], {
      height: 0,
      opacity: 0,
      y: 8,
      duration: 0.35,
      ease: "power2.inOut",
    });
    gsap.to(details[index], {
      height: "auto",
      opacity: 1,
      y: 0,
      duration: 0.48,
      ease: "power2.out",
    });
  }

  cards.forEach((card, index) => {
    card.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse" || event.pointerType === "pen")
        setActiveProject(index);
    });
    card.addEventListener("focusin", () => setActiveProject(index));
    card.addEventListener("click", (event) => {
      if (!(event.target as HTMLElement).closest("a")) setActiveProject(index);
    });
    triggers[index].addEventListener("click", () => setActiveProject(index));
  });

  // Keep the most visible mobile card active while swiping the snap track.
  let scrollFrame = 0;
  track.addEventListener(
    "scroll",
    () => {
      if (window.matchMedia("(min-width: 1024px)").matches) return;
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => {
        const center =
          track.getBoundingClientRect().left + track.clientWidth / 2;
        let nearest = 0;
        let distance = Infinity;
        cards.forEach((card, index) => {
          const bounds = card.getBoundingClientRect();
          const nextDistance = Math.abs(
            bounds.left + bounds.width / 2 - center,
          );
          if (nextDistance < distance) {
            nearest = index;
            distance = nextDistance;
          }
        });
        setActiveProject(nearest);
      });
    },
    { passive: true },
  );
}
