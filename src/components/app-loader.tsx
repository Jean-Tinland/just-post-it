import { AnimatePresence, motion } from "motion/react";
import Loader from "jt-design-system/es/loader";
import styles from "./app-loader.module.css";

type Props = {
  loading: boolean;
};

export default function AppLoader({ loading }: Props) {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className={styles.container}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <Loader className={styles.loader} />
          <div className={styles.text}>Loading...</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
