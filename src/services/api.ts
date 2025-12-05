import * as Fetcher from "@/services/fetcher";
import type { PostItItemPatch } from "@/@types/post-it";
import type { CategoryItem } from "@/@types/category";

const apiUrl = process.env.API_URL as string;

export async function login(password: string) {
  return Fetcher.POST(`${apiUrl}/api/login`, { password });
}

export async function auth(authorization: string) {
  return Fetcher.GET(`${apiUrl}/api/auth`, undefined, { authorization });
}

export async function getPostIts(authorization: string) {
  return Fetcher.GET(`${apiUrl}/api/post-its`, undefined, { authorization });
}

export async function getPostIt(authorization: string, id: number) {
  return Fetcher.GET(`${apiUrl}/api/post-it`, { id }, { authorization });
}

export async function updatePostIt(
  authorization: string,
  data: PostItItemPatch
) {
  return Fetcher.PATCH(`${apiUrl}/api/post-it`, data, undefined, {
    authorization,
  });
}

export async function removePostIt(authorization: string, id: number) {
  return Fetcher.DELETE(`${apiUrl}/api/post-it`, { id }, { authorization });
}

export async function createPostIt(
  authorization: string,
  categoryId: number | null,
  top?: number,
  left?: number
): Promise<{ id: number }> {
  return Fetcher.POST(
    `${apiUrl}/api/post-it`,
    { top, left, categoryId },
    undefined,
    { authorization }
  );
}

export async function getCategories(authorization: string) {
  return Fetcher.GET(`${apiUrl}/api/categories`, undefined, { authorization });
}

export async function createCategory(authorization: string, position: number) {
  return Fetcher.POST(`${apiUrl}/api/category`, { position }, undefined, {
    authorization,
  });
}

export async function updateCategory(
  authorization: string,
  category: Partial<CategoryItem>
) {
  return Fetcher.PATCH(`${apiUrl}/api/category`, category, undefined, {
    authorization,
  });
}

export async function removeCategory(authorization: string, id: number) {
  return Fetcher.DELETE(`${apiUrl}/api/category`, { id }, { authorization });
}
