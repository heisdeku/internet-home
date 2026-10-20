export function startClocks() {
  for (const clock of document.querySelectorAll<HTMLElement>(
    "[data-local-clock]",
  )) {
    const timeZone = clock.dataset.timeZone;
    const tick = () => {
      clock.textContent = new Date().toLocaleTimeString("en-GB", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
      });
    };
    tick();
    setInterval(tick, 15_000);
  }
}
