"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import * as API from "@/services/api";
import type { PostItItemPatch } from "@/@types/post-it";
import type { CategoryItem } from "@/@types/category";

const DEFAULT_TOKEN_DURATION_DAYS = 90;

async function getAuthorizationToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Not authenticated");
  }

  return token;
}

export async function login(password: string) {
  const response = (await API.login(password)) as {
    token?: unknown;
    expiresInDays?: unknown;
    error?: unknown;
  };

  if (typeof response?.token !== "string" || !response.token.trim()) {
    const message =
      typeof response?.error === "string" && response.error.trim()
        ? response.error
        : "Login failed";
    throw new Error(message);
  }

  const durationDays = Number(response.expiresInDays);
  const safeDurationDays =
    Number.isFinite(durationDays) && durationDays > 0
      ? Math.trunc(durationDays)
      : DEFAULT_TOKEN_DURATION_DAYS;

  const cookieStore = await cookies();
  cookieStore.set("token", response.token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: safeDurationDays * 24 * 60 * 60,
  });

  return { success: true };
}

export async function updatePostIt(postIt: PostItItemPatch) {
  const authorization = await getAuthorizationToken();
  await API.updatePostIt(authorization, postIt);
  revalidatePath("/", "layout");
}

export async function deletePostIt(postItId: number) {
  const authorization = await getAuthorizationToken();
  await API.removePostIt(authorization, postItId);
  revalidatePath("/", "layout");
}

export async function createPostIt(
  categoryId: number | null,
  top?: number,
  left?: number,
): Promise<{ id: number }> {
  const authorization = await getAuthorizationToken();
  const { id } = await API.createPostIt(authorization, categoryId, top, left);
  revalidatePath("/", "layout");
  return { id };
}

export async function createCategory(position: number) {
  const authorization = await getAuthorizationToken();
  await API.createCategory(authorization, position);
  revalidatePath("/", "layout");
}

export async function updateCategory(category: Partial<CategoryItem>) {
  const authorization = await getAuthorizationToken();
  await API.updateCategory(authorization, category);
  revalidatePath("/", "layout");
}

export async function removeCategory(id: number) {
  const authorization = await getAuthorizationToken();
  await API.removeCategory(authorization, id);
  revalidatePath("/", "layout");
}
