const SPOTIFY_API = process.env.SPOTIFY_API;
const SPOTIFY_ACCOUNTS_API = process.env.SPOTIFY_ACCOUNTS_API;

export const SERVER = {
  /* Spotify APIs */
  SPOTIFY_AUTHORIZE: `${SPOTIFY_ACCOUNTS_API}/authorize`,
  SPOTIFY_TOKEN: `${SPOTIFY_ACCOUNTS_API}/api/token`,
  SPOTIFY_PLAYLIST: (playlistId) => `${SPOTIFY_API}/playlists/${playlistId}`,
  SPOTIFY_PLAYLIST_TRACKS: (playlistId) =>
    `${SPOTIFY_API}/playlists/${playlistId}/tracks`,

  /* API Routes */
  SEARCH_PLAYLIST: "/api/playlists/search",
  GAME: "/api/game",
  SOCKET: "/api/socket",
};
