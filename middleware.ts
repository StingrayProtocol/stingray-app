import { NextResponse } from "next/server";

export function middleware() {
  // Create a response object to modify headers
  const response = NextResponse.next();

  // Set global no-cache headers
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("Surrogate-Control", "no-store");

  return response;
}

// Apply the middleware to API routes
export const config = {
  matcher: "/api/:path*", // This ensures it applies to all routes under /api
};
