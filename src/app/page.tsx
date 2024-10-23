import { cookies } from "next/headers";
import * as API from "@/services/api";
import styles from "./page.module.css";
import Pad from "@/components/pad";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value as string;

  const [postIts, categories] = await Promise.all([
    API.getPostIts(token),
    API.getCategories(token),
  ]);

  return (
    <main className={styles.main}>
      <Pad postIts={postIts} categories={categories} />
    </main>
  );
}
