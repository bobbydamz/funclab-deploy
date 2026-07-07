import { NextResponse } from "next/server";
import { z } from "zod";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

const schema = z.object({
  token: z.string(),
  code: z.string().trim(),
  newPassword: z.string().min(8),
});

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET env var is required.");
  return new TextEncoder().encode(secret);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  let payload: { email: string; code: string };
  try {
    const verified = await jwtVerify(parsed.data.token, getSecretKey());
    payload = verified.payload as unknown as { email: string; code: string };
  } catch {
    return NextResponse.json({ error: "This reset code has expired" }, { status: 400 });
  }

  if (payload.code !== parsed.data.code.trim().toUpperCase()) {
    return NextResponse.json({ error: "Invalid reset code" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user) return NextResponse.json({ error: "Account not found" }, { status: 404 });

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  return NextResponse.json({ ok: true });
}
