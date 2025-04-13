"use client";

import { useRouter } from "next/navigation";
import NameButton from "@/components/nameButton";
import { useUser } from "@/context/UserContext";

const mockNames = ["Iga", "Kasia", "Agata", "Kuba", "Wiktoria", "Rafał"];

export default function NamePicker() {
    const router = useRouter();
    const { login } = useUser();

    const handleSelectName = (name: string) => {
        login(name);
        router.push(`/ranking/`);
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8"
            style={{
                backgroundColor: "var(--background)",
                color: "var(--text-color)",
            }}
        >
            {/* Name Buttons */}
            <div className="w-full space-y-4">
                {mockNames.map((name) => (
                    <NameButton key={name} name={name} onClick={() => handleSelectName(name)} />
                ))}
            </div>
        </div>
    );
}
