const CONFIRM_MS = 1800;

/**
 * Copies the address on click and flips the parent into its "copied" state for a moment.
 * If the clipboard is unavailable or refuses, the click opens the mail client instead.
 */
export function startCopyEmail() {
	for (const link of document.querySelectorAll<HTMLAnchorElement>('[data-copy-email]')) {
		link.addEventListener('click', (event) => {
			if (!navigator.clipboard?.writeText) return;
			event.preventDefault();
			navigator.clipboard.writeText(link.textContent.trim()).then(
				() => {
					const group = link.parentElement!;
					group.dataset.copied = '';
					window.setTimeout(() => delete group.dataset.copied, CONFIRM_MS);
				},
				() => {
					window.location.href = link.href;
				},
			);
		});
	}
}
