import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/services/database";
import * as Auth from "@/services/auth";

export async function GET(request: NextRequest) {
  try {
    await Auth.check(request);

    const rows = await sql.get(`SELECT
                d.id,
                d.title,
                d.content,
                d.due_date,
                d.top_position,
                d.left_position,
                d.width,
                d.height,
                d.last_updated,
                d.category_id,
                c.name as category_name,
                c.color as category_color
              FROM post_it d
              LEFT JOIN category c ON d.category_id = c.id
              ORDER BY d.last_updated`);

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
      lastUpdated: row.last_updated,
      categoryId: row.category_id,
      categoryName: row.category_name,
      categoryColor: row.category_color,
    }));

    return NextResponse.json(postIts);
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}
