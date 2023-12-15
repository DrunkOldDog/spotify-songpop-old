import { SERVER } from "@common/server";
import { createGame, getGame } from "@lib/redis";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const gameId = await createGame({
      playlistId: req.body.playlistId,
    });

    await fetch("http://localhost:3000" + SERVER.SOCKET + "/" + gameId);

    res.status(200).json({ gameId });
  } else {
    const game = await getGame({ gameId: req.query.gameId });
    res.status(200).json(game);
  }
}
