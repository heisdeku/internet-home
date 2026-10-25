export function startReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.remove("is-pending");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
  );

  const below = Array.from(
    document.querySelectorAll<HTMLElement>(
      "[data-reveal], [data-reveal-stagger]",
    ),
  ).filter((el) => el.getBoundingClientRect().top > window.innerHeight);
  for (const el of below) {
    el.classList.add("is-pending");
    observer.observe(el);
  }
}
