declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackPageViews() {
  let first = true;
  document.addEventListener("astro:page-load", () => {
    if (first) {
      first = false;
      return;
    }
    window.gtag?.("event", "page_view", {
      page_location: location.href,
      page_title: document.title,
    });
  });
}
