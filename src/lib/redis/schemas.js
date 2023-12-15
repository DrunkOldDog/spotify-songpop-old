import { Schema, Entity } from "redis-om";

class Game extends Entity {}
export const gameSchema = new Schema(
  Game,
  {
    playlistId: { type: "string" },
    status: { type: "string" },
    players: { type: "string" },
  },
  {
    dataStructure: "JSON",
  }
);
