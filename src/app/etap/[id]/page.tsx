"use client";

interface UpgradeInfo {
    name: string;
    // add any other properties you might use
}

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { socket } from "@/socket";
import { useUser } from "@/context/UserContext";

// Simple hash function to turn a string into a pseudo-random index.
function getBgClass(name: string): string {
    // Calculate a hash value based on char codes.
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Map the hash to one of 5 background classes.
    const index = Math.abs(hash) % 5 + 1; // 1 to 5
    return `user-bg-${index}`;
}

export default function StageDetail() {
    const { currentUser } = useUser();
    const params = useParams();
    const stageParam =
        typeof params.id === "string"
            ? params.id
            : Array.isArray(params.id)
                ? params.id[0]
                : "Home";
    const stage = decodeURIComponent(stageParam);
    const storageKey = `connectedUsers-${stage}`;

    const [mounted, setMounted] = useState(false);
    // The following two states are kept but are not used in this snippet:
    const [, setIsConnected] = useState<boolean>(false);
    const [, setTransport] = useState<string>("N/A");
    const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

    // On mount, load connectedUsers for this room from localStorage.
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

    // Persist connectedUsers to localStorage on updates.
    useEffect(() => {
        if (mounted) {
            localStorage.setItem(storageKey, JSON.stringify(connectedUsers));
        }
    }, [connectedUsers, mounted, storageKey]);

    // Update localStorage on page unload.
    useEffect(() => {
        const handleBeforeUnload = () => {
            socket.emit("getAllConnectedUsers", { stage });
            localStorage.setItem(storageKey, JSON.stringify(connectedUsers));
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [connectedUsers, storageKey, stage]);

    // Socket event listeners.
    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);
            socket.io.engine.on("upgrade", (upgradeInfo: UpgradeInfo) => {
                setTransport(upgradeInfo.name);
            });

            const name = currentUser || "Guest";

            // Clear previous localStorage state.
            localStorage.removeItem(storageKey);
            setConnectedUsers([]);

            // Emit join event and then add the current user.
            socket.emit("join", { stage, name });
            setConnectedUsers([name]);
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport("N/A");
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        socket.on("currentUsers", (users: string[]) => {
            setConnectedUsers(users);
        });

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
                <h2 className="text-center">{stage}</h2>
                <div className="flex space-x-2">
                    {connectedUsers.map((name, index) => (
                        <div key={index} className={`connected-user ${getBgClass(name)}`}>
              <span className="connected-user-letter">
                {name.charAt(0).toUpperCase()}
              </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
