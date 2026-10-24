/**
 * Wraps each word of a `[data-split]` heading in a span so the words can rise
 * into place one after another. Nested spans (the accent highlight) and line
 * breaks are kept.
 */
export function startSplit() {
	for (const heading of document.querySelectorAll<HTMLElement>('[data-split]:not([data-split-ready])')) {
		heading.dataset.splitReady = '';
		// Screen readers get the sentence, not one word per span.
		if (!heading.hasAttribute('aria-label')) {
			const copy = heading.cloneNode(true) as HTMLElement;
			copy.querySelectorAll('[aria-hidden="true"]').forEach((hidden) => hidden.remove());
			heading.setAttribute('aria-label', copy.textContent?.replace(/\s+/g, ' ').trim() ?? '');
		}
		let index = 0;
		const wrapWords = (node: Node) => {
			for (const child of Array.from(node.childNodes)) {
				if (child.nodeType !== Node.TEXT_NODE) {
					// A rotating word keeps its own motion and is not split.
					if (child instanceof HTMLElement && child.dataset.rotate !== undefined) index++;
					else if (child.nodeName !== 'BR') wrapWords(child);
					continue;
				}
				const fragment = document.createDocumentFragment();
				for (const part of (child.textContent ?? '').split(/(\s+)/)) {
					if (!part) continue;
					if (/^\s+$/.test(part)) {
						fragment.append(part);
						continue;
					}
					const word = document.createElement('span');
					word.className = 'split-word';
					word.style.setProperty('--i', String(index++));
					word.textContent = part;
					fragment.append(word);
				}
				child.replaceWith(fragment);
			}
		};
		wrapWords(heading);
		requestAnimationFrame(() => heading.classList.add('is-split-in'));
	}
}
