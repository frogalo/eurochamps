"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { socket } from "@/socket";
import { useUser } from "@/context/UserContext";

export default function StageDetail() {
    const { currentUser } = useUser();
    const params = useParams();
    const stage = params.id || "Home";
    const storageKey = `connectedUsers-${stage}`;

    const [mounted, setMounted] = useState(false);
    const [, setIsConnected] = useState<boolean>(false);
    const [, setTransport] = useState<string>("N/A");
    const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

    // On mount, mark as loaded and restore connectedUsers (for this room) from localStorage.
    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setConnectedUsers(parsed);
                }
            } catch (err) {
                console.error("Error parsing connectedUsers:", err);
            }
        }
    }, [storageKey]);

    // Persist connectedUsers to localStorage whenever they update.
    useEffect(() => {
        if (mounted) {
            localStorage.setItem(storageKey, JSON.stringify(connectedUsers));
        }
    }, [connectedUsers, mounted, storageKey]);

    // Before unload, request an updated list from the server.
    useEffect(() => {
        const handleBeforeUnload = () => {
            // Ask the server for an updated list.
            socket.emit("getAllConnectedUsers", { stage });
            // Write the current state to localStorage.
            localStorage.setItem(storageKey, JSON.stringify(connectedUsers));
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [connectedUsers, storageKey, stage]);

    // Socket event listeners.
    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);
            socket.io.engine.on("upgrade", (upgradeInfo: any) => {
                setTransport(upgradeInfo.name);
            });

            const name = currentUser || "Guest";

            // Clear any stale localStorage state for this room.
            localStorage.removeItem(storageKey);
            setConnectedUsers([]);

            // Emit join event; the server will emit "currentUsers" with the updated list.
            socket.emit("join", { stage, name });

            // Add the current user to the list.
            setConnectedUsers([name]);
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport("N/A");
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        // When the server sends the full current list, replace the state.
        socket.on("currentUsers", (users: string[]) => {
            setConnectedUsers(users);
        });

        // When another user joins, add them if not already present.
        socket.on("userJoined", (data: { name: string; stage?: string }) => {
            if (data.stage === stage) {
                setConnectedUsers((prev) => {
                    if (!prev.includes(data.name)) {
                        return [...prev, data.name];
                    }
                    return prev;
                });
            }
        });

        // When a user leaves, remove them from the state.
        socket.on("userLeft", (data: { name: string; stage?: string }) => {
            if (data.stage === stage) {
                setConnectedUsers((prev) => prev.filter((n) => n !== data.name));
            }
        });

        if (socket.connected) {
            onConnect();
        }

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("currentUsers");
            socket.off("userJoined");
            socket.off("userLeft");
        };
    }, [stage, currentUser, mounted]);

    if (!mounted) return null;

    return (
        <div className="p-4">
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Connected Users</h2>
                <div className="flex space-x-2">
                    {connectedUsers.map((name, index) => (
                        <div
                            key={index}
                            className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
                        >
              <span className="text-xl font-bold">
                {name.charAt(0).toUpperCase()}
              </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
