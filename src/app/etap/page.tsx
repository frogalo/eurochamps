"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { useUser } from "@/context/UserContext";

interface StageItem {
    name: string;
    date: string;
}

const stages: StageItem[] = [
    {
        name: "Półfinał 1",
        date: "13 maja",
    },
    {
        name: "Półfinał 2",
        date: "15 maja",
    },
    {
        name: "Finał",
        date: "17 maja",
    },
];

export default function Stage() {
    const router = useRouter();
    const { logout } = useUser();

    const handleStageClick = (stageName: string) => {
        if (stageName) {
            // Przekierowanie do dynamicznej strony /etap/[id]
            router.push(`/etap/${encodeURIComponent(stageName)}`);
        }
    };

    const handleChangeUser = () => {
        logout();
        router.push("/");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-6">
            {stages.map((stage, index) => (
                <Button
                    text={stage.name}
                    key={index}
                    extra={stage.date}
                    onClick={() => handleStageClick(stage.name)}
                >
                    <h2 className="text-2xl font-semibold">{stage.name}</h2>
                    {stage.date && (
                        <p className="text-lg text-gray-600">{stage.date}</p>
                    )}
                </Button>
            ))}
            <Button
                text="Zmień osobę"
                onClick={handleChangeUser}
                background="var(--quaternary-accent)"
            />

        </div>
    );
}
