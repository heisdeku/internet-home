const NAMED = "[style*='view-transition-name']";

/**
 * An element whose view-transition-name was also on the previous page has morphed into place,
 * so the new page must not replay its entrance animation on top of the morph. Focus then moves
 * to the new page's heading, as it would after a full page load.
 */
export function startTransitions() {
  let previous = new Set<string>();
  document.addEventListener("astro:before-swap", () => {
    previous = new Set(
      [...document.querySelectorAll<HTMLElement>(NAMED)].map(
        (el) => el.style.viewTransitionName,
      ),
    );
  });
  document.addEventListener("astro:after-swap", () => {
    for (const el of document.querySelectorAll<HTMLElement>(NAMED))
      if (previous.has(el.style.viewTransitionName)) el.dataset.vtShared = "";
    const heading = document.querySelector<HTMLElement>("main h1");
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  });
}
