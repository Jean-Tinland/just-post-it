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

  React.useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      {
        threshold: 0,
      },
    );

    observer.observe(wrapper);

    return () => {
      observer.disconnect();
    };
  }, []);

  const placeholderStyles = React.useMemo(() => {
    if (viewMode === "grid") {
      return {
        minHeight: "240px",
        width: "100%",
      };
    }

    return {};
  }, [viewMode]);

  const shouldRender = isInView || dragging;

  if (viewMode === "free") {
    return (
      <>
        <div
          ref={wrapperRef}
          style={{
            position: "absolute",
            top: `${postIt.bounds.top}vh`,
            left: `${postIt.bounds.left}vw`,
            width: `${postIt.minimized ? 240 : postIt.bounds.width}px`,
            height: `${postIt.minimized ? 52 : postIt.bounds.height}px`,
            pointerEvents: "none",
            visibility: "hidden",
          }}
        />
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
