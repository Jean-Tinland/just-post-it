"use client";

import * as React from "react";
import classNames from "classnames";
import { AnimatePresence } from "motion/react";
import Controls from "@/components/controls";
import LazyPostIt from "@/components/post-it/lazy-post-it";
import { useAppContext } from "@/components/app-context";
import type { PostItItem } from "@/@types/post-it";
import type { CategoryItem } from "@/@types/category";
import styles from "./pad.module.css";

type Props = {
  postIts: PostItItem[];
  categories: CategoryItem[];
  categoryId: number | null;
};

export default function Pad({ postIts, categories, categoryId }: Props) {
  const { viewMode, updateCurrentCategory } = useAppContext();
  const padRef = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    updateCurrentCategory(categoryId);
  }, [categoryId, updateCurrentCategory]);

  const filteredPostIts = postIts.filter((postIt) => {
    if (search && !normalize(postIt.title).includes(normalize(search))) {
      return false;
    }
    return true;
  });

  const sortedPostIts =
    viewMode === "grid"
      ? filteredPostIts.sort((a, b) => b.id - a.id)
      : filteredPostIts;

  const updateSearch = React.useCallback(
    (newSearch: string) => {
      setSearch(newSearch);
      const hasOnlyOneResult = filteredPostIts.length === 1;
      if (hasOnlyOneResult) {
        const { id } = filteredPostIts[0];
        const target = document.querySelector(`[data-post-it="${id}"]`);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
        }
      }
    },
    [filteredPostIts],
  );

  const updateDragging = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode === "grid") {
      return setDragging(false);
    }
    const isMetaPressed = e.metaKey || e.ctrlKey;
    setDragging(isMetaPressed);
  };

  const classes = classNames(styles.pad, {
    [styles.grid]: viewMode === "grid",
  });

  return (
    <div
      ref={padRef}
      data-draggable={dragging}
      className={classes}
      onMouseMove={updateDragging}
    >
      <Controls
        padRef={padRef}
        categories={categories}
        search={search}
        updateSearch={updateSearch}
      />
      <AnimatePresence mode="popLayout">
        {sortedPostIts.map((postIt) => {
          return (
            <LazyPostIt
              key={postIt.id}
              padRef={padRef}
              postIt={postIt}
              categories={categories}
              dragging={dragging}
              viewMode={viewMode}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
