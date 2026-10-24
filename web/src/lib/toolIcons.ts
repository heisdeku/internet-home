import * as icons from 'simple-icons';

type Icon = { path: string; hex: string };

/** Tool names as written in the Studio that don't normalise straight to a simple-icons slug. */
const ALIASES: Record<string, string> = {
	'react native': 'react',
	'node & express': 'nodedotjs',
	node: 'nodedotjs',
	'node.js': 'nodedotjs',
	'next.js': 'nextdotjs',
	nextjs: 'nextdotjs',
	vue: 'vuedotjs',
	'vue.js': 'vuedotjs',
	nuxt: 'nuxt',
	scss: 'sass',
	gsap: 'greensock',
	tailwind: 'tailwindcss',
	'tailwind css': 'tailwindcss',
	postgres: 'postgresql',
	express: 'express',
};

/** The simple-icons mark and brand colour for a tool name, when one exists. */
export function toolIcon(name: string): Icon | null {
	const key = name.trim().toLowerCase();
	const slug = ALIASES[key] ?? key.replace(/\.js$/, 'dotjs').replace(/[^a-z0-9]/g, '');
	const exportName = `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}`;
	const icon = (icons as Record<string, unknown>)[exportName] as Icon | undefined;
	return icon ? { path: icon.path, hex: `#${icon.hex}` } : null;
}
