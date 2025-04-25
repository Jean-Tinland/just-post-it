"use client";

import * as React from "react";
import classNames from "classnames";
import styles from "./keyboard-shortcut.module.css";

type Props = {
  keys: string[];
  className?: string;
  theme?: "dark" | "light";
};

export default function KeyboardShortcut({
  keys,
  className,
  theme = "dark",
}: Props) {
  const [ready, setReady] = React.useState(false);
  const [isMac, setIsMac] = React.useState(false);

  React.useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const isMac = /Macintosh|Mac|Mac OS|MacIntel|MacPPC|Mac68K/gi.test(
      userAgent,
    );
    setIsMac(isMac);
    setReady(true);
  }, []);

  if (!ready) return null;

  const classes = classNames(styles.shortcut, className, {
    [styles.light]: theme === "light",
  });

  return (
    <div className={classes}>
      {keys.map((key) => {
        let result = key;
        if (key === "backspace") result = "⌫";
        if (key === "enter") result = "↵";
        if (key === "shift") result = "⇧";
        if (key === "ctrl" && isMac) result = "⌘";

        return (
          <div key={key} className={styles.key}>
            <span className={styles.inner}>{result}</span>
          </div>
        );
      })}
    </div>
  );
}
