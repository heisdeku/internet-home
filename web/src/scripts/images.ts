export function startImageFades() {
  for (const img of document.querySelectorAll<HTMLImageElement>(
    "img[data-fade-in]",
  )) {
    const reveal = () => img.classList.add("is-loaded");
    if (img.complete && img.naturalWidth > 0) {
      reveal();
      continue;
    }
    img.addEventListener("load", reveal, { once: true });
    img.addEventListener("error", reveal, { once: true });
  }
}
