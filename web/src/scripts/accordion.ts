const DURATION_MS = 420;
const EASE = 'cubic-bezier(0.2, 0.7, 0.2, 1)';

/**
 * Animates `<details data-accordion>` open and closed by height, so the panel
 * glides everywhere (Safari has no `::details-content` transition). Siblings
 * sharing a `name` close as the new one opens, like the native behaviour.
 */
export function startAccordions() {
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	for (const details of document.querySelectorAll<HTMLDetailsElement>('details[data-accordion]:not([data-ready])')) {
		details.dataset.ready = '';
		const summary = details.querySelector('summary');
		const panel = summary?.nextElementSibling as HTMLElement | null;
		if (!summary || !panel || reduce) continue;

		let animation: Animation | null = null;
		const animate = (from: number, to: number, onFinish: () => void) => {
			animation?.cancel();
			details.style.overflow = 'hidden';
			animation = details.animate({ height: [`${from}px`, `${to}px`] }, { duration: DURATION_MS, easing: EASE });
			animation.onfinish = () => {
				details.style.overflow = '';
				animation = null;
				onFinish();
			};
		};
		const open = () => {
			const closed = details.offsetHeight;
			details.open = true;
			animate(closed, summary.offsetHeight + panel.offsetHeight, () => {});
		};
		const close = () => animate(details.offsetHeight, summary.offsetHeight, () => (details.open = false));

		summary.addEventListener('click', (event) => {
			event.preventDefault();
			if (details.open) return close();
			open();
			const group = details.getAttribute('name');
			if (!group) return;
			for (const other of document.querySelectorAll<HTMLDetailsElement>(`details[data-accordion][name="${group}"][open]`)) {
				if (other !== details) other.querySelector('summary')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
			}
		});
	}
}
