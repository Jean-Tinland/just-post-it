import { NextRequest, NextResponse } from "next/server";
import * as Auth from "@/services/auth";

export async function GET(request: NextRequest) {
  try {
    await Auth.check(request);
    return NextResponse.json({ message: "success" });
  } catch (e) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }
}
