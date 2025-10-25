import ReactMarkdown from "react-markdown";
import Dialog from "jt-design-system/es/dialog";
import Button from "jt-design-system/es/button";
import Tooltip from "jt-design-system/es/tooltip";
import Icon from "@/components/icon";
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
              <Icon code="download" />
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className={styles.content}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </Dialog>
  );
}
