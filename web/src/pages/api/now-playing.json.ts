import type { APIRoute } from "astro";

type Track = { title: string; artist: string; albumArt: string; url: string };

export type NowPlaying =
  | ({ isPlaying: true; progressMs: number; durationMs: number } & Track)
  | { isPlaying: false; lastPlayed: (Track & { playedAt: string }) | null };

interface SpotifyTrack {
  name: string;
  duration_ms: number;
  artists: { name: string }[];
  album: { images: { url: string; width: number }[] };
  external_urls: { spotify: string };
}
interface SpotifyCurrentlyPlaying {
  is_playing: boolean;
  progress_ms: number;
  currently_playing_type: string;
  item: SpotifyTrack | null;
}
interface SpotifyRecentlyPlayed {
  items: { track: SpotifyTrack; played_at: string }[];
}

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } =
  import.meta.env;

const json = (body: NowPlaying) =>
  new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });

const track = (item: SpotifyTrack): Track => ({
  title: item.name,
  artist: item.artists.map((a) => a.name).join(", "),
  albumArt:
    (
      item.album.images.findLast((image) => image.width >= 104) ??
      item.album.images[0]
    )?.url ?? "",
  url: item.external_urls.spotify,
});

export const GET: APIRoute = async () => {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN)
    return json({ isPlaying: false, lastPlayed: null });

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });
  if (!tokenResponse.ok) return json({ isPlaying: false, lastPlayed: null });
  const { access_token } = (await tokenResponse.json()) as {
    access_token: string;
  };
  const headers = { authorization: `Bearer ${access_token}` };

  const playing = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    { headers },
  );

  if (playing.status === 200) {
    const data = (await playing.json()) as SpotifyCurrentlyPlaying;
    if (data.currently_playing_type === "track" && data.item) {
      if (data.is_playing) {
        return json({
          isPlaying: true,
          ...track(data.item),
          progressMs: data.progress_ms,
          durationMs: data.item.duration_ms,
        });
      }
      // Paused: the track still on the player is the last one played.
      return json({
        isPlaying: false,
        lastPlayed: { ...track(data.item), playedAt: new Date().toISOString() },
      });
    }
  }

  const recent = await fetch(
    "https://api.spotify.com/v1/me/player/recently-played?limit=1",
    { headers },
  );
  if (recent.status !== 200)
    return json({ isPlaying: false, lastPlayed: null });
  const { items } = (await recent.json()) as SpotifyRecentlyPlayed;
  const last = items[0];
  return json({
    isPlaying: false,
    lastPlayed: last
      ? { ...track(last.track), playedAt: last.played_at }
      : null,
  });
};
