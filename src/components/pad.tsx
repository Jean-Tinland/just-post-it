"use client";

import * as React from "react";
import classNames from "classnames";
import Controls from "@/components/controls";
import PostIt from "@/components/post-it";
import { useAppContext } from "@/components/app-context";
import type { PostItItem } from "@/@types/post-it";
import type { CategoryItem } from "@/@types/category";
import styles from "./pad.module.css";

type Props = {
  postIts: PostItItem[];
  categories: CategoryItem[];
};

export default function Pad({ postIts, categories }: Props) {
  const { viewMode, currentCategory } = useAppContext();
  const padRef = React.useRef<HTMLDivElement>(null);
  const [draggingMode, setDraggingMode] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filteredPostIts = postIts.filter((postIt) => {
    if (search && !normalize(postIt.title).includes(normalize(search))) {
      return false;
    }
    if (!currentCategory) {
      return true;
    }
    return postIt.categoryId === currentCategory;
  });

  const sortedPostIts =
    viewMode === "grid"
      ? filteredPostIts.sort((a, b) => b.id - a.id)
      : filteredPostIts;

  console.log(sortedPostIts);

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

  const updateDragginMode = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode === "grid") {
      return setDraggingMode(false);
    }
    const isMetaPressed = e.metaKey || e.ctrlKey;
    setDraggingMode(isMetaPressed);
  };

  const classes = classNames(styles.pad, {
    [styles.grid]: viewMode === "grid",
  });

  return (
    <div
      ref={padRef}
      data-draggable={draggingMode}
      className={classes}
      onMouseMove={updateDragginMode}
    >
      <Controls
        padRef={padRef}
        categories={categories}
        search={search}
        updateSearch={updateSearch}
      />
      {sortedPostIts.map((postIt) => (
        <PostIt
          key={postIt.id}
          padRef={padRef}
          postIt={postIt}
          draggingMode={draggingMode}
          categories={categories}
        />
      ))}
    </div>
  );
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
