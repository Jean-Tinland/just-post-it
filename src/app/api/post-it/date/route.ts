import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/services/database";
import * as Auth from "@/services/auth";

export async function PUT(request: NextRequest) {
  try {
    await Auth.check(request);

    const { id, dueDate } = await request.json();

    await sql.execute(
      `UPDATE post_it
       SET due_date = ?
       WHERE id = ?`,
      [dueDate, id],
    );

    return NextResponse.json({ message: "Post-it updated" });
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}
