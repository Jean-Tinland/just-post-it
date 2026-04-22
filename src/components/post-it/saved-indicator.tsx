import AnimatedVisibility from "@/components/animation/animated-visibility";
import Icon from "@/components/icon";
import styles from "./saved-indicator.module.css";

type Props = {
  saved: boolean;
};

export default function SavedIndicator({ saved }: Props) {
  return (
    <AnimatedVisibility
      visible={saved}
      className={styles.indicator}
      initial={{ y: 6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 6, opacity: 0 }}
    >
      <Icon code="check" className={styles.icon} />
      Saved!
    </AnimatedVisibility>
  );
}
