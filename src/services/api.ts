import * as Fetcher from "@/services/fetcher";
import type { PostItItem } from "@/@types/post-it";

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

export async function updatePostIt(authorization: string, data: PostItItem) {
  return Fetcher.PUT(`${apiUrl}/api/post-it`, data, undefined, {
    authorization,
  });
}

export async function updatePostItSize(
  authorization: string,
  id: number,
  width: number,
  height: number,
) {
  return Fetcher.PUT(
    `${apiUrl}/api/post-it/resize`,
    { id, width, height },
    undefined,
    { authorization },
  );
}

export async function updatePostItPosition(
  authorization: string,
  id: number,
  top: number,
  left: number,
) {
  return Fetcher.PUT(
    `${apiUrl}/api/post-it/move`,
    { id, top, left },
    undefined,
    {
      authorization,
    },
  );
}
updatePostIt;
export async function updatePostItCategory(
  authorization: string,
  id: number,
  categoryId: number | null,
) {
  return Fetcher.PUT(
    `${apiUrl}/api/post-it/category`,
    { id, categoryId },
    undefined,
    { authorization },
  );
}

export async function updatePostItContent(
  authorization: string,
  id: number,
  title: string,
  content: string,
) {
  return Fetcher.PUT(
    `${apiUrl}/api/post-it/content`,
    { id, title, content },
    undefined,
    { authorization },
  );
}

export async function updatePostItDate(
  authorization: string,
  id: number,
  dueDate: Date | null,
) {
  return Fetcher.PUT(`${apiUrl}/api/post-it/date`, { id, dueDate }, undefined, {
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
  left?: number,
) {
  return Fetcher.POST(
    `${apiUrl}/api/post-it`,
    { top, left, categoryId },
    undefined,
    { authorization },
  );
}

export async function getCategories(authorization: string) {
  return Fetcher.GET(`${apiUrl}/api/categories`, undefined, { authorization });
}
