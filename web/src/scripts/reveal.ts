const STAGGER_MS = 70;

/**
 * Reveals `[data-reveal]` elements, and the children of `[data-reveal-stagger]`
 * containers one after another, as they enter the viewport. The matching CSS
 * lives in global.css under "Reveal".
 */
export function startReveal() {
	const groups = document.querySelectorAll<HTMLElement>('[data-reveal-stagger]');
	for (const group of groups) {
		const step = Number(group.dataset.revealStep) || STAGGER_MS;
		Array.from(group.children).forEach((child, i) => {
			(child as HTMLElement).style.setProperty('--reveal-delay', `${i * step}ms`);
		});
	}

	const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-stagger]');
	if (!('IntersectionObserver' in window)) {
		for (const el of targets) el.classList.add('is-revealed');
		return;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				entry.target.classList.add('is-revealed');
				observer.unobserve(entry.target);
			}
		},
		{ rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
	);
	for (const el of targets) observer.observe(el);
}
