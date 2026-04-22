import {
  DraggableDiv,
  type PanInfo,
} from "@/components/animation/draggable-div";
import styles from "./resize-handles.module.css";

type Props = {
  handleResize: (
    direction: "x" | "y" | "both",
  ) => (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  onResizeStart: () => void;
  updateResize: () => void;
};

export default function ResizeHandles({
  handleResize,
  onResizeStart,
  updateResize,
}: Props) {
  const commonProps = {
    dragConstraints: { top: 0, left: 0, right: 0, bottom: 0 },
    onDragStart: onResizeStart,
    onDragEnd: updateResize,
    dragElastic: 0,
    dragMomentum: false,
  };

  return (
    <div className={styles.handles}>
      <DraggableDiv
        className={styles.handleY}
        drag="y"
        onDrag={handleResize("y")}
        {...commonProps}
      />
      <DraggableDiv
        className={styles.handleX}
        drag="x"
        onDrag={handleResize("x")}
        {...commonProps}
      />
      <DraggableDiv
        className={styles.handleBoth}
        drag="x"
        onDrag={handleResize("both")}
        {...commonProps}
      />
    </div>
  );
}
