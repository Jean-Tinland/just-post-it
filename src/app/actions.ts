"use server";

import { revalidatePath } from "next/cache";
import * as API from "@/services/api";
import type { PostItItem } from "@/@types/post-it";

export async function login(password: string) {
  return API.login(password);
}

export async function updatePostIt(authorization: string, postIt: PostItItem) {
  await API.updatePostIt(authorization, postIt);
  revalidatePath("/", "layout");
}

export async function updatePostItPosition(
  authorization: string,
  id: number,
  top: number,
  left: number,
) {
  await API.updatePostItPosition(authorization, id, top, left);
  revalidatePath("/", "layout");
}

export async function updatePostItSize(
  authorization: string,
  id: number,
  width: number,
  height: number,
) {
  await API.updatePostItSize(authorization, id, width, height);
  revalidatePath("/", "layout");
}

export async function updatePostItCategory(
  authorization: string,
  id: number,
  categoryId: number | null,
) {
  await API.updatePostItCategory(authorization, id, categoryId);
  revalidatePath("/", "layout");
}

export async function updatePostItContent(
  authorization: string,
  id: number,
  title: string,
  content: string,
) {
  await API.updatePostItContent(authorization, id, title, content);
  revalidatePath("/", "layout");
}

export async function updatePostItDate(
  authorization: string,
  id: number,
  dueDate: Date | null,
) {
  await API.updatePostItDate(authorization, id, dueDate);
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
) {
  await API.createPostIt(authorization, categoryId, top, left);
  revalidatePath("/", "layout");
}
