import * as React from "react";
import classNames from "classnames";
import { PanInfo, motion } from "motion/react";
import Button from "jt-design-system/es/button";
import Tooltip from "jt-design-system/es/tooltip";
import Input from "jt-design-system/es/input";
import Icon from "@/components/icon";
import CategorySelector from "@/components/category-selector";
import Settings from "@/components/settings";
import KeyboardShortcut from "@/components/keyboard-shortcut";
import PostItPlaceholder from "./post-it/post-it-placeholder";
import { useAppContext } from "@/components/app-context";
import * as Actions from "@/app/actions";
import type { CategoryItem } from "@/@types/category";
import styles from "./controls.module.css";

type Props = {
  padRef: React.RefObject<HTMLDivElement | null>;
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
  const [dragging, setDragging] = React.useState(false);
  const [draggingValid, setDraggingValid] = React.useState(false);
  const [settingsOpened, setSettingsOpened] = React.useState(false);
  const { user, setLoading, viewMode, updateViewMode, currentCategory } =
    useAppContext();
  const { token } = user;

  const focusSearch = React.useCallback(() => {
    if (searchRef.current) {
      const input = searchRef.current.querySelector("input");
      if (input) {
        input.select();
      }
    }
  }, []);

  const openSettings = () => {
    setSettingsOpened(true);
  };

  const closeSettings = () => {
    setSettingsOpened(false);
  };

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

  const updateMode = React.useCallback(() => {
    updateViewMode(viewMode === "free" ? "grid" : "free");
  }, [updateViewMode, viewMode]);

  const addPostIt = React.useCallback(async () => {
    if (dragging) return;
    setLoading(true);
    const { id } = await Actions.createPostIt(token, currentCategory);
    focusNewPostIt(id);
    setLoading(false);
  }, [currentCategory, dragging, setLoading, token]);

  const handleKeyPresses = React.useCallback(
    (e: KeyboardEvent) => {
      const allowedKeys = ["+", "l", ",", "/"];
      const { ctrlKey, key, metaKey, shiftKey } = e;
      const isAllowed = allowedKeys.includes(key);
      const target = e.target as HTMLElement;
      const isFocusingTextField = Boolean(target?.closest("input, textarea"));

      if (isFocusingTextField || !isAllowed) return;

      if (key === "/" && shiftKey) {
        e.preventDefault();
        return focusSearch();
      }

      if (key === "+" && (ctrlKey || metaKey) && shiftKey) {
        e.preventDefault();
        return addPostIt();
      }

      if (key === "," && (ctrlKey || metaKey)) {
        e.preventDefault();
        return setSettingsOpened(true);
      }

      if (key === "l" && (ctrlKey || metaKey) && shiftKey) {
        e.preventDefault();
        return updateMode();
      }
    },
    [addPostIt, focusSearch, updateMode],
  );

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyPresses);
    return () => {
      window.removeEventListener("keydown", handleKeyPresses);
    };
  }, [handleKeyPresses]);

  const showPostItPlaceholder = (_: any, info: PanInfo) => {
    setDragging(true);
    setDraggingValid(info.offset.y > 100);
  };

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

        const left = ((x - 150) / innerWidth) * 100;
        const top = ((y - 120) / innerHeight) * 100;

        const { id } = await Actions.createPostIt(
          token,
          currentCategory,
          top,
          left,
        );
        focusNewPostIt(id);
        setLoading(false);
      }

      setDragging(false);
      setDraggingValid(false);
    },
    [currentCategory, padRef, setLoading, token],
  );

  const modeTooltip =
    viewMode === "free" ? "Toggle grid view" : "Toggle free view";
  const fullModeTooltip = (
    <>
      {modeTooltip}
      <KeyboardShortcut keys={["ctrl", "shift", "l"]} theme="light" />
    </>
  );
  const modeIcon = viewMode === "free" ? "trello" : "grid";

  const searchClasses = classNames(styles.searchContainer, {
    [styles.grid]: viewMode === "grid",
  });

  const SearchIcon = () => <Icon code="search" />;

  const settingsTooltip = (
    <>
      Open settings <KeyboardShortcut keys={["ctrl", ","]} theme="light" />
    </>
  );

  return (
    <>
      <div className={styles.bar}>
        <Tooltip content={fullModeTooltip}>
          <Button className={styles.viewToggle} onClick={updateMode}>
            <Icon code={modeIcon} />
          </Button>
        </Tooltip>
        <div className={searchClasses}>
          <Tooltip content="Search among post-it titles">
            <Input
              ref={searchRef}
              type="search"
              className={styles.search}
              icon={SearchIcon}
              value={search}
              onValueChange={updateSearch}
              onKeyUp={handleKeyUp}
            />
          </Tooltip>
          <KeyboardShortcut
            keys={["shift", "/"]}
            theme="light"
            className={styles.searchShortcut}
          />
        </div>
        <div className={styles.addButton}>
          <Button
            variant={viewMode === "free" ? "secondary" : "primary"}
            className={styles.bottomAddButton}
            onClick={addPostIt}
            disabled={viewMode === "free"}
          >
            <Icon code="file-edit" />
            New post-it
            <KeyboardShortcut keys={["ctrl", "shift", "+"]} />
          </Button>
          {viewMode === "free" && (
            <motion.div
              className={styles.bottomButtonContainer}
              drag
              dragSnapToOrigin
              dragTransition={dragging ? { timeConstant: 100 } : undefined}
              whileDrag={{ cursor: "grabbing" }}
              dragMomentum={false}
              onDrag={showPostItPlaceholder}
              onDragEnd={createPostItFromDrag}
              transition={{ duration: 0 }}
            >
              <Button className={styles.topAddButton} onClick={addPostIt}>
                <Icon code="file-edit" />
                New post-it
                <KeyboardShortcut keys={["ctrl", "shift", "+"]} />
              </Button>
              <PostItPlaceholder visible={draggingValid} />
            </motion.div>
          )}
        </div>
        <Tooltip content={settingsTooltip}>
          <Button className={styles.settings} onClick={openSettings}>
            <Icon code="settings" />
          </Button>
        </Tooltip>
      </div>
      <CategorySelector categories={categories} />
      <Settings
        opened={settingsOpened}
        close={closeSettings}
        categories={categories}
      />
    </>
  );
}

function focusNewPostIt(id: number) {
  setTimeout(() => {
    const postIt = document.querySelector(`[data-post-it="${id}"]`);
    if (!postIt) return;
    const title = postIt.querySelector("input");
    if (!title) return;
    title.select();
  }, 200);
}
