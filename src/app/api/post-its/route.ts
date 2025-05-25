import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/services/database";
import * as Auth from "@/services/auth";

export async function GET(request: NextRequest) {
  try {
    await Auth.check(request);

    const rows = await sql.get(`SELECT
                p.id,
                p.title,
                p.content,
                p.due_date,
                p.top_position,
                p.left_position,
                p.width,
                p.height,
                p.category_id,
                p.last_updated,
                p.minimized,
                c.name as category_name,
                c.color as category_color
              FROM post_it p
              LEFT JOIN category c ON p.category_id = c.id
              ORDER BY p.last_updated`);

    const postIts = rows.map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      dueDate: row.due_date,
      bounds: {
        top: row.top_position,
        left: row.left_position,
        width: row.width,
        height: row.height,
      },
      categoryId: row.category_id,
      lastUpdated: row.last_updated,
      minimized: row.minimized,
      categoryName: row.category_name,
      categoryColor: row.category_color,
    }));

    return NextResponse.json(postIts);
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}
