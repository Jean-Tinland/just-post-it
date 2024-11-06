"use client";

import Popover from "dt-design-system/es/popover";
import Tooltip from "dt-design-system/es/tooltip";
import Input from "dt-design-system/es/input";
import Button from "dt-design-system/es/button";
import * as Icons from "dt-design-system/es/icons";
import { useAppContext } from "@/components/app-context";
import * as Actions from "@/app/actions";
import type { CategoryItem } from "@/@types/category";
import styles from "./categories.module.css";

type Props = {
  categories: CategoryItem[];
};

export default function Categories({ categories }: Props) {
  const { user, setLoading } = useAppContext();
  const { token } = user;

  const createCategory = async () => {
    setLoading(true);
    const position =
      categories.reduce(
        (acc, category) => Math.max(acc, category.position),
        0,
      ) + 1;
    await Actions.createCategory(token, position);
    setLoading(false);
  };

  const updateCategory =
    (id: number, kind: keyof CategoryItem) =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const current = categories.find((category) => category.id === id);
      if (current && kind === "color") {
        const hasChanged = current.color !== value;
        if (hasChanged) {
          setLoading(true);
          await Actions.updateCategory(token, { id, color: value });
        }
      }
      if (current && kind === "name") {
        const hasChanged = current.name !== value;
        if (hasChanged) {
          setLoading(true);
          await Actions.updateCategory(token, { id, name: value });
        }
      }
      setLoading(false);
    };

  const removeCategory = (id: number) => async () => {
    setLoading(true);
    await Actions.removeCategory(token, id);
    setLoading(false);
  };

  const updateCategoryPosition = (id: number, position: number) => async () => {
    setLoading(true);
    const previous = categories.find(
      (category) => category.position === position,
    );
    if (previous) {
      await Actions.updateCategory(token, {
        id: previous.id,
        position: position + 1,
      });
    }
    await Actions.updateCategory(token, { id, position });
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.categories}>
        {categories.map(({ id, name, color, position }, i) => {
          const isFirst = i === 0;
          return (
            <div key={id} className={styles.category}>
              <Tooltip content={isFirst ? undefined : "Move up"}>
                <Button
                  variant="transparent"
                  disabled={isFirst}
                  onClick={updateCategoryPosition(id, position - 1)}
                  className={styles.moveCategory}
                >
                  <Icons.ChevronUp />
                </Button>
              </Tooltip>
              <Popover
                className={styles.categoryColorPopover}
                innerClassName={styles.categoryColorPopoverInner}
                trigger={
                  <Button
                    variant="transparent"
                    className={styles.categoryColorButton}
                    style={{ backgroundColor: color }}
                  />
                }
              >
                <Input
                  className={styles.categoryColor}
                  defaultValue={color}
                  onBlur={updateCategory(id, "color")}
                  compact
                />
                <Tooltip content="Any valid CSS color">
                  <Button
                    variant="transparent"
                    className={styles.categoryColorHelper}
                  >
                    <Icons.Info />
                  </Button>
                </Tooltip>
              </Popover>
              <Input
                className={styles.categoryName}
                defaultValue={name}
                onBlur={updateCategory(id, "name")}
                compact
              />
              <Popover
                className={styles.removeCategoryPopover}
                trigger={
                  <Button
                    className={styles.removeCategory}
                    variant="transparent"
                  >
                    <Icons.Cross />
                  </Button>
                }
              >
                Confirm removal?
                <Button variant="danger" onClick={removeCategory(id)} compact>
                  <Icons.Bin />
                </Button>
              </Popover>
            </div>
          );
        })}
      </div>
      <Button className={styles.createCategory} onClick={createCategory}>
        <Icons.Plus />
        Add Category
      </Button>
    </div>
  );
}
