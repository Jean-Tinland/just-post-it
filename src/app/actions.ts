"use server";

import { revalidatePath } from "next/cache";
import * as API from "@/services/api";
import type { PostItItemPatch } from "@/@types/post-it";
import type { CategoryItem } from "@/@types/category";

export async function login(password: string) {
  return API.login(password);
}

export async function updatePostIt(
  authorization: string,
  postIt: PostItItemPatch,
) {
  await API.updatePostIt(authorization, postIt);
  revalidatePath("/", "layout");
}

export async function deletePostIt(authorization: string, postItId: number) {
  await API.removePostIt(authorization, postItId);
  revalidatePath("/", "layout");
}

export async function createPostIt(
  authorization: string,
  categoryId: number | null,
  top?: number,
  left?: number,
): Promise<{ id: number }> {
  const { id } = await API.createPostIt(authorization, categoryId, top, left);
  revalidatePath("/", "layout");
  return { id };
}

export async function createCategory(authorization: string, position: number) {
  await API.createCategory(authorization, position);
  revalidatePath("/", "layout");
}

export async function updateCategory(
  authorization: string,
  category: Partial<CategoryItem>,
) {
  await API.updateCategory(authorization, category);
  revalidatePath("/", "layout");
}

export async function removeCategory(authorization: string, id: number) {
  await API.removeCategory(authorization, id);
  revalidatePath("/", "layout");
}

export async function updatePreference(
  authorization: string,
  key: string,
  value: string,
) {
  await API.updatePreference(authorization, key, value);
  revalidatePath("/", "layout");
}
