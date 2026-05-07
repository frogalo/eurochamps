import { NextResponse } from "next/server";
import { z } from "zod";

import { createUser, getUserByUsername } from "@/lib/users";

const registerSchema = z.object({
  username: z.string().trim().min(1).max(50),
  displayName: z.string().trim().min(1).max(50).optional(),
  password: z.string().min(6).max(200),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Wpisz poprawna nazwe uzytkownika i haslo." },
        { status: 400 }
      );
    }

    const existingUser = await getUserByUsername(parsed.data.username);

    if (existingUser) {
      return NextResponse.json(
        { error: "Uzytkownik o tej nazwie juz istnieje." },
        { status: 409 }
      );
    }

    const user = await createUser(parsed.data);

    return NextResponse.json(
      {
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName ?? user.username,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Rejestracja nie powiodla sie", error);

    return NextResponse.json(
      { error: "Rejestracja jest teraz niedostepna." },
      { status: 500 }
    );
  }
}
