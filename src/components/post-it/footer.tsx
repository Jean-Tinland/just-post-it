import * as React from "react";
import { motion } from "motion/react";
import classNames from "classnames";
import Button from "jt-design-system/es/button";
import Tooltip from "jt-design-system/es/tooltip";
import Popover from "jt-design-system/es/popover";
import DatePicker from "jt-design-system/es/date-picker";
import Icon from "@/components/icon";
import styles from "./footer.module.css";

type Props = {
  downloadPostIt: () => void;
  openPreview: () => void;
  dueDate: Date | null;
  updateDueDate: (dueDate: string) => Promise<void>;
  hasPastDueDate: boolean;
};

export default function Footer({
  downloadPostIt,
  openPreview,
  dueDate,
  updateDueDate,
  hasPastDueDate,
}: Props) {
  const formattedDate = dueDate
    ? new Date(dueDate).toISOString().slice(0, 10)
    : "";

  const dateClasses = classNames(styles.date, {
    [styles.hasDate]: dueDate,
    [styles.pastDate]: hasPastDueDate,
  });

  const dateTooltip = dueDate ? "Update due date" : "Set due date";

  return (
    <motion.footer className={styles.footer} layout="preserve-aspect">
      <Tooltip content={dateTooltip}>
        <span>
          <Popover
            className={styles.datePopover}
            trigger={
              <Button className={dateClasses} variant="transparent">
                <Icon code="calendar" />
              </Button>
            }
          >
            <DatePicker
              lang="en"
              value={formattedDate}
              onChange={updateDueDate}
            />
          </Popover>
        </span>
      </Tooltip>
      <Tooltip content="Markdown preview">
        <Button variant="transparent" onClick={openPreview}>
          <Icon code="file-text" />
        </Button>
      </Tooltip>
      <Tooltip content="Download post-it">
        <Button variant="transparent" onClick={downloadPostIt}>
          <Icon code="download" />
        </Button>
      </Tooltip>
    </motion.footer>
  );
}
