import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request: NextRequest, { params }: { params: Promise<{ filename: string }> | { filename: string } }) {
    const resolvedParams = await params;
    const filename = resolvedParams.filename;

    const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");
    
    // Prevent directory traversal
    const safeFilename = path.normalize(filename).replace(/^(\.\.(\/|\\|$))+/, "");
    const filepath = path.join(uploadDir, safeFilename);

    try {
        const fileBuffer = await fs.readFile(filepath);
        const ext = safeFilename.split('.').pop()?.toLowerCase();
        let mimeType = "image/jpeg";
        if (ext === "png") mimeType = "image/png";
        else if (ext === "gif") mimeType = "image/gif";
        else if (ext === "webp") mimeType = "image/webp";
        else if (ext === "svg") mimeType = "image/svg+xml";

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": mimeType,
                "Cache-Control": "public, max-age=86400"
            }
        });
    } catch (e) {
        return new NextResponse("File not found", { status: 404 });
    }
}
