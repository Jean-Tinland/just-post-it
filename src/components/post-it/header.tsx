import * as React from "react";
import classNames from "classnames";
import Button from "dt-design-system/es/button";
import Popover from "dt-design-system/es/popover";
import DropdownMenu from "dt-design-system/es/dropdown-menu";
import DatePicker from "dt-design-system/es/date-picker";
import * as Icons from "dt-design-system/es/icons";
import PostItCategorySelector from "./category-selector";
import type { CategoryItem } from "@/@types/category";
import styles from "./header.module.css";

type Props = {
  categoryId: number | null;
  categoryColor: string;
  categories: CategoryItem[];
  title: string;
  updateCategory: (categoryId: number | null) => Promise<void>;
  dueDate: Date | null;
  updateDueDate: (dueDate: string) => Promise<void>;
  hasPastDueDate: boolean;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePostIt: () => void;
  downloadPostIt: () => void;
  openPreview: () => void;
};

export default function Header({
  categoryId,
  categoryColor,
  categories,
  title,
  updateCategory,
  dueDate,
  updateDueDate,
  hasPastDueDate,
  handleTitleChange,
  removePostIt,
  downloadPostIt,
  openPreview,
}: Props) {
  const formattedDate = dueDate
    ? new Date(dueDate).toISOString().slice(0, 10)
    : "";

  const dateClasses = classNames(styles.date, {
    [styles.hasDate]: dueDate,
    [styles.pastDate]: hasPastDueDate,
  });

  const actions = [
    {
      label: (
        <>
          <Icons.Download /> Download
        </>
      ),
      onClick: downloadPostIt,
    },
    {
      label: (
        <>
          <Icons.FileText /> Markdown preview
        </>
      ),
      onClick: openPreview,
    },
  ];

  return (
    <header className={styles.header}>
      <PostItCategorySelector
        categoryId={categoryId}
        categoryColor={categoryColor}
        categories={categories}
        updateCategory={updateCategory}
      />
      <input
        className={styles.title}
        value={title}
        contentEditable="true"
        onInput={handleTitleChange}
      />
      <DropdownMenu items={actions} modal={false}>
        <Button variant="transparent" className={styles.actions}>
          <Icons.MoreVertical />
        </Button>
      </DropdownMenu>
      <Popover
        className={styles.datePopover}
        trigger={
          <Button className={dateClasses} variant="transparent">
            <Icons.Calendar />
          </Button>
        }
      >
        <DatePicker lang="en" value={formattedDate} onChange={updateDueDate} />
      </Popover>
      <Popover
        className={styles.removePopover}
        trigger={
          <Button className={styles.remove} variant="transparent">
            <Icons.Cross />
          </Button>
        }
      >
        Confirm removal?
        <Button
          variant="danger"
          className={styles.confirmRemove}
          onClick={removePostIt}
          compact
        >
          <Icons.Bin />
        </Button>
      </Popover>
    </header>
  );
}
