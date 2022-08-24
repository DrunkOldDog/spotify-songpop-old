export const GAME_STATUS = {
  NOT_STARTED: "NOT_STARTED",
  STARTED: "STARTED",
  FINISHED: "FINISHED",
};

export const defaultGameStatusState = {
  status: GAME_STATUS.NOT_STARTED,
  options: [],
  currentSong: undefined,
};
