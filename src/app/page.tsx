import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as API from "@/services/api";
import styles from "./page.module.css";
import Pad from "@/components/pad";
import Preview from "@/components/post-it/preview";
import { PostItItem } from "@/@types/post-it";
import type { CategoryItem } from "@/@types/category";
import PreviewContent from "@/components/post-it/preview-content";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function parsePositiveIntParam(value: string | string[] | undefined) {
  if (typeof value !== "string") {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export default async function Home({ searchParams }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("/login");
  }

  const params = await searchParams;
  const { previewId, c } = params;
  const categoryId = parsePositiveIntParam(c);

  let postIts: PostItItem[] = [];
  let categories: CategoryItem[] = [];

  try {
    [postIts, categories] = await Promise.all([
      API.getPostIts(token, categoryId),
      API.getCategories(token),
    ]);
  } catch {
    redirect("/login");
  }

  let postItPreview: PostItItem | null = null;
  const previewPostItId = parsePositiveIntParam(previewId);

  if (previewPostItId) {
    try {
      postItPreview = await API.getPostIt(token, previewPostItId);
    } catch {
      postItPreview = null;
    }
  }

  return (
    <main className={styles.main}>
      <Pad postIts={postIts} categories={categories} categoryId={categoryId} />
      <Preview
        isOpened={postItPreview !== null}
        title={postItPreview?.title || ""}
      >
        {postItPreview?.content && (
          <PreviewContent content={postItPreview.content} />
        )}
      </Preview>
    </main>
  );
}
