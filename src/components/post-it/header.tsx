import * as React from "react";
import classNames from "classnames";
import Button from "jt-design-system/es/button";
import Popover, { PopoverPrimitive } from "jt-design-system/es/popover";
import Tooltip from "jt-design-system/es/tooltip";
import Icon from "@/components/icon";
import { useAppContext } from "@/components/app-context";
import KeyboardShortcut from "@/components/keyboard-shortcut";
import PostItCategorySelector from "./category-selector";
import type { CategoryItem } from "@/@types/category";
import styles from "./header.module.css";

type Props = {
  categoryId: number | null;
  categoryColor: string;
  categories: CategoryItem[];
  title: string;
  updateCategory: (categoryId: number | null) => Promise<void>;
  handleTitleChange: (e: React.InputEvent<HTMLInputElement>) => void;
  removePostIt: () => void;
  toggleMinimize: () => void;
  minimized: number;
  toggleMaximize: () => void;
  maximized: boolean;
  viewMode: "free" | "grid";
};

export default function Header({
  categoryId,
  categoryColor,
  categories,
  title,
  updateCategory,
  handleTitleChange,
  removePostIt,
  toggleMinimize,
  minimized,
  toggleMaximize,
  maximized,
  viewMode,
}: Props) {
  const { preferences } = useAppContext();
  const { autoCorrect, spellCheck } = preferences;

  const classes = classNames(styles.header, {
    [styles.minimized]: minimized,
    [styles.maximized]: maximized,
  });

  const maximizeTooltip = maximized ? (
    <>
      Unmaximize <KeyboardShortcut keys={["esc"]} theme="light" />
    </>
  ) : (
    "Maximize"
  );
  const disableActions = viewMode === "grid";

  return (
    <header className={classes}>
      <PostItCategorySelector
        categoryId={categoryId}
        categoryColor={categoryColor}
        categories={categories}
        updateCategory={updateCategory}
      />
      <input
        className={styles.title}
        value={title}
        contentEditable="true"
        onInput={handleTitleChange}
        spellCheck={spellCheck}
        autoCorrect={autoCorrect ? "on" : "off"}
      />
      {!minimized && (
        <>
          <Tooltip content="Minimize">
            <Button
              className={styles.minimize}
              variant="transparent"
              onClick={toggleMinimize}
              disabled={disableActions}
            >
              <Icon code="minus" />
            </Button>
          </Tooltip>
          <Tooltip content={maximizeTooltip}>
            <Button
              className={styles.maximize}
              variant="transparent"
              onClick={toggleMaximize}
            >
              <Icon code="square" />
            </Button>
          </Tooltip>
          <Popover
            className={styles.removePopover}
            trigger={
              <Button className={styles.remove} variant="transparent">
                <Icon code="close" />
              </Button>
            }
          >
            Confirm removal?
            <PopoverPrimitive.Close asChild>
              <Button
                variant="danger"
                className={styles.confirmRemove}
                onClick={removePostIt}
                compact
              >
                <Icon code="bin" />
              </Button>
            </PopoverPrimitive.Close>
          </Popover>
        </>
      )}
    </header>
  );
}
