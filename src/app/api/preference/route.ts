import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/services/database";

import * as Auth from "@/services/auth";

export async function PATCH(request: NextRequest) {
  try {
    await Auth.check(request);

    const { key, value } = await request.json();

    const existingValue = await sql.get(
      `SELECT COUNT(*) AS count FROM preference WHERE key = ?`,
      [key],
    );
    const { count } = existingValue[0];

    if (!count) {
      await sql.execute(`INSERT INTO preference (key, value) VALUES (?, ?)`, [
        key,
        value,
      ]);
      return NextResponse.json({ message: "Preference created" });
    }

    await sql.execute(
      `UPDATE preference
         SET value = ?
         WHERE key = ?`,
      [value, key],
    );

    return NextResponse.json({ message: "Preference updated" });
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}
