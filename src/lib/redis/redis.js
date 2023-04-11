import { Client } from "redis-om";

import { gameSchema } from "./schemas";

import { GAME_STATUS } from "@common/constants";

const client = new Client();

async function connect() {
  if (!client.isOpen()) {
    await client.open(process.env.REDIS_URL);
  }
}

export const createGame = async ({ gameId, playlistId }) => {
  await connect();

  const repository = client.fetchRepository(gameSchema);

  const game = repository.createEntity({
    gameId,
    playlistId,
    status: GAME_STATUS.NOT_STARTED,
    players: JSON.stringify({}),
  });

  const id = await repository.save(game);

  /* Add TTL to Game Store */
  await client.execute(["EXPIRE", `Game:${id}`, 3600]);

  return id;
};
