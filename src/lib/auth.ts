import { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function requireAdminUser(userName: string | null | undefined) {
  const normalizedUserName = userName?.trim();

  if (!normalizedUserName) {
    throw new Error("UNAUTHORIZED");
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: normalizedUserName },
        { displayName: normalizedUserName },
      ],
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      role: true,
    },
  });

  if (!user || user.role !== Role.ADMIN) {
    throw new Error("FORBIDDEN");
  }

  return user;
}

export function getRequestUserName(request: Request) {
  return request.headers.get("x-user-name");
}
