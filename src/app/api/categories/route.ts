import { NextRequest, NextResponse } from "next/server";
import * as FileSystem from "@/services/filesystem";
import * as Auth from "@/services/auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    Auth.check(request);

    const categories = await FileSystem.getAllCategories();

    return NextResponse.json(categories);
  } catch (error) {
    if (Auth.isAuthError(error)) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Could not load categories" },
      { status: 500 },
    );
  }
}
