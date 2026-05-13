import { NextResponse } from "next/server";
import { z } from "zod";

import { verifyUserPassword } from "@/lib/users";

const loginSchema = z.object({
  username: z.string().trim().min(1).max(50),
  password: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Nazwa uzytkownika i haslo sa wymagane." },
        { status: 400 }
      );
    }

    const user = await verifyUserPassword(
      parsed.data.username,
      parsed.data.password
    );

    if (!user) {
      return NextResponse.json(
        { error: "Nieprawidlowa nazwa uzytkownika lub haslo." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName ?? user.username,
        role: user.role,
        imagePath: user.imagePath,
      },
    });
  } catch (error) {
    console.error("Logowanie nie powiodlo sie", error);

    return NextResponse.json(
      { error: "Logowanie jest teraz niedostepne." },
      { status: 500 }
    );
  }
}
