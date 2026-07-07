import { NextResponse } from "next/server";
import { z } from "zod";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma";

const schema = z.object({ email: z.string().trim().toLowerCase().email() });

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET env var is required.");
  return new TextEncoder().encode(secret);
}

function randomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

/**
 * Stub for this phase: no real email delivery yet (see project plan). Instead of storing
 * a reset token server-side, the code + email are embedded in a short-lived signed JWT
 * handed straight back to the client and displayed on screen — this keeps the reset step
 * genuinely verifiable (signed, expiring, checked server-side) without needing a new
 * database table just for this stub. Swap in a real email send + opaque token once a
 * transactional email provider is wired up.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) {
    return NextResponse.json({ error: "No account found with that email address" }, { status: 404 });
  }

  const code = randomCode();
  const token = await new SignJWT({ email: user.email, code })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(getSecretKey());

  return NextResponse.json({ code, token });
}
