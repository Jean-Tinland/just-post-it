import { NextRequest, NextResponse } from "next/server";
import * as FileSystem from "@/services/filesystem";
import * as Auth from "@/services/auth";
import type { PostItItem } from "@/@types/post-it";

export const runtime = "nodejs";

const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 100000;
const MIN_WIDTH = 240;
const MIN_HEIGHT = 180;
const MAX_WIDTH = 2400;
const MAX_HEIGHT = 2400;

function parsePositiveInt(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function parseNullableCategoryId(value: unknown): number | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  return parsePositiveInt(value);
}

function parseFiniteNumber(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return value;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export async function GET(request: NextRequest) {
  try {
    Auth.check(request);

    const { searchParams } = request.nextUrl;
    const id = parsePositiveInt(searchParams.get("id"));

    if (!id) {
      return NextResponse.json(
        { error: "Invalid post-it ID" },
        { status: 400 },
      );
    }

    const postIt = await FileSystem.getPostIt(id);

    if (!postIt) {
      return NextResponse.json({ error: "Post-it not found" }, { status: 404 });
    }

    return NextResponse.json(postIt);
  } catch (error) {
    if (Auth.isAuthError(error)) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Could not load post-it" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    Auth.check(request);

    const body = (await request.json().catch(() => null)) as {
      categoryId?: unknown;
      top?: unknown;
      left?: unknown;
    } | null;

    const parsedCategoryId = parseNullableCategoryId(body?.categoryId);
    if (body?.categoryId !== undefined && parsedCategoryId === undefined) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 },
      );
    }

    const top = body?.top === undefined ? 10 : parseFiniteNumber(body.top);
    const left = body?.left === undefined ? 10 : parseFiniteNumber(body.left);

    if (top === null || left === null) {
      return NextResponse.json(
        { error: "Invalid post-it position" },
        { status: 400 },
      );
    }

    const id = await FileSystem.createPostIt(
      parsedCategoryId ?? null,
      clamp(top, 0, 100),
      clamp(left, 0, 100),
    );

    return NextResponse.json(
      { message: "Post-it created", id },
      { status: 201 },
    );
  } catch (error) {
    if (Auth.isAuthError(error)) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Could not create post-it" },
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
        { error: "Invalid post-it ID" },
        { status: 400 },
      );
    }

    await FileSystem.deletePostIt(id);

    return NextResponse.json({ message: "Post-it deleted" });
  } catch (error) {
    if (Auth.isAuthError(error)) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    if (error instanceof Error && /ENOENT|not found/i.test(error.message)) {
      return NextResponse.json({ error: "Post-it not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Could not delete post-it" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    Auth.check(request);

    const body = (await request.json().catch(() => null)) as {
      id?: unknown;
      categoryId?: unknown;
      title?: unknown;
      content?: unknown;
      dueDate?: unknown;
      bounds?: unknown;
      minimized?: unknown;
    } | null;

    const id = parsePositiveInt(body?.id);
    if (!id) {
      return NextResponse.json(
        { error: "Invalid post-it ID" },
        { status: 400 },
      );
    }

    const updates: Partial<
      Omit<PostItItem, "bounds"> & { bounds?: Partial<PostItItem["bounds"]> }
    > = {};

    if (body?.categoryId !== undefined) {
      const parsedCategoryId = parseNullableCategoryId(body.categoryId);
      if (parsedCategoryId === undefined) {
        return NextResponse.json(
          { error: "Invalid category ID" },
          { status: 400 },
        );
      }

      updates.categoryId = parsedCategoryId;
    }

    if (body?.title !== undefined) {
      if (
        typeof body.title !== "string" ||
        body.title.length > MAX_TITLE_LENGTH
      ) {
        return NextResponse.json({ error: "Invalid title" }, { status: 400 });
      }

      updates.title = body.title;
    }

    if (body?.content !== undefined) {
      if (
        typeof body.content !== "string" ||
        body.content.length > MAX_CONTENT_LENGTH
      ) {
        return NextResponse.json({ error: "Invalid content" }, { status: 400 });
      }

      updates.content = body.content;
    }

    if (body?.dueDate !== undefined) {
      if (body.dueDate === null || body.dueDate === "") {
        updates.dueDate = null;
      } else {
        const parsedDate = new Date(String(body.dueDate));
        if (Number.isNaN(parsedDate.getTime())) {
          return NextResponse.json(
            { error: "Invalid due date" },
            { status: 400 },
          );
        }

        updates.dueDate = parsedDate;
      }
    }

    if (body?.bounds !== undefined) {
      if (!body.bounds || typeof body.bounds !== "object") {
        return NextResponse.json({ error: "Invalid bounds" }, { status: 400 });
      }

      const boundsPatch: Partial<PostItItem["bounds"]> = {};
      const bounds = body.bounds as Record<string, unknown>;

      if (bounds.top !== undefined) {
        const top = parseFiniteNumber(bounds.top);
        if (top === null) {
          return NextResponse.json(
            { error: "Invalid bounds top" },
            { status: 400 },
          );
        }

        boundsPatch.top = clamp(top, 0, 100);
      }

      if (bounds.left !== undefined) {
        const left = parseFiniteNumber(bounds.left);
        if (left === null) {
          return NextResponse.json(
            { error: "Invalid bounds left" },
            { status: 400 },
          );
        }

        boundsPatch.left = clamp(left, 0, 100);
      }

      if (bounds.width !== undefined) {
        const width = parseFiniteNumber(bounds.width);
        if (width === null) {
          return NextResponse.json(
            { error: "Invalid bounds width" },
            { status: 400 },
          );
        }

        boundsPatch.width = clamp(Math.round(width), MIN_WIDTH, MAX_WIDTH);
      }

      if (bounds.height !== undefined) {
        const height = parseFiniteNumber(bounds.height);
        if (height === null) {
          return NextResponse.json(
            { error: "Invalid bounds height" },
            { status: 400 },
          );
        }

        boundsPatch.height = clamp(Math.round(height), MIN_HEIGHT, MAX_HEIGHT);
      }

      if (Object.keys(boundsPatch).length) {
        updates.bounds = boundsPatch;
      }
    }

    if (body?.minimized !== undefined) {
      if (body.minimized !== 0 && body.minimized !== 1) {
        return NextResponse.json(
          { error: "Invalid minimized flag" },
          { status: 400 },
        );
      }

      updates.minimized = body.minimized;
    }

    if (!Object.keys(updates).length) {
      return NextResponse.json(
        { error: "No valid post-it updates provided" },
        { status: 400 },
      );
    }

    await FileSystem.updatePostIt(id, updates);

    return NextResponse.json({ message: "Post-it updated" });
  } catch (error) {
    if (Auth.isAuthError(error)) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    if (error instanceof Error && /ENOENT|not found/i.test(error.message)) {
      return NextResponse.json({ error: "Post-it not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Could not update post-it" },
      { status: 500 },
    );
  }
}
