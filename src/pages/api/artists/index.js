import { getSession } from "next-auth/react";
import { searchArtistsByName } from "@lib/spotify";

export default async function (req, res) {
  const session = await getSession({ req });
  const { artistName } = req.query;

  const artistsList = await searchArtistsByName(
    session?.refreshToken,
    artistName
  );
  res.status(200).json(artistsList || []);
}
