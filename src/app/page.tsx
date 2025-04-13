"use client";

import {useRouter} from "next/navigation";
import Button from "@/components/Button";
import {useUser} from "@/context/UserContext";

const mockNames = ["Iga", "Kasia", "Agata", "Kuba", "Wiktoria", "Rafał"];

export default function NamePicker() {
    const router = useRouter();
    const {login} = useUser();

    const handleSelectName = (name: string) => {
        login(name);
        router.push(`/etap/`);
    };

    return (
        <div className="min-h-screen overflow-hidden flex flex-col items-center justify-center p-4 space-y-8">
            <div className="w-full space-y-4">
                {mockNames.map((name) => (
                    <Button key={name} text={name} onClick={() => handleSelectName(name)}/>
                ))}
            </div>
        </div>
    );
}
