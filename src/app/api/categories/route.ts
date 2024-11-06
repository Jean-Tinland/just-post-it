import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/services/database";

import * as Auth from "@/services/auth";

export async function GET(request: NextRequest) {
  try {
    await Auth.check(request);

    const rows = await sql.get(`SELECT id, name, color, position
                                FROM category
                                ORDER BY position ASC`);

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}
