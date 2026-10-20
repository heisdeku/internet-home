import type { SITE_SETTINGS_QUERY_RESULT } from '@/sanity/types';

type NavLink = NonNullable<NonNullable<SITE_SETTINGS_QUERY_RESULT>['navigation']>[number];

/** A `simpleLink` or `cta` object after the LINK projection. `cta` adds `variant`. */
export type LinkData = Omit<NavLink, '_key' | '_type'> & { variant?: 'default' | 'secondary' | 'text' | null };

type InternalDoc = NonNullable<LinkData['internal']>;

export function pathFor(doc: InternalDoc): string | null {
	if (!doc.slug) return null;
	switch (doc._type) {
		case 'page':
			return doc.slug === 'home' ? '/' : `/${doc.slug}`;
		case 'outreach':
			return `/intro/${doc.slug}`;
		case 'work':
			return `/work/${doc.slug}`;
		case 'product':
			return `/products/${doc.slug}`;
		case 'post':
			return `/writing/${doc.slug}`;
	}
}

/** Resolves a Studio-managed link to an href, or null when it cannot resolve (e.g. no résumé uploaded). */
export function resolveHref(link: LinkData, resumeUrl: string | null): string | null {
	const params = link.params ?? '';
	switch (link.type) {
		case 'external':
			return link.external ? `${link.external}${params}` : null;
		case 'relative':
			return link.relative ? `${link.relative}${params}` : null;
		case 'email':
			return link.email ? `mailto:${link.email}` : null;
		case 'phone':
			return link.phone ? `tel:${link.phone}` : null;
		case 'resume':
			return resumeUrl ? `${resumeUrl}?dl=` : null;
		default: {
			if (!link.internal) return null;
			const path = pathFor(link.internal);
			return path ? `${path}${params}` : null;
		}
	}
}

export const opensInNewTab = (link: LinkData) => link.target === '_blank';
