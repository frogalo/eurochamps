import { compare, hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";

const PASSWORD_ROUNDS = 12;

export async function createUser(input: {
  username: string;
  password: string;
  displayName?: string;
}) {
  const passwordHash = await hash(input.password, PASSWORD_ROUNDS);

  return prisma.user.create({
    data: {
      username: input.username,
      passwordHash,
      displayName: input.displayName,
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

  return user;
}

export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
  });
}
