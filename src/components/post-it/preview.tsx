"use client";

import Dialog from "jt-design-system/es/dialog";
import styles from "./preview.module.css";
import { useRouter } from "next/navigation";

type Props = {
  isOpened: boolean;
  title: string;
  children: React.ReactNode;
};

export default function Preview({ isOpened, title, children }: Props) {
  const router = useRouter();

  const close = () => {
    router.push("/");
  };

  return (
    <Dialog
      className={styles.dialog}
      isOpened={isOpened}
      close={close}
      closeButtonVariant="transparent"
    >
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
      </div>
      <div className={styles.content}>{children}</div>
    </Dialog>
  );
}
