import { NextRequest, NextResponse } from "next/server";
import * as FileSystem from "@/services/filesystem";
import * as Auth from "@/services/auth";

export async function GET(request: NextRequest) {
  try {
    await Auth.check(request);

    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get("categoryId");

    let postIts = await FileSystem.getAllPostIts();

    if (categoryId) {
      const categoryIdNum = Number(categoryId);
      postIts = postIts.filter((postIt) => postIt.categoryId === categoryIdNum);
    }

    return NextResponse.json(postIts);
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}
