import * as React from "react";
import { useAppContext } from "@/components/app-context";
import styles from "./content.module.css";

type Props = {
  content: string;
  handleContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  contentRef: React.RefObject<HTMLTextAreaElement | null>;
  dragged: boolean;
  handleHeightChange: () => void;
};

export default function Content({
  content,
  handleContentChange,
  contentRef,
  dragged,
  handleHeightChange,
}: Props) {
  const { preferences } = useAppContext();
  const { autoCorrect, spellCheck } = preferences;

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
      spellCheck={spellCheck === "1" ? "true" : "false"}
      autoCorrect={autoCorrect === "1" ? "on" : "off"}
      readOnly={dragged}
    />
  );
}
