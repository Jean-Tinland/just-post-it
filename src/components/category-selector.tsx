import * as React from "react";
import classNames from "classnames";
import Button from "dt-design-system/es/button";
import Tooltip from "dt-design-system/es/tooltip";
import { useAppContext } from "@/components/app-context";
import type { CategoryItem } from "@/@types/category";
import styles from "./category-selector.module.css";

type Props = {
  categories: CategoryItem[];
};

export default function CategorySelector({ categories }: Props) {
  const { currentCategory, updateCurrentCategory } = useAppContext();
  return (
    <div className={styles.selector}>
      {categories.map((category) => {
        const { id, name, color } = category;
        const isSelected = currentCategory && currentCategory === id;

        const updateCategory = () => {
          updateCurrentCategory(isSelected ? null : category.id);
        };

        const classes = classNames(styles.button, {
          [styles.selected]: isSelected,
        });

        return (
          <Tooltip key={id} content={name} contentProps={{ side: "right" }}>
            <Button
              className={classes}
              style={{ backgroundColor: color }}
              onClick={updateCategory}
            />
          </Tooltip>
        );
      })}
    </div>
  );
}
