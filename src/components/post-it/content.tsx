import * as React from "react";
import classNames from "classnames";
import { useAppContext } from "@/components/app-context";
import styles from "./content.module.css";

type Props = {
  content: string;
  handleContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  contentRef: React.RefObject<HTMLTextAreaElement | null>;
  dragged: boolean;
  handleHeightChange: () => void;
  maximized: boolean;
};

export default function Content({
  content,
  handleContentChange,
  contentRef,
  dragged,
  handleHeightChange,
  maximized,
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

  const onKeyDown = (e: React.KeyboardEvent) => {
    const target = e.target as HTMLTextAreaElement;

    if (e.key !== "Tab") return;
    e.preventDefault();

    const tab = "  ";
    const start = target.selectionStart;
    target.setRangeText(tab, start, start, "end");
  };

  const classes = classNames(styles.content, {
    [styles.maximized]: maximized,
  });

  return (
    <textarea
      ref={contentRef}
      className={classes}
      value={content}
      onChange={onChange}
      onKeyDown={onKeyDown}
      spellCheck={spellCheck === "1" ? "true" : "false"}
      autoCorrect={autoCorrect === "1" ? "on" : "off"}
      readOnly={dragged}
    />
  );
}
