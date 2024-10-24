import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/services/database";

import * as Auth from "@/services/auth";

export async function GET(request: NextRequest) {
  try {
    await Auth.check(request);

    const rows = await sql.get(`SELECT id, name, color
                                FROM category
                                ORDER BY position ASC`);

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await Auth.check(request);

    const { name, color, position } = await request.json();

    await sql.execute(
      `INSERT INTO category
        (name, color, position)
        VALUES
        (?, ?, ?)`,
      [name, color, position],
    );

    const rows = await sql.get(
      `SELECT last_insert_rowid() AS id FROM category`,
    );
    const { id } = rows[0];

    return NextResponse.json({ message: "Category created", id });
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
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    await sql.execute(`DELETE FROM category WHERE id = ?`, [id]);

    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await Auth.check(request);

    const { id, name, color, position } = await request.json();

    if (name !== undefined) {
      await sql.execute(
        `UPDATE category
         SET name = ?
         WHERE id = ?`,
        [name, id],
      );
    }

    if (color !== undefined) {
      await sql.execute(
        `UPDATE category
         SET color = ?
         WHERE id = ?`,
        [color, id],
      );
    }

    if (position !== undefined) {
      await sql.execute(
        `UPDATE category
         SET position = ?
         WHERE id = ?`,
        [position, id],
      );
    }

    return NextResponse.json({ message: "Category updated" });
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}
