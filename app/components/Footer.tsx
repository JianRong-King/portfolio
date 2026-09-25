import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.copy}>&copy; {year}. All rights reserved.</span>
      </div>
    </footer>
  );
}
