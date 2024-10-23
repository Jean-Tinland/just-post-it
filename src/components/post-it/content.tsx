import * as React from "react";
import type { PostItItem } from "@/@types/post-it";
import styles from "./content.module.css";

type Props = {
  postIt: PostItItem;
  content: string;
  handleContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  contentRef: React.RefObject<HTMLTextAreaElement>;
  dragged: boolean;
  handleHeightChange: () => void;
};

export default function Content({
  postIt,
  content,
  handleContentChange,
  contentRef,
  dragged,
  handleHeightChange,
}: Props) {
  React.useEffect(() => {
    handleHeightChange();
  }, [handleHeightChange]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleContentChange(e);
    handleHeightChange();
  };

  return (
    <textarea
      ref={contentRef}
      className={styles.content}
      value={content}
      onChange={onChange}
      spellCheck="false"
      readOnly={dragged}
    />
  );
}
