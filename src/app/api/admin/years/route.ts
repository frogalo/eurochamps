import { NextResponse } from "next/server";

import { getAdminStages } from "@/lib/admin-data";
import { getRequestUserName, requireAdminUser } from "@/lib/auth";
import { ensureInitialContestData } from "@/lib/bootstrap";

// Legacy endpoint — redirects to stages data
export async function GET(request: Request) {
  try {
    await requireAdminUser(getRequestUserName(request));
    await ensureInitialContestData();

    const stages = await getAdminStages();
    
    // Group stages by year for backward compatibility
    const yearMap = new Map<string, { year: string; stages: typeof stages }>();
    for (const stage of stages) {
      if (!yearMap.has(stage.year)) {
        yearMap.set(stage.year, { year: stage.year, stages: [] });
      }
      yearMap.get(stage.year)!.stages.push(stage);
    }

    const years = Array.from(yearMap.values()).map((entry) => ({
      id: entry.year,
      name: entry.year,
      location: entry.stages[0]?.place ?? "",
      logo: entry.stages[0]?.logoUrl ?? "",
      stages: entry.stages,
    }));

    return NextResponse.json({ years });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Brak uzytkownika." }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Brak uprawnien administratora." }, { status: 403 });
    }
    console.error("Admin years error", error);
    return NextResponse.json({ error: "Operacja nie powiodla sie." }, { status: 500 });
  }
}
