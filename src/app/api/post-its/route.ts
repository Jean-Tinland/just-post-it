import { NextRequest, NextResponse } from "next/server";
import * as FileSystem from "@/services/filesystem";
import * as Auth from "@/services/auth";

export const runtime = "nodejs";

function parsePositiveInt(value: string | null) {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export async function GET(request: NextRequest) {
  try {
    Auth.check(request);

    const searchParams = request.nextUrl.searchParams;
    const rawCategoryId = searchParams.get("categoryId");

    const categoryId = rawCategoryId ? parsePositiveInt(rawCategoryId) : null;
    if (rawCategoryId && categoryId === null) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 },
      );
    }

    let postIts = await FileSystem.getAllPostIts();

    if (categoryId !== null) {
      postIts = postIts.filter((postIt) => postIt.categoryId === categoryId);
    }

    return NextResponse.json(postIts);
  } catch (error) {
    if (Auth.isAuthError(error)) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Could not load post-its" },
      { status: 500 },
    );
  }
}
