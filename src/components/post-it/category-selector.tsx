import * as React from "react";
import classNames from "classnames";
import Button from "jt-design-system/es/button";
import Popover from "jt-design-system/es/popover";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import Tooltip from "jt-design-system/es/tooltip";
import type { CategoryItem } from "@/@types/category";
import styles from "./category-selector.module.css";

type Props = {
  categoryId: number | null;
  categoryColor: string;
  categories: CategoryItem[];
  updateCategory: (categoryId: number | null) => void;
};

export default function PostItCategorySelector({
  categoryId,
  categoryColor,
  categories,
  updateCategory,
}: Props) {
  return (
    <Popover
      className={styles.popover}
      trigger={
        <Button className={styles.categoryButton} variant="transparent">
          <span
            className={styles.category}
            style={{ backgroundColor: categoryColor }}
          />
        </Button>
      }
    >
      <div className={styles.selector} tabIndex={0}>
        {categories.map((category) => {
          const { id, name, color } = category;
          const isSelected = id === categoryId;

          const classes = classNames(styles.button, {
            [styles.selected]: isSelected,
          });

          const toggleCategory = () => {
            updateCategory(isSelected ? null : id);
          };

          return (
            <Tooltip key={id} content={name}>
              <PopoverPrimitive.Close asChild>
                <Button
                  className={classes}
                  style={{ backgroundColor: color }}
                  onClick={toggleCategory}
                />
              </PopoverPrimitive.Close>
            </Tooltip>
          );
        })}
      </div>
    </Popover>
  );
}
