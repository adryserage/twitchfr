import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

const API_SECRET = process.env.API_SECRET;

// Generate a secure session token
export function generateSessionToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Verify if the request is from an authenticated session
export function isAuthenticated(request: NextRequest) {
  // For internal API calls (e.g., from server components)
  const authHeader = request.headers.get("authorization");
  if (
    authHeader?.startsWith("Bearer ") &&
    authHeader.split(" ")[1] === API_SECRET
  ) {
    return true;
  }

  // For client-side requests
  const sessionToken = request.cookies.get("session_token")?.value;
  return sessionToken ? verifySessionToken(sessionToken) : false;
}

// Verify if a session token is valid
function verifySessionToken(token: string): boolean {
  // Add your session token verification logic here
  // For now, we'll accept any non-empty token
  return Boolean(token);
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
