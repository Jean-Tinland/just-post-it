"use server";

import { codeToHtml } from "shiki";
import classNames from "classnames";
import styles from "./code-block.module.css";

type Props = {
  className?: string;
  theme?: "dark" | "light";
  language: string;
  content: string;
  hideLanguage?: boolean;
};

export default async function CodeBlock({
  className,
  language,
  content,
  hideLanguage,
}: Props) {
  const html = await codeToHtml(content, {
    lang: language,
    defaultColor: "light",
    themes: {
      dark: "github-dark-high-contrast",
      light: "github-light-high-contrast",
    },
  });

  const classes = classNames(styles.block, className, {
    [styles.hideLanguage]: hideLanguage,
  });

  return (
    <div className={classes}>
      {!hideLanguage && <div className={styles.language}>{language}</div>}
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
