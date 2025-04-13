"use client";

import {useRouter} from "next/navigation";
import NameButton from "@/components/nameButton";

const mockNames = ["Iga", "Kasia", "Agata", "Kuba"];

export default function NamePicker() {
    const router = useRouter();

    const handleSelectName = (name: string) => {
        console.log("User selected:", name);
        // Navigate to a ranking page with the chosen name.
        router.push(`/ranking/${name.toLowerCase()}`);
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
                    <NameButton
                        key={name}
                        name={name}
                        onClick={() => handleSelectName(name)}
                    />
                ))}
            </div>
        </div>
    );
}
