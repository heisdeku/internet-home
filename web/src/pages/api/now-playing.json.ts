import type { APIRoute } from 'astro';

export const prerender = false;

export type NowPlaying =
	| { isPlaying: false }
	| {
			isPlaying: true;
			title: string;
			artist: string;
			albumArt: string;
			url: string;
			progressMs: number;
			durationMs: number;
	  };

interface SpotifyCurrentlyPlaying {
	is_playing: boolean;
	progress_ms: number;
	currently_playing_type: string;
	item: {
		name: string;
		duration_ms: number;
		artists: { name: string }[];
		album: { images: { url: string }[] };
		external_urls: { spotify: string };
	} | null;
}

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = import.meta.env;

const notPlaying = () =>
	new Response(JSON.stringify({ isPlaying: false } satisfies NowPlaying), {
		headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
	});

export const GET: APIRoute = async () => {
	if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) return notPlaying();

	const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
			'content-type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: SPOTIFY_REFRESH_TOKEN }),
	});
	if (!tokenResponse.ok) return notPlaying();
	const { access_token } = (await tokenResponse.json()) as { access_token: string };

	const playing = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
		headers: { authorization: `Bearer ${access_token}` },
	});
	// 204 means nothing is playing right now.
	if (playing.status !== 200) return notPlaying();

	const data = (await playing.json()) as SpotifyCurrentlyPlaying;
	if (!data.is_playing || data.currently_playing_type !== 'track' || !data.item) return notPlaying();

	const body: NowPlaying = {
		isPlaying: true,
		title: data.item.name,
		artist: data.item.artists.map((a) => a.name).join(', '),
		albumArt: data.item.album.images[0]?.url ?? '',
		url: data.item.external_urls.spotify,
		progressMs: data.progress_ms,
		durationMs: data.item.duration_ms,
	};
	return new Response(JSON.stringify(body), {
		headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
	});
};
