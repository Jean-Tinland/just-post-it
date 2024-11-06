import Dialog from "dt-design-system/es/dialog";
import Tabs from "dt-design-system/es/tabs";
import * as Icons from "dt-design-system/es/icons";
import Categories from "./categories";
import Preferences from "./preferences";
import About from "./about";
import type { CategoryItem } from "@/@types/category";
import styles from "./settings.module.css";

type Props = {
  opened: boolean;
  close: () => void;
  categories: CategoryItem[];
};

export default function Settings({ opened, close, categories }: Props) {
  return (
    <Dialog
      className={styles.dialog}
      isOpened={opened}
      close={close}
      closeButtonVariant="transparent"
      closeOnBackdropClick={false}
    >
      <div className={styles.inner}>
        <div className={styles.title}>Settings</div>
        <div className={styles.content}>
          <Tabs
            className={styles.tabs}
            tabs={[
              {
                label: (
                  <>
                    <Icons.MoreVertical className={styles.tabIcon} />
                    Categories
                  </>
                ),
                value: "categories",
                content: <Categories categories={categories} />,
              },
              {
                label: (
                  <>
                    <Icons.Tune className={styles.tabIcon} />
                    Preferences
                  </>
                ),
                value: "preferences",
                content: <Preferences />,
              },
              {
                label: (
                  <>
                    <Icons.Question className={styles.tabIcon} />
                    About
                  </>
                ),
                value: "about",
                content: <About />,
              },
            ]}
            defaultValue="categories"
          />
        </div>
      </div>
    </Dialog>
  );
}
