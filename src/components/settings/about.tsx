import styles from "./about.module.css";

export default function About() {
  return (
    <div className={styles.container}>
      <img
        className={styles.logo}
        src="/images/logo.svg"
        alt="Just Post-It logo"
      />
      <div className={styles.title}>Just Post-It</div>
      <div className={styles.version}>v{process.env.APP_VERSION}</div>
    </div>
  );
}
