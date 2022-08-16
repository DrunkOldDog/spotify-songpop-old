const SPOTIFY_API = process.env.SPOTIFY_API;
const SPOTIFY_ACCOUNTS_API = process.env.SPOTIFY_ACCOUNTS_API;

export const SERVER = {
  /* Spotify APIs */
  SPOTIFY_AUTHORIZE: `${SPOTIFY_ACCOUNTS_API}/authorize`,
  SPOTIFY_TOKEN: `${SPOTIFY_ACCOUNTS_API}/api/token`,
  SPOTIFY_GET_ARTIST: (artistId) => `${SPOTIFY_API}/artists/${artistId}`,
  SPOTIFY_ARTIST_SEARCH: (name) =>
    `${SPOTIFY_API}/search?type=artist&q=artist:${name}`,
  SPOTIFY_ARTIST_TOP_SONGS: (artistId, market = "BO") =>
    `${SPOTIFY_API}/artists/${artistId}/top-tracks?market=${market}`,

  /* API Routes */
  SEARCH_ARTISTS: "/api/artists",
};
