import { NextResponse } from "next/server";
import { z } from "zod";

import { updateStage, deleteStage } from "@/lib/admin-data";
import { getRequestUserName, requireAdminUser } from "@/lib/auth";

const updateStageSchema = z.object({
  name: z.string().trim().min(1).max(100),
  year: z.string().trim().min(1).max(10),
  place: z.string().trim().min(1).max(100),
  logoUrl: z.string().trim().max(500).default(""),
  round: z.string().trim().max(100).default(""),
  date: z.string().trim().max(50).default(""),
  tagline: z.string().trim().max(200).default(""),
  description: z.string().trim().max(500).default(""),
  status: z.enum(["OPEN", "LOCKED"]).optional(),
  disabledArtists: z.array(z.string()).optional(),
});

export async function PUT(
  request: Request,
  context: { params: Promise<{ stageId: string }> }
) {
  try {
    await requireAdminUser(getRequestUserName(request));
    const { stageId } = await context.params;

    const parsed = updateStageSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Niepoprawne dane konkursu." }, { status: 400 });
    }

    const stage = await updateStage(stageId, parsed.data);
    return NextResponse.json({ stage });
  } catch (error) {
    return handleAdminError(error);
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ stageId: string }> }
) {
  try {
    await requireAdminUser(getRequestUserName(request));
    const { stageId } = await context.params;

    await deleteStage(stageId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleAdminError(error);
  }
}

function handleAdminError(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return NextResponse.json({ error: "Brak uzytkownika." }, { status: 401 });
  }

  if (error instanceof Error && error.message === "FORBIDDEN") {
    return NextResponse.json({ error: "Brak uprawnien administratora." }, { status: 403 });
  }

  console.error("Admin stage mutation error", error);
  return NextResponse.json({ error: "Zmiana konkursu nie powiodla sie." }, { status: 500 });
}
