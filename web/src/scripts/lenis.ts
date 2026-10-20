import Lenis from "lenis";

const HEADER_OFFSET = -72;

export function startLenis() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const lenis = new Lenis({ autoRaf: true, lerp: 0.1 });

  document.addEventListener("click", (event) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>(
      'a[href*="#"]',
    );
    if (
      !link ||
      link.origin !== location.origin ||
      link.pathname !== location.pathname ||
      !link.hash
    )
      return;
    const target = document.querySelector<HTMLElement>(link.hash);
    if (!target) return;
    event.preventDefault();
    history.pushState(null, "", link.hash);
    lenis.scrollTo(target, { offset: HEADER_OFFSET });
  });
}
