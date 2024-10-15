import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/services/database";
import * as Auth from "@/services/auth";

export async function PUT(request: NextRequest) {
  try {
    await Auth.check(request);

    const { id, title, content, dueDate, bounds, categoryId, lastUpdated } =
      await request.json();
    const { top, left, width, height } = bounds;

    await sql.execute(
      `UPDATE post_it
       SET
        title = ?,
        content = ?,
        due_date = ?,
        top_position = ?,
        left_position = ?,
        width = ?,
        height = ?,
        category_id = ?,
        last_updated = ?
       WHERE id = ?`,
      [
        title,
        content,
        dueDate,
        top,
        left,
        width,
        height,
        categoryId,
        lastUpdated || "NOW()",
        id,
      ],
    );

    return NextResponse.json({ message: "Post-it updated" });
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await Auth.check(request);

    const { categoryId = null, top = 10, left = 10 } = await request.json();

    await sql.execute(
      `INSERT INTO post_it
        (top_position, left_position, category_id)
        VALUES
        (?, ?, ?)`,
      [top, left, categoryId],
    );
    const rows = await sql.get(`SELECT last_insert_rowid() AS id`);
    const { id } = rows[0];

    return NextResponse.json({ message: "Post-it created", id });
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await Auth.check(request);

    const url = request.nextUrl;
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Post-it not found" }, { status: 404 });
    }

    await sql.execute(`DELETE FROM post_it WHERE id = ?`, [id]);

    return NextResponse.json({ message: "Post-it deleted" });
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}
