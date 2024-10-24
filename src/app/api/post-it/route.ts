import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/services/database";
import * as Auth from "@/services/auth";

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
    const rows = await sql.get(`SELECT last_insert_rowid() AS id FROM post_it`);
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

export async function PATCH(request: NextRequest) {
  try {
    await Auth.check(request);

    const { id, categoryId, title, content, dueDate, bounds } =
      await request.json();
    const { top, left, width, height } = bounds || {};

    const now = new Date();
    const nowISO = now.toISOString().replace("T", " ").split(".")[0];

    if (categoryId !== undefined) {
      await sql.execute(
        `UPDATE post_it
         SET category_id = ?
         WHERE id = ?`,
        [categoryId, id],
      );
    }

    if (title !== undefined && content !== undefined) {
      await sql.execute(
        `UPDATE post_it
         SET title = ?, content = ?, last_updated = ?
         WHERE id = ?`,
        [title, content, nowISO, id],
      );
    }

    if (dueDate !== undefined) {
      await sql.execute(
        `UPDATE post_it
         SET due_date = ?
         WHERE id = ?`,
        [dueDate, id],
      );
    }

    if (top !== undefined && left !== undefined) {
      await sql.execute(
        `UPDATE post_it
         SET top_position = ?, left_position = ?, last_updated = ?
         WHERE id = ?`,
        [top, left, nowISO, id],
      );
    }

    if (width !== undefined && height !== undefined) {
      await sql.execute(
        `UPDATE post_it
         SET width = ?, height = ?, last_updated = ?
         WHERE id = ?`,
        [width, height, nowISO, id],
      );
    }

    return NextResponse.json({ message: "Post-it updated" });
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}
