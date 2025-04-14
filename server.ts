import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer, {
        path: "/socket.io",
        transports: ["websocket"],
        pingInterval: 10000, // Send a ping every 10 seconds.
        pingTimeout: 5000,
    });

    io.on("connection", (socket) => {
        console.log("New connection:", socket.id);

        socket.on(
            "join",
            async ({ stage, name }: { stage: string; name: string }) => {
                console.log(`User "${name}" joined stage: ${stage}`);

                // Save the username and the stage on the socket's data.
                socket.data.username = name;
                socket.data.stage = stage;

                socket.join(stage);

                // Get list of sockets in the room.
                const socketsInRoom =
                    io.sockets.adapter.rooms.get(stage) || new Set();
                const currentUsers = Array.from(socketsInRoom)
                    .map(
                        (socketId) =>
                            io.sockets.sockets.get(socketId)?.data.username
                    )
                    .filter(Boolean);

                // Send the current list to the joining socket.
                socket.emit("currentUsers", currentUsers);

                // Inform others in the room that a new user joined.
                socket.to(stage).emit("userJoined", { name, stage });
            }
        );

        // New event: Respond with the current list of connected users.
        socket.on(
            "getAllConnectedUsers",
            ({ stage }: { stage: string }) => {
                const socketsInRoom =
                    io.sockets.adapter.rooms.get(stage) || new Set();
                const currentUsers = Array.from(socketsInRoom)
                    .map(
                        (socketId) =>
                            io.sockets.sockets.get(socketId)?.data.username
                    )
                    .filter(Boolean);
                socket.emit("currentUsers", currentUsers);
            }
        );

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            const stage = socket.data.stage || "Home";
            socket.to(stage).emit("userLeft", {
                name: socket.data.username || "User",
                stage,
            });
        });
    });

    // Log all connected sockets and their user info every 10 seconds.
    setInterval(() => {
        console.log("==== Connected sockets and users ====");
        for (const [socketId, socket] of io.sockets.sockets) {
            console.log(`Socket ${socketId}:`, {
                username: socket.data.username,
                stage: socket.data.stage,
            });
        }
        console.log("=====================================");
    }, 10000);

    httpServer
        .once("error", (err: unknown) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});
