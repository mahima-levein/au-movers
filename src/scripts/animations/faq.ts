import gsap from "gsap";

export function initFaq() {
  const section = document.querySelector<HTMLElement>("#faq");
  if (!section) return;

  const items = [...section.querySelectorAll<HTMLElement>("[data-faq-item]")];
  const triggers = [
    ...section.querySelectorAll<HTMLButtonElement>("[data-faq-trigger]"),
  ];
  const panels = [...section.querySelectorAll<HTMLElement>("[data-faq-panel]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = 0;

  function setActiveFaq(index: number) {
    if (index === activeIndex || !items[index]) return;
    const previous = activeIndex;
    activeIndex = index;

    items[previous].dataset.active = "false";
    items[index].dataset.active = "true";
    triggers[previous].setAttribute("aria-expanded", "false");
    triggers[index].setAttribute("aria-expanded", "true");
    panels[previous].setAttribute("aria-hidden", "true");
    panels[index].setAttribute("aria-hidden", "false");
    panels[previous].inert = true;
    panels[index].inert = false;

    gsap.killTweensOf([panels[previous], panels[index]]);
    if (reducedMotion.matches) {
      gsap.set(panels[previous], { height: 0, opacity: 0, y: 0 });
      gsap.set(panels[index], { height: "auto", opacity: 1, y: 0 });
      return;
    }

    gsap.to(panels[previous], {
      height: 0,
      opacity: 0,
      y: -4,
      duration: 0.35,
      ease: "power2.out",
    });
    gsap.to(panels[index], {
      height: "auto",
      opacity: 1,
      y: 0,
      duration: 0.42,
      ease: "power2.out",
    });
  }

  triggers.forEach((trigger, index) => {
    trigger.addEventListener("click", () => setActiveFaq(index));
  });
}
