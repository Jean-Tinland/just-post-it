import * as React from "react";
import { PanInfo, motion } from "motion/react";
import classNames from "classnames";
import { useAppContext } from "@/components/app-context";
import Header from "./header";
import Content from "./content";
import Footer from "./footer";
import ResizeHandles from "./resize-handles";
import * as Actions from "@/app/actions";
import type { PostItItem } from "@/@types/post-it";
import type { CategoryItem } from "@/@types/category";
import styles from "./post-it.module.css";

type Props = {
  padRef: React.RefObject<HTMLDivElement | null>;
  postIt: PostItItem;
  categories: CategoryItem[];
  dragging: boolean;
};

const MIN_WIDTH = 300;
const MIN_HEIGHT = 240;

export default function PostIt({
  padRef,
  postIt,
  categories,
  dragging,
}: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLTextAreaElement>(null);

  const { user, setLoading, viewMode } = useAppContext();
  const { token } = user;
  const { id, dueDate, bounds, categoryId, categoryColor, minimized } = postIt;
  let date = dueDate;
  if (date) {
    date = new Date(date);
  }
  const hasPastDueDate = Boolean(date && date < new Date());

  const [dragged, setDragged] = React.useState(false);
  const [title, setTitle] = React.useState(postIt.title);
  const [content, setContent] = React.useState(postIt.content);
  const [width, setWidth] = React.useState(bounds.width);
  const [height, setHeight] = React.useState(bounds.height);
  const [maximized, setMaximized] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const savedTimeout = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const updatePostItPosition = React.useCallback(
    async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const container = padRef.current;

      if (container) {
        setLoading(true);
        const { x, y } = info.offset;

        const { innerWidth, innerHeight } = window;

        const xPercent = bounds.left + (x / innerWidth) * 100;
        const yPercent = bounds.top + (y / innerHeight) * 100;

        await Actions.updatePostIt(token, {
          id,
          bounds: { top: yPercent, left: xPercent },
        });
        setDragged(false);
        setLoading(false);
      }
    },
    [bounds, id, padRef, setLoading, token],
  );

  const handleResize = React.useCallback(
    (axis: "x" | "y" | "both") =>
      async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        setLoading(true);
        const { x, y } = info.offset;

        const newWidth = Math.round(width + x);
        const newHeight = Math.round(height + y);

        if (axis === "both") {
          setWidth(Math.max(MIN_WIDTH, newWidth));
          setHeight(Math.max(MIN_HEIGHT, newHeight));
        } else if (axis === "x") {
          setWidth(Math.max(MIN_WIDTH, newWidth));
        } else if (axis === "y") {
          setHeight(Math.max(MIN_HEIGHT, newHeight));
        }

        setLoading(false);
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bounds],
  );

  const handleHeightChange = () => {
    if (!contentRef.current || !scrollRef.current) return;
    const currentScroll = scrollRef.current.scrollTop;

    contentRef.current.style.minHeight = "100%";

    const newScrollHeight = contentRef.current.scrollHeight;
    contentRef.current.style.minHeight = `${newScrollHeight}px`;

    scrollRef.current.scrollTop = currentScroll;
  };

  const updateResize = async () => {
    setLoading(true);
    await Actions.updatePostIt(token, { id, bounds: { width, height } });
    setLoading(false);
  };

  const updateCategory = async (categoryId: number | null) => {
    setLoading(true);
    await Actions.updatePostIt(token, { id, categoryId });
    setLoading(false);
  };

  const updateDueDate = async (dueDate: string | null) => {
    setLoading(true);
    const newDate = dueDate ? new Date(dueDate) : null;
    await Actions.updatePostIt(token, { id, dueDate: newDate });
    setLoading(false);
  };

  const handleTitleChange = (e: React.InputEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setTitle(target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setContent(target.value);
  };

  const updateSaved = () => {
    setSaved(true);
    if (typeof savedTimeout.current === "string") {
      clearTimeout(savedTimeout.current);
    }
    savedTimeout.current = setTimeout(() => {
      setSaved(false);
    }, 1280);
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const matchingTarget = target?.closest("input, textarea");
    const allowedKeys = ["s", "Escape"];
    const { ctrlKey, key, metaKey } = e;
    const isAllowed = allowedKeys.includes(key);

    if (!isAllowed) return;

    if (key === "Escape") {
      const activeElement = document.activeElement as HTMLElement;
      if (!activeElement) return;

      activeElement.blur();
      unMaximizePostIt();
    }

    if (!matchingTarget) return;

    if (key === "s" && (ctrlKey || metaKey)) {
      e.preventDefault();
      setLoading(true);
      await Actions.updatePostIt(token, { id, title, content });
      updateSaved();
      setLoading(false);
    }
  };

  const updatePostIt = async (e: React.FocusEvent<HTMLDivElement, Element>) => {
    const unSavedChanges = title !== postIt.title || content !== postIt.content;

    const elementToIgnore = [styles.title, styles.content];
    const preventBlur = elementToIgnore.some((className) => {
      const related = e.relatedTarget;
      const matching = related?.classList.contains(className);
      const isInside = ref.current?.contains(related as Node);
      return matching && isInside;
    });

    if (!unSavedChanges || preventBlur) return;
    setLoading(true);

    await Actions.updatePostIt(token, { id, title, content });
    updateSaved();
    setLoading(false);
  };

  const maximizePostIt = () => {
    document.body.style.setProperty("overflow", "hidden");
    setMaximized(true);
    const textArea = contentRef.current;
    if (textArea) {
      textArea.focus();
    }
  };

  const unMaximizePostIt = () => {
    document.body.style.removeProperty("overflow");
    setMaximized(false);
  };

  const toggleMaximize = () => {
    if (maximized) {
      unMaximizePostIt();
    } else {
      maximizePostIt();
    }
  };

  const minimizePostIt = async () => {
    setLoading(true);

    unMaximizePostIt();
    await Actions.updatePostIt(token, { id, minimized: 1 });
    setLoading(false);
  };

  const unMinimizePostIt = async () => {
    setLoading(true);

    await Actions.updatePostIt(token, { id, minimized: 0 });
    setLoading(false);
  };

  const toggleMinimize = async () => {
    if (minimized) {
      await unMinimizePostIt();
    } else {
      await minimizePostIt();
    }
  };

  const removePostIt = React.useCallback(async () => {
    setLoading(true);
    unMaximizePostIt();
    await Actions.deletePostIt(token, id);
    setLoading(false);
  }, [id, token, setLoading]);

  const downloadPostIt = () => {
    const href = "data:text/plain;charset=utf-8,".concat(
      encodeURIComponent(content),
    );

    const link = Object.assign(document.createElement("a"), {
      href,
      download: `${title}.md`,
    });
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const classes = classNames(styles.postIt, {
    [styles.grid]: viewMode === "grid",
    [styles.pastDueDate]: hasPastDueDate,
    [styles.minimized]: minimized,
    [styles.maximized]: maximized,
  });

  const postItStyles = computeStyles({
    top: bounds.top,
    left: bounds.left,
    width,
    height,
    minimized,
    maximized,
  });

  const draggedPostItStyles = {
    opacity: 0.8,
    cursor: "grabbing",
  };

  return (
    <motion.div
      ref={ref}
      key={String(bounds.top + bounds.left)}
      data-post-it={postIt.id}
      data-dragged={dragged}
      data-maximized={maximized}
      className={classes}
      style={postItStyles}
      whileDrag={draggedPostItStyles}
      dragConstraints={padRef}
      drag={dragging || dragged}
      dragMomentum={false}
      onDragStart={() => setDragged(true)}
      onDragEnd={updatePostItPosition}
      onKeyDown={handleKeyDown}
      onBlur={updatePostIt}
      initial={dragging ? undefined : { scale: 0.8, opacity: 0 }}
      animate={dragging ? undefined : { scale: 1, opacity: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onClick={minimized && !dragging ? unMinimizePostIt : undefined}
    >
      <div className={styles.overflow}>
        <div ref={scrollRef} className={styles.scroll}>
          <Header
            categoryId={categoryId}
            categoryColor={categoryColor}
            categories={categories}
            title={title}
            updateCategory={updateCategory}
            handleTitleChange={handleTitleChange}
            removePostIt={removePostIt}
            toggleMinimize={toggleMinimize}
            minimized={minimized}
            toggleMaximize={toggleMaximize}
            maximized={maximized}
            viewMode={viewMode}
          />
          {!minimized && (
            <>
              <Content
                content={content}
                handleContentChange={handleContentChange}
                contentRef={contentRef}
                dragged={dragged}
                handleHeightChange={handleHeightChange}
                maximized={maximized}
              />
              <Footer
                postItId={postIt.id}
                downloadPostIt={downloadPostIt}
                dueDate={date}
                updateDueDate={updateDueDate}
                hasPastDueDate={hasPastDueDate}
                saved={saved}
                maximized={maximized}
              />
            </>
          )}
        </div>
      </div>
      {!minimized && !maximized && viewMode === "free" && (
        <ResizeHandles
          handleResize={handleResize}
          updateResize={updateResize}
        />
      )}
    </motion.div>
  );
}

type Styles = {
  top: number;
  left: number;
  width: number;
  height: number;
  minimized: number;
  maximized: boolean;
};

function computeStyles({
  top,
  left,
  width,
  height,
  minimized,
  maximized,
}: Styles) {
  if (minimized) {
    return {
      top: `${top}vh`,
      left: `${left}vw`,
      width: 240,
      height: 52,
    };
  }
  if (maximized) {
    return {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: "100%",
      height: "100%",
      borderColor: "transparent",
      borderRadius: 0,
    };
  }
  return {
    top: `${top}vh`,
    left: `${left}vw`,
    width,
    height,
  };
}
