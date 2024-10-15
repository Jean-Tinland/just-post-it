import * as React from "react";
import classNames from "classnames";
import { PanInfo, motion } from "framer-motion";
import Button from "dt-design-system/es/button";
import Tooltip from "dt-design-system/es/tooltip";
import Input from "dt-design-system/es/input";
import * as Icons from "dt-design-system/es/icons";
import CategorySelector from "./category-selector";
import { useAppContext } from "@/components/app-context";
import * as Actions from "@/app/actions";
import type { CategoryItem } from "@/@types/category";
import styles from "./controls.module.css";

type Props = {
  padRef: React.RefObject<HTMLDivElement>;
  categories: CategoryItem[];
  search: string;
  updateSearch: (newSearch: string) => void;
};

export default function Controls({
  padRef,
  categories,
  search,
  updateSearch,
}: Props) {
  const searchRef = React.useRef<HTMLInputElement>(null);
  const { user, setLoading, viewMode, updateViewMode, currentCategory } =
    useAppContext();
  const { token } = user;

  const MotionButton = motion.create(Button);

  const focusSearch = React.useCallback(() => {
    if (searchRef.current) {
      const input = searchRef.current.querySelector("input");
      if (input) {
        input.select();
      }
    }
  }, []);

  const handleKeyPresses = React.useCallback(
    (e: KeyboardEvent) => {
      const allowedKeys = ["k"];
      const { code, ctrlKey, key, metaKey } = e;
      const isAllowed =
        (ctrlKey || metaKey) &&
        (allowedKeys.includes(code) || allowedKeys.includes(key));

      if (!isAllowed) return;
      e.preventDefault();

      if (key === "k" && (ctrlKey || metaKey)) {
        focusSearch();
      }
    },
    [focusSearch],
  );

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyPresses);
    return () => {
      window.removeEventListener("keydown", handleKeyPresses);
    };
  }, [handleKeyPresses]);

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isEnter = e.key === "Enter";
    const postIts = document.querySelectorAll("[data-postIt]");
    if (isEnter && postIts.length === 1) {
      const postIt = postIts[0];
      const textarea = postIt.querySelector("textarea");
      if (textarea) {
        textarea.focus();
      }
    }
  };

  const updateMode = () => {
    updateViewMode(viewMode === "free" ? "grid" : "free");
  };

  const addPostIt = React.useCallback(async () => {
    setLoading(true);
    await Actions.createPostIt(token, currentCategory);
    setLoading(false);
  }, [currentCategory, token, setLoading]);

  const createPostItFromDrag = React.useCallback(
    async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const container = padRef.current;

      if (container) {
        setLoading(true);
        const { x, y } = info.point;
        const { y: yOffset } = info.offset;

        if (yOffset < 100) {
          setLoading(false);
          return;
        }

        const { innerWidth, innerHeight } = window;

        const left = ((x - 100) / innerWidth) * 100;
        const top = ((y - 90) / innerHeight) * 100;

        await Actions.createPostIt(token, currentCategory, top, left);
        setLoading(false);
      }
    },
    [currentCategory, padRef, setLoading, token],
  );

  const modeTooltip =
    viewMode === "free" ? "Toggle grid view" : "Toggle free view";
  const ModeIcon = viewMode === "free" ? Icons.Trello : Icons.Grid;

  const searchClasses = classNames(styles.search, {
    [styles.grid]: viewMode === "grid",
  });

  return (
    <>
      <div className={styles.bar}>
        <Tooltip content={modeTooltip}>
          <Button className={styles.viewToggle} onClick={updateMode}>
            <ModeIcon />
          </Button>
        </Tooltip>
        <Tooltip content="Search among post-it titles">
          <Input
            ref={searchRef}
            type="search"
            className={searchClasses}
            icon="Search"
            value={search}
            onValueChange={updateSearch}
            onKeyUp={handleKeyUp}
            autoFocus
          />
        </Tooltip>
        <div className={styles.addButton}>
          <Button
            variant={viewMode === "free" ? "secondary" : "primary"}
            className={styles.bottomAddButton}
            onClick={addPostIt}
            disabled={viewMode === "free"}
          >
            <Icons.File />
            New post-it
          </Button>
          {viewMode === "free" && (
            <MotionButton
              className={styles.motionAddButton}
              whileDrag={{
                scale: 1.2,
                backgroundColor: "var(--ds-green-400)",
                pointerEvents: "none",
              }}
              drag
              dragSnapToOrigin
              dragMomentum={false}
              onClick={addPostIt}
              onDragEnd={createPostItFromDrag as any}
            >
              <Icons.File />
              New post-it
            </MotionButton>
          )}
        </div>
        <Button className={styles.settings} disabled>
          <Icons.Settings />
        </Button>
      </div>
      <CategorySelector categories={categories} />
    </>
  );
}
