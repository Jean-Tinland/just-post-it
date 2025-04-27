import { AnimatePresence, motion } from "motion/react";
import styles from "./post-it-placeholder.module.css";

type Props = {
  visible: boolean;
};

export default function PostItPlaceholder({ visible }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.postIt}
          initial={{ scale: 0.5, opacity: 0, x: "-50%", y: "-50%" }}
          animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
          exit={{ opacity: 0, x: "-50%", y: "-50%" }}
        >
          <div className={styles.header}>
            <div className={styles.category} />
            <div className={styles.title} />
          </div>
          <div className={styles.content} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
