import { createGame } from "@lib/redis";

import { v4 as uuid } from "uuid";

export default async function handler(req, res) {
  const gameId = await createGame({
    playlistId: req.body.playlistId,
    gameId: uuid(),
  });

  res.status(200).json({ gameId });
}
