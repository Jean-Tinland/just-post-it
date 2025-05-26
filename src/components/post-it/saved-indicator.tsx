import { AnimatePresence, motion } from "motion/react";
import Icon from "@/components/icon";
import styles from "./saved-indicator.module.css";

type Props = {
  saved: boolean;
};

export default function SavedIndicator({ saved }: Props) {
  return (
    <AnimatePresence mode="sync">
      {saved && (
        <motion.div
          className={styles.indicator}
          initial={{ y: 6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 6, opacity: 0 }}
        >
          <Icon code="check" className={styles.icon} />
          Saved!
        </motion.div>
      )}
    </AnimatePresence>
  );
}
