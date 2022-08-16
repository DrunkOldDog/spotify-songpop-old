const SPOTIFY_API = process.env.SPOTIFY_API;
const SPOTIFY_ACCOUNTS_API = process.env.SPOTIFY_ACCOUNTS_API;

export const SERVER = {
  /* Spotify APIs */
  SPOTIFY_AUTHORIZE: `${SPOTIFY_ACCOUNTS_API}/authorize`,
  SPOTIFY_TOKEN: `${SPOTIFY_ACCOUNTS_API}/api/token`,
  SPOTIFY_ARTIST_SEARCH: (name) =>
    `${SPOTIFY_API}/search?type=artist&q=artist:${name}`,

  /* API Routes */
  SEARCH_ARTISTS: "/api/artists",
};
