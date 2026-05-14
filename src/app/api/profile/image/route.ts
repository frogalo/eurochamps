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
    // Using absolute path for Docker volume persistence
    const uploadDir = join(process.cwd(), "public", "uploads");
    
    try {
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
    } catch (dirError) {
      console.error("Failed to create upload directory:", dirError);
      return NextResponse.json({ error: "Serwer nie moze zapisac pliku." }, { status: 500 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
    // Validate extension
    const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    if (!allowedExts.includes(ext)) {
      return NextResponse.json({ error: "Niedozwolony format pliku." }, { status: 400 });
    }

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
