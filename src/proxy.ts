import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

// Edge-compatible first line of defense for /api/admin/**: verifies the session JWT's
// signature and role claim without a database round-trip. Those route handlers
// additionally call requireAdmin() (lib/auth.ts), which re-checks the role fresh from
// the database — that second check is the authoritative one, so a revoked admin can't
// keep access just because their still-valid JWT was issued before the revoke.
//
// /admin/** pages are deliberately NOT redirected here: admin/layout.tsx renders a
// login screen in place (via the same authoritative requireAdmin() check) rather than
// bouncing to /account, so /admin is a self-contained entry point.
export async function proxy(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
