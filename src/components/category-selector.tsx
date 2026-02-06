import { useRouter } from "next/navigation";
import classNames from "classnames";
import Button from "jt-design-system/es/button";
import Tooltip from "jt-design-system/es/tooltip";
import { useAppContext } from "@/components/app-context";
import type { CategoryItem } from "@/@types/category";
import styles from "./category-selector.module.css";

type Props = {
  categories: CategoryItem[];
};

export default function CategorySelector({ categories }: Props) {
  const router = useRouter();
  const { currentCategory } = useAppContext();
  return (
    <div className={styles.selector}>
      {categories.map((category) => {
        const { id, name, color } = category;
        const isSelected = currentCategory && currentCategory === id;

        const updateCategory = () => {
          if (isSelected) {
            router.push("/");
          } else {
            router.push(`/?c=${category.id}`);
          }
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
