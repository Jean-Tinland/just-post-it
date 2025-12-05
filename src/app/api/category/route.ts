import { NextRequest, NextResponse } from "next/server";
import * as FileSystem from "@/services/filesystem";
import * as Auth from "@/services/auth";
import { CategoryItem } from "@/@types/category";

export async function POST(request: NextRequest) {
  try {
    await Auth.check(request);

    const { position } = await request.json();

    const id = await FileSystem.createCategory(position);

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
        { status: 404 }
      );
    }

    await FileSystem.deleteCategory(Number(id));

    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await Auth.check(request);

    const { id, name, color, position } = await request.json();

    console.log({ id, name, color, position });

    const updates: Record<string, Partial<CategoryItem>> = {};

    if (name !== undefined) updates.name = name;
    if (color !== undefined) updates.color = color;
    if (position !== undefined) updates.position = position;

    await FileSystem.updateCategory(id, updates);

    return NextResponse.json({ message: "Category updated" });
  } catch (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
}
