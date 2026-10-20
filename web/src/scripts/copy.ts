const CONFIRM_MS = 1800;

/** Copies the address on click and flips the parent into its "copied" state for a moment. */
export function startCopyEmail() {
	for (const link of document.querySelectorAll<HTMLAnchorElement>('[data-copy-email]')) {
		link.addEventListener('click', async (event) => {
			if (!navigator.clipboard) return; // falls through to the mailto href
			event.preventDefault();
			await navigator.clipboard.writeText(link.textContent.trim());
			const group = link.parentElement!;
			group.dataset.copied = '';
			window.setTimeout(() => delete group.dataset.copied, CONFIRM_MS);
		});
	}
}
