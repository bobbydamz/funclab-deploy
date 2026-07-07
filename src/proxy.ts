import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

// Edge-compatible first line of defense: verifies the session JWT's signature and role
// claim without a database round-trip. Route handlers under /api/admin/** additionally
// call requireAdmin() (lib/auth.ts), which re-checks the role fresh from the database —
// that second check is the authoritative one, so a revoked admin can't keep access just
// because their still-valid JWT was issued before the revoke.
export async function proxy(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session || session.role !== "ADMIN") {
    const isApi = req.nextUrl.pathname.startsWith("/api/");
    if (isApi) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/account", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
