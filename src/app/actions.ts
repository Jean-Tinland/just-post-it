"use server";

import { revalidatePath } from "next/cache";
import * as API from "@/services/api";
import type { PostItItemPatch } from "@/@types/post-it";

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
) {
  await API.createPostIt(authorization, categoryId, top, left);
  revalidatePath("/", "layout");
}
