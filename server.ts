import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = parseInt(process.env.PORT || "3013", 10);

const turbo = process.argv.includes("--turbopack");
const app = next({ dev, hostname, port, turbo });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    path: "/socket.io",
    transports: ["websocket"],
    pingInterval: 10000,
    pingTimeout: 5000,
  });

  const getStageUsers = (stage: string) => {
    const socketsInRoom = io.sockets.adapter.rooms.get(stage) || new Set();

    return Array.from(socketsInRoom)
      .map((socketId) => io.sockets.sockets.get(socketId)?.data.username)
      .filter(Boolean);
  };

  io.on("connection", (socket) => {
    console.log("New connection:", socket.id);

    socket.on("join", ({ stage, name }: { stage: string; name: string }) => {
      const previousStage = socket.data.stage;
      const previousUser = socket.data.username || name;

      if (previousStage && previousStage !== stage) {
        socket.leave(previousStage);
        socket.to(previousStage).emit("userLeft", {
          name: previousUser,
          stage: previousStage,
        });
      }

      socket.data.username = name;
      socket.data.stage = stage;
      socket.join(stage);

      socket.emit("currentUsers", getStageUsers(stage));
      socket.to(stage).emit("userJoined", { name, stage });
    });

    socket.on("leaveStage", ({ stage, name }: { stage: string; name?: string }) => {
      if (socket.data.stage !== stage) {
        return;
      }

      socket.leave(stage);
      socket.to(stage).emit("userLeft", {
        name: socket.data.username || name || "User",
        stage,
      });
      socket.data.stage = undefined;
    });

    socket.on("getAllConnectedUsers", ({ stage }: { stage: string }) => {
      socket.emit("currentUsers", getStageUsers(stage));
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      const stage = socket.data.stage;

      if (!stage) {
        return;
      }

      socket.to(stage).emit("userLeft", {
        name: socket.data.username || "User",
        stage,
      });
    });
  });

  httpServer
    .once("error", (err: unknown) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
