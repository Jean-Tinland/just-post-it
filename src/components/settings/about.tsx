import Image from "next/image";
import Button from "jt-design-system/es/button";
import Icon from "@/components/icon";
import styles from "./about.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <Image
        className={styles.logo}
        src="/images/logo.svg"
        alt="Just Post-It logo"
        width={48}
        height={48}
      />
      <div className={styles.title}>Just Post-It</div>
      <div className={styles.version}>v{process.env.APP_VERSION}</div>
      <Button
        tag="a"
        variant="link"
        href="https://github.com/Jean-Tinland/just-post-it"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon code="github" className={styles.icon} />
        Open GitHub repository
      </Button>
    </div>
  );
}
