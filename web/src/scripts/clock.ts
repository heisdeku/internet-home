export function startClocks() {
  for (const clock of document.querySelectorAll<HTMLElement>(
    "[data-local-clock]:not([data-ready])",
  )) {
    clock.dataset.ready = "";
    const timeZone = clock.dataset.timeZone;
    const tick = () => {
      clock.textContent = new Date().toLocaleTimeString("en-GB", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
      });
    };
    tick();

    const timer = window.setInterval(tick, 15_000);
    document.addEventListener(
      "astro:before-swap",
      () => window.clearInterval(timer),
      { once: true },
    );
  }
}
