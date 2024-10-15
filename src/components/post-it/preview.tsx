import * as React from "react";
import ReactMarkdown from "react-markdown";
import Dialog from "dt-design-system/es/dialog";
import Button from "dt-design-system/es/button";
import Tooltip from "dt-design-system/es/tooltip";
import * as Icons from "dt-design-system/es/icons";
import styles from "./preview.module.css";

type Props = {
  isOpened: boolean;
  close: () => void;
  title: string;
  content: string;
  downloadPostIt: () => void;
};

export default function Preview({
  isOpened,
  close,
  title,
  content,
  downloadPostIt,
}: Props) {
  return (
    <Dialog
      className={styles.dialog}
      isOpened={isOpened}
      close={close}
      closeButtonVariant="transparent"
    >
      <div className={styles.header}>
        <div className={styles.title}>
          {title}
          <Tooltip content="Download post-it">
            <Button
              className={styles.download}
              variant="transparent"
              onClick={downloadPostIt}
            >
              <Icons.Download />
            </Button>
          </Tooltip>
        </div>
      </div>
      <ReactMarkdown className={styles.content}>{content}</ReactMarkdown>
    </Dialog>
  );
}
