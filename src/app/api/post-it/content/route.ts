import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/services/database";
import * as Auth from "@/services/auth";

export async function PUT(request: NextRequest) {
  try {
    await Auth.check(request);

    const { id, title, content } = await request.json();

    const now = new Date();
    const nowISO = now.toISOString().replace("T", " ").split(".")[0];

    await sql.execute(
      `UPDATE post_it
       SET title = ?, content = ?, last_updated = ?
       WHERE id = ?`,
      [title, content, nowISO, id],
    );

    return NextResponse.json({ message: "Post-it updated" });
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}
