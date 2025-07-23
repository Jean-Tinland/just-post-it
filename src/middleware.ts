import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as API from "@/services/api";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const redirect = request.nextUrl.clone();
  redirect.pathname = "/login";

  if (token) {
    try {
      const result = await API.auth(token);
      if (result.error) {
        return NextResponse.redirect(redirect);
      } else {
        return NextResponse.next();
      }
    } catch (error) {
      console.error(error);
      return NextResponse.redirect(redirect);
    }
  }

  return NextResponse.redirect(redirect);
}

export const config = {
  matcher: [
    "/((?!api|login|images|_next/static|_next/image|favicon.ico|manifest.webmanifest).*)",
  ],
};
