import * as React from "react";
import { PanInfo, motion } from "motion/react";
import classNames from "classnames";
import { useAppContext } from "@/components/app-context";
import Header from "./header";
import Content from "./content";
import ResizeHandles from "./resize-handles";
import * as Actions from "@/app/actions";
import type { PostItItem } from "@/@types/post-it";
import type { CategoryItem } from "@/@types/category";
import styles from "./post-it.module.css";
import Preview from "./preview";

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
  const { id, dueDate, bounds, categoryId, categoryColor } = postIt;
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
  const [previewOpened, setPreviewOpened] = React.useState(false);

  const removePostIt = React.useCallback(async () => {
    setLoading(true);
    await Actions.deletePostIt(token, id);
    setLoading(false);
  }, [id, token, setLoading]);

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

        if (axis === "both") {
          setWidth(Math.max(MIN_WIDTH, width + x));
          setHeight(Math.max(MIN_HEIGHT, height + y));
        } else if (axis === "x") {
          setWidth(Math.max(MIN_WIDTH, width + x));
        } else if (axis === "y") {
          setHeight(Math.max(MIN_HEIGHT, height + y));
        }

        setLoading(false);
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bounds],
  );

  const handleHeightChange = () => {
    if (!contentRef.current || !scrollRef.current) return;
    const currentScroll = scrollRef.current.scrollTop;

    contentRef.current.style.minHeight = "inherit";
    contentRef.current.style.minHeight = `${contentRef.current.scrollHeight}px`;

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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setTitle(target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setContent(target.value);
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
    setLoading(false);
  };

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

  const openPreview = () => {
    setPreviewOpened(true);
  };

  const closePreview = () => {
    setPreviewOpened(false);
  };

  const classes = classNames(styles.postIt, {
    [styles.grid]: viewMode === "grid",
    [styles.pastDueDate]: hasPastDueDate,
  });

  const postItStyles = {
    top: `${bounds.top}vh`,
    left: `${bounds.left}vw`,
    width,
    height,
  };

  const draggedPostItStyles = {
    opacity: 0.8,
    cursor: "grabbing",
  };

  return (
    <motion.div
      ref={ref}
      data-post-it={postIt.id}
      data-dragged={dragged}
      key={bounds.top + bounds.left + bounds.width + bounds.height}
      className={classes}
      style={postItStyles}
      whileDrag={draggedPostItStyles}
      dragConstraints={padRef}
      drag={dragging || dragged}
      dragMomentum={false}
      onDragStart={() => setDragged(true)}
      onDragEnd={updatePostItPosition}
      onBlur={updatePostIt}
      onResize={() => handleHeightChange()}
    >
      <div className={styles.overflow}>
        <div ref={scrollRef} className={styles.scroll}>
          <Header
            categoryId={categoryId}
            categoryColor={categoryColor}
            categories={categories}
            title={title}
            updateCategory={updateCategory}
            dueDate={date}
            updateDueDate={updateDueDate}
            hasPastDueDate={hasPastDueDate}
            handleTitleChange={handleTitleChange}
            removePostIt={removePostIt}
            downloadPostIt={downloadPostIt}
            openPreview={openPreview}
          />
          <Content
            postIt={postIt}
            content={content}
            handleContentChange={handleContentChange}
            contentRef={contentRef}
            dragged={dragged}
            handleHeightChange={handleHeightChange}
          />
        </div>
      </div>
      {viewMode === "free" && (
        <ResizeHandles
          handleResize={handleResize}
          updateResize={updateResize}
        />
      )}
      <Preview
        isOpened={previewOpened}
        close={closePreview}
        title={title}
        content={content}
        downloadPostIt={downloadPostIt}
      />
    </motion.div>
  );
}
