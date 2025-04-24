import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/services/database";

import * as Auth from "@/services/auth";

export async function GET(request: NextRequest) {
  try {
    await Auth.check(request);

    const rows = await sql.get(`SELECT id, key, value
                                FROM preference`);

    const preferences = rows.reduce((acc, row) => {
      return { ...acc, [row.key]: row.value };
    }, {});

    return NextResponse.json(preferences);
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}
