import { NextRequest, NextResponse } from "next/server";
import * as FileSystem from "@/services/filesystem";
import * as Auth from "@/services/auth";

export async function GET(request: NextRequest) {
  try {
    await Auth.check(request);

    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing post-it ID" },
        { status: 400 }
      );
    }

    const postIt = await FileSystem.getPostIt(Number(id));

    if (!postIt) {
      return NextResponse.json({ error: "Post-it not found" }, { status: 404 });
    }

    return NextResponse.json(postIt);
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await Auth.check(request);

    const { categoryId = null, top = 10, left = 10 } = await request.json();

    const id = await FileSystem.createPostIt(categoryId, top, left);

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

    await FileSystem.deletePostIt(Number(id));

    return NextResponse.json({ message: "Post-it deleted" });
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await Auth.check(request);

    const { id, categoryId, title, content, dueDate, bounds, minimized } =
      await request.json();

    const updates: any = {};

    if (categoryId !== undefined) updates.categoryId = categoryId;
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (dueDate !== undefined)
      updates.dueDate = dueDate ? new Date(dueDate) : null;
    if (bounds !== undefined) updates.bounds = bounds;
    if (minimized !== undefined) updates.minimized = minimized;

    await FileSystem.updatePostIt(id, updates);

    return NextResponse.json({ message: "Post-it updated" });
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}
