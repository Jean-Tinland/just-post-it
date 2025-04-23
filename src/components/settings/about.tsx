import Image from "next/image";
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
    </div>
  );
}
