import * as icons from 'simple-icons';

type Icon = { path: string; title: string };

// LinkedIn is not in simple-icons (trademark policy), so its mark is inlined.
const LINKEDIN: Icon = {
	title: 'LinkedIn',
	path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
};

/** Hostnames that have a well-known mark; anything else keeps its text label. */
const BY_HOST: Record<string, string> = {
	'github.com': 'siGithub',
	'x.com': 'siX',
	'twitter.com': 'siX',
	'instagram.com': 'siInstagram',
	'dribbble.com': 'siDribbble',
	'behance.net': 'siBehance',
	'youtube.com': 'siYoutube',
	'spotify.com': 'siSpotify',
	'open.spotify.com': 'siSpotify',
	'medium.com': 'siMedium',
	'dev.to': 'siDevdotto',
};

/** The brand mark for a social URL, when the host is a known network. */
export function socialIcon(url: string): Icon | null {
	let host: string;
	try {
		host = new URL(url).hostname.replace(/^www\./, '');
	} catch {
		return null;
	}
	const root = host.split('.').slice(-2).join('.');
	if (root === 'linkedin.com') return LINKEDIN;
	const name = BY_HOST[host] ?? BY_HOST[root];
	const icon = name ? ((icons as Record<string, unknown>)[name] as Icon | undefined) : undefined;
	return icon ? { path: icon.path, title: icon.title } : null;
}
