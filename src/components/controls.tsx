import * as React from "react";
import classNames from "classnames";
import { PanInfo, motion } from "motion/react";
import Button from "jt-design-system/es/button";
import Tooltip from "jt-design-system/es/tooltip";
import Input from "jt-design-system/es/input";
import Icon from "@/components/icon";
import CategorySelector from "@/components/category-selector";
import Settings from "@/components/settings";
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

const MotionButton = motion.create(Button);

export default function Controls({
  padRef,
  categories,
  search,
  updateSearch,
}: Props) {
  const searchRef = React.useRef<HTMLInputElement>(null);
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

  const updateMode = () => {
    updateViewMode(viewMode === "free" ? "grid" : "free");
  };

  const addPostIt = React.useCallback(async () => {
    setLoading(true);
    const { id } = await Actions.createPostIt(token, currentCategory);
    focusNewPostIt(id);
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

        const { id } = await Actions.createPostIt(
          token,
          currentCategory,
          top,
          left,
        );
        focusNewPostIt(id);
        setLoading(false);
      }
    },
    [currentCategory, padRef, setLoading, token],
  );

  const modeTooltip =
    viewMode === "free" ? "Toggle grid view" : "Toggle free view";
  const modeIcon = viewMode === "free" ? "trello" : "grid";

  const searchClasses = classNames(styles.search, {
    [styles.grid]: viewMode === "grid",
  });

  const SearchIcon = () => <Icon code="search" />;

  return (
    <>
      <div className={styles.bar}>
        <Tooltip content={modeTooltip}>
          <Button className={styles.viewToggle} onClick={updateMode}>
            <Icon code={modeIcon} />
          </Button>
        </Tooltip>
        <Tooltip content="Search among post-it titles">
          <Input
            ref={searchRef}
            type="search"
            className={searchClasses}
            icon={SearchIcon}
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
            <Icon code="file-edit" />
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
              <Icon code="file-edit" />
              New post-it
            </MotionButton>
          )}
        </div>
        <Tooltip content="Open settings">
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
