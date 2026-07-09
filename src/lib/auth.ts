import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { getSession } from "./session";

const BCRYPT_COST = 10;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export type CurrentUser = {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  role: "CUSTOMER" | "ADMIN";
};

/**
 * Looks up the current user fresh from the database on every call (rather than trusting
 * the role baked into the session JWT at login time), so a role change or account edit
 * takes effect immediately instead of waiting for the session to expire.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, firstName: true, lastName: true, email: true, phone: true, role: true },
  });
  return user;
}

export async function requireAdmin(): Promise<CurrentUser | null> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") return null;
  return user;
}
