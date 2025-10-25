import { motion } from "motion/react";
import type { PanInfo } from "motion/react";
import styles from "./resize-handles.module.css";

type Props = {
  handleResize: (
    direction: "x" | "y" | "both"
  ) => (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  updateResize: () => void;
};

export default function ResizeHandles({ handleResize, updateResize }: Props) {
  const commonProps = {
    dragConstraints: { top: 0, left: 0, right: 0, bottom: 0 },
    onDragEnd: updateResize,
    dragElastic: 0,
    dragMomentum: false,
  };

  return (
    <div className={styles.handles}>
      <motion.div
        className={styles.handleY}
        drag="y"
        onDrag={handleResize("y")}
        {...commonProps}
      />
      <motion.div
        className={styles.handleX}
        drag="x"
        onDrag={handleResize("x")}
        {...commonProps}
      />
      <motion.div
        className={styles.handleBoth}
        drag="x"
        onDrag={handleResize("both")}
        {...commonProps}
      />
    </div>
  );
}
