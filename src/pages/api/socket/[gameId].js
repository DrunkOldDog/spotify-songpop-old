import { Server } from "socket.io";
import { messageHandler } from "@common/sockets";

export default function SocketHandler(req, res) {
  if (res.socket.server.io && process.env.NODE_ENV === "development") {
    res.socket.server.io.disconnectSockets();
    res.socket.server.io = undefined;
  }

  /* Instantiate a new socket connection */
  if (!res.socket.server.io) {
    console.log("Initializing new socket...", req.query.gameId);
    const io = new Server(res.socket.server, {
      path: req.query.gameId ? `/${req.query.gameId}/` : undefined,
    });
    io.on("connection", messageHandler);
    res.socket.server.io = io; // store socket in server
  } else {
    console.log("Socket already running!");
  }

  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
