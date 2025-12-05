import { cookies } from "next/headers";
import * as API from "@/services/api";
import styles from "./page.module.css";
import Pad from "@/components/pad";
import Preview from "@/components/post-it/preview";
import { PostItItem } from "@/@types/post-it";
import PreviewContent from "@/components/post-it/preview-content";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value as string;
  const { previewId } = await searchParams;

  console.log({ previewId });

  const [postIts, categories] = await Promise.all([
    API.getPostIts(token),
    API.getCategories(token),
  ]);

  let postItPreview: PostItItem | null = null;

  if (previewId) {
    postItPreview = await API.getPostIt(token, Number(previewId));
  }

  return (
    <main className={styles.main}>
      <Pad postIts={postIts} categories={categories} />
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
