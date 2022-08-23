import { Server } from "socket.io";
import { messageHandler } from "@common/sockets";

export default function SocketHandler(_, res) {
  /* Instantiate a new socket connection */
  if (!res.socket.server.io) {
    console.log("Initializing new socket...");
    const io = new Server(res.socket.server);
    io.on("connection", messageHandler);
    res.socket.server.io = io; // store socket in server
  } else {
    console.log("Socket already running!");
    /* To refresh socket listeners on fast refresh */
    if (process.env.NODE_ENV === "development") {
      res.socket.server.io.removeAllListeners();
      res.socket.server.io.on("connection", messageHandler);
    }
  }

  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
