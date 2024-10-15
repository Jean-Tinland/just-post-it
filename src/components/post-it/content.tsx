import * as React from "react";
import type { PostItItem } from "@/@types/post-it";
import styles from "./content.module.css";

type Props = {
  postIt: PostItItem;
  content: string;
  handleContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  scrollRef: React.RefObject<HTMLDivElement>;
};

export default function Content({
  postIt,
  content,
  handleContentChange,
  scrollRef,
}: Props) {
  const contentRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    updateHeight(scrollRef.current, contentRef.current);
  }, [postIt, scrollRef]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleContentChange(e);
    updateHeight(scrollRef.current, e.target);
  };

  return (
    <textarea
      ref={contentRef}
      className={styles.content}
      value={content}
      onChange={onChange}
    />
  );
}

function updateHeight(
  container: HTMLDivElement | null,
  target: HTMLTextAreaElement | null,
) {
  if (!target || !container) return;
  const currentScroll = container.scrollTop;
  target.style.minHeight = "inherit";
  target.style.minHeight = `${target.scrollHeight}px`;
  container.scrollTop = currentScroll;
}
