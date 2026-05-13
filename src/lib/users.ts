import { Role } from "@prisma/client";
import { compare, hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";

const PASSWORD_ROUNDS = 12;

export async function createUser(input: {
  username: string;
  password: string;
  displayName?: string;
}) {
  const passwordHash = await hash(input.password, PASSWORD_ROUNDS);
  const normalizedUsername = input.username.trim().toLowerCase();

  return prisma.user.create({
    data: {
      username: input.username,
      passwordHash,
      displayName: input.displayName,
      role: normalizedUsername === "admin" ? Role.ADMIN : Role.USER,
    },
  });
}

export async function verifyUserPassword(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return null;
  }

  const isValid = await compare(password, user.passwordHash);

  if (!isValid) {
    return null;
  }

  if (user.role !== Role.ADMIN && user.username.trim().toLowerCase() === "admin") {
    return prisma.user.update({
      where: { id: user.id },
      data: { role: Role.ADMIN },
    });
  }

  return user;
}

export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
  });
}
