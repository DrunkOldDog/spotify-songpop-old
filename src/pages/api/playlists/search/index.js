import { getSession } from "next-auth/react";
import { searchPlaylistsByName } from "@lib/spotify";

export default async function (req, res) {
  const session = await getSession({ req });
  const { name } = req.query;

  const artistsList = await searchPlaylistsByName(session?.refreshToken, name);
  res.status(200).json(artistsList || []);
}
