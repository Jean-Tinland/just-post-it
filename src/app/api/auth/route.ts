import { NextRequest, NextResponse } from "next/server";
import * as Auth from "@/services/auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    Auth.check(request);
    return NextResponse.json({ message: "success" });
  } catch (error) {
    if (Auth.isAuthError(error)) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Authentication check failed" },
      { status: 500 },
    );
  }
}
