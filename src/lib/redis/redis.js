import { Client } from "redis-om";

import { gameSchema } from "./schemas";

import { GAME_STATUS } from "@common/constants";

const client = new Client();

async function connect() {
  if (!client.isOpen()) {
    await client.open(process.env.REDIS_URL);
  }
}

export const createGame = async ({ playlistId }) => {
  await connect();

  const repository = client.fetchRepository(gameSchema);

  const game = repository.createEntity({
    playlistId,
    status: GAME_STATUS.NOT_STARTED,
    players: JSON.stringify({}),
  });

  const gameId = await repository.save(game);

  /* Add TTL to Game Store */
  await client.execute(["EXPIRE", `Game:${gameId}`, 3600]);

  return gameId;
};

export const getGame = async ({ gameId }) => {
  await connect();

  const repository = client.fetchRepository(gameSchema);

  return await repository.fetch(gameId);
}
