const HOLD_MS = 2200;
const OUT_MS = 300;

/**
 * Cycles the words in `[data-rotate]`. The box first eases to the next word's
 * width while the current word drifts up and fades; once the text around it has
 * settled, the new word rises in. One motion at a time keeps it calm.
 */
export function startRotate() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (const word of document.querySelectorAll<HTMLElement>(
    "[data-rotate]:not([data-ready])",
  )) {
    word.dataset.ready = "";
    const options = (word.dataset.words ?? "").split("|").filter(Boolean);
    if (options.length < 2) continue;

    // An invisible twin in the same text measures words at the live font size.
    const ruler = word.cloneNode() as HTMLElement;
    ruler.removeAttribute("data-rotate");
    ruler.removeAttribute("data-ready");
    ruler.className = "rotate-ruler";
    ruler.setAttribute("aria-hidden", "true");
    word.after(ruler);
    const widthOf = (text: string) => {
      ruler.textContent = text;
      return ruler.offsetWidth;
    };

    let index = 0;
    const lock = () => (word.style.width = `${widthOf(options[index])}px`);
    lock();
    window.addEventListener("resize", lock);

    const timer = window.setInterval(() => {
      if (document.hidden) return;
      const next = (index + 1) % options.length;
      word.style.width = `${widthOf(options[next])}px`;
      word.classList.add("is-out");
      window.setTimeout(() => {
        index = next;
        word.textContent = options[index];
        word.classList.remove("is-out");
        word.classList.add("is-in");
        void word.offsetWidth; // commit the start position before releasing it
        word.classList.remove("is-in");
      }, OUT_MS);
    }, HOLD_MS);
    document.addEventListener(
      "astro:before-swap",
      () => window.clearInterval(timer),
      { once: true },
    );
  }
}
