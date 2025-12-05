import { NextRequest, NextResponse } from "next/server";
import * as FileSystem from "@/services/filesystem";
import * as Auth from "@/services/auth";

export async function GET(request: NextRequest) {
  try {
    await Auth.check(request);

    const categories = await FileSystem.getAllCategories();

    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}
