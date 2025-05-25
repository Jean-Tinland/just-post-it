import * as React from "react";
import classNames from "classnames";
import Button from "jt-design-system/es/button";
import Tooltip from "jt-design-system/es/tooltip";
import Popover from "jt-design-system/es/popover";
import DatePicker from "jt-design-system/es/date-picker";
import Icon from "@/components/icon";
import styles from "./footer.module.css";

type Props = {
  downloadDraft: () => void;
  openPreview: () => void;
  dueDate: Date | null;
  updateDueDate: (dueDate: string) => Promise<void>;
  hasPastDueDate: boolean;
};

export default function Footer({
  downloadDraft,
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
    <footer className={styles.footer}>
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
      <Tooltip content="Download draft">
        <Button variant="transparent" onClick={downloadDraft}>
          <Icon code="download" />
        </Button>
      </Tooltip>
    </footer>
  );
}
