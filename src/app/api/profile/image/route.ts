import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

import { prisma } from "@/lib/prisma";
import { getRequestUserName } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const username = getRequestUserName(request);
    if (!username) {
      return NextResponse.json({ error: "Brak autoryzacji." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Brak pliku." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads
    const uploadDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const ext = file.name.split('.').pop() || 'png';
    const filename = `user_${username}_${Date.now()}.${ext}`;
    const filepath = join(uploadDir, filename);

    await writeFile(filepath, buffer);

    const imagePath = `/uploads/${filename}`;

    // Update user in DB
    const updatedUser = await prisma.user.update({
      where: { username },
      data: { imagePath },
    });

    return NextResponse.json({ 
      success: true, 
      imagePath: updatedUser.imagePath 
    });

  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Wystapil blad podczas przesylania zdjecia." },
      { status: 500 }
    );
  }
}
