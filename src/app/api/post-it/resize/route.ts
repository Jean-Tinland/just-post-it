import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/services/database";
import * as Auth from "@/services/auth";

export async function PUT(request: NextRequest) {
  try {
    await Auth.check(request);

    const { id, width, height } = await request.json();

    const now = new Date();
    const nowISO = now.toISOString().replace("T", " ").split(".")[0];

    await sql.execute(
      `UPDATE post_it
       SET width = ?, height = ?, last_updated = ?
       WHERE id = ?`,
      [width, height, nowISO, id],
    );

    return NextResponse.json({ message: "Post-it updated" });
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}
