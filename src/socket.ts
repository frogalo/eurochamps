"use client";

import { io, Socket } from "socket.io-client";

// Create and export a socket instance that connects back to the same host.
export const socket: Socket = io(undefined, {
    path: "/socket.io",
    transports: ["websocket"],
});
