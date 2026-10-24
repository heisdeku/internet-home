import Lenis from "lenis";


let lenis: Lenis | null = null;

export function startLenis() {
  if (lenis || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return;

  lenis = new Lenis({ autoRaf: true, lerp: 0.1 });
  const smooth = lenis;

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
    const header = document.querySelector<HTMLElement>("header");
    smooth.scrollTo(target, { offset: -((header?.offsetHeight ?? 72) + 8) });
  });
}
