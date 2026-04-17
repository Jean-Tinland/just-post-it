import { NextRequest, NextResponse } from "next/server";
import * as FileSystem from "@/services/filesystem";
import * as Auth from "@/services/auth";
import type { CategoryItem } from "@/@types/category";

export const runtime = "nodejs";

const MAX_CATEGORY_NAME_LENGTH = 80;
const MAX_CATEGORY_COLOR_LENGTH = 80;
const MAX_CATEGORY_POSITION = 10000;

function parsePositiveInt(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export async function POST(request: NextRequest) {
  try {
    Auth.check(request);

    const body = (await request.json().catch(() => null)) as {
      position?: unknown;
    } | null;

    const position = parsePositiveInt(body?.position);
    if (!position || position > MAX_CATEGORY_POSITION) {
      return NextResponse.json(
        { error: "Invalid category position" },
        { status: 400 },
      );
    }

    const id = await FileSystem.createCategory(position);

    return NextResponse.json(
      { message: "Category created", id },
      { status: 201 },
    );
  } catch (error) {
    if (Auth.isAuthError(error)) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Could not create category" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    Auth.check(request);

    const url = request.nextUrl;
    const id = parsePositiveInt(url.searchParams.get("id"));

    if (!id) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 },
      );
    }

    await FileSystem.deleteCategory(id);

    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    if (Auth.isAuthError(error)) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Could not delete category" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    Auth.check(request);

    const body = (await request.json().catch(() => null)) as {
      id?: unknown;
      name?: unknown;
      color?: unknown;
      position?: unknown;
    } | null;

    const id = parsePositiveInt(body?.id);
    if (!id) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 },
      );
    }

    const updates: Partial<Omit<CategoryItem, "id">> = {};

    if (body?.name !== undefined) {
      if (typeof body.name !== "string") {
        return NextResponse.json(
          { error: "Invalid category name" },
          { status: 400 },
        );
      }

      const normalizedName = body.name.trim();
      if (!normalizedName || normalizedName.length > MAX_CATEGORY_NAME_LENGTH) {
        return NextResponse.json(
          { error: "Invalid category name" },
          { status: 400 },
        );
      }

      updates.name = normalizedName;
    }

    if (body?.color !== undefined) {
      if (typeof body.color !== "string") {
        return NextResponse.json(
          { error: "Invalid category color" },
          { status: 400 },
        );
      }

      const normalizedColor = body.color.trim();
      if (
        !normalizedColor ||
        normalizedColor.length > MAX_CATEGORY_COLOR_LENGTH
      ) {
        return NextResponse.json(
          { error: "Invalid category color" },
          { status: 400 },
        );
      }

      updates.color = normalizedColor;
    }

    if (body?.position !== undefined) {
      const parsedPosition = parsePositiveInt(body.position);
      if (!parsedPosition || parsedPosition > MAX_CATEGORY_POSITION) {
        return NextResponse.json(
          { error: "Invalid category position" },
          { status: 400 },
        );
      }

      updates.position = parsedPosition;
    }

    if (!Object.keys(updates).length) {
      return NextResponse.json(
        { error: "No valid category updates provided" },
        { status: 400 },
      );
    }

    await FileSystem.updateCategory(id, updates);

    return NextResponse.json({ message: "Category updated" });
  } catch (error) {
    if (Auth.isAuthError(error)) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    if (error instanceof Error && /not found/i.test(error.message)) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Could not update category" },
      { status: 500 },
    );
  }
}
