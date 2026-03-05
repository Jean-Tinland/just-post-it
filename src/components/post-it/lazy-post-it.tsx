"use client";

import * as React from "react";
import PostIt from "./post-it";
import type { PostItItem } from "@/@types/post-it";
import type { CategoryItem } from "@/@types/category";

type Props = {
  padRef: React.RefObject<HTMLDivElement | null>;
  postIt: PostItItem;
  categories: CategoryItem[];
  dragging: boolean;
  viewMode: "free" | "grid";
};

export default function LazyPostIt({
  padRef,
  postIt,
  categories,
  dragging,
  viewMode,
}: Props) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = React.useState(false);
  const hasBeenVisible = React.useRef(false);

  React.useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            hasBeenVisible.current = true;
          }
          setIsInView(entry.isIntersecting);
        });
      },
      {
        threshold: 0,
        rootMargin: "200px",
      },
    );

    observer.observe(wrapper);

    return () => {
      observer.disconnect();
    };
  }, []);

  const placeholderStyles =
    viewMode === "grid" ? { minHeight: "240px", width: "100%" } : {};

  const shouldRender = isInView || (dragging && hasBeenVisible.current);

  const measurementStyle = {
    position: "absolute" as const,
    top: `${postIt.bounds.top}vh`,
    left: `${postIt.bounds.left}vw`,
    width: `${postIt.minimized ? 240 : postIt.bounds.width}px`,
    height: `${postIt.minimized ? 52 : postIt.bounds.height}px`,
    pointerEvents: "none" as const,
    visibility: "hidden" as const,
  };

  if (viewMode === "free") {
    return (
      <>
        <div ref={wrapperRef} style={measurementStyle} />
        {shouldRender && (
          <PostIt
            padRef={padRef}
            postIt={postIt}
            categories={categories}
            dragging={dragging}
          />
        )}
      </>
    );
  }

  return (
    <div ref={wrapperRef} style={placeholderStyles}>
      {shouldRender && (
        <PostIt
          padRef={padRef}
          postIt={postIt}
          categories={categories}
          dragging={dragging}
        />
      )}
    </div>
  );
}
